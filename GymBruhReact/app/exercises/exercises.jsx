import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  CheckBox,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { db } from "@/config/firebaseConfig";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const color = "#42307e";

const ExercisesScreen = () => {
  const { workoutId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [workoutData, setWorkoutData] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [exerciseSets, setExerciseSets] = useState({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchWorkout();
  }, []);

  
  const addSet = (exerciseId) => {
    setExerciseSets((prevSets) => {
      const prevExerciseSets = prevSets[exerciseId] || [];
      const lastSet = prevExerciseSets[prevExerciseSets.length - 1] || {
        weight: 0,
        reps: 0,
        rpe: 0,
        rating: 0,
        completed: false,
      };
  
      const newSet = {
        ...lastSet,
        id: Math.random().toString(),
        completed: false,
      };
  
      return {
        ...prevSets,
        [exerciseId]: [...prevExerciseSets, newSet],
      };
    });
  };
  
  
  const deleteSet = (exerciseId, index) => {
    setExerciseSets((prevSets) => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].filter((_, i) => i !== index),
    }));
  };

  const fetchWorkout = async () => {
    try {
      const workoutRef = doc(db, "workouts", workoutId);
      const workoutSnap = await getDoc(workoutRef);

      if (workoutSnap.exists()) {
        const workout = workoutSnap.data();
        setWorkoutData(workout);
        fetchExerciseDetails(workout.exercises);
      } else {
        console.log("Workout not found!");
      }
    } catch (error) {
      console.error("Error fetching workout:", error);
    }
  };

  const fetchExerciseDetails = async (exerciseIds) => {
    try {
      const exercisesRef = collection(db, "exercises");
      const querySnapshot = await getDocs(exercisesRef);

      let exerciseMap = {};
      let setsMap = {};

      querySnapshot.forEach((doc) => {
        if (exerciseIds.includes(doc.id)) {
          const exercise = doc.data();
          exerciseMap[doc.id] = { id: doc.id, ...exercise };
          setsMap[doc.id] = [];
        }
      });

      const sessionsRef = collection(db, "sessions");
      const sessionsSnapshot = await getDocs(sessionsRef);

      let maxVolumeSets = {};

      sessionsSnapshot.forEach((doc) => {
        const session = doc.data();
        if (session.user_id === "PXDYJCKtnULevYyzaNgp") {
          session.exercises.forEach(({ exercise_id, sets }) => {
            sets.forEach((set) => {
              const volume = set.weight * set.reps;
              if (
                !maxVolumeSets[exercise_id] ||
                volume > maxVolumeSets[exercise_id].volume
              ) {
                maxVolumeSets[exercise_id] = {
                  id: Math.random().toString(),
                  weight: set.weight,
                  reps: set.reps,
                  rpe: set.rpe || 0,
                  rating: set.set_rating || 0,
                  completed: false,
                  volume: volume,
                };
              }
            });
          });
        }
      });

      Object.keys(exerciseMap).forEach((exerciseId) => {
        if (maxVolumeSets[exerciseId]) {
          setsMap[exerciseId] = [maxVolumeSets[exerciseId]];
        } else {
          setsMap[exerciseId] = [
            {
              id: Math.random().toString(),
              weight: 0,
              reps: 0,
              rpe: 0,
              rating: 0,
              completed: false,
            },
          ];
        }
      });

      setExerciseDetails(exerciseMap);
      setExerciseSets(setsMap);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleSetChange = (exerciseId, setId, field, value) => {
    setExerciseSets((prevSets) => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set) =>
        set.id === setId ? { ...set, [field]: value } : set
      ),
    }));
  };

  const handleFinish = async () => {
    try {
      const sessionRef = collection(db, "sessions");

      const sessionData = {
        user_id: "PXDYJCKtnULevYyzaNgp",
        workout_id: workoutId,
        date: new Date(),
        exercises: Object.entries(exerciseSets).map(([exerciseId, sets]) => ({
          exercise_id: exerciseId,
          sets: sets.map(({ weight, reps, rpe, rating }) => ({
            weight,
            reps,
            rpe,
            set_rating: rating,
          })),
        })),
      };

      await addDoc(sessionRef, sessionData);
      console.log("Session saved successfully!");

      router.push("/workout");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  if (!workoutData) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{workoutData.name}</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.backButton} onPress={() => router.push("/workout")}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Pressable style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={workoutData.exercises}
        keyExtractor={(id) => id}
        renderItem={({ item }) => {
          const exercise = exerciseDetails[item];
          if (!exercise) return null;

          return (
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>

              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>SET</Text>
                  <Text style={styles.headerText}>KG</Text>
                  <Text style={styles.headerText}>REPS</Text>
                  <Text style={styles.headerText}>RPE</Text>
                  <Text style={styles.headerText}>Rating</Text>
                  <Text style={styles.headerText}>✔</Text>
                </View>

                <FlatList
                  data={exerciseSets[exercise.id]}
                  keyExtractor={(set) => set.id}
                  renderItem={({ item: set, index }) => (
                    <View style={styles.row}>
                      <View style={styles.column}>
                        <Pressable onPress={() => deleteSet(exercise.id, index)}>
                          <Text style={styles.cell}>{index + 1}</Text>
                        </Pressable>
                      </View>
                      <View style={styles.column}>
                        <TextInput
                          style={styles.input}
                          value={String(set.weight)}
                          keyboardType="numeric"
                          onChangeText={(value) =>
                            handleSetChange(exercise.id, set.id, "weight", Number(value))
                          }
                        />
                      </View>
                      <View style={styles.column}>
                        <TextInput
                          style={styles.input}
                          value={String(set.reps)}
                          keyboardType="numeric"
                          onChangeText={(value) =>
                            handleSetChange(exercise.id, set.id, "reps", Number(value))
                          }
                        />
                      </View>
                      <View style={styles.column}>
                        <TextInput
                          style={styles.input}
                          value={String(set.rpe)}
                          keyboardType="numeric"
                          onChangeText={(value) =>
                            handleSetChange(exercise.id, set.id, "rpe", Number(value))
                          }
                        />
                      </View>
                      <View style={styles.column}>
                        <TextInput
                          style={styles.input}
                          value={String(set.rating)}
                          keyboardType="numeric"
                          onChangeText={(value) =>
                            handleSetChange(exercise.id, set.id, "rating", Number(value))
                          }
                        />
                      </View>
                      <View style={styles.column}>
                        <CheckBox
                          value={set.completed}
                          onValueChange={(value) =>
                            handleSetChange(exercise.id, set.id, "completed", value)
                          }
                        />
                      </View>
                    </View>
                  )}
                />

                <Pressable style={styles.addButton} onPress={() => addSet(exercise.id)}>
                  <Text style={styles.addButtonText}>+ Add Set</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  exerciseCard: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  exerciseName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  tableHeader: { flexDirection: "row", backgroundColor: color, padding: 6 },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  row: { flexDirection: "row", padding: 6, alignItems: "center" },
  column: {
    flex: 1,
    alignItems: "center", // Center align items in each column
  },
  cell: {
    width: 30, // Set a fixed width for the set number field
    textAlign: "center",
    fontSize: 16, // Keep the font size the same
    color: "#fff",
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    fontSize: 16,
    textAlign: "center",
    borderRadius: 5,
    paddingVertical: 4,
    margin: 2,
    maxWidth: 50, // Set a max width for smaller screens
  },
  addButton: {
    backgroundColor: color,
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: "center",
  },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  buttonContainer: {
    flexDirection: "row",
    gap: 10, // Add space between buttons
  },
  backButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: color, // Use the main theme color for text
    fontSize: 16,
    fontWeight: "bold",
  },
  finishButton: {
    flex: 1,
    backgroundColor: color,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExercisesScreen;
