import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import globalStyles from "../globalStyle/styles";

interface HeaderProps {
  user: User;
  setUser: (user: User | null) => void;
}

const Header: React.FC<HeaderProps> = ({ user, setUser }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Alert.alert("Logout", "Você saiu com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
    }
  };

  return (
    <View style={globalStyles.header}>
      <View style={globalStyles.userInfoContainer}>
        <View style={globalStyles.userAvatarPlaceholder}>
          <MaterialIcons name="person" size={30} color="#FFF" />
        </View>
        <View>
          <Text style={globalStyles.userName}>
            Olá, {user.displayName || "Cliente"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={globalStyles.logoutButton}
      >
        <MaterialIcons name="logout" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
