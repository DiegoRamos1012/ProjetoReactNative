import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { colors, globalStyles } from "../globalStyle/styles";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";

const BlockedDaysManager: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [blockedDays, setBlockedDays] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const calendarRef = useRef(null);

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

  // Buscar dias bloqueados ao abrir o modal
  useEffect(() => {
    if (modalVisible) {
      fetchBlockedDays();
    }
  }, [modalVisible]);

  // Buscar dias bloqueados do Firestore
  const fetchBlockedDays = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "config", "blockedDays");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlockedDays(docSnap.data().days || {});
      } else {
        setBlockedDays({});
      }
    } catch (error) {
      console.error("Erro ao buscar dias bloqueados:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os dias bloqueados. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Salvar dias bloqueados no Firestore
  const saveBlockedDays = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "config", "blockedDays"),
        { days: blockedDays, updatedAt: new Date() },
        { merge: true }
      );

      Alert.alert("Sucesso", "Dias bloqueados salvos com sucesso!", [
        { text: "OK", onPress: () => setModalVisible(false) },
      ]);
    } catch (error) {
      console.error("Erro ao salvar dias bloqueados:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar os dias bloqueados. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  // Alternar o estado de bloqueio de um dia
  const toggleDayBlock = (day) => {
    const { dateString } = day;

    // Impedir bloqueio de dias no passado
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateString);

    if (selectedDate < currentDate) {
      Alert.alert(
        "Ação não permitida",
        "Não é possível bloquear/desbloquear datas passadas."
      );
      return;
    }

    // Toggle do status do dia
    setBlockedDays((prev) => {
      const newBlockedDays = { ...prev };

      if (newBlockedDays[dateString]) {
        // Se já existe, remover (desbloquear)
        delete newBlockedDays[dateString];
      } else {
        // Se não existe, adicionar (bloquear)
        newBlockedDays[dateString] = {
          disabled: true,
          disableTouchEvent: true,
          selectedColor: "#F44336",
          selected: true,
        };
      }

      return newBlockedDays;
    });
  };

  return (
    <View>
      <TouchableOpacity
        style={globalStyles.blockedDaysButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="event-busy" size={24} color="#FFF" />
        <Text style={globalStyles.blockedDaysButtonText}>
          Gerenciar Dias Indisponíveis
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.blockedDaysModalView}>
            <View style={globalStyles.blockedDaysModalHeader}>
              <Text style={globalStyles.blockedDaysModalTitle}>
                Gerenciar Dias Indisponíveis
              </Text>
              <TouchableOpacity
                style={globalStyles.blockedDaysCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={globalStyles.blockedDaysModalContent}>
              <Text style={globalStyles.blockedDaysInstructions}>
                Toque em uma data para bloquear/desbloquear agendamentos nesse
                dia. Os dias em vermelho não permitirão novos agendamentos.
              </Text>

              {loading ? (
                <View style={{ alignItems: "center", padding: 20 }}>
                  <ActivityIndicator size="large" color={colors.barber.gold} />
                  <Text style={{ color: colors.white, marginTop: 10 }}>
                    Carregando dias bloqueados...
                  </Text>
                </View>
              ) : (
                <Calendar
                  ref={calendarRef}
                  onDayPress={toggleDayBlock}
                  markedDates={blockedDays}
                  minDate={new Date().toISOString().split("T")[0]}
                  maxDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() + 1)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  monthFormat={"MMMM yyyy"}
                  hideExtraDays={true}
                  enableSwipeMonths={true}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    textSectionTitleColor: colors.white,
                    selectedDayBackgroundColor: "#F44336",
                    selectedDayTextColor: colors.white,
                    todayTextColor: colors.barber.gold,
                    dayTextColor: colors.white,
                    textDisabledColor: "rgba(255, 255, 255, 0.3)",
                    monthTextColor: colors.white,
                    arrowColor: colors.barber.gold,
                  }}
                />
              )}

              <View style={globalStyles.blockedDaysLegend}>
                <Text
                  style={[
                    globalStyles.blockedDaysLegendText,
                    { marginBottom: 10, fontWeight: "bold" },
                  ]}
                >
                  Legenda:
                </Text>
                <View style={globalStyles.blockedDaysLegendItem}>
                  <View
                    style={[
                      globalStyles.blockedDaysLegendColor,
                      { backgroundColor: "#F44336" },
                    ]}
                  />
                  <Text style={globalStyles.blockedDaysLegendText}>
                    Dia bloqueado - Não permite agendamentos
                  </Text>
                </View>
                <View style={globalStyles.blockedDaysLegendItem}>
                  <View
                    style={[
                      globalStyles.blockedDaysLegendColor,
                      { backgroundColor: colors.barber.gold },
                    ]}
                  />
                  <Text style={globalStyles.blockedDaysLegendText}>
                    Dia atual
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={globalStyles.blockedDaysModalFooter}>
              <TouchableOpacity
                style={globalStyles.blockedDaysCancelButton}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={{ color: "#FFF" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.blockedDaysSaveButton}
                onPress={saveBlockedDays}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={{ color: "#000", fontWeight: "bold" }}>
                    Salvar Alterações
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BlockedDaysManager;
