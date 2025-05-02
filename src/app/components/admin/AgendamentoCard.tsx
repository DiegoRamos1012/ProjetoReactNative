import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, globalStyles } from "../globalStyle/styles";
import { Agendamento } from "../../types/types";

interface AgendamentoCardProps {
  agendamento: Agendamento;
  formatarData: (data: any) => string;
  atualizandoAgendamento: string | null;
  excluindoAgendamento: string | null;
  mostrarMenuStatus: (agendamento: Agendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
}

const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  agendamento,
  formatarData,
  atualizandoAgendamento,
  excluindoAgendamento,
  mostrarMenuStatus,
  onExcluir,
}) => {
  // Função para definir a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "#FF9800"; // Laranja
      case "confirmado":
        return "#4CAF50"; // Verde
      case "cancelado":
        return "#F44336"; // Vermelho
      case "concluido":
      case "finalizado":
        return "#2196F3"; // Azul
      default:
        return "#9E9E9E"; // Cinza (para status desconhecidos)
    }
  };

  // Função para definir o ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return "pending";
      case "confirmado":
        return "check-circle";
      case "cancelado":
        return "cancel";
      case "concluido":
      case "finalizado":
        return "task-alt";
      default:
        return "help";
    }
  };

  // Função para definir o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "confirmado":
        return "Confirmado";
      case "cancelado":
        return "Cancelado";
      case "concluido":
        return "Concluído";
      case "finalizado":
        return "Finalizado";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Verifica se este agendamento está sendo atualizado ou excluído
  const isUpdating = atualizandoAgendamento === agendamento.id;
  const isDeleting = excluindoAgendamento === agendamento.id;

  // Debugging info
  console.log("Renderizando agendamento:", agendamento.id, agendamento.servico);

  return (
    <View
      style={[
        globalStyles.agendamentoCardContainer,
        (isUpdating || isDeleting) &&
          globalStyles.agendamentoCardContainerDisabled,
      ]}
    >
      {/* Overlay para quando estiver atualizando ou excluindo */}
      {(isUpdating || isDeleting) && (
        <View style={globalStyles.agendamentoCardLoadingOverlay}>
          <ActivityIndicator size="large" color={colors.button.primary} />
        </View>
      )}

      <View style={globalStyles.agendamentoCardHeader}>
        <View style={globalStyles.agendamentoCardClienteInfo}>
          <Text style={globalStyles.agendamentoCardUserName}>
            {agendamento.userName || "Cliente não identificado"}
          </Text>
          <View style={globalStyles.agendamentoCardDateTimeContainer}>
            <MaterialIcons
              name="event"
              size={14}
              color={colors.barber.gold}
              style={{ marginRight: 4 }}
            />
            <Text style={globalStyles.agendamentoCardDateTime}>
              {formatarData(agendamento.data)} às {agendamento.hora}
            </Text>
          </View>
        </View>
        <View
          style={[
            globalStyles.agendamentoCardStatusBadge,
            { backgroundColor: getStatusColor(agendamento.status) },
          ]}
        >
          <MaterialIcons
            name={getStatusIcon(agendamento.status) as any}
            size={14}
            color="#FFF"
            style={{ marginRight: 4 }}
          />
          <Text style={globalStyles.agendamentoCardStatusText}>
            {getStatusText(agendamento.status)}
          </Text>
        </View>
      </View>

      <View style={globalStyles.agendamentoCardContent}>
        <Text style={globalStyles.agendamentoCardServiceName}>
          {agendamento.servico || "Serviço não especificado"}
        </Text>
        {agendamento.barbeiro && (
          <Text style={globalStyles.agendamentoCardBarberName}>
            Barbeiro: {agendamento.barbeiro}
          </Text>
        )}

        {agendamento.observacao && (
          <View style={globalStyles.agendamentoCardObsContainer}>
            <Text style={globalStyles.agendamentoCardObsTitle}>
              Observações:
            </Text>
            <Text style={globalStyles.agendamentoCardObsText}>
              {agendamento.observacao}
            </Text>
          </View>
        )}
      </View>

      <View style={globalStyles.agendamentoCardFooter}>
        <TouchableOpacity
          style={globalStyles.agendamentoCardActionButton}
          onPress={() => mostrarMenuStatus(agendamento)}
          disabled={isUpdating || isDeleting}
        >
          <MaterialIcons name="update" size={20} color={colors.white} />
          <Text style={globalStyles.agendamentoCardActionText}>Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.agendamentoCardActionButton,
            globalStyles.agendamentoCardDeleteButton,
          ]}
          onPress={() => onExcluir(agendamento)}
          disabled={isUpdating || isDeleting}
        >
          <MaterialIcons name="delete" size={20} color={colors.white} />
          <Text style={globalStyles.agendamentoCardActionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AgendamentoCard;
