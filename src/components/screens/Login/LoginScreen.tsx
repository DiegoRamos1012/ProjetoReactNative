import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackgroundAvila from "../../BackgroundAvila";
import globalStyles, {
  colors,
} from "../../../app/components/globalStyle/styles";

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
  onForgotPassword: () => void; // Nova prop para esqueci senha
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
  onForgotPassword,
}) => {
  // Input focus states
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Button animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Animação adicional para o texto
  const linkTextAnim = useRef(new Animated.Value(20)).current;
  const titleAnim = useRef(new Animated.Value(30)).current;
  const titleFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada com animação principal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      // Título animado
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      // Texto de link animado
      Animated.timing(linkTextAnim, {
        toValue: 0,
        duration: 600,
        delay: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <BackgroundAvila>
      <StatusBar
        backgroundColor={colors.gradient.start}
        barStyle="light-content"
      />

      <View style={globalStyles.authContainer}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: moveAnim }, { scale: scaleAnim }],
          }}
        >
          <Image
            source={require("../../../../assets/images/logo_avila_barbearia.png")}
            style={globalStyles.logoImage}
          />
        </Animated.View>

        <Animated.Text
          style={[
            globalStyles.authTitle,
            {
              opacity: titleFade,
              transform: [{ translateY: titleAnim }],
            },
          ]}
        >
          Faça seu Login
        </Animated.Text>

        <Animated.View
          style={{
            width: "100%",
            opacity: fadeAnim,
            transform: [{ translateY: moveAnim }],
          }}
        >
          <TextInput
            style={[
              globalStyles.authInput,
              emailFocused ? globalStyles.authInputFocused : null,
            ]}
            placeholder="Endereço de E-mail"
            placeholderTextColor="rgba(255,255,255,0.6)"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />

          <View style={globalStyles.passwordContainer}>
            <TextInput
              style={[
                globalStyles.authInput,
                passwordFocused ? globalStyles.authInputFocused : null,
              ]}
              placeholder="Senha"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
              autoCapitalize="none"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              style={globalStyles.passwordIconContainer}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Link Esqueci minha senha */}
          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                globalStyles.authButton,
                isLoading && { backgroundColor: "rgba(58, 81, 153, 0.7)" },
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={globalStyles.authButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Link para cadastro */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              alignItems: "center",
              marginTop: 15,
              transform: [{ translateY: linkTextAnim }],
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                Não tem uma conta?
              </Text>
              <TouchableOpacity onPress={goToWelcome}>
                <Text
                  style={{
                    color: "#4a9eff",
                    fontSize: 14,
                    fontWeight: "bold",
                    marginLeft: 5,
                    textDecorationLine: "underline",
                  }}
                >
                  Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </BackgroundAvila>
  );
};

const styles = StyleSheet.create({
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 15,
    marginTop: -10,
  },
  forgotPasswordText: {
    color: "#4a9eff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
