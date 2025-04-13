import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import AppNavigator from "./navigation/AppNavigator";
import globalStyles from "./components/globalStyle/styles";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função callback memoizada para atualizar o usuário
  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  // AUTH STATE LISTENER - Este é crucial para a persistência
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("AsyncStorage: " + (currentUser ? "Persistência funcionando corretamente" : "Usuário não autenticado"));
      setUser(currentUser);
      setLoading(false);
    });

    // Limpar inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  // Memoizar o AppNavigator para evitar re-renders desnecessários
  const memoizedNavigator = useMemo(() => {
    return <AppNavigator user={user} setUser={handleSetUser} />;
  }, [user, handleSetUser]);

  // Exibir tela de carregamento
  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A4A73" />
      </View>
    );
  }

  return memoizedNavigator;
}
