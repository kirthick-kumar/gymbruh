import React from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import styles from '../styles/main'

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={'./doodle.png'} resizeMode="cover">
      <Image style={styles.image} source={require('../3.png')}></Image>
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
      />
      <Link href="profile" asChild style={styles.link}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </Link>
    </ImageBackground>
    </SafeAreaView>
  );
};


export default Login;