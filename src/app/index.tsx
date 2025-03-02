import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Login from "./Login";

export default function Home() {
  const [user, setUser] = useState(null);

  return (
    <View style={styles.container}>
      <Login setUser={setUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F7F8",
    flex: 1,
  },
});
