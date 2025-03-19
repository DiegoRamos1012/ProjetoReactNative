import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles, {colors} from "../../../app/components/globalStyle/styles";

interface RegisterScreenProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  handleRegister: () => void;
  goToWelcome: () => void;
  isLoading: boolean;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  handleRegister,
  goToWelcome,
  isLoading,
}) => (
  <View style={globalStyles.container}>
    <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />
    <Image style={globalStyles.image} />
    <Text style={[globalStyles.title, { marginBottom: 30 }]}>Cadastre-se</Text>
    <TextInput
      style={globalStyles.textInput}
      placeholder="Nome"
      placeholderTextColor={"#FFFFFF"}
      onChangeText={setName}
      value={name}
    />
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
        />
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={[
        globalStyles.singleButton,
        isLoading && { backgroundColor: "#555" },
      ]}
      onPress={handleRegister}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={globalStyles.singleButtonText}>Cadastrar</Text>
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

export default RegisterScreen;
