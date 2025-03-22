import React from "react";
import { View, Text, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento, Servico } from "../../types";
import globalStyles from "../globalStyle/styles";

interface AppointmentsListProps {
  agendamentos: Agendamento[];
  loading: boolean;
  isLoading: boolean; // Adicionado para correção do erro
  refreshing: boolean;
  errorMessage: string | null;
  onDeleteAppointment: (id: string) => void;
  servicos?: Servico[]; // Adicionado para correção do erro
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  agendamentos,
  loading,
  refreshing,
  errorMessage,
  onDeleteAppointment,
  servicos = [], // Valor padrão para evitar undefined
}) => {
  // Função segura para encontrar um serviço pelo nome
  const findServicoSeguro = (nomeServico: string): Servico | undefined => {
    // Verificar se a lista de serviços existe e tem itens
    if (!servicos || servicos.length === 0) return undefined;

    // Usar find de forma segura
    return servicos.find((s) => s.nome === nomeServico);
  };

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
        {agendamentos.map((agendamento) => {
          // Obter serviço de forma segura
          const servico = findServicoSeguro(agendamento.servico);
          // Usar o ícone do serviço encontrado, ou cair para o método getServiceIcon

          return (
            <View key={agendamento.id} style={globalStyles.agendamentoItem}>
              <View style={globalStyles.agendamentoInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name={"content-cut" as any}
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
                {/* Display client observation if it exists */}
                {agendamento.observacao_cliente && (
                  <View
                    style={{
                      marginTop: 5,
                      paddingTop: 5,
                      borderTopWidth: 1,
                      borderTopColor: "#eee",
                    }}
                  >
                    <Text
                      style={{
                        fontStyle: "italic",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      Observação: {agendamento.observacao_cliente}
                    </Text>
                  </View>
                )}
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
          );
        })}
      </>
    );
  };

  return <View>{renderContent()}</View>;
};

export default AppointmentsList;
