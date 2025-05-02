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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";

interface AppointmentModalProps {
  visible: boolean;
  servico: Servico | null;
  onClose: () => void;
  onConfirm: (
    servico: Servico,
    data: string,
    hora: string,
    observacao?: string
  ) => void;
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
  const [blockedDays, setBlockedDays] = useState({});
  const [loadingBlockedDays, setLoadingBlockedDays] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];

  // Carregar dias bloqueados quando o modal for aberto
  useEffect(() => {
    if (visible) {
      fetchBlockedDays();
    }
  }, [visible]);

  const fetchBlockedDays = async () => {
    setLoadingBlockedDays(true);
    try {
      const blockedDaysDoc = await getDoc(doc(db, "config", "blockedDays"));
      if (blockedDaysDoc.exists()) {
        const blockDaysData = blockedDaysDoc.data().days || {};

        // Processar os dias bloqueados para destacá-los visualmente
        const processedBlockedDays = {};
        Object.keys(blockDaysData).forEach((date) => {
          processedBlockedDays[date] = {
            disabled: true,
            disableTouchEvent: true,
            selected: true,
            selectedColor: "#F44336",
            selectedTextColor: "#ffffff",
          };
        });

        setBlockedDays(processedBlockedDays);
        // Iniciar com os dias bloqueados já aplicados
        setMarkedDates({ ...processedBlockedDays });
      } else {
        setBlockedDays({});
        setMarkedDates({});
      }
    } catch (error) {
      console.error("Erro ao buscar dias bloqueados:", error);
      // Não mostrar alerta para não interromper a experiência do usuário
    } finally {
      setLoadingBlockedDays(false);
    }
  };

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
    // Verificar se a data está bloqueada
    if (blockedDays[data]) {
      Alert.alert(
        "Data Indisponível",
        "Esta data não está disponível para agendamentos. Por favor, escolha outra data."
      );
      return;
    }

    setDataSelecionada(data);

    // Criar uma cópia profunda dos dias marcados
    const newMarkedDates = JSON.parse(JSON.stringify(blockedDays));

    // Adicionar a data selecionada com estilo especial
    newMarkedDates[data] = {
      selected: true,
      selectedColor: colors.button.primary,
    };

    setMarkedDates(newMarkedDates);
  };

  const handleConfirm = () => {
    if (!dataSelecionada) {
      Alert.alert(
        "Data não selecionada",
        "Por favor, selecione uma data para o agendamento."
      );
      return;
    }

    if (!horaSelecionada) {
      Alert.alert(
        "Horário não selecionado",
        "Por favor, selecione um horário para o agendamento."
      );
      return;
    }

    if (servico) {
      onConfirm(servico, dataSelecionada, horaSelecionada, observacao);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Configurar idioma português para o calendário
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
        <View
          style={[globalStyles.appointmentModalContainer, { maxHeight: "90%" }]}
        >
          <View style={globalStyles.appointmentModalHeader}>
            <Text style={globalStyles.appointmentModalTitle}>
              Agendar Serviço
            </Text>
            <TouchableOpacity
              style={globalStyles.appointmentCloseButton}
              onPress={handleClose}
            >
              <MaterialIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={globalStyles.appointmentModalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 35 }}
          >
            {servico ? (
              <>
                <Text style={globalStyles.appointmentServicoNome}>
                  {servico.nome}
                </Text>
                <Text style={globalStyles.appointmentServicoPreco}>
                  {formatCurrencyBRL(servico.preco)}
                </Text>

                {servico.observacao && (
                  <View style={globalStyles.appointmentObservacaoContainer}>
                    <Text style={globalStyles.appointmentObservacaoLabel}>
                      Informações do serviço:
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
                  {loadingBlockedDays ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.barber.gold}
                    />
                  ) : (
                    <>
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
                      {Object.keys(blockedDays).length > 0 && (
                        <View style={globalStyles.blockedDaysLegend}>
                          <View style={globalStyles.blockedDaysLegendItem}>
                            <View
                              style={[
                                globalStyles.blockedDaysLegendColor,
                                { backgroundColor: "#F44336" },
                              ]}
                            />
                            <Text style={globalStyles.blockedDaysLegendText}>
                              Dia indisponível - Não permite agendamentos
                            </Text>
                          </View>
                          <View style={globalStyles.blockedDaysLegendItem}>
                            <View
                              style={[
                                globalStyles.blockedDaysLegendColor,
                                { backgroundColor: colors.button.primary },
                              ]}
                            />
                            <Text style={globalStyles.blockedDaysLegendText}>
                              Dia selecionado
                            </Text>
                          </View>
                        </View>
                      )}
                    </>
                  )}
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
                          <Text
                            style={[
                              globalStyles.appointmentHorarioText,
                              horaSelecionada === hora && {
                                fontWeight: "bold",
                              },
                            ]}
                          >
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

                <View
                  style={globalStyles.appointmentClientObservationContainer}
                >
                  <Text style={globalStyles.appointmentClientObservationLabel}>
                    Observações (opcional):
                  </Text>
                  <TextInput
                    style={globalStyles.appointmentClientObservationInput}
                    placeholder="Informe aqui detalhes adicionais ou preferências..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    multiline={true}
                    numberOfLines={3}
                    value={observacao}
                    onChangeText={setObservacao}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    globalStyles.appointmentAgendarButton,
                    (!dataSelecionada || !horaSelecionada || loading) &&
                      globalStyles.appointmentAgendarButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={!dataSelecionada || !horaSelecionada || loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={globalStyles.appointmentAgendarButtonText}>
                      Agendar Serviço
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <Text style={globalStyles.appointmentEmptyText}>
                Erro ao carregar informações do serviço.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
