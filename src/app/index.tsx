import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Login from "./Login";
import Home from "./Home";
import globalStyles from "./components/globalStyle/styles";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Exibir tela de carregamento
  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A4A73" />
      </View>
    );
  }

  // Renderizar Login ou Home baseado no estado de autenticação
  return user ? (
    <Home user={user} setUser={setUser} />
  ) : (
    <Login setUser={setUser} />
  );
}
