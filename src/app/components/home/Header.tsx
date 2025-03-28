import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import globalStyles from "../globalStyle/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

interface HeaderProps {
  user: User;
  setUser: (user: User | null) => void;
}

const Header: React.FC<HeaderProps> = ({ user, setUser }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={globalStyles.header}>
      <View style={globalStyles.userInfoContainer}>
        <TouchableOpacity
          onPress={navigateToProfile}
          style={globalStyles.userAvatarPlaceholder}
          activeOpacity={0.7}
        >
          <MaterialIcons name="person" size={30} color="#FFF" />
        </TouchableOpacity>
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
