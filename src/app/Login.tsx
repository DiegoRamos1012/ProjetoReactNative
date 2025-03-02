import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

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
    <View style={styles.container}>
      <Image
        style={{ width: 600, height: 400 }}
        source={require("../../assets/images/Barbearia.png")}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Endereço de E-mail"
        placeholderTextColor={"#FFFFFF"}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.passwordGroup}>
        <TextInput
          style={[styles.textInput, styles.passwordInput]}
          placeholder="Senha"
          placeholderTextColor={"#FFFFFF"}
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          style={styles.iconContainer}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={25}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.singleButton}
        onPress={() => handleRegister()}
      >
        <Text style={styles.singleButtonText}> Cadastrar </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F7F8",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  textInput: {
    width: "100%",
    height: 40,
    backgroundColor: "gray",
    borderRadius: 20,
    paddingLeft: 20,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  singleButton: {
    width: "50%",
    height: 40,
    backgroundColor: "gray",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  singleButtonText: {
    color: "#FFFFFF",
  },
  passwordGroup: {
    width: "100%",
    marginBottom: 20,
  },
  passwordInput: {
    paddingRight: 50, // leave space for icon
  },
  iconContainer: {
    alignItems: "flex-end",
    marginTop: 5,
    paddingRight: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#67159C",
  },
  iconWrapper: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -22 }],
  },
});

export default Login;
