import React from "react";
import { View, Text, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento } from "../../types";
import globalStyles from "../globalStyle/styles";

interface AppointmentsListProps {
  agendamentos: Agendamento[];
  loading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
  onDeleteAppointment: (id: string) => void;
  getServiceIcon: (servico: string) => string;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  agendamentos,
  loading,
  refreshing,
  errorMessage,
  onDeleteAppointment,
  getServiceIcon,
}) => {
  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <Text style={globalStyles.emptyText}>Carregando agendamentos...</Text>
      );
    }

    if (errorMessage && agendamentos.length === 0) {
      return (
        <Text style={[globalStyles.emptyText, { color: "red" }]}>
          {errorMessage}
        </Text>
      );
    }

    if (agendamentos.length === 0) {
      return (
        <Text style={globalStyles.emptyText}>
          Você ainda não tem agendamentos.
        </Text>
      );
    }

    const handleDeletePress = (appointment: {
      servico: string;
      data: any;
      id: string;
    }) => {
      Alert.alert(
        "Cancelar Agendamento",
        `Deseja realmente cancelar o agendamento de ${appointment.servico} em ${appointment.data}?`,
        [
          {
            text: "Não",
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => onDeleteAppointment(appointment.id),
            style: "destructive",
          },
        ]
      );
    };

    return (
      <>
        <Text style={globalStyles.agendamentoTitulo}>Seus agendamentos:</Text>
        {agendamentos.map((agendamento) => (
          <View key={agendamento.id} style={globalStyles.agendamentoItem}>
            <View style={globalStyles.agendamentoInfo}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name={getServiceIcon(agendamento.servico) as any}
                  size={20}
                  color="#2A4A73"
                  style={{ marginRight: 8 }}
                />
                <Text style={globalStyles.agendamentoServico}>
                  {agendamento.servico}
                </Text>
              </View>
              <Text style={globalStyles.agendamentoData}>
                {agendamento.data} às {agendamento.hora}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons
                name="delete"
                size={24}
                color="#333"
                onPress={() => handleDeletePress(agendamento)}
              />
            </View>
          </View>
        ))}
      </>
    );
  };

  return <View>{renderContent()}</View>;
};

export default AppointmentsList;
