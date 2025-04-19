import React, { useState, useCallback } from "react";
import { View, StyleSheet, StatusBar, Animated, Alert } from "react-native";
import { User } from "firebase/auth";
import { colors } from "../components/globalStyle/styles";
import { useScreenTransition } from "../../hooks/useScreenTransition";
import { loginUser, registerUser } from "../../services/authService";

// Import screen components
import WelcomeScreen from "../../components/screens/Login/WelcomeScreen";
import LoginScreen from "../../components/screens/Login/LoginScreen";
import RegisterScreen from "../../components/screens/Login/RegisterScreen";
import ForgotPasswordScreen from "../../components/screens/Login/ForgotPasswordScreen";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  navigation?: any;
}

export const Login: React.FC<LoginProps> = ({
  setUser,
  setPassword: setGlobalPassword,
}) => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Screen transition hook
  const {
    screenMode: currentScreen,
    getAnimatedStyles,
    transitionToScreen: handleNavigate,
  } = useScreenTransition();

  // Get animation styles
  const animation = getAnimatedStyles()[`${currentScreen}Style`];

  // Login handler
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Iniciando login para:", email);
      const userCredential = await loginUser(email, password);
      console.log("Login bem-sucedido para:", userCredential.email);

      // Sem necessidade de guardar a senha, Firebase gerencia os tokens
      if (setGlobalPassword) {
        setGlobalPassword(""); // Limpar senha após login
      }

      setUser(userCredential);
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert(
        "Erro no login",
        "Verifique suas credenciais e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Iniciando registro para:", email);
      const userCredential = await registerUser(name, email, password);
      console.log("Registro bem-sucedido para:", userCredential.email);

      // Sem necessidade de guardar a senha, Firebase gerencia os tokens
      if (setGlobalPassword) {
        setGlobalPassword(""); // Limpar senha após registro
      }

      setUser(userCredential);
    } catch (error: any) {
      console.error("Erro no registro:", error);
      Alert.alert(
        "Erro no registro",
        "Não foi possível criar sua conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation methods
  const goToLogin = useCallback(() => {
    handleNavigate("login");
  }, [handleNavigate]);

  const goToRegister = useCallback(() => {
    handleNavigate("register");
  }, [handleNavigate]);

  // New navigation method for forgot password
  const goToForgotPassword = useCallback(() => {
    handleNavigate("forgotPassword");
  }, [handleNavigate]);

  // Password visibility toggler
  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="light-content" />

      {currentScreen === "welcome" && (
        <Animated.View style={[styles.screenContainer, animation]}>
          <WelcomeScreen
            onLoginPress={goToLogin}
            onRegisterPress={goToRegister}
          />
        </Animated.View>
      )}

      {currentScreen === "login" && (
        <Animated.View style={[styles.screenContainer, animation]}>
          <LoginScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPasswordState}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            handleLogin={handleLogin}
            goToWelcome={goToRegister} // Alterado: agora redireciona para a tela de cadastro
            isLoading={isLoading}
            onForgotPassword={goToForgotPassword} // Adicionando o handler para Esqueci minha senha
          />
        </Animated.View>
      )}

      {currentScreen === "register" && (
        <Animated.View style={[styles.screenContainer, animation]}>
          <RegisterScreen
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPasswordState}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            handleRegister={handleRegister}
            goToWelcome={goToLogin} // Continua redirecionando para o login
            isLoading={isLoading}
          />
        </Animated.View>
      )}

      {currentScreen === "forgotPassword" && (
        <Animated.View style={[styles.screenContainer, animation]}>
          <ForgotPasswordScreen goBack={goToLogin} />
        </Animated.View>
      )}
    </View>
  );
};

// Styles for screen management
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default Login;
