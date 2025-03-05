import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
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
import globalStyles, { colors } from "../components/globalStyle/styles";
import { welcomeStyles } from "../components/globalStyle/welcomeStyles";
import AppStatusBar from "../components/AppStatusBar";

// Get screen dimensions for animations
const { width } = Dimensions.get("window");

interface LoginProps {
  setUser: (user: User | null) => void;
  setPassword: (password: string) => void;
}

// Define screen modes
type ScreenMode = "welcome" | "login" | "register";

// Componentes de tela extraídos para fora do componente principal
interface WelcomeScreenProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

// Original screen components - no animation wrapping
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginPress,
  onRegisterPress,
}) => (
  <View style={globalStyles.container}>
    <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />
    <Image style={globalStyles.image} />
    <Text style={[globalStyles.title, { marginBottom: 20 }]}>
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

export const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [screenMode, setScreenMode] = useState<ScreenMode>("welcome");
  const [nextScreenMode, setNextScreenMode] = useState<ScreenMode | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs for each screen
  const welcomePosition = useRef(new Animated.Value(0)).current;
  const loginPosition = useRef(new Animated.Value(width)).current;
  const registerPosition = useRef(new Animated.Value(width)).current;

  // Track which screens are mounted to prevent flashes
  const [isMounted, setIsMounted] = useState({
    welcome: true,
    login: false,
    register: false,
  });

  // Improved transition method with custom directions
  const transitionToScreen = useCallback(
    (nextMode: ScreenMode) => {
      if (screenMode === nextMode) return;

      // Determine which positions to animate
      const currentPosition =
        screenMode === "welcome"
          ? welcomePosition
          : screenMode === "login"
          ? loginPosition
          : registerPosition;

      const nextPosition =
        nextMode === "welcome"
          ? welcomePosition
          : nextMode === "login"
          ? loginPosition
          : registerPosition;

      // Direction of slide (positive = right, negative = left)
      // Changed to have login go left and register go right
      let direction = 1; // Default to right

      // From welcome screen
      if (screenMode === "welcome") {
        if (nextMode === "login") {
          direction = -1; // Login goes left from welcome
        } else if (nextMode === "register") {
          direction = 1; // Register goes right from welcome
        }
      }
      // Back to welcome screen
      else if (nextMode === "welcome") {
        if (screenMode === "login") {
          direction = 1; // From login back to welcome (opposite of login direction)
        } else if (screenMode === "register") {
          direction = -1; // From register back to welcome (opposite of register direction)
        }
      }
      // Between login and register
      else if (screenMode === "login" && nextMode === "register") {
        direction = 1; // From login to register (go right)
      } else if (screenMode === "register" && nextMode === "login") {
        direction = -1; // From register to login (go left)
      }

      // First ensure both screens are mounted
      setIsMounted((prev) => ({
        ...prev,
        [nextMode]: true,
      }));

      // Position the next screen off-screen (will slide in)
      nextPosition.setValue(direction * width);

      // Setup parallel animations: current screen out, next screen in
      Animated.parallel([
        // Current screen slides off
        Animated.timing(currentPosition, {
          toValue: -direction * width,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        // Next screen slides in
        Animated.timing(nextPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start(() => {
        // Update state after animation completes
        setScreenMode(nextMode);

        // Clear inputs when going back to welcome
        if (nextMode === "welcome") {
          setName("");
          setEmail("");
          setPassword("");
        }

        // After a delay, unmount screens we don't need
        setTimeout(() => {
          setIsMounted((prev) => ({
            welcome:
              prev.welcome &&
              (nextMode === "welcome" || screenMode === "welcome"),
            login:
              prev.login && (nextMode === "login" || screenMode === "login"),
            register:
              prev.register &&
              (nextMode === "register" || screenMode === "register"),
          }));
        }, 100);
      });
    },
    [screenMode, welcomePosition, loginPosition, registerPosition]
  );

  const goToLogin = useCallback(() => {
    transitionToScreen("login");
  }, [transitionToScreen]);

  const goToRegister = useCallback(() => {
    transitionToScreen("register");
  }, [transitionToScreen]);

  const goToWelcome = useCallback(() => {
    transitionToScreen("welcome");
    setName("");
    setEmail("");
    setPassword("");
  }, [transitionToScreen]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
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

  // Get screen styles
  const welcomeStyle = { transform: [{ translateX: welcomePosition }] };
  const loginStyle = { transform: [{ translateX: loginPosition }] };
  const registerStyle = { transform: [{ translateX: registerPosition }] };

  // Render all screens with absolute positioning
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />

      {isMounted.welcome && (
        <Animated.View style={[styles.screenContainer, welcomeStyle]}>
          <WelcomeScreen
            onLoginPress={() => transitionToScreen("login")}
            onRegisterPress={() => transitionToScreen("register")}
          />
        </Animated.View>
      )}

      {isMounted.login && (
        <Animated.View style={[styles.screenContainer, loginStyle]}>
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
        </Animated.View>
      )}

      {isMounted.register && (
        <Animated.View style={[styles.screenContainer, registerStyle]}>
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
        </Animated.View>
      )}
    </View>
  );
};

// Additional styles for screen management
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Keep this for content transitions
  },
  screenContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default Login;
