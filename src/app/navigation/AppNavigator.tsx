import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User } from "firebase/auth";

import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import Login from "../Screens/Login";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ user, setUser }) => {
  const [password, setPassword] = useState<string>("");

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
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
            <Stack.Screen name="Home">
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
            <Stack.Screen name="Profile">
              {(props) => <Profile {...props} user={user} setUser={setUser} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
