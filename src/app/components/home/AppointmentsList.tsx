import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento, Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import useAppointments from "../../hooks/useAppointments";
import { auth } from "../../../config/firebaseConfig";
interface AppointmentsListProps {
  agendamentos: Agendamento[];
  loading: boolean;
  isLoading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
  onDeleteAppointment: (id: string) => void;
  servicos?: Servico[];
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
            globalStyles.appointmentCard,
            isPast && !isCompleted ? { opacity: 0.7 } : null,
            isCanceled
              ? globalStyles.cardBackgroundCanceled
              : isCompleted
              ? globalStyles.cardBackgroundCompleted
              : globalStyles.cardBackgroundDefault,
          ]}
        >
          <View style={globalStyles.appointmentHeader}>
            <View style={globalStyles.appointmentIconContainer}>
              <MaterialIcons
                name="content-cut"
                size={24}
                color={colors.barber.gold}
              />
            </View>
            <View style={globalStyles.appointmentInfo}>
              <Text style={globalStyles.appointmentServico}>
                {agendamento.servico}
              </Text>
              <Text style={globalStyles.appointmentHorario}>
                <MaterialIcons
                  name="event"
                  size={14}
                  color={colors.barber.gold}
                  style={globalStyles.appointmentSmallIcon}
                />{" "}
                {agendamento.data} às {agendamento.hora}
              </Text>
              {agendamento.barbeiro && (
                <Text style={globalStyles.appointmentBarbeiro}>
                  <MaterialIcons
                    name="person"
                    size={14}
                    color={colors.barber.gold}
                    style={globalStyles.appointmentSmallIcon}
                  />{" "}
                  {agendamento.barbeiro}
                </Text>
              )}
            </View>

            <View>
              {/* Botão de cancelar para agendamentos futuros não cancelados */}
              {!isPast && !isCanceled && !isCompleted && (
                <TouchableOpacity
                  style={globalStyles.appointmentDeleteButton}
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
            <View style={globalStyles.appointmentObservacaoContainer}>
              <Text style={globalStyles.appointmentObservacaoTitle}>
                Observações:
              </Text>
              <Text style={globalStyles.appointmentObservacaoText}>
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
        <Text style={globalStyles.appointmentListTitle}>
          Seus agendamentos:
        </Text>
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

export default AppointmentsList;
