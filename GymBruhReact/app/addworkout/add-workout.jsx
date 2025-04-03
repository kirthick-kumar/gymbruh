import { useState, useEffect } from 'react';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, Dialog, Portal, Checkbox } from 'react-native-paper';
import { db } from '@/config/firebaseConfig';
import { collection, addDoc, doc, updateDoc, getDoc, arrayUnion, getDocs } from "firebase/firestore";
import * as Notifications from 'expo-notifications';

const color = '#42307e';
const muscles = ['Chest', 'Shoulder', 'Triceps', 'Back', 'Biceps', 'Legs', 'Forearms', 'Abs'];

const AddWorkout = () => {
  const { workoutId } = useLocalSearchParams(); // Get workoutId if editing
  const [workoutName, setWorkoutName] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]); // Store exercise IDs
  const [exercises, setExercises] = useState([]); // Store exercises from Firestore
  const [dialogVisible, setDialogVisible] = useState(false);
  
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchExercises();
    if (workoutId) loadWorkoutData(workoutId); // Load existing workout if editing
  }, [navigation, workoutId]);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const fetchExercises = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const exerciseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setExercises(exerciseList);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const loadWorkoutData = async (id) => {
    try {
      const workoutRef = doc(db, "workouts", id);
      const workoutSnap = await getDoc(workoutRef);

      if (workoutSnap.exists()) {
        const data = workoutSnap.data();
        setWorkoutName(data.name);
        setSelectedMuscles(data.muscles || []);
        setSelectedExercises(data.exercises || []);
      }
    } catch (error) {
      console.error("Error loading workout data:", error);
    }
  };

  const toggleMuscle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const toggleExercise = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const handleSubmit = async () => {
    const workout = { name: workoutName, muscles: selectedMuscles, exercises: selectedExercises };

    try {
      if (workoutId) {
        // Update existing workout
        const workoutRef = doc(db, "workouts", workoutId);
        await updateDoc(workoutRef, workout);
      } else {
        // Add new workout
        const workoutRef = await addDoc(collection(db, "workouts"), workout);
        
        // Hardcoded userId (update later)
        const userId = "PXDYJCKtnULevYyzaNgp";
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          createdWorkouts: arrayUnion(workoutRef.id)
        });
      }

      // Send notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: workoutId ? "Workout Updated" : "Workout Saved",
          body: workoutId ? "Your workout has been updated!" : "Your workout has been saved successfully!",
          sound: true,
        },
        trigger: null,
      });

      router.push('/workout');
    } catch (error) {
      router.push('/workout');
      console.error("Error saving workout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{workoutId ? "Edit Workout" : "Add Workout"}</Text>

        {/* Workout Name Input */}
        <TextInput
          label="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
          style={styles.input}
          placeholderTextColor="#888"
          textColor="#fff"
          theme={{ colors: { text: '#fff' } }}
        />

        {/* Muscles Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Muscles Involved</Text>
          <View style={styles.chipContainer}>
            {muscles.map((muscle) => (
              <Chip
                key={muscle}
                onPress={() => toggleMuscle(muscle)}
                style={[styles.chip, selectedMuscles.includes(muscle) && styles.chipSelected]}
                textStyle={styles.chipText}
              >
                {muscle}
              </Chip>
            ))}
          </View>
        </View>

        {/* Exercises Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Exercises</Text>
          <Button 
            mode="contained" 
            onPress={() => setDialogVisible(true)} 
            style={styles.selectButton}
            labelStyle={styles.selectButtonText}
          >
            Select Exercises
          </Button>

          {/* Selected Exercises */}
          <View style={styles.selectedItemsContainer}>
            {selectedExercises.map((exerciseId) => {
              const exercise = exercises.find((ex) => ex.id === exerciseId);
              return exercise ? (
                <Chip key={exerciseId} style={styles.chip}>
                  {exercise.name}
                </Chip>
              ) : null;
            })}
          </View>
        </View>

        {/* Exercise Dialog */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Select Exercises</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView>
                {exercises.map((exercise) => (
                  <Checkbox.Item
                    key={exercise.id}
                    label={exercise.name}
                    status={selectedExercises.includes(exercise.id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleExercise(exercise.id)}
                    color={color}
                    labelStyle={styles.dialogText}
                  />
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)} labelStyle={styles.dialogButtonText}>
                Done
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Submit Button */}
        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
        >
          {workoutId ? "Update Workout" : "Save Workout"}
        </Button>

        <Button 
          mode="contained" 
          onPress={() => router.push('/workout')} 
          style={[styles.submitButton, {backgroundColor: 'white'}]}
          labelStyle={[styles.submitButtonText, {color: color}]}
        >
          Back
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
  },
  section: {
    marginBottom: 25,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  label: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 12,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#2e2e2e',
    marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: color,
  },
  chipText: {
    color: '#fff',
  },
  selectButton: {
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: color,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddWorkout;
