import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../globalStyle/styles";
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
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Verifica se este agendamento está sendo atualizado ou excluído
  const isUpdating = atualizandoAgendamento === agendamento.id;
  const isDeleting = excluindoAgendamento === agendamento.id;

  return (
    <View
      style={[
        styles.container,
        (isUpdating || isDeleting) && styles.containerDisabled,
      ]}
    >
      {/* Overlay para quando estiver atualizando ou excluindo */}
      {(isUpdating || isDeleting) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.button.primary} />
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.clienteInfo}>
          <Text style={styles.userName}>{agendamento.userName}</Text>
          <Text style={styles.dateTime}>
            {formatarData(agendamento.data)} às {agendamento.hora}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(agendamento.status) },
          ]}
        >
          <MaterialIcons
            name={getStatusIcon(agendamento.status) as any}
            size={14}
            color="#FFF"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.statusText}>
            {getStatusText(agendamento.status)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.serviceName}>{agendamento.servico}</Text>
        {agendamento.barbeiro && (
          <Text style={styles.barberName}>
            Barbeiro: {agendamento.barbeiro}
          </Text>
        )}

        {agendamento.observacao && (
          <View style={styles.obsContainer}>
            <Text style={styles.obsTitle}>Observações:</Text>
            <Text style={styles.obsText}>{agendamento.observacao}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => mostrarMenuStatus(agendamento)}
          disabled={isUpdating || isDeleting}
        >
          <MaterialIcons name="update" size={20} color={colors.white} />
          <Text style={styles.actionText}>Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onExcluir(agendamento)}
          disabled={isUpdating || isDeleting}
        >
          <MaterialIcons name="delete" size={20} color={colors.white} />
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 15,
    padding: 15,
    position: "relative",
    borderLeftWidth: 3,
    borderLeftColor: colors.button.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  containerDisabled: {
    opacity: 0.7,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  clienteInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 3,
  },
  dateTime: {
    fontSize: 14,
    color: colors.textLighter,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    marginVertical: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.barber.gold,
    marginBottom: 5,
  },
  barberName: {
    fontSize: 14,
    color: colors.textLighter,
    marginBottom: 10,
  },
  obsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  obsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.barber.gold,
    marginBottom: 3,
  },
  obsText: {
    fontSize: 14,
    color: colors.textLighter,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.button.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionText: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 5,
  },
});

export default AgendamentoCard;
