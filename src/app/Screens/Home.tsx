import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import globalStyles, { colors } from "../components/globalStyle/styles";
import { HomeProps } from "../types/types";
import { Servico } from "../types/types";
import { useAppointments } from "../hooks/useAppointments";
import useServicos from "../data/services";
// Componentes modulares
import Header from "../components/home/Header";
import Banner from "../components/home/Banner";
import ServicesList from "../components/home/ServicesList";
import AppointmentsList from "../components/home/AppointmentsList";
import AppointmentModal from "../components/home/AppointmentModal";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
export const Home: React.FC<HomeProps> = ({ user, setUser }) => {
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
  } = useAppointments(user);

  const { servicos, loading: loadingServicos, refreshServicos } = useServicos();

  // Carregar agendamentos quando o componente montar
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Atualizar serviços quando a tela entrar em foco
  useFocusEffect(
    React.useCallback(() => {
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

  // Handlers para o modal de agendamento
  const handleOpenModal = (servico: Servico) => {
    setServicoSelecionado(servico);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setServicoSelecionado(null);
  };

  // Versão corrigida da função de confirmação de agendamento
  const handleConfirmAppointment = async (
    data: string,
    hora: string,
    observacao?: string
  ) => {
    if (!servicoSelecionado || !user) return;

    // Usar a função do hook useAppointments para criar o agendamento
    const success = await createAppointment(
      servicoSelecionado,
      data,
      hora,
      observacao
    );

    if (success) {
      handleCloseModal();
    }
  };

  return (
    <>
      {/* Tela de carregamento estilizada */}
      {loading && agendamentos.length === 0 && loadingServicos ? (
        <View style={globalStyles.loadingContainer}>
          <View style={globalStyles.loadingCircle}>
            <MaterialIcons
              name="content-cut"
              size={40}
              color={colors.button.primary}
            />
          </View>
          <Text style={globalStyles.loadingText}>
            Bem-vindo à Ávila Barbearia
          </Text>
          <Text style={globalStyles.loadingSubText}>
            Carregando sua experiência personalizada...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={globalStyles.homeContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshAppointments}
              colors={[colors.button.primary]}
              tintColor={colors.button.primary}
            />
          }
        >
          {/* Header com informações do usuário */}
          <Header user={user} setUser={setUser} />

          {/* Banner de destaque */}
          <Banner
            title="Ávila Barbearia"
            subtitle="Terça a sexta: 09:00 - 20:00. Sábado: 
            09:00 - 16:00."
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
            servicos={servicos.map((s) => ({ ...s, preco: Number(s.preco) }))}
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
      )}
    </>
  );
};

export default Home;
