import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  Pressable,
  TextInput,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/main";  
import { signIn } from "../../services/auth";  // Firebase auth function
import { db } from "../../config/firebaseConfig";
import {
  query,
  where,
  getDocs,
  collection
} from "firebase/firestore";
import { useAuth } from "../AuthContext";  // Use your updated AuthContext

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUser } = useAuth(); // Get setToken and setUser from context

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      // Query Firestore for the user data
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Login Failed", "No user found with this email.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };

      // Sign in with Firebase Auth
      const userCredential = await signIn(email, password);
      if (userCredential) {
        const token = userCredential.accessToken;

        // Save token and user in context and storage
        await setToken(token);
        await setUser(userData);

        router.push("/(tabs)/diet"); // Navigate after successful login
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", error.message || "Something went wrong.");
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
        autoCapitalize="none"
        keyboardType="email-address"
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
