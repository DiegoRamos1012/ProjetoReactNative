import React, { useState, useEffect } from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import globalStyles from "../components/globalStyle/styles";
import { HomeProps, Servico } from "../types";
import { useAppointments } from "../hooks/useAppointments";
import { servicosBarbearia } from "../data/services";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
// Componentes modulares
import Header from "../components/home/Header";
import Banner from "../components/home/Banner";
import ServicesList from "../components/home/ServicesList";
import AppointmentsList from "../components/home/AppointmentsList";
import AppointmentModal from "../components/home/AppointmentModal";

export const Home: React.FC<HomeProps> = ({ user, setUser, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null
  );
  // Novo estado para armazenar serviços do Firestore
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicosLoading, setServicosLoading] = useState(true);

  // Usar o hook personalizado para gerenciar agendamentos
  const {
    agendamentos,
    loading,
    refreshing,
    errorMessage,
    fetchAppointments,
    refreshAppointments,
    createAppointment,
    deleteAppointment,
    getServiceIcon,
  } = useAppointments(user);

  // Função para buscar serviços do Firestore
  const fetchServices = async () => {
    setServicosLoading(true);
    try {
      const servicosRef = collection(db, "servicos");
      const snapshot = await getDocs(servicosRef);

      if (snapshot.empty) {
        // Se não houver serviços no Firestore, usar a lista estática
        setServicos(servicosBarbearia);
      } else {
        const servicosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Servico[];
        setServicos(servicosData);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      // Em caso de erro, use a lista estática
      setServicos(servicosBarbearia);
    } finally {
      setServicosLoading(false);
    }
  };

  // Carregar agendamentos e serviços quando o componente montar
  useEffect(() => {
    console.log("Componente montado, carregando agendamentos iniciais");
    fetchAppointments();
    fetchServices(); // Buscar serviços do Firestore
  }, [fetchAppointments]);

  // Log do usuário autenticado
  useEffect(() => {
    console.log("Usuário autenticado:", user.displayName);
  }, [user]);

  // Atualizar tudo ao fazer o refresh
  const handleRefresh = () => {
    refreshAppointments();
    fetchServices();
  };

  // Handlers para o modal de agendamento
  const handleOpenModal = (servico: Servico) => {
    setServicoSelecionado(servico);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setServicoSelecionado(null);
  };

  const handleConfirmAppointment = async (hora: string) => {
    if (servicoSelecionado) {
      const success = await createAppointment(servicoSelecionado, hora);
      if (success) {
        handleCloseModal();
      }
    }
  };

  return (
    <ScrollView
      style={globalStyles.homeContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || servicosLoading}
          onRefresh={handleRefresh}
          colors={["#2A4A73"]}
          tintColor="#2A4A73"
        />
      }
    >
      {/* Header com informações do usuário */}
      <Header user={user} setUser={setUser} />

      {/* Banner de destaque */}
      <Banner
        title="Barbearia Premium"
        subtitle="Qualidade e estilo para você"
      />

      {/* Lista de serviços */}
      {servicosLoading ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2A4A73" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Carregando serviços...
          </Text>
        </View>
      ) : (
        <ServicesList
          servicos={servicos} // Usar serviços do Firestore
          onServicoPress={handleOpenModal}
        />
      )}

      {/* Lista de agendamentos */}
      <AppointmentsList
        agendamentos={agendamentos}
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        onDeleteAppointment={deleteAppointment}
        getServiceIcon={getServiceIcon}
      />

      {/* Modal de agendamento */}
      <AppointmentModal
        visible={modalVisible}
        servico={servicoSelecionado}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAppointment}
        loading={loading}
      />
    </ScrollView>
  );
};

export default Home;
