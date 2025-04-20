import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User } from "firebase/auth";
import { colors } from "../components/globalStyle/styles";
import { Animated, Easing } from "react-native";
import { CardStyleInterpolators } from "@react-navigation/stack";

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

// Animação personalizada para slide da esquerda
const customSlideFromLeft = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-layouts.screen.width, 0],
            }),
          },
        ],
        backgroundColor: colors.gradient.middle,
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
          extrapolate: "clamp",
        }),
      },
    };
  },
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 250,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 200,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      },
    },
  },
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ user, setUser }) => {
  const [password, setPassword] = useState<string>("");

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.gradient.middle },
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // Configurações adicionais para evitar o flash branco durante a transição
        animationTypeForReplace: "push",
        cardStyle: { backgroundColor: colors.gradient.dark },
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
              // Quando voltamos do Profile para Home, a tela vem da esquerda
              ...customSlideFromLeft,
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
              // Por padrão, quando vamos para Profile, a tela vem da direita
              animation: "slide_from_right",
              animationDuration: 250,
            }}
          >
            {(props) => <Profile {...props} user={user} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen
            name="AdminTools"
            options={{
              title: "Ferramentas de Admin",
              animation: "slide_from_right",
              animationDuration: 250,
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
