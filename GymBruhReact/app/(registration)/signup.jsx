import React, { useState } from "react";
import { SafeAreaView, Text, Pressable, TextInput, Image, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/main";
import { signUp } from "../../services/auth"; // Firebase signup function

const SignUpScreen = () => {
  const router = useRouter();
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
    const { email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const userCredential = await signUp(email, password);
      if (userCredential) {
        Alert.alert("Success", "Account created successfully!");
        router.push("/(tabs)/diet");
      }
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
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
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <View style={styles.flex_inputs}>
        <TextInput
          style={styles.input_half}
          placeholder="Age"
          placeholderTextColor="gray"
          value={formData.age}
          onChangeText={(text) => handleInputChange("age", text)}
        />
        <TextInput
          style={styles.input_half}
          placeholder="Height (cm)"
          placeholderTextColor="gray"
          value={formData.height}
          onChangeText={(text) => handleInputChange("height", text)}
        />
        <TextInput
          style={styles.input_half}
          placeholder="Weight (kg)"
          placeholderTextColor="gray"
          value={formData.weight}
          onChangeText={(text) => handleInputChange("weight", text)}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="gray"
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
