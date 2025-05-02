import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import { formatCurrencyBRL } from "../../format";

const localStyles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: colors.gradient.middle,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.barber.gold,
  },
  modalHeader: {
    backgroundColor: colors.gradient.start,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButtonStyle: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    padding: 20,
  },
  observacaoContainer: {
    marginVertical: 15,
    padding: 12,
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.barber.gold,
  },
  observacaoLabel: {
    color: colors.barber.gold,
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 14,
  },
  observacaoText: {
    color: colors.white,
    fontStyle: "italic",
  },
  servicoNome: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  servicoPreco: {
    fontSize: 18,
    color: colors.barber.gold,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  servicoDescricao: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 15,
    lineHeight: 22,
    textAlign: "center",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.barber.gold,
  },
  horarioContainer: {
    marginVertical: 15,
  },
  horarioTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 12,
  },
  horarioOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  horarioOption: {
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  horarioSelected: {
    backgroundColor: colors.button.primary,
    borderColor: colors.barber.gold,
  },
  horarioText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  clientObservationContainer: {
    marginVertical: 15,
    width: "100%",
  },
  clientObservationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 10,
  },
  clientObservationInput: {
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "rgba(30, 41, 59, 0.85)",
    color: colors.white,
  },
  agendarButton: {
    backgroundColor: colors.barber.gold,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  agendarButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  agendarButtonDisabled: {
    backgroundColor: "rgba(212, 175, 55, 0.3)",
  },
  emptyText: {
    color: colors.textLight,
    fontStyle: "italic",
    textAlign: "center",
    margin: 20,
  },
  calendarContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.barber.gold,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 8,
  },
  dateSelected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  dateText: {
    color: colors.white,
    marginLeft: 8,
    fontSize: 14,
  },
});

interface AppointmentModalProps {
  visible: boolean;
  servico: Servico | null;
  onClose: () => void;
  onConfirm: (data: string, hora: string, observacao?: string) => void;
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
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [markedDates, setMarkedDates] = useState({});

  const hoje = new Date().toISOString().split("T")[0];

  const getDataMaxima = () => {
    const dataMax = new Date();
    dataMax.setDate(dataMax.getDate() + 30);
    return dataMax.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!visible) {
      setHoraSelecionada("");
      setObservacao("");
      setDataSelecionada("");
      setMarkedDates({});
    } else {
      handleDateSelect(hoje);
    }
  }, [visible]);

  const formatarData = (dataString) => {
    if (!dataString) return "";

    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleDateSelect = (data) => {
    setDataSelecionada(data);

    const newMarkedDates = {};
    newMarkedDates[data] = {
      selected: true,
      selectedColor: colors.button.primary,
    };
    setMarkedDates(newMarkedDates);
  };

  const handleConfirm = () => {
    if (!dataSelecionada) {
      Alert.alert(
        "Escolha uma data",
        "Por favor, selecione uma data para o agendamento."
      );
      return;
    }

    if (!horaSelecionada) {
      Alert.alert(
        "Escolha um horário",
        "Por favor, selecione um horário para o agendamento."
      );
      return;
    }

    onConfirm(dataSelecionada, horaSelecionada, observacao);
  };

  const handleClose = () => {
    setHoraSelecionada("");
    setObservacao("");
    setDataSelecionada("");
    setMarkedDates({});
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
        <View style={localStyles.modalContainer}>
          <View style={localStyles.modalHeader}>
            <Text style={localStyles.modalTitle}>Agendar Serviço</Text>
            <TouchableOpacity
              style={localStyles.closeButtonStyle}
              onPress={handleClose}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={localStyles.modalContent}>
              <Text style={localStyles.servicoNome}>{servico.nome}</Text>
              <Text style={localStyles.servicoPreco}>
                {typeof servico.preco === "number"
                  ? formatCurrencyBRL(servico.preco)
                  : `R$ ${servico.preco}`}{" "}
                • {servico.tempo}
              </Text>

              {servico.descricao && (
                <Text style={localStyles.servicoDescricao}>
                  {servico.descricao}
                </Text>
              )}

              {servico?.observacao && (
                <View style={localStyles.observacaoContainer}>
                  <Text style={localStyles.observacaoLabel}>
                    Observação do serviço:
                  </Text>
                  <Text style={localStyles.observacaoText}>
                    {servico.observacao}
                  </Text>
                </View>
              )}

              <View style={localStyles.calendarContainer}>
                <Text style={localStyles.calendarTitle}>
                  Selecione uma data:
                </Text>
                <Calendar
                  onDayPress={(day) => handleDateSelect(day.dateString)}
                  markedDates={markedDates}
                  minDate={hoje}
                  maxDate={getDataMaxima()}
                  monthFormat={"MMMM yyyy"}
                  hideExtraDays={true}
                  enableSwipeMonths={true}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    textSectionTitleColor: colors.white,
                    selectedDayBackgroundColor: colors.button.primary,
                    selectedDayTextColor: colors.white,
                    todayTextColor: colors.barber.gold,
                    dayTextColor: colors.white,
                    textDisabledColor: "rgba(255, 255, 255, 0.3)",
                    monthTextColor: colors.white,
                    arrowColor: colors.barber.gold,
                  }}
                />

                {dataSelecionada && (
                  <View style={localStyles.dateSelected}>
                    <MaterialIcons
                      name="event"
                      size={18}
                      color={colors.barber.gold}
                    />
                    <Text style={localStyles.dateText}>
                      Data selecionada: {formatarData(dataSelecionada)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={localStyles.horarioContainer}>
                <Text style={localStyles.horarioTitle}>
                  Horários Disponíveis:
                </Text>
                <View style={localStyles.horarioOptions}>
                  {servico.horarios && servico.horarios.length > 0 ? (
                    [...servico.horarios].sort().map((hora) => (
                      <TouchableOpacity
                        key={hora}
                        style={[
                          localStyles.horarioOption,
                          horaSelecionada === hora &&
                            localStyles.horarioSelected,
                        ]}
                        onPress={() => setHoraSelecionada(hora)}
                      >
                        <Text style={localStyles.horarioText}>{hora}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={localStyles.emptyText}>
                      Não há horários disponíveis para este serviço.
                    </Text>
                  )}
                </View>
              </View>

              <View style={localStyles.clientObservationContainer}>
                <Text style={localStyles.clientObservationLabel}>
                  Observações para o profissional (opcional):
                </Text>
                <TextInput
                  style={localStyles.clientObservationInput}
                  placeholder="Descreva aqui suas necessidades específicas..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={observacao}
                  onChangeText={setObservacao}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={200}
                />
              </View>

              <TouchableOpacity
                style={[
                  localStyles.agendarButton,
                  (!dataSelecionada ||
                    !horaSelecionada ||
                    !servico.horarios ||
                    servico.horarios.length === 0) &&
                    localStyles.agendarButtonDisabled,
                ]}
                disabled={
                  !dataSelecionada ||
                  !horaSelecionada ||
                  !servico.horarios ||
                  servico.horarios.length === 0
                }
                onPress={handleConfirm}
              >
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={localStyles.agendarButtonText}>
                    CONFIRMAR AGENDAMENTO
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
