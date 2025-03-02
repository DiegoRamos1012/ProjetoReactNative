import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento } from "../../types";
import globalStyles from "../globalStyle/styles";

interface AppointmentsListProps {
  agendamentos: Agendamento[];
  loading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  agendamentos,
  loading,
  refreshing,
  errorMessage,
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

    return agendamentos.map((agendamento) => (
      <View key={agendamento.id} style={globalStyles.agendamentoItem}>
        <View style={globalStyles.agendamentoInfo}>
          <Text style={globalStyles.agendamentoServico}>
            {agendamento.servico}
          </Text>
          <Text style={globalStyles.agendamentoData}>
            {agendamento.data} às {agendamento.hora}
          </Text>
          <Text style={globalStyles.agendamentoBarbeiro}>
            Barbeiro: {agendamento.barbeiro || "Não definido"}
          </Text>
        </View>
        <MaterialIcons name="event" size={24} color="#333" />
      </View>
    ));
  };

  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionTitle}>Seus Agendamentos</Text>
      {refreshing && (
        <Text style={[globalStyles.emptyText, { marginBottom: 10 }]}>
          Atualizando agendamentos...
        </Text>
      )}
      {renderContent()}
    </View>
  );
};

export default AppointmentsList;
