import { StyleSheet } from "react-native";

// Estilos compartilhados entre componentes
export const colors = {
  primary: "#67159C",
  background: "#F7F7F8",
  input: "gray",
  text: "#FFFFFF",
  error: "#FF375B",
};

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  textInput: {
    width: "100%",
    height: 40,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingLeft: 20,
    color: colors.text,
    marginBottom: 20,
  },
  singleButton: {
    width: "50%",
    height: 40,
    backgroundColor: colors.input,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  singleButtonText: {
    color: colors.text,
  },
  passwordGroup: {
    width: "100%",
    marginBottom: 20,
  },
  passwordInput: {
    paddingRight: 50,
  },
  iconContainer: {
    alignItems: "flex-end",
    marginTop: 5,
    paddingRight: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  iconWrapper: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -22 }],
  },
  image: {
    width: 600,
    height: 400,
  },
});

export default globalStyles;
