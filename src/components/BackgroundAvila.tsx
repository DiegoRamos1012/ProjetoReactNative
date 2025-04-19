import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../app/components/globalStyle/styles";

/**
 * Componente de fundo customizado para as telas do app Ávila Barbearia
 * Utiliza as cores da identidade visual com um gradiente elegante
 */
const BackgroundAvila: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LinearGradient
      colors={[
        colors.gradient.start,
        colors.gradient.middle,
        colors.gradient.end,
      ]}
      style={styles.container}
    >
      {/* Conteúdo principal */}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BackgroundAvila;
