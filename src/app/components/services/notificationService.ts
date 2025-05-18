import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { db } from "../../../config/firebaseConfig";
import { UserData } from "../../types/types";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Configurar comportamento de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registra o dispositivo para receber notificações push
 * @param userId ID do usuário
 * @returns Token de push notification
 */
export async function registerForPushNotifications(userId: string) {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Não foi possível obter permissão para notificações push!");
      return;
    }

    // Obter token do Expo
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "b2a9a738-5a6a-4fd7-9e0b-8420dfaeab45", // seu projectId do app.json
      })
    ).data;

    // Salvar token no Firestore
    await saveUserPushToken(userId, token);

    console.log("Token push notification:", token);
  } else {
    console.log("Notificações push só funcionam em dispositivos físicos");
  }

  return token;
}

/**
 * Salva o token de notificação push do usuário no Firestore
 */
async function saveUserPushToken(userId: string, token: string) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Atualizar o documento do usuário com o token
      await updateDoc(userRef, {
        pushToken: token,
        notificationsEnabled: true,
      });
    }
  } catch (error) {
    console.error("Erro ao salvar token de notificação:", error);
  }
}

/**
 * Atualiza as preferências de notificação do usuário
 */
export async function updateNotificationPreferences(
  userId: string,
  enabled: boolean
) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      notificationsEnabled: enabled,
    });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar preferências de notificação:", error);
    return false;
  }
}

/**
 * Envia notificação para um usuário específico
 */
export async function sendNotificationToUser(
  userId: string,
  title: string,
  body: string,
  data?: any
) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;

      if (userData.notificationsEnabled && userData.pushToken) {
        await sendPushNotification(userData.pushToken, title, body, data);
        return true;
      } else {
        console.log(
          `Usuário ${userId} não habilitou notificações ou não tem token válido`
        );
        return false;
      }
    } else {
      console.log(`Usuário ${userId} não encontrado`);
      return false;
    }
  } catch (error) {
    console.error("Erro ao enviar notificação para usuário:", error);
    return false;
  }
}

/**
 * Envia notificação para um grupo de usuários com base no cargo/role
 */
export async function sendNotificationToGroup(
  targetGroup: "all" | "clients" | "staff" | "admin",
  title: string,
  body: string,
  data?: any
) {
  try {
    const usersRef = collection(db, "users");
    let q;

    // Construir a query baseada no grupo alvo (código existente)
    if (targetGroup === "all") {
      q = query(usersRef, where("notificationsEnabled", "==", true));
    } else if (targetGroup === "clients") {
      q = query(
        usersRef,
        where("role", "==", "cliente"),
        where("notificationsEnabled", "==", true)
      );
    } else if (targetGroup === "staff") {
      q = query(
        usersRef,
        where("cargo", "in", ["barbeiro", "funcionario"]),
        where("notificationsEnabled", "==", true)
      );
    } else if (targetGroup === "admin") {
      q = query(
        usersRef,
        where("role", "==", "administrador"),
        where("notificationsEnabled", "==", true)
      );
    }

    const usersSnapshot = await getDocs(q);

    // Enviar para cada usuário do grupo e capturar resultados
    const sendPromises = usersSnapshot.docs.map(async (userDoc) => {
      const userData = userDoc.data() as UserData;
      if (userData.pushToken) {
        const success = await sendPushNotification(
          userData.pushToken,
          title,
          body,
          data
        );
        return success ? 1 : 0; // Retornar 1 se enviou com sucesso, 0 se falhou
      }
      return 0; // Retornar 0 se não tiver token
    });

    // Esperar todas as promessas resolverem e somar os resultados
    const results = await Promise.all(sendPromises);
    const sentCount = results.reduce((total, current) => total + current, 0);

    console.log(
      `Notificação enviada para ${sentCount} usuários do grupo ${targetGroup}`
    );
    return sentCount;
  } catch (error) {
    console.error("Erro ao enviar notificação para grupo:", error);
    return 0;
  }
}

/**
 * Função base para enviar notificação push via Expo
 */
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: any
) {
  try {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: data || {},
    };

    // Utilizando a API de push do Expo
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();

    if (responseData.data && responseData.data.status === "ok") {
      console.log("Notificação enviada com sucesso!");
      return true;
    } else {
      console.error("Erro ao enviar notificação:", responseData);
      return false;
    }
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
    return false;
  }
}

