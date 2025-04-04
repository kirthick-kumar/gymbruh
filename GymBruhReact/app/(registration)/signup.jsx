import React, { useState } from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from "firebase/firestore";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { db } from "../../config/firebaseConfig";
import { signUp } from "../../services/auth"; // Firebase signup function
import styles from '../styles/main';

const SignUpScreen = () => {
  const router = useRouter();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    const { username, email, age, height, weight, phoneNumber, password, confirmPassword } = formData;

    // Validate fields
    if (!username || !email || !age || !height || !weight || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const userCredential = await signUp(email, password);
      console.log(userCredential.user);
      
      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        console.log('dASFDSAF', user);
        
        // Send email verification
        await sendEmailVerification(user);
        Alert.alert("Success", "Verification email sent! Please check your inbox.");

        // Save user details in Firestore
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          username,
          email,
          age,
          height,
          weight,
          phoneNumber,
        });

        Alert.alert("Success", "Registration successful!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require("../3.png")} />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="gray"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <View style={styles.flex_inputs}>
        <TextInput
          style={styles.input_half}
          placeholder="Age"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => handleInputChange("age", text)}
        />
        <TextInput
          style={styles.input_half}
          placeholder="Height (cm)"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(text) => handleInputChange("height", text)}
        />
        <TextInput
          style={styles.input_half}
          placeholder="Weight (kg)"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={formData.weight}
          onChangeText={(text) => handleInputChange("weight", text)}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="gray"
        keyboardType="phone-pad"
        value={formData.phoneNumber}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange("confirmPassword", text)}
      />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignUpScreen;
