import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, Alert, View, FlatList } from 'react-native';
import { TextInput, Button, Text, Chip, IconButton, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const color = '#42307e';

const EXERCISES = [
  'Bench Press', 'Squat', 'Deadlift', 'Pull Ups', 'Push Ups', 
  'Bicep Curls', 'Lunges', 'Shoulder Press', 'Planks', 'Tricep Dips'
];

const AddWorkout = () => {
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');
  const [exercises, setExercises] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleAddWorkout = () => {
    if (!name || !muscle || exercises.length === 0) {
      Alert.alert('Error', 'Please fill out all fields and add at least one exercise.');
      return;
    }

    console.log(`Workout Added: ${name} - ${muscle}`);
    console.log('Exercises:', exercises);

    Alert.alert('Success', 'Workout added successfully!');
    router.back();
  };

  const handleAddExercise = (exercise) => {
    if (!exercises.includes(exercise)) {
      setExercises([...exercises, exercise]);
    }
    setMenuVisible(false);
  };

  const handleRemoveExercise = (exercise) => {
    setExercises(exercises.filter((ex) => ex !== exercise));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text 
        style={styles.title} 
        entering={FadeInUp.duration(500)}
      >
        Add Workout
      </Animated.Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.form}
      >
        <TextInput
          label="Workout Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: color } }}
        />
        <TextInput
          label="Target Muscles"
          value={muscle}
          onChangeText={setMuscle}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: color } }}
        />

        {/* Exercise Dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.selectButton}
              labelStyle={styles.selectButtonText}
            >
              Add Exercise
            </Button>
          }
        >
          {EXERCISES.map((exercise) => (
            <Menu.Item 
              key={exercise}
              onPress={() => handleAddExercise(exercise)}
              title={exercise}
            />
          ))}
        </Menu>

        {/* Selected Exercises */}
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.exerciseItem}>
              <Chip 
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {item}
              </Chip>
              <IconButton 
                icon="close"
                size={20}
                onPress={() => handleRemoveExercise(item)}
                iconColor="white"
                style={styles.deleteIcon}
              />
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        {/* Add Workout Button */}
        <Button 
          mode="contained" 
          onPress={handleAddWorkout}
          style={styles.addButton}
          labelStyle={styles.addButtonText}
        >
          Add Workout
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    width: '80%', 
    alignSelf: 'center',
  },
  selectButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
  },
  selectButtonText: {
    color: color,
    fontSize: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 20,
  },
  chip: {
    backgroundColor: 'color',
    marginRight: 10,
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
  deleteIcon: {
    backgroundColor: '#333',
    borderRadius: 50,
  },
  addButton: {
    backgroundColor: color,
    paddingVertical: 10,
    borderRadius: 25,
    width: '80%', 
    alignSelf: 'center',
    marginTop: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWorkout;
