import React, { useState } from "react";
import { SafeAreaView, Text, Pressable, TextInput, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/main";  
import { signIn } from "../../services/auth";  // Firebase auth function

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(email, password);
      if (userCredential) {
        router.push("/(tabs)/diet");  // Navigate only if successful login
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);  // Show error if login fails
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require("../3.png")} />
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

export default LoginScreen;
