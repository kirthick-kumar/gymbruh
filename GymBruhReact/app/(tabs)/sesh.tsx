import React from 'react';
import { SafeAreaView, Pressable, Button } from 'react-native';
import { Card, Text } from 'react-native-paper';
import styles from '../styles/workout';
import { Ionicons } from '@expo/vector-icons';

const color = '#42307e'

const workouts = [
  {
    id: '1',
    name: 'Push',
    muscle: 'Chest, Shoulder, Triceps',
  },
  {
    id: '2',
    name: 'Pull',
    muscle: 'Back, Biceps',
  },
  {
    id: '3',
    name: 'Legs',
    muscle: 'Legs, Forearms, Abs',
  },
];

const MyComponent = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Workouts</Text>
    {workouts.map((workout, index) => (
      <Card key={workout.id} style={[styles.card, { backgroundColor: index % 2 === 0 ? color : 'white' }]}>
        <Card.Content style={styles.cardBody}>
          <SafeAreaView>
            <Text style={[styles.cardText, { color: index % 2 === 0 ? 'white' : color }]}>
              {workout.name}
            </Text>
            <Text style={{ color: index % 2 === 0 ? 'white' : color, fontSize: 16 }}>
              {workout.muscle}
            </Text>
          </SafeAreaView>
          <Pressable onPress={() => console.log(`Delete ${workout.name}`)}>
            <Ionicons name="trash-outline" size={24} color={index % 2 === 0 ? 'white' : color} />
          </Pressable>
        </Card.Content>
      </Card>
    ))}
  </SafeAreaView>
);

export default MyComponent;
