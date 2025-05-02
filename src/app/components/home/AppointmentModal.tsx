import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import { formatCurrencyBRL } from "../../format";

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

  LocaleConfig.locales["pt-br"] = {
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    dayNames: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
  };

  LocaleConfig.defaultLocale = "pt-br";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.appointmentModalContainer}>
          <View style={globalStyles.appointmentModalHeader}>
            <Text style={globalStyles.appointmentModalTitle}>
              Agendar Serviço
            </Text>
            <TouchableOpacity
              style={globalStyles.appointmentCloseButton}
              onPress={handleClose}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={globalStyles.appointmentModalContent}>
              <Text style={globalStyles.appointmentServicoNome}>
                {servico.nome}
              </Text>
              <Text style={globalStyles.appointmentServicoPreco}>
                {typeof servico.preco === "number"
                  ? formatCurrencyBRL(servico.preco)
                  : `R$ ${servico.preco}`}{" "}
                • {servico.tempo}
              </Text>

              {servico.descricao && (
                <Text style={globalStyles.appointmentServicoDescricao}>
                  {servico.descricao}
                </Text>
              )}

              {servico?.observacao && (
                <View style={globalStyles.appointmentObservacaoContainer}>
                  <Text style={globalStyles.appointmentObservacaoLabel}>
                    Observação do serviço:
                  </Text>
                  <Text style={globalStyles.appointmentObservacaoText}>
                    {servico.observacao}
                  </Text>
                </View>
              )}

              <View style={globalStyles.appointmentCalendarContainer}>
                <Text style={globalStyles.appointmentCalendarTitle}>
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
                  <View style={globalStyles.appointmentDateSelected}>
                    <MaterialIcons
                      name="event"
                      size={18}
                      color={colors.barber.gold}
                    />
                    <Text style={globalStyles.appointmentDateText}>
                      Data selecionada: {formatarData(dataSelecionada)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={globalStyles.appointmentHorarioContainer}>
                <Text style={globalStyles.appointmentHorarioTitle}>
                  Horários Disponíveis:
                </Text>
                <View style={globalStyles.appointmentHorarioOptions}>
                  {servico.horarios && servico.horarios.length > 0 ? (
                    [...servico.horarios].sort().map((hora) => (
                      <TouchableOpacity
                        key={hora}
                        style={[
                          globalStyles.appointmentHorarioOption,
                          horaSelecionada === hora &&
                            globalStyles.appointmentHorarioSelected,
                        ]}
                        onPress={() => setHoraSelecionada(hora)}
                      >
                        <Text style={globalStyles.appointmentHorarioText}>
                          {hora}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={globalStyles.appointmentEmptyText}>
                      Não há horários disponíveis para este serviço.
                    </Text>
                  )}
                </View>
              </View>

              <View style={globalStyles.appointmentClientObservationContainer}>
                <Text style={globalStyles.appointmentClientObservationLabel}>
                  Observações para o profissional (opcional):
                </Text>
                <TextInput
                  style={globalStyles.appointmentClientObservationInput}
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
                  globalStyles.appointmentAgendarButton,
                  (!dataSelecionada ||
                    !horaSelecionada ||
                    !servico.horarios ||
                    servico.horarios.length === 0) &&
                    globalStyles.appointmentAgendarButtonDisabled,
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
                  <Text style={globalStyles.appointmentAgendarButtonText}>
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
