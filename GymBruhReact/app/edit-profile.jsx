import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Pressable, TextInput, Image, View, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { db } from "../config/firebaseConfig"; 
import styles from './styles/main';

const EditProfileScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    phoneNumber: '',
  });

  const router = useRouter();
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    };

    if (uid) fetchUserData();
  }, [uid]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, formData);
      Alert.alert('Success', 'Profile updated!');
      router.back(); // Go back to profile screen
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('./3.png')} />
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={text => handleInputChange('username', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={text => handleInputChange('email', text)}
      />
      <View style={styles.flex_inputs}>
        <TextInput
          style={styles.input_half}
          placeholder="Age"
          value={formData.age}
          onChangeText={text => handleInputChange('age', text)}
        />
        <TextInput
          style={styles.input_half}
          placeholder="Height"
          value={formData.height}
          onChangeText={text => handleInputChange('height', text)}
        />
        <TextInput
          style={styles.input_half}
          placeholder="Weight"
          value={formData.weight}
          onChangeText={text => handleInputChange('weight', text)}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChangeText={text => handleInputChange('phoneNumber', text)}
      />

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
