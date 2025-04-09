import { SafeAreaView, Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { db } from "../../config/firebaseConfig";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const color = '#42307e';

const MyComponent = () => {
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) fetchWorkouts(user.id);
  }, [user]);

  const fetchWorkouts = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const workoutList = userSnap.data().createdWorkouts || [];
        const fetchedWorkouts = [];

        for (let workoutId of workoutList) {
          const workoutRef = doc(db, "workouts", workoutId);
          const workoutSnap = await getDoc(workoutRef);

          if (workoutSnap.exists())
            fetchedWorkouts.push({ id: workoutId, ...workoutSnap.data() });
        }

        setWorkouts(fetchedWorkouts);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleViewSessions = (workoutId) => {
    router.push({ pathname: '/sessions/sessions', params: { workoutId } });
  };
  
  const handleEdit = (workoutId) => {
    router.push(`/addworkout/add-workout?workoutId=${workoutId}`);
  };

  const handleDelete = async (workoutId) => {
    try {
      const userId = user?.id;
      if (!userId) return;

      await deleteDoc(doc(db, "workouts", workoutId));

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedWorkouts = (userData.createdWorkouts || []).filter(id => id !== workoutId);
        await updateDoc(userRef, { createdWorkouts: updatedWorkouts });
      }

      setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w.id !== workoutId));
      console.log("Workout deleted");
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workouts</Text>

      {workouts.map((workout, index) => (
        <Animated.View
          key={workout.id}
          entering={FadeInUp.delay(index * 200)}
          exiting={FadeOut}
        >
          <Pressable
            onPress={() =>
              router.push({ pathname: "/exercises/exercises", params: { workoutId: workout.id } })
            }
            style={[styles.card, { backgroundColor: index % 2 === 0 ? color : 'white' }]}
          >
            <Card.Content style={styles.cardBody}>
              <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleScroll}>
                <Text style={[styles.cardText, { color: index % 2 === 0 ? 'white' : color }]}>
                  {workout.name}
                </Text>
              </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleScroll}>
                  <Text style={{ color: index % 2 === 0 ? 'white' : color, fontSize: 16 }}>
                    {Array.isArray(workout.muscles) ? workout.muscles.join(', ') : workout.muscles}
                  </Text>
                </ScrollView>
              </View>

              <View style={styles.buttonContainer}>
                <Pressable onPress={() => handleEdit(workout.id)} style={styles.iconButton}>
                  <Icon name="edit" size={20} color={index % 2 === 0 ? 'white' : color} />
                </Pressable>
                <Pressable onPress={() => handleDelete(workout.id)} style={styles.iconButton}>
                  <Icon name="trash-alt" size={20} color={index % 2 === 0 ? 'white' : color} />
                </Pressable>
                <Pressable onPress={() => handleViewSessions(workout.id)} style={styles.iconButton}>
                  <Icon name="history" size={20} color={index % 2 === 0 ? 'white' : color} />
                </Pressable>
              </View>
            </Card.Content>
          </Pressable>
        </Animated.View>
      ))}

      <Pressable style={styles.addButton} onPress={() => router.push('/addworkout/add-workout')}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Add Workout</Text>
      </Pressable>

      <Pressable
        style={[styles.addButton, { backgroundColor: 'white', marginTop: 20 }]}
        onPress={() => router.push('/add-exercise/add-exercise')}
      >
        <Text style={{ color: color, fontSize: 20, fontWeight: '600' }}>Exercises</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 15 },
  card: { marginTop: 30, width: '90%', height: 100, alignSelf: 'center', borderRadius: 10, padding: 10 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardText: { fontSize: 28, fontWeight: 'bold' },
  title: { fontSize: 42, fontWeight: 'bold', textAlign: 'center', color: 'white', marginBottom: 20, marginTop: 50 },
  addButton: {
    backgroundColor: color,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'center',
    width: '90%',
    marginTop: 50,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  muscleScroll: {
    maxWidth: 200,
  },
});

export default MyComponent;
