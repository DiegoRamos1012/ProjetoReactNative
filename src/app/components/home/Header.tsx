import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import globalStyles, { colors } from "../globalStyle/styles";
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
    <View>
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

      {/* Linha horizontal para finalizar o header */}
      <View
        style={{
          height: 2,
          backgroundColor: "transparent",
          marginVertical: 2,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(30, 41, 59, 0.8)",
          shadowColor: "rgba(30, 41, 59, 0.8)",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.6,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: colors.gradient.middle,
            opacity: 0.3,
          }}
        />
      </View>
    </View>
  );
};

export default Header;
