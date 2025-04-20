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
  StyleSheet,
  Alert,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles, {
  colors,
} from "../../../app/components/globalStyle/styles";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

interface ForgotPasswordScreenProps {
  goBack: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  goBack,
}) => {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Animation values properly initialized with useRef
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;
  const titleAnim = useRef(new Animated.Value(30)).current;
  const titleFade = useRef(new Animated.Value(0)).current;

  // Button animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations in parallel with proper configuration
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
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, [fadeAnim, moveAnim, titleFade, titleAnim]);

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

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, informe seu e-mail");
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      Alert.alert(
        "E-mail enviado",
        "Enviamos um link para resetar sua senha no e-mail fornecido. Verifique sua caixa de entrada."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível enviar o e-mail: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={colors.gradient.start}
        barStyle="light-content"
      />

      <View style={globalStyles.authContainer}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: moveAnim }],
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
          Recuperação de Senha
        </Animated.Text>

        <Animated.View
          style={{
            width: "100%",
            opacity: fadeAnim,
            transform: [{ translateY: moveAnim }],
          }}
        >
          {!resetSent ? (
            <>
              <Text style={styles.instructions}>
                Digite seu e-mail cadastrado e enviaremos instruções para
                redefinir sua senha.
              </Text>

              <TextInput
                style={[
                  globalStyles.authInput,
                  emailFocused ? globalStyles.authInputFocused : null,
                ]}
                placeholder="Seu e-mail"
                placeholderTextColor="rgba(255,255,255,0.6)"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={[
                    globalStyles.authButton,
                    isLoading && { backgroundColor: "rgba(58, 81, 153, 0.7)" },
                  ]}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={globalStyles.authButtonText}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <MaterialIcons name="check-circle" size={60} color="#4BB543" />
              <Text style={styles.successText}>
                Link enviado com sucesso! Verifique seu e-mail.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Voltar ao login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  instructions: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ForgotPasswordScreen;
