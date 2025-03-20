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

const color = "#42307e";

const ExercisesScreen = () => {
  const router = useRouter();
  const { workout } = useLocalSearchParams();
  const workoutData = JSON.parse(workout);

  const navigation = useNavigation();
    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

  const [exerciseSets, setExerciseSets] = useState(
    workoutData.exercises.reduce((acc, exercise) => {
      acc[exercise.id] = [
        { id: "1", weight: 55, reps: 8, rpe: 7, rating: 4, completed: false },
        { id: "2", weight: 55, reps: 8, rpe: 7, rating: 4, completed: false },
        { id: "3", weight: 55, reps: 8, rpe: 7, rating: 4, completed: false },
      ];
      return acc;
    }, {})
  );

  const handleSetChange = (exerciseId, setId, key, value) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set) =>
        set.id === setId ? { ...set, [key]: value } : set
      ),
    }));
  };

  const addSet = (exerciseId) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: [
        ...prev[exerciseId],
        {
          id: `${prev[exerciseId].length + 1}`,
          weight: 55,
          reps: 8,
          rpe: 7,
          rating: 4,
          completed: false,
        },
      ],
    }));
  };

  const deleteSet = (exerciseId, index) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].filter((_, i) => i !== index),
    }));
  };

  const handleFinish = () => {
    // Add your finish logic here (e.g., navigate to another screen or show a message)
    console.log("Workout finished!");
    // You can navigate to another screen if needed
    // router.push('/someOtherScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{workoutData.name}</Text>
        <Pressable style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </View>
      <FlatList
        data={workoutData.exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{item.name}</Text>

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
                data={exerciseSets[item.id]}
                keyExtractor={(set) => set.id}
                renderItem={({ item: set, index }) => (
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Pressable onPress={() => deleteSet(item.id, index)}>
                        <Text style={styles.cell}>{index + 1}</Text> {/* Display index + 1 */}
                      </Pressable>
                    </View>
                    <View style={styles.column}>
                      <TextInput
                        style={styles.input}
                        value={String(set.weight)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                          handleSetChange(item.id, set.id, "weight", Number(value))
                        }
                      />
                    </View>
                    <View style={styles.column}>
                      <TextInput
                        style={styles.input}
                        value={String(set.reps)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                          handleSetChange(item.id, set.id, "reps", Number(value))
                        }
                      />
                    </View>
                    <View style={styles.column}>
                      <TextInput
                        style={styles.input}
                        value={String(set.rpe)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                          handleSetChange(item.id, set.id, "rpe", Number(value))
                        }
                      />
                    </View>
                    <View style={styles.column}>
                      <TextInput
                        style={styles.input}
                        value={String(set.rating)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                          handleSetChange(item.id, set.id, "rating", Number(value))
                        }
                      />
                    </View>
                    <View style={styles.column}>
                      <CheckBox
                        value={set.completed}
                        onValueChange={(value) =>
                          handleSetChange(item.id, set.id, "completed", value)
                        }
                      />
                    </View>
                  </View>
                )}
              />

              <Pressable style={styles.addButton} onPress={() => addSet(item.id)}>
                <Text style={styles.addButtonText}>+ Add Set</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable style={styles.backButton} onPress={() => router.push('/workout')}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 10, paddingTop: 30},
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
  finishButton: {
    backgroundColor: color,
    padding: 8,
    borderRadius: 5,
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
  backButton: {
    backgroundColor: color,
    padding: 8,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 15,
  },
  buttonText: { color: "white", fontSize: 14, textAlign: "center", fontWeight: "bold" },
});

export default ExercisesScreen;
