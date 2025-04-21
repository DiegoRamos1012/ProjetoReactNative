import React, { useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { colors } from "../components/globalStyle/styles";

interface TransitionOverlayProps {
  isActive: boolean;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isActive }) => {
  const opacity = new Animated.Value(isActive ? 1 : 0);

  useEffect(() => {
    if (isActive) {
      // Fade in
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { opacity },
        isActive ? styles.active : null,
      ]}
      pointerEvents={isActive ? "auto" : "none"}
    />
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.gradient.middle,
    zIndex: 9999,
  },
  active: {
    elevation: 10, // Para Android
  },
});

export default TransitionOverlay;
