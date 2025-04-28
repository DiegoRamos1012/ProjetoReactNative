import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, globalStyles } from "../globalStyle/styles";
import { Agendamento } from "../../types/types";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";

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
  const [isUpdating, setIsUpdating] = useState(false);
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
  useEffect(() => {
    if (visible && agendamento) {
      setStatusSelecionado(agendamento.status || "pendente");
    }
  }, [visible, agendamento]);

  const handleStatusChange = async () => {
    if (!agendamento || !statusSelecionado) return;

    setIsUpdating(true);
    try {
      // Atualizar o documento no Firestore
      const agendamentoRef = doc(db, "agendamentos", agendamento.id);
      await updateDoc(agendamentoRef, {
        status: statusSelecionado,
        atualizado_em: Timestamp.now(),
      });

      // Chamar o callback para atualizar a UI
      onStatusChange(agendamento.id, statusSelecionado);
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o status: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!agendamento) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={globalStyles.statusModalCenteredView}>
        <View style={globalStyles.statusModalView}>
          {/* Cabeçalho do Modal */}
          <View style={globalStyles.statusModalHeader}>
            <Text style={globalStyles.statusModalTitle}>Alterar Status</Text>
            <TouchableOpacity
              style={globalStyles.statusCloseButton}
              onPress={onClose}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Conteúdo do Modal */}
          <View style={globalStyles.statusModalContent}>
            <View style={globalStyles.statusAgendamentoInfoContainer}>
              <Text style={globalStyles.statusAgendamentoInfo}>
                Agendamento: {agendamento.servico}
              </Text>
              <Text style={globalStyles.statusClienteInfo}>
                Cliente: {agendamento.userName}
              </Text>
            </View>

            <View style={globalStyles.statusOptionsContainer}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    globalStyles.statusOption,
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
                      globalStyles.statusLabel,
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

            {agendamento.observacao && (
              <View style={globalStyles.statusObservacoesContainer}>
                <Text style={globalStyles.statusObservacoesLabel}>
                  Observações do cliente:
                </Text>
                <Text style={globalStyles.statusObservacoesText}>
                  {agendamento.observacao}
                </Text>
              </View>
            )}
          </View>

          {/* Rodapé do Modal */}
          <View style={globalStyles.statusModalFooter}>
            <TouchableOpacity
              style={globalStyles.statusCancelButton}
              onPress={onClose}
              disabled={isUpdating}
            >
              <Text style={globalStyles.statusButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.statusConfirmButton,
                isUpdating && { opacity: 0.7 },
              ]}
              onPress={handleStatusChange}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={globalStyles.statusButtonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
