import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebaseConfig";
import NotificationService from "../services/Notifications";
import { colors } from "../globalStyle/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MaskInput from "../ui/MaskInput";
import { useTheme } from "../globalStyle/ThemeContext";

interface NotificationPreferences {
  appointmentReminders: boolean;
  statusUpdates: boolean;
  promotions: boolean;
}

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    appointmentReminders: true,
    statusUpdates: true,
    promotions: false,
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().notificationPreferences) {
        setPreferences(userDoc.data().notificationPreferences);
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          notificationPreferences: preferences,
        },
        { merge: true }
      );

      Alert.alert("Sucesso", "Preferências de notificação salvas com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      Alert.alert("Erro", "Não foi possível salvar suas preferências.");
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const testNotification = () => {
    NotificationService.postLocalNotification(
      "Teste de Notificação",
      "Esta é uma notificação de teste para o app da barbearia",
      { screen: "Home" }
    );
    Alert.alert("Notificação enviada", "Verifique a notificação de teste!");
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <ActivityIndicator size="large" color={colors.barber.gold} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Text style={[styles.title, { color: theme.textColor }]}>
        Preferências de Notificação
      </Text>

      <View style={styles.optionRow}>
        <View style={styles.optionInfo}>
          <MaterialIcons
            name="notifications-active"
            size={24}
            color={colors.barber.gold}
          />
          <Text style={[styles.optionText, { color: theme.textColor }]}>
            Lembretes de Agendamento
          </Text>
        </View>
        <Switch
          value={preferences.appointmentReminders}
          onValueChange={() => handleToggle("appointmentReminders")}
          trackColor={{ false: "#767577", true: colors.barber.primary }}
          thumbColor={
            preferences.appointmentReminders ? colors.barber.gold : "#f4f3f4"
          }
        />
      </View>

      <View style={styles.optionRow}>
        <View style={styles.optionInfo}>
          <MaterialIcons name="update" size={24} color={colors.barber.gold} />
          <Text style={[styles.optionText, { color: theme.textColor }]}>
            Atualizações de Status
          </Text>
        </View>
        <Switch
          value={preferences.statusUpdates}
          onValueChange={() => handleToggle("statusUpdates")}
          trackColor={{ false: "#767577", true: colors.barber.primary }}
          thumbColor={
            preferences.statusUpdates ? colors.barber.gold : "#f4f3f4"
          }
        />
      </View>

      <View style={styles.optionRow}>
        <View style={styles.optionInfo}>
          <MaterialIcons
            name="local-offer"
            size={24}
            color={colors.barber.gold}
          />
          <Text style={[styles.optionText, { color: theme.textColor }]}>
            Promoções e Novidades
          </Text>
        </View>
        <Switch
          value={preferences.promotions}
          onValueChange={() => handleToggle("promotions")}
          trackColor={{ false: "#767577", true: colors.barber.primary }}
          thumbColor={preferences.promotions ? colors.barber.gold : "#f4f3f4"}
        />
      </View>

      <View style={styles.infoBox}>
        <MaterialIcons
          name="info-outline"
          size={22}
          color={colors.barber.gold}
        />
        <Text style={styles.infoText}>
          As notificações ajudam você a lembrar de seus agendamentos e receber
          atualizações importantes.
        </Text>
      </View>

      <TouchableOpacity style={styles.testButton} onPress={testNotification}>
        <MaterialIcons name="notifications" size={20} color="#FFF" />
        <Text style={styles.testButtonText}>Testar Notificação</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveButtonText}>Salvar Preferências</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: "rgba(32, 32, 32, 0.7)",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "#E0E0E0",
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  testButton: {
    backgroundColor: colors.barber.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  testButtonText: {
    color: "#FFF",
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.barber.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NotificationSettings;
