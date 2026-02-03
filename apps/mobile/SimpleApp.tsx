import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    console.log('🧪 SimpleApp rendering...');
    return (
        <View style={styles.container}>
            <Text style={styles.text}>📍 REACT NATIVE ENGINE IS ALIVE</Text>
            <Text style={styles.subtext}>If you see this, the basic rendering works.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#0f0',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#fff',
        marginTop: 10,
    },
});
