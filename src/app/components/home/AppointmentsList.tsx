import React from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento, Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";

// Função para formatar moeda em BRL
const formatCurrencyBRL = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

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
        <Text style={styles.agendamentoTitle}>Seus agendamentos:</Text>
        {agendamentos.map((agendamento) => {
          // Obter serviço de forma segura
          const servico = findServicoSeguro(agendamento.servico);

          // Definir ícone baseado no serviço se disponível
          const iconName = servico?.iconName || "content-cut";

          // Determinar status baseado em data/hora
          const hoje = new Date();
          const [dia, mes, ano] = agendamento.data.split("/").map(Number);
          const [horas, minutos] = agendamento.hora.split(":").map(Number);
          const dataAgendamento = new Date(ano, mes - 1, dia, horas, minutos);
          const isPast = dataAgendamento < hoje;

          return (
            <View key={agendamento.id} style={styles.agendamentoCard}>
              <View style={styles.agendamentoHeader}>
                <View style={styles.agendamentoIconContainer}>
                  <MaterialIcons
                    name={iconName as any}
                    size={24}
                    color={colors.barber.gold}
                  />
                </View>
                <View style={styles.agendamentoInfo}>
                  <Text style={styles.agendamentoServico}>
                    {agendamento.servico}
                  </Text>
                  <Text style={styles.agendamentoHorario}>
                    <MaterialIcons
                      name="event"
                      size={14}
                      color={colors.barber.gold}
                      style={styles.smallIcon}
                    />{" "}
                    {agendamento.data} às {agendamento.hora}
                  </Text>
                  {agendamento.barbeiro && (
                    <Text style={styles.agendamentoBarbeiro}>
                      <MaterialIcons
                        name="person"
                        size={14}
                        color={colors.barber.gold}
                        style={styles.smallIcon}
                      />{" "}
                      {agendamento.barbeiro}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.deleteButton, isPast && styles.disabledButton]}
                  onPress={() => !isPast && handleDeletePress(agendamento)}
                  disabled={isPast}
                >
                  <MaterialIcons name="delete" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {agendamento.observacao && (
                <View style={styles.observacaoContainer}>
                  <Text style={styles.observacaoTitle}>Observações:</Text>
                  <Text style={styles.observacaoText}>
                    {agendamento.observacao}
                  </Text>
                </View>
              )}

              {isPast && (
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>Agendamento concluído</Text>
                </View>
              )}
            </View>
          );
        })}
      </>
    );
  };

  return <View>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "rgba(255, 55, 91, 0.8)",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  agendamentoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.white,
    marginTop: 10,
  },
  agendamentoCard: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: colors.barber.gold,
  },
  agendamentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agendamentoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.barber.gold,
  },
  agendamentoInfo: {
    flex: 1,
  },
  agendamentoServico: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 2,
  },
  agendamentoHorario: {
    fontSize: 13,
    color: colors.textLighter,
    marginBottom: 2,
  },
  agendamentoBarbeiro: {
    fontSize: 13,
    color: colors.textLighter,
  },
  observacaoContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: colors.barber.gold,
  },
  observacaoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.barber.gold,
  },
  observacaoText: {
    color: colors.white,
    fontSize: 12,
  },
  statusContainer: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "green",
    alignItems: "center",
  },
  statusText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 12,
  },
  smallIcon: {
    verticalAlign: "middle",
  },
  disabledButton: {
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
});

export default AppointmentsList;
