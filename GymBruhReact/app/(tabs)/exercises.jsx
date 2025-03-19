import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Modal, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ExercisesScreen = () => {
  const router = useRouter();
  const { workout } = useLocalSearchParams();
  const workoutData = JSON.parse(workout);

  const [exerciseSets, setExerciseSets] = useState(
    workoutData.exercises.reduce((acc, exercise) => {
      acc[exercise.id] = [
        { id: "1", weight: 55, reps: 8 },
        { id: "2", weight: 55, reps: 8 },
        { id: "3", weight: 55, reps: 8 },
      ];
      return acc;
    }, {})
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [tempWeight, setTempWeight] = useState("");
  const [tempReps, setTempReps] = useState("");

  const openEditModal = (exerciseId, set) => {
    setEditingSet({ exerciseId, setId: set.id });
    setTempWeight(String(set.weight));
    setTempReps(String(set.reps));
    setModalVisible(true);
  };

  const saveSet = () => {
    if (editingSet) {
      setExerciseSets((prev) => ({
        ...prev,
        [editingSet.exerciseId]: prev[editingSet.exerciseId].map((set) =>
          set.id === editingSet.setId
            ? { ...set, weight: Number(tempWeight), reps: Number(tempReps) }
            : set
        ),
      }));
    }
    setModalVisible(false);
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
        },
      ],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workoutData.name} Workout</Text>
      <FlatList
        data={workoutData.exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{item.name}</Text>

            {/* TABLE */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>SET</Text>
                <Text style={styles.headerText}>KG</Text>
                <Text style={styles.headerText}>REPS</Text>
                <Text style={styles.headerText}></Text>
              </View>

              <FlatList
                data={exerciseSets[item.id]}
                keyExtractor={(set) => set.id}
                renderItem={({ item: set }) => (
                  <View style={styles.row}>
                    <Text style={styles.cell}>{set.id}</Text>
                    <Text style={styles.cell}>{set.weight}</Text>
                    <Text style={styles.cell}>{set.reps}</Text>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => openEditModal(item.id, set)}
                    >
                      <Ionicons name="create-outline" size={20} color="white" />
                    </Pressable>
                  </View>
                )}
              />

              {/* ADD SET BUTTON */}
              <Pressable style={styles.addButton} onPress={() => addSet(item.id)}>
                <Text style={styles.addButtonText}>+ Add Set</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Set</Text>
            <TextInput
              style={styles.input}
              value={tempWeight}
              keyboardType="numeric"
              onChangeText={setTempWeight}
              placeholder="Weight (kg)"
            />
            <TextInput
              style={styles.input}
              value={tempReps}
              keyboardType="numeric"
              onChangeText={setTempReps}
              placeholder="Reps"
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.saveButton} onPress={saveSet}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* BACK BUTTON */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 15 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "white", marginBottom: 20 },
  exerciseCard: { backgroundColor: "#1e1e1e", padding: 15, marginBottom: 10, borderRadius: 10 },
  exerciseName: { fontSize: 22, fontWeight: "bold", color: "#fff" },

  // TABLE STYLES
  table: { marginTop: 15, borderRadius: 10, overflow: "hidden" },
  tableHeader: { flexDirection: "row", backgroundColor: "#333", padding: 8 },
  headerText: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "bold", color: "#fff" },
  row: { flexDirection: "row", backgroundColor: "#252525", padding: 8, alignItems: "center" },
  cell: { flex: 1, textAlign: "center", fontSize: 16, color: "#fff" },
  editButton: {
    padding: 6,
    backgroundColor: "#ff7f50",
    borderRadius: 5,
    marginLeft: 5,
  },

  // MODAL STYLES
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  input: {
    backgroundColor: "#333",
    color: "white",
    fontSize: 16,
    textAlign: "center",
    borderRadius: 5,
    paddingVertical: 8,
    width: "100%",
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  saveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, flex: 1, margin: 5 },
  cancelButton: { backgroundColor: "#ff7f50", padding: 10, borderRadius: 5, flex: 1, margin: 5 },
  buttonText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "bold" },

  // OTHER BUTTONS
  addButton: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginTop: 10, alignSelf: "center" },
  addButtonText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  backButton: { backgroundColor: "#ff7f50", padding: 10, borderRadius: 5, alignSelf: "center", marginTop: 20 },
});

export default ExercisesScreen;
