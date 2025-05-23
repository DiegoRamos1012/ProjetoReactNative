import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import AppNavigator from "./navigation/AppNavigator";
import globalStyles from "./components/globalStyle/styles";

// Log de desenvolvimento - será o primeiro log que aparece
console.log("========================================================");
console.log("Para emulação no Expo Go, utilize a versão de SDK 52");
console.log("========================================================");
console.log(
  "Desenvolvido por: Diego Ramos dos Santos. Github: @diego1012",
);
console.log("========================================================");
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar o serviço de notificações

  // Função callback memoizada para atualizar o usuário
  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  // AUTH STATE LISTENER - Este é crucial para a persistência
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        "AsyncStorage: " +
          (currentUser
            ? "Persistência funcionando corretamente"
            : "Usuário não autenticado")
      );
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
