import { useState, useRef, useCallback } from "react";
import { Animated, Dimensions, Easing } from "react-native";

const { width } = Dimensions.get("window");

type ScreenMode = "welcome" | "login" | "register" | "forgotPassword";

interface ScreenState {
  [key: string]: boolean;
}

export const useScreenTransition = (initialMode: ScreenMode = "welcome") => {
  const [screenMode, setScreenMode] = useState<ScreenMode>(initialMode);

  // Animation refs for each screen
  const welcomePosition = useRef(new Animated.Value(0)).current;
  const loginPosition = useRef(new Animated.Value(width)).current;
  const registerPosition = useRef(new Animated.Value(width)).current;
  const forgotPasswordPosition = useRef(new Animated.Value(width)).current;

  // Track which screens are mounted to prevent flashes
  const [isMounted, setIsMounted] = useState<ScreenState>({
    welcome: true,
    login: false,
    register: false,
    forgotPassword: false,
  });

  const getPositionForMode = (mode: ScreenMode): Animated.Value => {
    switch (mode) {
      case "welcome":
        return welcomePosition;
      case "login":
        return loginPosition;
      case "register":
        return registerPosition;
      case "forgotPassword":
        return forgotPasswordPosition;
      default:
        return welcomePosition;
    }
  };

  // Transition between screens with animation
  const transitionToScreen = useCallback(
    (nextMode: ScreenMode) => {
      if (screenMode === nextMode) return;

      // Get current and next position references
      const currentPosition = getPositionForMode(screenMode);
      const nextPosition = getPositionForMode(nextMode);

      // Determine slide direction
      let direction = 1; // Default to right

      // From welcome screen
      if (screenMode === "welcome") {
        direction = nextMode === "login" ? -1 : 1; // Left for login, right for register
      }
      // Back to welcome screen
      else if (nextMode === "welcome") {
        direction = screenMode === "login" ? 1 : -1; // From login/register back to welcome
      }
      // Between login and register
      else if (screenMode === "login" && nextMode === "register") {
        direction = 1; // Login to register (go right)
      } else if (screenMode === "register" && nextMode === "login") {
        direction = -1; // Register to login (go left)
      }
      // To forgotPassword
      else if (nextMode === "forgotPassword") {
        direction = 1; // Going to forgotPassword slides from right
      }
      // From forgotPassword
      else if (screenMode === "forgotPassword") {
        direction = -1; // Going back from forgotPassword slides to left
      }

      // Ensure next screen is mounted
      setIsMounted((prev) => ({
        ...prev,
        [nextMode]: true,
      }));

      // Position the next screen off-screen
      nextPosition.setValue(direction * width);

      // Animate both screens
      Animated.parallel([
        // Current screen slides out
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
            forgotPassword:
              prev.forgotPassword &&
              (nextMode === "forgotPassword" ||
                screenMode === "forgotPassword"),
          }));
        }, 100);
      });
    },
    [
      screenMode,
      welcomePosition,
      loginPosition,
      registerPosition,
      forgotPasswordPosition,
    ]
  );

  // Get animated styles for each screen
  const getAnimatedStyles = () => {
    return {
      welcomeStyle: { transform: [{ translateX: welcomePosition }] },
      loginStyle: { transform: [{ translateX: loginPosition }] },
      registerStyle: { transform: [{ translateX: registerPosition }] },
      forgotPasswordStyle: {
        transform: [{ translateX: forgotPasswordPosition }],
      },
    };
  };

  return {
    screenMode,
    isMounted,
    transitionToScreen,
    getAnimatedStyles,
  };
};
