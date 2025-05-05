import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NotificationSettingsProps,
  NotificationSettings as NotificationSettingsType,
} from "../types/types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  navigation,
  user,
}) => {
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
  const [appointmentReminders, setAppointmentReminders] =
    useState<boolean>(true);
  const [promotions, setPromotions] = useState<boolean>(false);
  const [systemUpdates, setSystemUpdates] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Carregar configurações de notificação do Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const fetchNotificationSettings = async () => {
      setLoading(true);
      try {
        const notifRef = doc(db, "notificationSettings", user.uid);
        const notifDoc = await getDoc(notifRef);

        if (notifDoc.exists()) {
          const data = notifDoc.data() as NotificationSettingsType;
          setPushEnabled(data.pushEnabled ?? true);
          setEmailEnabled(data.emailEnabled ?? false);
          setAppointmentReminders(data.appointmentReminders ?? true);
          setPromotions(data.promotions ?? false);
          setSystemUpdates(data.systemUpdates ?? true);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações de notificação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, [user]);

  // Salvar configurações a cada alteração
  const saveSettings = async () => {
    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não identificado");
      return;
    }

    setSaving(true);
    try {
      // Criar objeto de configurações
      const notificationSettings: NotificationSettingsType = {
        pushEnabled,
        emailEnabled,
        appointmentReminders,
        promotions,
        systemUpdates,
        userId: user.uid,
        updatedAt: new Date(),
      };

      // Salvar no Firebase
      await setDoc(
        doc(db, "notificationSettings", user.uid),
        notificationSettings
      );
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar suas preferências. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  // Salvar automaticamente quando qualquer configuração mudar
  useEffect(() => {
    if (loading || !user?.uid) return;

    const saveTimeout = setTimeout(() => {
      saveSettings();
    }, 500);

    return () => clearTimeout(saveTimeout);
  }, [
    pushEnabled,
    emailEnabled,
    appointmentReminders,
    promotions,
    systemUpdates,
  ]);

  return (
    <View
      style={[
        globalStyles.homeContainer,
        { backgroundColor: colors.gradient.middle },
      ]}
    >
      <View
        style={[
          globalStyles.header,
          { backgroundColor: colors.gradient.start },
        ]}
      >
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={[
            globalStyles.bannerTitle,
            { marginBottom: 0, color: colors.primary },
          ]}
        >
          Gerenciamento de Notificações
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canais de Notificação</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingName}>Notificações Push</Text>
              <Text style={styles.settingDescription}>
                Receba alertas diretamente no seu celular
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{
                false: colors.gray,
                true: colors.notification.active,
              }}
              thumbColor={pushEnabled ? colors.white : colors.lightGray}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingName}>Notificações por Email</Text>
              <Text style={styles.settingDescription}>
                Receba informações por email
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{
                false: colors.gray,
                true: colors.notification.active,
              }}
              thumbColor={emailEnabled ? colors.white : colors.lightGray}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Notificação</Text>

          <View style={styles.settingItem}>
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.notification.reminder}20` },
              ]}
            >
              <Ionicons
                name="calendar"
                size={20}
                color={colors.notification.reminder}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingName}>Lembretes de Agendamento</Text>
              <Text style={styles.settingDescription}>
                Lembretes sobre seus agendamentos
              </Text>
            </View>
            <Switch
              value={appointmentReminders}
              onValueChange={setAppointmentReminders}
              trackColor={{
                false: colors.gray,
                true: colors.notification.reminder,
              }}
              thumbColor={
                appointmentReminders ? colors.white : colors.lightGray
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.notification.promo}20` },
              ]}
            >
              <Ionicons
                name="pricetags"
                size={20}
                color={colors.notification.promo}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingName}>Promoções</Text>
              <Text style={styles.settingDescription}>
                Ofertas e descontos especiais
              </Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{
                false: colors.gray,
                true: colors.notification.promo,
              }}
              thumbColor={promotions ? colors.white : colors.lightGray}
            />
          </View>

          <View style={styles.settingItem}>
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.notification.update}20` },
              ]}
            >
              <Ionicons
                name="sync"
                size={20}
                color={colors.notification.update}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingName}>Atualizações do Sistema</Text>
              <Text style={styles.settingDescription}>
                Informações sobre novos recursos
              </Text>
            </View>
            <Switch
              value={systemUpdates}
              onValueChange={setSystemUpdates}
              trackColor={{
                false: colors.gray,
                true: colors.notification.update,
              }}
              thumbColor={systemUpdates ? colors.white : colors.lightGray}
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[globalStyles.button, styles.saveButton]}
            onPress={saveSettings}
          >
            <Text style={globalStyles.buttonText}>Salvar Configurações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 8,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    color: colors.textLighter,
    fontSize: 14,
    marginTop: 4,
  },
  bottomContainer: {
    paddingVertical: 24,
  },
  saveButton: {
    backgroundColor: colors.button.primary,
  },
});

export default NotificationSettings;
