import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, View, Text, Button } from "react-native";
import globalStyles from "../components/globalStyle/styles";
import { HomeProps, Servico } from "../types";
import { useAppointments } from "../hooks/useAppointments";
import { servicosBarbearia } from "../data/services";
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
    getServiceIcon, // Certifique-se de extrair essa função do hook
  } = useAppointments(user);

  // Carregar agendamentos quando o componente montar
  useEffect(() => {
    console.log("Componente montado, carregando agendamentos iniciais");
    fetchAppointments();
  }, [fetchAppointments]);

  // Log do usuário autenticado
  useEffect(() => {
    console.log("Usuário autenticado:", user.displayName);
  }, [user]);

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
          refreshing={refreshing}
          onRefresh={refreshAppointments}
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
      <ServicesList
        servicos={servicosBarbearia}
        onServicoPress={handleOpenModal}
      />

      {/* Lista de agendamentos */}
      <AppointmentsList
        agendamentos={agendamentos}
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        onDeleteAppointment={deleteAppointment}
        getServiceIcon={getServiceIcon} // Passar a função aqui
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
