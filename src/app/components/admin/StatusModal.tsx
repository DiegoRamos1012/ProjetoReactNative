import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../globalStyle/styles";
import { Agendamento } from "../../types/types";

interface StatusModalProps {
  visible: boolean;
  agendamento: Agendamento | null;
  onClose: () => void;
  onStatusChange: (agendamentoId: string, novoStatus: string) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  agendamento,
  onClose,
  onStatusChange,
}) => {
  const statusOptions = [
    {
      value: "pendente",
      label: "Pendente",
      icon: "pending",
      color: "#FF9800", // Laranja
    },
    {
      value: "confirmado",
      label: "Confirmado",
      icon: "check-circle",
      color: "#4CAF50", // Verde
    },
    {
      value: "cancelado",
      label: "Cancelado",
      icon: "cancel",
      color: "#F44336", // Vermelho
    },
    {
      value: "concluido",
      label: "Concluído",
      icon: "task-alt",
      color: "#2196F3", // Azul
    },
  ];

  // Estado local para o status selecionado no modal
  const [statusSelecionado, setStatusSelecionado] = useState<string | null>(
    null
  );

  // Quando o modal é aberto, definir o status selecionado como o atual do agendamento
  React.useEffect(() => {
    if (visible && agendamento) {
      setStatusSelecionado(agendamento.status || "pendente");
    }
  }, [visible, agendamento]);

  if (!agendamento) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alterar Status</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.agendamentoInfo}>
              Agendamento: {agendamento.servico}
            </Text>
            <Text style={styles.clienteInfo}>
              Cliente: {agendamento.userName}
            </Text>

            <View style={styles.statusOptionsContainer}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor:
                        statusSelecionado === option.value
                          ? option.color
                          : "rgba(255, 255, 255, 0.1)",
                    },
                  ]}
                  onPress={() => setStatusSelecionado(option.value)}
                >
                  <MaterialIcons
                    name={option.icon as any}
                    size={20}
                    color={
                      statusSelecionado === option.value ? "#fff" : option.color
                    }
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      styles.statusLabel,
                      {
                        color:
                          statusSelecionado === option.value
                            ? "#fff"
                            : option.color,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.observacoesContainer}>
              {agendamento.observacao && (
                <>
                  <Text style={styles.observacoesLabel}>
                    Observações do cliente:
                  </Text>
                  <Text style={styles.observacoesText}>
                    {agendamento.observacao}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (statusSelecionado) {
                  onStatusChange(agendamento.id, statusSelecionado);
                }
              }}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    width: "80%",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 15,
  },
  agendamentoInfo: {
    fontSize: 16,
    color: colors.barber.gold,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clienteInfo: {
    fontSize: 14,
    color: colors.textLighter,
    marginBottom: 15,
  },
  statusOptionsContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  observacoesContainer: {
    marginTop: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 2,
    borderLeftColor: colors.barber.gold,
  },
  observacoesLabel: {
    color: colors.barber.gold,
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
  },
  observacoesText: {
    color: colors.textLighter,
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButton: {
    backgroundColor: "#555",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: colors.button.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default StatusModal;
