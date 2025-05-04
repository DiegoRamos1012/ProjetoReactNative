import { useEffect } from "react";
import NotificationService from "../components/services/Notifications";
import { auth } from "../../config/firebaseConfig";

/**
 * Hook para inicializar notificações no app
 * Este hook deve ser usado no componente principal do app
 */
export const useNotifications = () => {
  useEffect(() => {
    // Inicializar o serviço de notificações
    console.log("Inicializando serviço de notificações");

    // Resetar qualquer estado de notificação anterior
    NotificationService.cancelAllLocalNotifications();
    NotificationService.resetBadgeCount();

    // Configurar listeners para eventos de notificação
    const configureNotificationsForUser = () => {
      const user = auth.currentUser;
      if (user) {
        console.log("Configurando notificações para o usuário:", user.uid);
        // Aqui podemos realizar configurações adicionais específicas do usuário se necessário
      }
    };

    // Configurar notificações caso o usuário já esteja logado
    configureNotificationsForUser();

    // Adicionar um listener para mudanças de estado de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuário fez login, configurar notificações
        configureNotificationsForUser();
      } else {
        // Usuário fez logout, limpar notificações se necessário
        NotificationService.cancelAllLocalNotifications();
        NotificationService.resetBadgeCount();
      }
    });

    // Limpar listener quando o componente for desmontado
    return () => {
      unsubscribe();
    };
  }, []);

  // Função para enviar uma notificação de teste
  const sendTestNotification = () => {
    NotificationService.postLocalNotification(
      "Teste de Notificação",
      "Esta é uma notificação de teste para o app da barbearia",
      { screen: "Home" }
    );
  };

  return {
    sendTestNotification,
  };
};
