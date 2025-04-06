import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

const color = '#a78bfa';

const SessionScreen = () => {
  const { workoutId } = useLocalSearchParams();
  const [sessions, setSessions] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (workoutId) {
      fetchWorkoutName(workoutId);
      fetchSessions(workoutId);
    }
  }, [workoutId]);

  const fetchWorkoutName = async (workoutId) => {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      const workoutSnap = await getDoc(workoutRef);
      if (workoutSnap.exists()) {
        const name = workoutSnap.data().name || 'Workout';
        setWorkoutName(name);
        navigation.setOptions({ title: `${name} Sessions` });
      }
    } catch (error) {
      console.error('Error fetching workout name:', error);
    }
  };

  const fetchSessions = async (workoutId) => {
    try {
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('workout_id', '==', workoutId)
      );
      const querySnapshot = await getDocs(sessionsQuery);

      const sessionsData = [];

      for (const docSnap of querySnapshot.docs) {
        const session = docSnap.data();
        let totalRPE = 0;
        let totalSets = 0;
        let totalVolume = 0;

        const exercisesWithNames = await Promise.all(
          session.exercises.map(async (exercise) => {
            const exerciseRef = doc(db, 'exercises', exercise.exercise_id);
            const exerciseSnap = await getDoc(exerciseRef);
            const exerciseName = exerciseSnap.exists()
              ? exerciseSnap.data().name
              : 'Unknown Exercise';

            exercise.sets.forEach((set) => {
              totalRPE += set.rpe;
              totalVolume += set.reps * set.weight;
              totalSets++;
            });

            return {
              ...exercise,
              name: exerciseName,
            };
          })
        );

        const avgRPE = totalSets > 0 ? (totalRPE / totalSets).toFixed(1) : 'N/A';

        sessionsData.push({
          id: docSnap.id,
          date: session.date.toDate(),
          exercises: exercisesWithNames,
          avgRPE,
          totalVolume,
        });
      }

      sessionsData.sort((a, b) => b.date - a.date);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const confirmDeleteSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    setDeleteModalVisible(true);
  };

  const deleteSession = async () => {
    if (selectedSessionId) {
      try {
        await deleteDoc(doc(db, 'sessions', selectedSessionId));
        setSessions((prev) => prev.filter((s) => s.id !== selectedSessionId));
        setDeleteModalVisible(false);
        setSelectedSessionId(null);
      } catch (err) {
        console.error('Error deleting session:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.workoutName}>{workoutName}</Text> History
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.sessionDate}>
                {moment(session.date).format('D MMMM YYYY [at] h:mm:ss A')}
              </Text>
              <Pressable onPress={() => confirmDeleteSession(session.id)}>
                <Icon style={styles.deleteIcon} name="trash-alt" size={15} color={color} />
              </Pressable>
            </View>

            <View style={styles.metrics}>
              <Text style={styles.metricText}>RPE: {session.avgRPE}</Text>
              <Text style={styles.metricText}>Volume: {session.totalVolume} kg</Text>
            </View>

            <ScrollView style={styles.exerciseScroll} nestedScrollEnabled>
              {session.exercises.map((exercise, idx) => (
                <View key={idx} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>Set</Text>
                    <Text style={styles.headerCell}>Reps</Text>
                    <Text style={styles.headerCell}>Weight</Text>
                    <Text style={styles.headerCell}>RPE</Text>
                    <Text style={styles.headerCell}>Rating</Text>
                  </View>

                  {exercise.sets.map((set, setIdx) => (
                    <View key={setIdx} style={styles.tableRow}>
                      <Text style={styles.cell}>{setIdx + 1}</Text>
                      <Text style={styles.cell}>{set.reps}</Text>
                      <Text style={styles.cell}>{set.weight} kg</Text>
                      <Text style={styles.cell}>{set.rpe}</Text>
                      <Text style={styles.cell}>{set.set_rating}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        ))}

        {sessions.length === 0 && (
          <Text style={styles.noSessionsText}>No sessions found for this workout.</Text>
        )}
      </ScrollView>

      {/* Custom Delete Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Session</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this session?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.modalCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteSession} style={styles.modalDelete}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  workoutName: {
    color: '#a78bfa',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  sessionCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 10,
    maxHeight: 230,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a78bfa',
  },
  deleteIcon: {
    padding: 5,
    paddingBottom: 15
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  metricText: {
    color: '#ccc',
    fontSize: 13,
  },
  exerciseScroll: {
    flexGrow: 0,
  },
  exerciseContainer: {
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomColor: '#a78bfa',
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#a78bfa',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
  },
  noSessionsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    color: '#ccc',
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalDelete: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SessionScreen;
