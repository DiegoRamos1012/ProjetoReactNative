import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import { formatCurrencyBRL } from "../../format"; 

const localStyles = StyleSheet.create({
  observacaoContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  observacaoLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  observacaoText: {
    color: colors.textLighter,
  },
  clientObservationContainer: {
    marginVertical: 5,
    width: "100%",
    color: colors.textLighter,

  },
  clientObservationLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: colors.textLighter,

  },
  clientObservationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
});

interface AppointmentModalProps {
  visible: boolean;
  servico: Servico | null;
  onClose: () => void;
  onConfirm: (hora: string, observacao?: string) => void;
  loading: boolean;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  visible,
  servico,
  onClose,
  onConfirm,
  loading,
}) => {
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [observacao, setObservacao] = useState("");

  const handleConfirm = () => {
    onConfirm(horaSelecionada, observacao);
  };

  const handleClose = () => {
    setHoraSelecionada("");
    setObservacao("");
    onClose();
  };

  if (!servico) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.modalView}>
          <MaterialIcons
            name="close"
            size={24}
            color="#333"
            style={globalStyles.closeButton}
            onPress={handleClose}
          />
          {/* Se o serviço tiver observação, exibir para o cliente */}
          {servico?.observacao && (
            <View style={localStyles.observacaoContainer}>
              <Text style={localStyles.observacaoLabel}>Observação:</Text>
              <Text style={localStyles.observacaoText}>
                {servico.observacao}
              </Text>
            </View>
          )}
          <Text style={globalStyles.modalServico}>{servico.nome}</Text>
          <Text style={globalStyles.modalPreco}>
            {typeof servico.preco === "number"
              ? formatCurrencyBRL(servico.preco)
              : `R$ ${servico.preco}`}{" "}
            • {servico.tempo}
          </Text>
          <Text  style={globalStyles.modalDescricao}>Descrição: {servico.descricao}</Text>

          <View style={globalStyles.horarioContainer}>
            <Text style={globalStyles.horarioTitle}>
              Horários Disponíveis Hoje:
            </Text>
            <View style={globalStyles.horarioOptions}>
              {/* Use service-specific hours instead of hardcoded ones */}
              {servico.horarios && servico.horarios.length > 0 ? (
                // Sort hours chronologically
                [...servico.horarios].sort().map((hora) => (
                  <TouchableOpacity
                    key={hora}
                    style={[
                      globalStyles.horarioOption,
                      horaSelecionada === hora && globalStyles.horarioSelected,
                    ]}
                    onPress={() => setHoraSelecionada(hora)}
                  >
                    <Text
                      style={[
                        globalStyles.horarioText,
                        horaSelecionada === hora &&
                          globalStyles.horarioTextSelected,
                      ]}
                    >
                      {hora}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={globalStyles.emptyText}>
                  Não há horários disponíveis para este serviço.
                </Text>
              )}
            </View>
          </View>

          {/* Add observation field for the client */}
          <View style={localStyles.clientObservationContainer}>
            <Text style={localStyles.clientObservationLabel}>
              Observação (opcional):
            </Text>
            <TextInput
              style={localStyles.clientObservationInput}
              placeholder="Precisa de algo especial? Insira aqui! Isso ajuda o profissional a saber exatamente do que você precisa"
              value={observacao}
              onChangeText={setObservacao}
              multiline={true}
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <TouchableOpacity
            style={[
              globalStyles.agendarButton,
              (!horaSelecionada ||
                !servico.horarios ||
                servico.horarios.length === 0) &&
                globalStyles.agendarButtonDisabled,
            ]}
            disabled={
              !horaSelecionada ||
              !servico.horarios ||
              servico.horarios.length === 0
            }
            onPress={handleConfirm}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={globalStyles.agendarButtonText}>Agendar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
