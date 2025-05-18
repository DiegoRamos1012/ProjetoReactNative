import React, { useState, useEffect, useRef } from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import AppNavigator from "./src/app/navigation/AppNavigator";
import { colors } from "./src/app/components/globalStyle/styles";
import TransitionOverlay from "./src/app/components/TransitionOverlay";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "./src/app/components/services/notificationService";

const App = () => {
  const [user, setUser] = React.useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStateRef = useRef<NavigationState | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Detectar mudanças no estado de navegação
  const handleStateChange = (state: NavigationState | undefined) => {
    if (state && prevStateRef.current) {
      // Se as rotas mudaram, ativar o overlay de transição
      if (
        state.routes.length !== prevStateRef.current.routes.length ||
        state.index !== prevStateRef.current.index
      ) {
        setIsTransitioning(true);
        // Depois de um curto período, esconder o overlay
        setTimeout(() => setIsTransitioning(false), 350);
      }
    }
    prevStateRef.current = state || null;
  };

  useEffect(() => {
    // Registrar para notificações quando o usuário estiver logado
    if (user && user.uid) {
      registerForPushNotifications(user.uid).catch((error) =>
        console.log("Erro ao registrar para notificações:", error)
      );

      // Listener para notificações recebidas enquanto o app está aberto
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notificação recebida:", notification);
          // Aqui você pode atualizar um contador de notificações ou mostrar um indicador visual
        });

      // Listener para quando o usuário toca em uma notificação
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Resposta de notificação:", response);
          const data = response.notification.request.content.data as any;

          // Navegação baseada no tipo de notificação
          if (data.screen) {
            // navigation.navigate(data.screen, data.params);
          }
        });
    }

    return () => {
      // Limpar listeners ao desmontar
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gradient.middle }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.gradient.middle}
        translucent={false}
      />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.button.primary,
            background: colors.gradient.middle,
            card: colors.gradient.middle,
            text: colors.text,
            border: "transparent",
            notification: colors.error,
          },
          fonts: {
            regular: {
              fontFamily: "System",
              fontWeight: "normal",
            },
            medium: {
              fontFamily: "System",
              fontWeight: "normal",
            },
            bold: {
              fontFamily: "System",
              fontWeight: "bold",
            },
            heavy: {
              fontFamily: "System",
              fontWeight: "900",
            },
          },
        }}
        onStateChange={handleStateChange}
      >
        <AppNavigator user={user} setUser={setUser} />
        <TransitionOverlay isActive={isTransitioning} />
      </NavigationContainer>
    </View>
  );
};

export default App;
