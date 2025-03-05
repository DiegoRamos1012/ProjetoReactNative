import { StyleSheet } from "react-native";
import { colors } from "./styles";

export const welcomeStyles = StyleSheet.create({
  welcomeTitle: {
    color: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
});


export default welcomeStyles;