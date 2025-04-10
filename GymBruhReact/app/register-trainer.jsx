import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from './AuthContext';
import { db } from '@/config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';

const specialtyOptions = [
  'Strength',
  'Weight Loss',
  'Bodybuilding',
  'Cardio',
  'Rehabilitation',
  'Yoga',
  'HIIT',
];

const RegisterTrainerScreen = () => {
  const [experience, setExperience] = useState('');
  const [contact, setContact] = useState('');
  const [gymName, setGymName] = useState('');
  const [gymLocation, setGymLocation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [bio, setBio] = useState('');

  const { user } = useAuth();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `Trainer Registration` });
  }, [navigation]);
  
  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleRegister = async () => {
    if (!experience || !contact || !gymName || !gymLocation || !bio || selectedSpecialties.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and select at least one specialty.');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        isTrainer: true,
        trainerDetails: {
          experience,
          contact,
          gymName,
          gymLocation,
          certifications,
          specialties: selectedSpecialties,
          bio,
        },
      });

      console.log('Success', 'You have registered as a trainer!');
      router.push('/profile');
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

      <TextInput
        placeholder="Gym Name"
        style={styles.input}
        value={gymName}
        onChangeText={setGymName}
      />

      <TextInput
        placeholder="Gym Location"
        style={styles.input}
        value={gymLocation}
        onChangeText={setGymLocation}
      />

      <TextInput
        placeholder="Certifications (comma separated)"
        style={styles.input}
        value={certifications}
        onChangeText={setCertifications}
      />

      <Text style={styles.label}>Specialties</Text>
      <View style={styles.specialtyContainer}>
        {specialtyOptions.map((specialty) => {
          const isSelected = selectedSpecialties.includes(specialty);
          return (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.specialtyButton,
                isSelected && styles.specialtyButtonSelected,
              ]}
              onPress={() => toggleSpecialty(specialty)}
            >
              <Text
                style={[
                  styles.specialtyText,
                  isSelected && styles.specialtyTextSelected,
                ]}
              >
                {specialty}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        placeholder="Short Bio / Description"
        style={[styles.input, { height: 100 }]}
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#1C1C1C', flexGrow: 1 },
  heading: { color: '#7657df', fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    outlineColor: 'white',
  },
  label: {
    color: '#7657df',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  specialtyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  specialtyButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyButtonSelected: {
    backgroundColor: '#42307e',
  },
  specialtyText: {
    color: '#ccc',
    fontSize: 14,
  },
  specialtyTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#42307e',
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
