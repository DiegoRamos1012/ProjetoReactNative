import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import globalStyles from "../components/globalStyle/styles";

interface LoginProps {
  setUser: (user: User | null) => void;
}

// Define screen modes
type ScreenMode = "welcome" | "login" | "register";

// Componentes de tela extraídos para fora do componente principal
interface WelcomeScreenProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginPress,
  onRegisterPress,
}) => (
  <View style={globalStyles.container}>
    <Image
      style={globalStyles.image}
    />
    <Text style={[globalStyles.singleButtonText, { marginBottom: 20 }]}>
      Bem-vindo à Barbearia
    </Text>

    <TouchableOpacity style={globalStyles.singleButton} onPress={onLoginPress}>
      <Text style={globalStyles.singleButtonText}>Fazer Login</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[globalStyles.singleButton, { marginTop: 15 }]}
      onPress={onRegisterPress}
    >
      <Text style={globalStyles.singleButtonText}>Cadastrar-se</Text>
    </TouchableOpacity>
  </View>
);

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
    <Image
      style={globalStyles.image}
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
    <Image
      style={globalStyles.image}
    />
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

export const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [screenMode, setScreenMode] = useState<ScreenMode>("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const goToWelcome = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setScreenMode("welcome");
  }, []);

  const handleRegister = useCallback(async () => {
    if (email === "") {
      alert("E-mail não pode ser vazio");
      return;
    } else if (!email.includes("@")) {
      alert("E-mail inválido");
      return;
    }

    if (name.trim() === "") {
      alert("Nome não pode ser vazio");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      }),
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: name,
          email: email,
          dataCadastro: new Date(),
        });

      setUser(user);
      alert("Usuário cadastrado com sucesso!");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("Este e-mail já está sendo usado por outra conta.");
      } else if (error.code === "auth/weak-password") {
        alert("A senha é muito fraca. Utilize uma senha mais forte.");
      } else if (error.code === "auth/invalid-email") {
        alert("O formato do e-mail é inválido.");
      } else if (error.code === "auth/network-request-failed") {
        alert("Erro de conexão com a internet. Verifique sua conexão.");
      } else {
        alert(`Erro ao cadastrar: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, setUser]);

  const handleLogin = useCallback(async () => {
    if (email === "") {
      alert("E-mail não pode ser vazio");
      return;
    } else if (!email.includes("@")) {
      alert("E-mail inválido");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        alert("E-mail ou senha incorretos. Por favor, tente novamente.");
      } else if (error.code === "auth/user-not-found") {
        alert("Não existe usuário com este e-mail. Deseja se cadastrar?");
      } else if (error.code === "auth/wrong-password") {
        alert("Senha incorreta. Por favor, verifique e tente novamente.");
      } else if (error.code === "auth/user-disabled") {
        alert("Esta conta foi desativada. Entre em contato com o suporte.");
      } else if (error.code === "auth/network-request-failed") {
        alert("Erro de conexão com a internet. Verifique sua conexão.");
      } else {
        alert(`Erro ao fazer login: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, setUser]);

  // Renderização condicional otimizada
  switch (screenMode) {
    case "welcome":
      return (
        <WelcomeScreen
          onLoginPress={() => setScreenMode("login")}
          onRegisterPress={() => setScreenMode("register")}
        />
      );
    case "login":
      return (
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          handleLogin={handleLogin}
          goToWelcome={goToWelcome}
          isLoading={isLoading}
        />
      );
    case "register":
      return (
        <RegisterScreen
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          handleRegister={handleRegister}
          goToWelcome={goToWelcome}
          isLoading={isLoading}
        />
      );
    default:
      return null;
  }
};

export default Login;
