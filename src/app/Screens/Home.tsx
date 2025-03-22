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
import { useServicos } from "../data/services";
// Componentes modulares
import Header from "../components/home/Header";
import Banner from "../components/home/Banner";
import ServicesList from "../components/home/ServicesList";
import AppointmentsList from "../components/home/AppointmentsList";
import AppointmentModal from "../components/home/AppointmentModal";
import { useFocusEffect } from "@react-navigation/native";

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
  } = useAppointments(user);

  const { servicos, loading: loadingServicos, refreshServicos } = useServicos();

  // Carregar agendamentos quando o componente montar
  useEffect(() => {
    console.log("Componente montado, carregando agendamentos iniciais");
    fetchAppointments();
    fetchServices(); // Buscar serviços do Firestore
  }, [fetchAppointments]);

  // Atualizar serviços quando a tela entrar em foco
  useFocusEffect(
    React.useCallback(() => {
      console.log("Home screen em foco, atualizando serviços");
      refreshServicos();
      return () => {
        // Cleanup opcional
      };
    }, [refreshServicos])
  );

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

  const handleConfirmAppointment = async (
    hora: string,
    observacao?: string
  ) => {
    if (servicoSelecionado) {
      const success = await createAppointment(
        servicoSelecionado,
        hora,
        observacao
      );
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

      {/* Lista de serviços - Usando serviços do Firebase */}
      <ServicesList
        servicos={servicos}
        onServicoPress={handleOpenModal}
        loading={loadingServicos}
      />

      {/* Lista de agendamentos */}
      <AppointmentsList
        agendamentos={agendamentos}
        servicos={servicos}
        loading={loading}
        refreshing={refreshing}
        isLoading={loading || loadingServicos}
        errorMessage={errorMessage}
        onDeleteAppointment={deleteAppointment}
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
