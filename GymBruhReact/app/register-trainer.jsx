import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './AuthContext';
import { db } from '@/config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const RegisterTrainerScreen = () => {
  const [experience, setExperience] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState([]);
  const { user } = useAuth();

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to continue');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 5, // Choose how many max you want
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  const handleRegister = async () => {
    if (!experience || !contact || images.length === 0) {
      Alert.alert('Error', 'Please fill all fields and upload at least one photo.');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        isTrainer: true,
        trainerDetails: {
          experience,
          contact,
          photoPreviews: images.map(img => img.uri),
        },
      });

      Alert.alert('Success', 'You have registered as a trainer!');
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Trainer Registration</Text>

      <TextInput
        placeholder="Years of Experience"
        style={styles.input}
        keyboardType="numeric"
        value={experience}
        onChangeText={setExperience}
      />

      <TextInput
        placeholder="Contact Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={contact}
        onChangeText={setContact}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
        <Text style={styles.uploadText}>
          {images.length > 0 ? `${images.length} photo(s) selected` : 'Upload Verification Photos'}
        </Text>
      </TouchableOpacity>

      <ScrollView horizontal style={{ marginTop: 10 }}>
        {images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img.uri }}
            style={{ width: 100, height: 100, marginRight: 10, borderRadius: 10 }}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#1C1C1C', flexGrow: 1 },
  heading: { color: '#D6EFFF', fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  uploadText: {
    color: '#D6EFFF',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 25,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterTrainerScreen;
