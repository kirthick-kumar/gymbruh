import React, { useState } from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '../AuthContext';
import styles from '../styles/main';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setToken } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data.msg);
      if (response.ok){
        Alert.alert('Success', 'Login successful!');
        setToken(data.token);
        
        // REDIRECT
        router.push({
          pathname: '/profile',
          params: { token: data.token },
        });
      }
      else
        Alert.alert('Error', data.msg || 'Login failed');
    } 
    catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ImageBackground resizeMode="cover"> source={require()} */}
      <Image style={styles.image} source={require('../3.png')} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
