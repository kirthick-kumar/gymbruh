import React from 'react';
import { SafeAreaView, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import styles from '../styles/main';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Link href="login" asChild style={styles.link}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default Profile;
