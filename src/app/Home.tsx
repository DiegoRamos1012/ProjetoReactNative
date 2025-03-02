import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Home: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à Página Home</Text>
            <Text style={styles.subtitle}>Esta é uma página de exemplo.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default Home;