import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Servico } from "../../types";
import globalStyles from "../globalStyle/styles";

interface AppointmentModalProps {
  visible: boolean;
  servico: Servico | null;
  onClose: () => void;
  onConfirm: (hora: string) => void;
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

  const handleConfirm = () => {
    onConfirm(horaSelecionada);
  };

  const handleClose = () => {
    setHoraSelecionada("");
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

          <Text style={globalStyles.modalTitle}>Agendar Serviço</Text>
          <View style={globalStyles.modalIconContainer}>
            <MaterialIcons name={servico.iconName as any} size={40} color="#2A4A73" />
          </View>
          <Text style={globalStyles.modalServico}>{servico.nome}</Text>
          <Text style={globalStyles.modalPreco}>
            {servico.preco} • {servico.tempo}
          </Text>
          <Text style={globalStyles.modalDescricao}>{servico.descricao}</Text>

          <View style={globalStyles.horarioContainer}>
            <Text style={globalStyles.horarioTitle}>
              Horários Disponíveis Hoje:
            </Text>
            <View style={globalStyles.horarioOptions}>
              {["09:00", "10:30", "13:00", "15:30", "17:00"].map((hora) => (
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
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              globalStyles.agendarButton,
              !horaSelecionada && globalStyles.agendarButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!horaSelecionada || loading}
          >
            <Text style={globalStyles.agendarButtonText}>
              {loading ? "Processando..." : "Confirmar Agendamento"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
