import React from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image } from 'react-native';
import { Link } from 'expo-router';
import styles from '../styles/main'

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image  style={styles.image} source={require('../3.png')}></Image>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
      />
      <Link href="profile" asChild style={styles.link}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};


export default Login;