import React from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/main';

const Login = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(tabs)/diet'); // Navigate directly to Workout screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('../3.png')} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
