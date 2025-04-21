import React, { useState, useRef, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User } from "firebase/auth";
import { colors } from "../components/globalStyle/styles";
import { useNavigationContainerRef } from "@react-navigation/native";

import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import Login from "../Screens/Login";
import AdminTools from "../Screens/AdminTools";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  AdminTools: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ user, setUser }) => {
  const [password, setPassword] = useState<string>("");
  // Referência para rastrear a rota anterior
  const prevRouteRef = useRef<string | null>(null);
  const fromAdminRef = useRef<boolean>(false);

  // Função para detectar transições específicas
  const getAnimationForRoute = (
    currentRoute: string,
    previousRoute: string | null
  ) => {
    // Estamos vindo do AdminTools para o Profile?
    if (currentRoute === "Profile" && previousRoute === "AdminTools") {
      fromAdminRef.current = true;
      return "slide_from_left"; // AdminTools -> Profile desliza da esquerda
    }

    // Estamos vindo do Profile para o Home, depois de ter vindo do AdminTools?
    if (
      currentRoute === "Home" &&
      previousRoute === "Profile" &&
      fromAdminRef.current
    ) {
      fromAdminRef.current = false;
      return "slide_from_left"; // Profile -> Home (após AdminTools) desliza da esquerda
    }

    // Para outras transições Profile -> Home, também deslizamos da esquerda
    if (currentRoute === "Home" && previousRoute === "Profile") {
      return "slide_from_left";
    }

    // Para transições para Profile ou AdminTools, deslizamos da direita
    if (currentRoute === "Profile" || currentRoute === "AdminTools") {
      return "slide_from_right";
    }

    // Default
    return "fade";
  };

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.gradient.middle },
        animation: "fade",
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        fullScreenGestureEnabled: true,
        presentation: "transparentModal",
      }}
    >
      {!user ? (
        <Stack.Screen name="Login">
          {(props) => (
            <Login {...props} setUser={setUser} setPassword={setPassword} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            options={{
              animation: "fade",
            }}
            listeners={{
              focus: () => {
                const animation = getAnimationForRoute(
                  "Home",
                  prevRouteRef.current
                );
                prevRouteRef.current = "Home";
              },
            }}
          >
            {(props) => (
              <Home
                {...props}
                user={user}
                setUser={setUser}
                password={password}
                setShowProfile={() => {}}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Profile"
            options={{
              animation: "slide_from_right",
              animationDuration: 300,
            }}
            listeners={{
              focus: () => {
                const animation = getAnimationForRoute(
                  "Profile",
                  prevRouteRef.current
                );
                prevRouteRef.current = "Profile";
              },
              beforeRemove: () => {
                // Se sairmos do Profile, configuramos a animação com base na próxima tela
              },
            }}
          >
            {(props) => <Profile {...props} user={user} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen
            name="AdminTools"
            options={{
              title: "Ferramentas de Admin",
              animation: "slide_from_right",
              animationDuration: 300,
            }}
            listeners={{
              focus: () => {
                prevRouteRef.current = "AdminTools";
              },
            }}
          >
            {(props) => <AdminTools {...props} user={user} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
