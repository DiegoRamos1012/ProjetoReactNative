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

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpar o listener quando o componente for desmontado
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
