import { SafeAreaView, Pressable, Button, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const color = '#42307e';

const workouts = [
  { id: '1', name: 'Push', muscle: 'Chest, Shoulder, Triceps', exercises: [
    { id: '1', name: 'Bench Press (Barbell)', sets: 3, reps: 8, weight: '55 kg', rest: '2 min' },
    { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: '22 kg', rest: '1 min 30s' },
    { id: '3', name: 'Tricep Dips', sets: 3, reps: 12, weight: 'Bodyweight', rest: '1 min' },
  ]},
  { id: '2', name: 'Pull', muscle: 'Back, Biceps', exercises: [
    { id: '1', name: 'Deadlift', sets: 3, reps: 6, weight: '90 kg', rest: '2 min' },
    { id: '2', name: 'Pull-Ups', sets: 3, reps: 8, weight: 'Bodyweight', rest: '1 min' },
  ]},
  { id: '3', name: 'Legs', muscle: 'Legs, Forearms, Abs', exercises: [
    { id: '1', name: 'Squats', sets: 3, reps: 8, weight: '80 kg', rest: '2 min' },
  ]}
];

const MyComponent = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workouts</Text>
      {workouts.map((workout, index) => (
        <Animated.View 
          key={workout.id} 
          entering={FadeInUp.delay(index * 200)} 
          exiting={FadeOut}>
          <Pressable 
            onPress={() => router.push({ pathname: "/exercises/exercises", params: { workout: JSON.stringify(workout) } })} 
            style={[styles.card, { backgroundColor: index % 2 === 0 ? color : 'white' }]}
          >
            <Card.Content style={styles.cardBody}>
              <Text style={[styles.cardText, { color: index % 2 === 0 ? 'white' : color }]}>
                {workout.name}
              </Text>
              <Text style={{ color: index % 2 === 0 ? 'white' : color, fontSize: 16 }}>
                {workout.muscle}
              </Text>
            </Card.Content>
          </Pressable>
        </Animated.View>
      ))}
      <Pressable
        style={styles.addButton}
        mode="contained"
        onPress={() => router.push('/addworkout/add-workout')}
      >
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Add Workout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 15 },
  card: { marginTop: 30, width: '90%', height: 80, alignSelf: 'center', borderRadius: 10, padding: 10 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardText: { fontSize: 28, fontWeight: 'bold' },
  title: { fontSize: 42, fontWeight: 'bold', textAlign: 'center', color: 'white', marginBottom: 20, marginTop: 50 },
  addButton: {
    backgroundColor: color,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'center',
    width: '90%',
    marginVertical: 20,
    alignItems: 'center',
  }
});

export default MyComponent;
