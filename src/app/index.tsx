import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Login from "./Login";
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
      <View style={globalStyles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Se não tiver usuário logado, exibe tela de login diretamente
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // Se tiver usuário logado, exibe a tela principal
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo!</Text>
      <Text>Você está logado como: {user.email}</Text>
      <Text
        style={[globalStyles.singleButtonText, { marginTop: 20 }]}
        onPress={() => auth.signOut()}
      >
        Sair
      </Text>
    </View>
  );
}
