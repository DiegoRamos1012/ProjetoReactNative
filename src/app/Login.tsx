import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import globalStyles from "./components/globalStyle/styles";

interface LoginProps {
  setUser: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleRegister = () => {
    // função do botão "Cadastrar"
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(userCredential.user);
        alert("Usuário cadastrado com sucesso!");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleLogin = () => {
    if (!emailValidation(email)) {
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        alert("Login realizado com sucesso!");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          alert("Email ou senha incorretos. Por favor, tente novamente.");
        } else {
          alert(`Erro: ${error.message}`);
        }
      });
  };

  const emailValidation = (email: string): boolean => {
    // Condicional pra validar e-mail
    if (email === "") {
      alert("E-mail não pode ser vazio");
    } else if (!email.includes("@")) {
      alert("E-mail inválido");
    }
    return email.includes("@");
  };

  return (
    <View style={globalStyles.container}>
      <Image
        style={globalStyles.image}
        source={require("../../assets/images/Barbearia.png")}
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Endereço de E-mail"
        placeholderTextColor={"#FFFFFF"}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={globalStyles.passwordGroup}>
        <TextInput
          style={[globalStyles.textInput, globalStyles.passwordInput]}
          placeholder="Senha"
          placeholderTextColor={"#FFFFFF"}
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          style={globalStyles.iconContainer}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={25}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={globalStyles.singleButton}
        onPress={() => handleRegister()}
      >
        <Text style={globalStyles.singleButtonText}> Cadastrar </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
