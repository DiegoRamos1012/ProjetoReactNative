// src/app/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './components/Button'; // 1. Importa o componente Button

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, Rocketseat!</Text>
      <Button title="Entrar" onPress={() => alert('Clicou!')} /> {/* 2. Usa o componente Button */}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
	    backgroundColor: '#19181F',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      color: '#67159C', // Um roxo da Rocketseat! 😉
    },
  });