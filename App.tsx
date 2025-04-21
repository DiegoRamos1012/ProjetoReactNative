import React, { useState, useEffect, useRef } from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import AppNavigator from "./src/app/navigation/AppNavigator";
import { colors } from "./src/app/components/globalStyle/styles";
import TransitionOverlay from "./src/app/components/TransitionOverlay";

const App = () => {
  const [user, setUser] = React.useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStateRef = useRef<NavigationState | null>(null);

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
              fontFamily: 'System',
              fontWeight: 'normal',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: 'normal',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: 'bold',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
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
