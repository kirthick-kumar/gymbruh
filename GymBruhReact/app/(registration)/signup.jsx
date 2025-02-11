import React from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image, View } from 'react-native';
import { Link } from 'expo-router';
import styles from '../styles/main'


const Signup = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image  style={styles.image} source={require('../3.png')}></Image>
      <Text style={styles.signupTitle}>Signup</Text>
      <Text style={styles.subtitle}>To Join the GymBruhCommunity</Text>
      <TextInput
        style={styles.input}
        placeholder="FullName"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
      />
      <View style={styles.flex_inputs}>
      <TextInput
        style={styles.input_half}
        placeholder="Age"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input_half}
        placeholder="Height (cm)"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input_half}
        placeholder="Weight (kg)"
        placeholderTextColor="gray"
      />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
      />
      <Link href="login" asChild style={styles.link}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default Signup;