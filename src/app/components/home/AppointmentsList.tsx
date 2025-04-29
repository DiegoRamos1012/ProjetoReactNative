import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento, Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import useAppointments from "../../hooks/useAppointments";
import { auth } from "../../../config/firebaseConfig";
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
  servicos = [],
}) => {
  // Usar o hook de agendamentos
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;
  const appointmentsHook = useAppointments(user!);

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

    // Renderiza cada card de agendamento
    const renderAppointmentCard = (agendamento: Agendamento) => {
      // Detecta se o agendamento é no passado ou futuro
      const dataAgendamento = agendamento.data_timestamp.toDate();
      const isPast = dataAgendamento < new Date();

      // Detecta o estado do agendamento
      const isCompleted = agendamento.status === "concluido";
      const isCanceled = agendamento.status === "cancelado";

      return (
        <View
          key={agendamento.id}
          style={[
            styles.agendamentoCard,
            isPast && !isCompleted ? { opacity: 0.7 } : null,
            isCanceled
              ? globalStyles.cardBackgroundCanceled
              : isCompleted
              ? globalStyles.cardBackgroundCompleted
              : globalStyles.cardBackgroundDefault,
          ]}
        >
          <View style={styles.agendamentoHeader}>
            <View style={styles.agendamentoIconContainer}>
              <MaterialIcons
                name="content-cut"
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

            <View>
              {/* Botão de cancelar para agendamentos futuros não cancelados */}
              {!isPast && !isCanceled && !isCompleted && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePress(agendamento)}
                >
                  <MaterialIcons name="cancel" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {/* Botão para remover do histórico (agendamentos passados, concluídos ou cancelados) */}
              {(isPast || isCompleted || isCanceled) && (
                <TouchableOpacity
                  style={globalStyles.removeHistoryButton}
                  onPress={() => confirmRemoveFromHistory(agendamento.id)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {agendamento.observacao && (
            <View style={styles.observacaoContainer}>
              <Text style={styles.observacaoTitle}>Observações:</Text>
              <Text style={styles.observacaoText}>
                {agendamento.observacao}
              </Text>
            </View>
          )}

          {/* Mostrar status para o cliente */}
          <View
            style={[
              globalStyles.statusContainer,
              isCanceled
                ? globalStyles.statusCanceled
                : isCompleted
                ? globalStyles.statusCompleted
                : agendamento.status === "confirmado"
                ? globalStyles.statusConfirmed
                : globalStyles.statusPending,
            ]}
          >
            <Text
              style={[
                globalStyles.statusText,
                isCanceled
                  ? globalStyles.statusTextCanceled
                  : isCompleted
                  ? globalStyles.statusTextCompleted
                  : agendamento.status === "confirmado"
                  ? globalStyles.statusTextConfirmed
                  : globalStyles.statusTextPending,
              ]}
            >
              {isCompleted
                ? "Concluído"
                : isCanceled
                ? "Cancelado"
                : agendamento.status === "confirmado"
                ? "Confirmado"
                : "Pendente"}
            </Text>
          </View>
        </View>
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

          return renderAppointmentCard(agendamento);
        })}
      </>
    );
  };

  // Função para confirmar remoção do histórico
  const confirmRemoveFromHistory = (agendamentoId: string) => {
    Alert.alert(
      "Remover do Histórico",
      "Este agendamento será removido do seu histórico. Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeFromHistory(agendamentoId),
        },
      ]
    );
  };

  // Função para remover agendamento do histórico
  const removeFromHistory = async (agendamentoId: string) => {
    try {
      setIsLoading(true);
      await appointmentsHook.removeFromHistory(agendamentoId);
      // A lista será atualizada pelo hook
    } catch (error) {
      console.error("Erro ao remover do histórico:", error);
    } finally {
      setIsLoading(false);
    }
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
    borderRadius: 6,
    alignItems: "center",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  smallIcon: {
    verticalAlign: "middle",
  },
});

export default AppointmentsList;
