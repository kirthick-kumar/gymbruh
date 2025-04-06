import React, { useState } from "react";
import { SafeAreaView, Text, Pressable, TextInput, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/main";  
import { signIn } from "../../services/auth";  // Firebase auth function
import { db } from "../../config/firebaseConfig";
import { query, where, getDocs, collection } from "firebase/firestore";


const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        console.log("User Data:", { id: userDoc.id, ...userDoc.data() });

        const userCredential = await signIn(email, password);
        if (userCredential){
          // setToken(userCredential.token);
          router.push("/(tabs)/diet");  // Navigate only if successful login
        }
      }
      else
        console.log("No user found!");
    } 
    catch (error) {
      console.error("Error fetching user:", error);
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
