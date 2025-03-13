import React from 'react';
import { SafeAreaView, Pressable, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import ProfileScreen from './profile';

const color = '#42307e';

const workouts = [
  { id: '1', name: 'Push', muscle: 'Chest, Shoulder, Triceps' },
  { id: '2', name: 'Pull', muscle: 'Back, Biceps' },
  { id: '3', name: 'Legs', muscle: 'Legs, Forearms, Abs' },
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
          <Card style={[styles.card, { backgroundColor: index % 2 === 0 ? color : 'white' }]}>
            <Card.Content style={styles.cardBody}>
              <SafeAreaView>
                <Text style={[styles.cardText, { color: index % 2 === 0 ? 'white' : color }]}>
                  {workout.name}
                </Text>
                <Text style={{ color: index % 2 === 0 ? 'white' : color, fontSize: 16 }}>
                  {workout.muscle}
                </Text>
              </SafeAreaView>
              <Pressable 
                onPress={() => console.log(`Delete ${workout.name}`)} 
                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.9 : 1 }] }]}
              >
                <Ionicons name="trash-outline" size={24} color={index % 2 === 0 ? 'white' : color} />
              </Pressable>
            </Card.Content>
          </Card>
        </Animated.View>
      ))}
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/addworkout'
          });
        }}
        style={({ pressed }) => [styles.addButton,{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
        <Text style={styles.addButtonText}>Add Workout</Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#121212",
  },
  card: {
    marginTop: 30,
    width: '90%',
    height: 80,
    alignSelf: 'center',
  },
  addButton: {
    backgroundColor: color,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  cardBody: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  cardText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
    marginTop: 50,
  },
});

export default MyComponent;
