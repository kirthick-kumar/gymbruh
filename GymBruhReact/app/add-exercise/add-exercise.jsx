import { useState, useEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, RadioButton, Chip, Dialog, Portal } from 'react-native-paper';
import { db } from '@/config/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const color = '#42307e';

const exerciseTypes = ['Strength', 'Cardio', 'Muscle', 'Balanced'];
const muscles = ['Chest', 'Shoulder', 'Triceps', 'Back', 'Biceps', 'Legs', 'Forearms', 'Abs'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

const AddExercise = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [muscleDialogVisible, setMuscleDialogVisible] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSubmit = async () => {
    const exercise = { 
      name: exerciseName, 
      type: exerciseType.toLowerCase(), 
      primary_muscle: primaryMuscle, 
      equipment, 
      difficulty: difficulty.toLowerCase() 
    };
    console.log(exercise);

    try {
      await addDoc(collection(db, "exercises"), exercise);
      router.push('/workout');
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Exercise</Text>

        <TextInput
          label="Exercise Name"
          value={exerciseName}
          onChangeText={setExerciseName}
          style={styles.input}
          placeholderTextColor="#888"
          textColor="#fff"
        />

        <View style={styles.section}>
          <Text style={styles.label}>Exercise Type</Text>
          {exerciseTypes.map((type) => (
            <RadioButton.Item
              key={type}
              label={type}
              value={type}
              status={exerciseType === type ? 'checked' : 'unchecked'}
              onPress={() => setExerciseType(type)}
              color={color}
              labelStyle={styles.radioText}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Primary Muscle</Text>
          <Button 
            mode="contained" 
            onPress={() => setMuscleDialogVisible(true)} 
            style={styles.selectButton}
            labelStyle={styles.selectButtonText}
          >
            Select Muscle
          </Button>
          {primaryMuscle ? (
            <Chip style={styles.chip} textStyle={styles.chipText}>
                {primaryMuscle}
            </Chip>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Equipment (Optional)</Text>
          <TextInput
            label="Equipment"
            value={equipment}
            onChangeText={setEquipment}
            style={styles.input}
            placeholderTextColor="#888"
            textColor="#fff"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Difficulty</Text>
          {difficulties.map((level) => (
            <RadioButton.Item
              key={level}
              label={level}
              value={level}
              status={difficulty === level ? 'checked' : 'unchecked'}
              onPress={() => setDifficulty(level)}
              color={color}
              labelStyle={styles.radioText}
            />
          ))}
        </View>

        <Portal>
          <Dialog visible={muscleDialogVisible} onDismiss={() => setMuscleDialogVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Select Primary Muscle</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView>
                {muscles.map((muscle) => (
                  <RadioButton.Item
                    key={muscle}
                    label={muscle}
                    value={muscle}
                    status={primaryMuscle === muscle ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setPrimaryMuscle(muscle);
                      setMuscleDialogVisible(false);
                    }}
                    color={color}
                    labelStyle={styles.dialogText}
                  />
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog>
        </Portal>

        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
        >
          Save Exercise
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
  chip: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 6,
    color: color,
  },
  chipText: {
    color: color,
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioText: {
    color: '#ddd',
    fontSize: 16,
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

export default AddExercise;
