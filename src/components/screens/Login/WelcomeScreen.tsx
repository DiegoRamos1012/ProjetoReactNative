import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackgroundAvila from "../../BackgroundAvila";
import globalStyles, {
  colors,
} from "../../../app/components/globalStyle/styles";

interface WelcomeScreenProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginPress,
  onRegisterPress,
}) => {
  // Animação do logo
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Animação do título
  const titleAnim = useRef(new Animated.Value(30)).current;
  const titleFade = useRef(new Animated.Value(0)).current;

  // Animação dos botões
  const buttonAnimLeft = useRef(new Animated.Value(-100)).current;
  const buttonAnimRight = useRef(new Animated.Value(100)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  // Botão escala ao pressionar
  const loginButtonScale = useRef(new Animated.Value(1)).current;
  const registerButtonScale = useRef(new Animated.Value(1)).current;

  // Animação adicional para o texto de login
  const loginTextAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Sequência de animações
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    const moveUp = Animated.timing(moveAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    const scaleUp = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    const showTitle = Animated.timing(titleFade, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    });

    const moveTitle = Animated.timing(titleAnim, {
      toValue: 0,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    const showButtons = Animated.timing(buttonFade, {
      toValue: 1,
      duration: 600,
      delay: 600,
      useNativeDriver: true,
    });

    const moveButtonsIn = Animated.parallel([
      Animated.timing(buttonAnimLeft, {
        toValue: 0,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(buttonAnimRight, {
        toValue: 0,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]);

    // Animação adicional para o texto de login
    const animateLoginText = Animated.timing(loginTextAnim, {
      toValue: 0,
      duration: 600,
      delay: 700, // Ligeiramente após os botões
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    // Inicia a sequência de animações
    Animated.parallel([
      fadeIn,
      moveUp,
      scaleUp,
      showTitle,
      moveTitle,
      showButtons,
      moveButtonsIn,
      animateLoginText,
    ]).start();
  }, []);

  const handleRegisterPressIn = () => {
    Animated.spring(registerButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleRegisterPressOut = () => {
    Animated.spring(registerButtonScale, {
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
            borderRadius: 20,
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
          Bem-vindo!
        </Animated.Text>

        {/* Botão Cadastrar-se com destaque */}
        <Animated.View
          style={{
            opacity: buttonFade,
            transform: [{ translateX: buttonAnimLeft }],
            width: "100%",
          }}
        >
          <Animated.View
            style={{ transform: [{ scale: registerButtonScale }] }}
          >
            <TouchableOpacity
              style={[
                globalStyles.authButton,
                {
                  backgroundColor: "#FFFFFF4D", // Cinza claro em vez de vermelho
                  marginBottom: 15,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                },
              ]}
              onPress={onRegisterPress}
              onPressIn={handleRegisterPressIn}
              onPressOut={handleRegisterPressOut}
            >
              <Text style={[globalStyles.authButtonText, { fontSize: 18 }]}>
                <MaterialIcons name="person-add" size={20} /> Cadastrar-se
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Já tem conta? Faça o Login */}
        <Animated.View
          style={{
            opacity: buttonFade,
            alignItems: "center",
            marginTop: 10,
            transform: [{ translateY: loginTextAnim }],
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
              Já tem uma conta?
            </Text>
            <TouchableOpacity onPress={onLoginPress}>
              <Text
                style={{
                  color: "#4a9eff",
                  fontSize: 16,
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
      </View>
    </BackgroundAvila>
  );
};

export default WelcomeScreen;
