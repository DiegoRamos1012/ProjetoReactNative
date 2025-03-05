import React, { useState, useCallback } from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";
import { User } from "firebase/auth";
import { colors } from "../components/globalStyle/styles";
import { useScreenTransition } from "../../hooks/useScreenTransition";
import { loginUser, registerUser } from "../../services/authService";

// Import screen components
import WelcomeScreen from "../../components/screens/Login/WelcomeScreen";
import LoginScreen from "../../components/screens/Login/LoginScreen";
import RegisterScreen from "../../components/screens/Login/RegisterScreen";

interface LoginProps {
  setUser: (user: User | null) => void;
  setPassword: (password: string) => void;
}

export const Login: React.FC<LoginProps> = ({
  setUser,
  setPassword: setGlobalPassword,
}) => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswordState] = useState(""); // Fixed: added proper setter function
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Screen transition hook
  const { screenMode, isMounted, transitionToScreen, getAnimatedStyles } =
    useScreenTransition("welcome");

  // Get animated styles
  const { welcomeStyle, loginStyle, registerStyle } = getAnimatedStyles();

  // Navigation handlers
  const goToLogin = useCallback(() => {
    transitionToScreen("login");
  }, [transitionToScreen]);

  const goToRegister = useCallback(() => {
    transitionToScreen("register");
  }, [transitionToScreen]);

  const goToWelcome = useCallback(() => {
    transitionToScreen("welcome");
    // Clear form data
    setName("");
    setEmail("");
    setPasswordState(""); // Updated to use correct setter
  }, [transitionToScreen]);

  // Password visibility toggler
  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Authentication handlers
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      setGlobalPassword(password); // Update global password if needed
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, setUser, setGlobalPassword]);

  const handleRegister = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await registerUser(name, email, password);
      setUser(user);
      setGlobalPassword(password); // Update global password if needed
      alert("Usuário cadastrado com sucesso!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, setUser, setGlobalPassword]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />

      {isMounted.welcome && (
        <Animated.View style={[styles.screenContainer, welcomeStyle]}>
          <WelcomeScreen
            onLoginPress={goToLogin}
            onRegisterPress={goToRegister}
          />
        </Animated.View>
      )}

      {isMounted.login && (
        <Animated.View style={[styles.screenContainer, loginStyle]}>
          <LoginScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPasswordState} // Updated to use correct setter
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
            setPassword={setPasswordState} // Updated to use correct setter
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
