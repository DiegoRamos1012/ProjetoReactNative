import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User } from "firebase/auth";
import { colors } from "../components/globalStyle/styles";

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

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.gradient.middle },
        animation: "fade",
        animationDuration: 200,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        fullScreenGestureEnabled: true,
        // Configuração para eliminar o flash branco
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
              animation: "slide_from_left",
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
