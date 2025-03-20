import { useState, useEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, Dialog, Portal, Checkbox } from 'react-native-paper';

const color = '#42307e';

const muscles = ['Chest', 'Shoulder', 'Triceps', 'Back', 'Biceps', 'Legs', 'Forearms', 'Abs'];
const exercises = ['Bench Press', 'Squats', 'Deadlift', 'Pull-Ups', 'Tricep Dips', 'Incline Dumbbell Press'];

const AddWorkout = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const toggleMuscle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise) ? prev.filter((e) => e !== exercise) : [...prev, exercise]
    );
  };

  const handleSubmit = () => {
    console.log({ workoutName, selectedMuscles, selectedExercises });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Workout</Text>

        {/* Workout Name Input */}
        <TextInput
          label="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
          style={styles.input}
          placeholderTextColor="#888"
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
            {selectedExercises.map((exercise) => (
              <Chip key={exercise} style={styles.chip}>
                {exercise}
              </Chip>
            ))}
          </View>
        </View>

        {/* Exercise Dialog */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Select Exercises</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView>
                {exercises.map((exercise) => (
                  <View key={exercise} style={styles.checkboxContainer}>
                    <Checkbox.Android
                      status={selectedExercises.includes(exercise) ? 'checked' : 'unchecked'}
                      onPress={() => toggleExercise(exercise)}
                      color={color}
                    />
                    <Text style={styles.dialogText}>{exercise}</Text>
                  </View>
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
          Save Workout
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
    backgroundColor: color,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  dialog: {
    backgroundColor: '#1e1e1e',
  },
  dialogTitle: {
    color: '#fff',
  },
  dialogText: {
    color: '#ddd',
    fontSize: 16,
  },
  dialogButtonText: {
    color: color,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
