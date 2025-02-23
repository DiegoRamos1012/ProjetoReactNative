import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 600, height: 400 }}
        source={require("../../assets/images/Barbearia.png")}
      />
      <TextInput style={styles.textInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F7F8",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  textInput: {
    width: "100%",
    height: 40,
    backgroundColor: "gray",
    borderRadius: 20,
    paddingLeft: 20,
    color: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#67159C", 
  },
});
