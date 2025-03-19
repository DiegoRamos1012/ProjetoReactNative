import React from "react";
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles, {colors} from "../../../app/components/globalStyle/styles";
interface LoginScreenProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  handleLogin: () => void;
  goToWelcome: () => void;
  isLoading: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  handleLogin,
  goToWelcome,
  isLoading,
}) => (
  <View style={globalStyles.container}>
    <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />
    <Image style={globalStyles.image} />
    <Text style={[globalStyles.title, { marginBottom: 30 }]}>
      Faça seu Login
    </Text>

    <TextInput
      style={globalStyles.textInput}
      placeholder="Endereço de E-mail"
      placeholderTextColor={"#FFFFFF"}
      onChangeText={setEmail}
      value={email}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <View style={globalStyles.passwordGroup}>
      <TextInput
        style={[globalStyles.textInput, globalStyles.passwordInput]}
        placeholder="Senha"
        placeholderTextColor={"#FFFFFF"}
        secureTextEntry={!showPassword}
        onChangeText={setPassword}
        value={password}
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={toggleShowPassword}
        style={globalStyles.iconContainer}
      >
        <MaterialIcons
          name={showPassword ? "visibility" : "visibility-off"}
          size={25}
          color="#FFFFFF"
          height={44}
        />
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={[
        globalStyles.singleButton,
        isLoading && { backgroundColor: "#555" },
      ]}
      onPress={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={globalStyles.singleButtonText}>Entrar</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      style={globalStyles.backButtonContainer}
      onPress={goToWelcome}
      disabled={isLoading}
    >
      <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
      <Text style={globalStyles.backButtonText}>Voltar à Tela Principal</Text>
    </TouchableOpacity>
  </View>
);

export default LoginScreen;
