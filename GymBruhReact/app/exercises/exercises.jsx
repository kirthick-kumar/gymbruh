import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, CheckBox,} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/config/firebaseConfig";
import {doc, getDoc, addDoc, collection, getDocs,} from "firebase/firestore";

const themeColor = "#42307e";

const ExercisesScreen = () => {
  const { workoutId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [workoutData, setWorkoutData] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [exerciseSets, setExerciseSets] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log("User not authenticated");
        router.replace("/login"); // or wherever your login screen is
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    navigation.setOptions({ headerShown: false });
    fetchWorkout();
  }, [userId]);

  const fetchWorkout = async () => {
    try {
      const workoutRef = doc(db, "workouts", workoutId);
      const workoutSnap = await getDoc(workoutRef);

      if (!workoutSnap.exists()) return console.log("Workout not found!");

      const workout = workoutSnap.data();
      setWorkoutData(workout);
      fetchExerciseDetails(workout.exercises);
    } catch (error) {
      console.error("Error fetching workout:", error);
    }
  };

  const fetchExerciseDetails = async (exerciseIds) => {
    try {
      const exercisesRef = collection(db, "exercises");
      const exercisesSnapshot = await getDocs(exercisesRef);

      const sessionsRef = collection(db, "sessions");
      const sessionsSnapshot = await getDocs(sessionsRef);

      let exerciseMap = {};
      let setsMap = {};
      let maxVolumeSets = {};

      exercisesSnapshot.forEach((doc) => {
        if (exerciseIds.includes(doc.id)) {
          const data = doc.data();
          exerciseMap[doc.id] = { id: doc.id, ...data };
          setsMap[doc.id] = [];
        }
      });

      sessionsSnapshot.forEach((doc) => {
        const session = doc.data();
        if (session.user_id !== userId) return;

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
                volume,
              };
            }
          });
        });
      });

      Object.keys(exerciseMap).forEach((id) => {
        setsMap[id] = [
          maxVolumeSets[id] || {
            id: Math.random().toString(),
            weight: 0,
            reps: 0,
            rpe: 0,
            rating: 0,
            completed: false,
          },
        ];
      });

      setExerciseDetails(exerciseMap);
      setExerciseSets(setsMap);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const addSet = (exerciseId) => {
    setExerciseSets((prev) => {
      const current = prev[exerciseId] || [];
      const last = current[current.length - 1] || {
        weight: 0,
        reps: 0,
        rpe: 0,
        rating: 0,
        completed: false,
      };
      const newSet = { ...last, id: Math.random().toString(), completed: false };
      return { ...prev, [exerciseId]: [...current, newSet] };
    });
  };

  const deleteSet = (exerciseId, index) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].filter((_, i) => i !== index),
    }));
  };

  const handleSetChange = (exerciseId, setId, field, value) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set) =>
        set.id === setId ? { ...set, [field]: value } : set
      ),
    }));
  };

  const handleFinish = async () => {
    try {
      const sessionRef = collection(db, "sessions");

      const sessionData = {
        user_id: userId,
        workout_id: workoutId,
        date: new Date(),
        exercises: Object.entries(exerciseSets).map(([id, sets]) => ({
          exercise_id: id,
          sets: sets.map(({ weight, reps, rpe, rating }) => ({
            weight,
            reps,
            rpe,
            set_rating: rating,
          })),
        })),
      };

      await addDoc(sessionRef, sessionData);
      console.log("Session saved!");
      router.push("/workout");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  if (!workoutData) return <Text style={{ color: "#fff", padding: 20 }}>Loading...</Text>;

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
                  {["SET", "KG", "REPS", "RPE", "Rating", "✔"].map((label, i) => (
                    <Text key={i} style={styles.headerText}>{label}</Text>
                  ))}
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
                      {["weight", "reps", "rpe", "rating"].map((field, i) => (
                        <View key={i} style={styles.column}>
                          <TextInput
                            style={styles.input}
                            value={String(set[field])}
                            keyboardType="numeric"
                            onChangeText={(value) =>
                              handleSetChange(exercise.id, set.id, field, Number(value))
                            }
                          />
                        </View>
                      ))}
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
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: themeColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  finishButton: {
    flex: 1,
    backgroundColor: themeColor,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseCard: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: themeColor,
    padding: 6,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    padding: 6,
    alignItems: "center",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  cell: {
    width: 30,
    textAlign: "center",
    fontSize: 16,
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
    maxWidth: 50,
  },
  addButton: {
    backgroundColor: themeColor,
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ExercisesScreen;
