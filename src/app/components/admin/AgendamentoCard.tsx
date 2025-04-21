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
  // Obtem o ícone correto para o status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "check-circle";
      case "pendente":
        return "pending";
      case "cancelado":
        return "cancel";
      case "concluido":
        return "task-alt";
      default:
        return "info";
    }
  };

  // Obtem a cor para o status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "#4CAF50"; // Verde
      case "pendente":
        return "#FF9800"; // Laranja
      case "cancelado":
        return "#F44336"; // Vermelho
      case "concluido":
        return "#2196F3"; // Azul
      default:
        return "#9E9E9E"; // Cinza
    }
  };

  return (
    <View style={styles.agendamentoItem}>
      {/* Overlay de loading se estiver atualizando este agendamento */}
      {atualizandoAgendamento === agendamento.id && (
        <View style={styles.agendamentoLoadingOverlay}>
          <ActivityIndicator size="large" color={colors.button.primary} />
        </View>
      )}

      {/* Overlay de loading se estiver excluindo este agendamento */}
      {excluindoAgendamento === agendamento.id && (
        <View
          style={[
            styles.agendamentoLoadingOverlay,
            { backgroundColor: "rgba(244, 67, 54, 0.2)" },
          ]}
        >
          <ActivityIndicator size="large" color="#F44336" />
          <Text style={{ marginTop: 10, color: "#F44336", fontWeight: "bold" }}>
            Movendo para lixeira...
          </Text>
        </View>
      )}

      <View style={styles.agendamentoContent}>
        {/* Cabeçalho com nome do cliente e data */}
        <View style={styles.agendamentoHeader}>
          <Text style={styles.clienteNome}>{agendamento.userName}</Text>
          <Text style={styles.agendamentoData}>
            {agendamento.data} às {agendamento.hora}
          </Text>
        </View>

        {/* Informações do serviço */}
        <View style={styles.agendamentoServico}>
          <Text style={styles.servicoNome}>{agendamento.servico}</Text>
          {agendamento.barbeiro && (
            <Text style={styles.barbeiro}>
              Barbeiro: {agendamento.barbeiro}
            </Text>
          )}
        </View>

        {/* Observação do cliente - destaque especial */}
        {agendamento.observacao && (
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: "rgba(212, 175, 55, 0.3)",
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <MaterialIcons
                name="comment"
                size={18}
                color={colors.barber.gold}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: colors.barber.gold,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Observação do cliente:
              </Text>
            </View>
            <Text
              style={{
                color: colors.white,
                fontStyle: "italic",
                marginLeft: 26,
                lineHeight: 20,
                fontSize: 15,
              }}
            >
              "{agendamento.observacao}"
            </Text>
          </View>
        )}

        {/* Botões de status */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(agendamento.status) },
            ]}
          >
            <MaterialIcons
              name={getStatusIcon(agendamento.status)}
              size={16}
              color="#FFF"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.statusText}>
              {agendamento.status.charAt(0).toUpperCase() +
                agendamento.status.slice(1)}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            {/* Botão para alterar status */}
            <TouchableOpacity
              style={[styles.button, styles.statusButton]}
              onPress={() => mostrarMenuStatus(agendamento)}
            >
              <MaterialIcons name="update" size={16} color="#FFF" />
              <Text style={styles.buttonText}>Status</Text>
            </TouchableOpacity>

            {/* Botão para excluir */}
            <TouchableOpacity
              style={[styles.button, styles.excluirButton]}
              onPress={() => onExcluir(agendamento)}
            >
              <MaterialIcons name="delete" size={16} color="#FFF" />
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data de criação do agendamento */}
        <Text style={styles.criadoEm}>
          Criado em: {formatarData(agendamento.criado_em)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  agendamentoItem: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  agendamentoLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  agendamentoContent: {
    flex: 1,
  },
  agendamentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  agendamentoData: {
    fontSize: 14,
    color: colors.textLighter,
  },
  agendamentoServico: {
    marginBottom: 5,
  },
  servicoNome: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.barber.gold,
    marginBottom: 2,
  },
  barbeiro: {
    fontSize: 14,
    color: colors.textLighter,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 8,
  },
  statusButton: {
    backgroundColor: "#2196F3",
  },
  excluirButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 5,
  },
  criadoEm: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 10,
    textAlign: "right",
  },
});

export default AgendamentoCard;
