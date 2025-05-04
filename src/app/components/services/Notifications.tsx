import {
  Notifications,
  NotificationBackgroundFetchResult,
} from "react-native-notifications";
import { Platform } from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebaseConfig";

interface NotificationData {
  [key: string]: any;
}

class NotificationService {
  constructor() {
    this.configure();
  }

  // Configuração inicial das notificações
  configure() {
    // Registrar para eventos de notificação
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log("Notificação recebida em primeiro plano:", notification);

        // Completar o processo de notificação
        completion({ alert: true, sound: true, badge: true });
      }
    );

    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log("Notificação aberta pelo usuário:", notification);

        // Aqui você pode navegar para uma tela específica com base na notificação
        // Ex: this.navigationService.navigate('Agendamento', { id: notification.payload.agendamentoId });

        completion();
      }
    );

    Notifications.events().registerNotificationReceivedBackground(
      (notification, completion) => {
        console.log("Notificação recebida em background:", notification);
        completion(NotificationBackgroundFetchResult.NEW_DATA);
      }
    );

    // Para iOS é necessário solicitar permissão
    if (Platform.OS === "ios") {
      this.requestIOSPermissions();
    } else {
      // No Android solicitar o token diretamente
      this.registerDevice();
    }
  }

  // Solicitar permissões no iOS
  requestIOSPermissions() {
    Notifications.ios
      .requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      })
      .then((data: any) => {
        console.log("Permissões de notificação iOS:", data);
        this.registerDevice();
      });
  }

  // Registrar o dispositivo para notificações
  registerDevice() {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      // Evento disparado quando o dispositivo é registrado com sucesso
      console.log("Dispositivo registrado para notificações:", event);
      this.saveTokenToFirestore(event.deviceToken);
    });

    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event) => {
        console.error("Falha ao registrar para notificações:", event);
      }
    );
  }

  // Salvar o token no Firestore
  async saveTokenToFirestore(token: string) {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);

      // Verificar se o documento existe
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Atualizar token sem sobrescrever outros dados
        await setDoc(
          userDocRef,
          {
            pushToken: token,
            platform: Platform.OS,
            tokenUpdatedAt: new Date(),
          },
          { merge: true }
        );

        console.log("Token salvo com sucesso no Firestore");
      }
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  }

  // Enviar notificação local (usado para testes)
  postLocalNotification(
    title: string,
    body: string,
    data: NotificationData = {}
  ) {
    Notifications.postLocalNotification({
        title,
        body,
        payload: data,
        identifier: "",
        sound: "",
        badge: 0,
        type: "",
        thread: ""
    });
  }

  // Limpar todas as notificações pendentes
  cancelAllLocalNotifications() {
    Notifications.cancelLocalNotification();
  }

  // Remover badge no iOS
  resetBadgeCount() {
    if (Platform.OS === "ios") {
      Notifications.ios.setBadgeCount(0);
    }
  }
}

export default new NotificationService();
