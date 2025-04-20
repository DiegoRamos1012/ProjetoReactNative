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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles, {
  colors,
} from "../../../app/components/globalStyle/styles";

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
}) => {
  // Input focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Button animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Staggered animation for inputs
  const inputsAnim = useRef([
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
  ]).current;

  useEffect(() => {
    // Sequência de animações
    Animated.parallel([
      // Logo e título
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
    ]).start();

    // Animação sequencial dos inputs
    Animated.stagger(100, [
      Animated.timing(inputsAnim[0], {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(inputsAnim[1], {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(inputsAnim[2], {
        toValue: 0,
        duration: 400,
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
    <View style={{ flex: 1 }}>
      <View style={globalStyles.authContainer}>
        <StatusBar
          backgroundColor={colors.gradient.start}
          barStyle="light-content"
        />

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
              opacity: fadeAnim,
              transform: [{ translateY: moveAnim }],
              marginTop: -40, // Mais espaço acima
              marginBottom: 20, // Menos espaço abaixo
            },
          ]}
        >
          Cadastre-se
        </Animated.Text>

        <Animated.View
          style={{
            width: "100%",
            opacity: fadeAnim,
          }}
        >
          {/* Nome */}
          <Animated.View
            style={{
              transform: [{ translateY: inputsAnim[0] }],
              opacity: fadeAnim,
            }}
          >
            <TextInput
              style={[
                globalStyles.authInput,
                nameFocused ? globalStyles.authInputFocused : null,
              ]}
              placeholder="Nome"
              placeholderTextColor="rgba(255,255,255,0.6)"
              onChangeText={setName}
              value={name}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </Animated.View>

          {/* Email */}
          <Animated.View
            style={{
              transform: [{ translateY: inputsAnim[1] }],
              opacity: fadeAnim,
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
          </Animated.View>

          {/* Senha */}
          <Animated.View
            style={{
              transform: [{ translateY: inputsAnim[2] }],
              opacity: fadeAnim,
            }}
          >
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
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                globalStyles.authButton,
                isLoading && { backgroundColor: "rgba(58, 81, 153, 0.7)" },
              ]}
              onPress={handleRegister}
              disabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={globalStyles.authButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              alignItems: "center",
              marginTop: 15,
              transform: [{ translateY: inputsAnim[2] }],
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                Já tem cadastro?
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
                  Faça o Login
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

export default RegisterScreen;
