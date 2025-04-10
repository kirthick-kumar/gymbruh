import { useState, useEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView, StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, Button, RadioButton, Chip, Dialog, Portal } from 'react-native-paper';
import { db } from '@/config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from '../AuthContext';

const color = '#42307e';

const exerciseTypes = ['Strength', 'Cardio', 'Muscle', 'Balanced'];
const muscles = ['Chest', 'Shoulder', 'Triceps', 'Back', 'Biceps', 'Legs', 'Forearms', 'Abs'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

const AddExercise = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [muscleDialogVisible, setMuscleDialogVisible] = useState(false);
  const [userExercises, setUserExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: `Your Exercise` });
  }, [navigation]);

  useEffect(() => {
    const fetchUserExercises = async () => {
      if (!user?.id) return;
      const q = query(collection(db, "exercises"), where("user_id", "==", user.id));
      const snapshot = await getDocs(q);
      const exercises = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserExercises(exercises);
    };

    fetchUserExercises();
  }, [user]);

  const handleSubmit = async () => {
    const exercise = { 
      name: exerciseName, 
      type: exerciseType.toLowerCase(), 
      primary_muscle: primaryMuscle, 
      equipment, 
      difficulty: difficulty.toLowerCase(),
      user_id: user.id,
    };

    try {
      if (isEditing && selectedExerciseId) {
        const docRef = doc(db, "exercises", selectedExerciseId);
        await updateDoc(docRef, exercise);
      } else {
        await addDoc(collection(db, "exercises"), exercise);
      }

      router.push('/workout');
    } catch (error) {
      console.error("Error saving exercise:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "exercises", id));
      setUserExercises((prev) => prev.filter((ex) => ex.id !== id));
      if (selectedExerciseId === id) resetForm();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const resetForm = () => {
    setExerciseName('');
    setExerciseType('');
    setPrimaryMuscle('');
    setEquipment('');
    setDifficulty('');
    setSelectedExerciseId(null);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Your Exercises</Text>
          <ScrollView style={styles.exerciseList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {userExercises.length > 0 ? (
              userExercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseChipContainer}>
                  <View style={styles.chipRow}>
                    <Chip
                      style={[
                        styles.chip,
                        selectedExerciseId === exercise.id && { backgroundColor: color },
                        { flex: 1 }
                      ]}
                      textStyle={[
                        styles.chipText,
                        selectedExerciseId === exercise.id && { color: '#fff' },
                      ]}
                      onPress={() => {
                        if (selectedExerciseId === exercise.id) {
                          resetForm();
                        } else {
                          setExerciseName(exercise.name);
                          setExerciseType(capitalize(exercise.type));
                          setPrimaryMuscle(exercise.primary_muscle);
                          setEquipment(exercise.equipment);
                          setDifficulty(capitalize(exercise.difficulty));
                          setSelectedExerciseId(exercise.id);
                          setIsEditing(true);
                        }
                      }}
                    >
                      {exercise.name}
                    </Chip>
                    <Pressable onPress={() => handleDelete(exercise.id)} style={{paddingTop: 10}}>
                      <Icon name="trash-alt" size={20} color="#a78bfa" />
                    </Pressable>
                  </View>
                </View>

              ))
            ) : (
              <Text style={{ color: "#888" }}>No saved exercises found.</Text>
            )}
          </ScrollView>
        </View>

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
          {isEditing ? 'Edit Exercise' : 'Save Exercise'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 30,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trashIcon: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  chip: {
    backgroundColor: 'white',
    marginTop: 10,
    color: color,
    padding: 5
  },
  chipText: {
    color: color,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseList: {
    maxHeight: 150,
  },
  exerciseChipContainer: {
    marginBottom: 10,
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
