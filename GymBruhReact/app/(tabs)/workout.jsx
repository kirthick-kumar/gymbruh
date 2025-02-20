import React from 'react';
import { SafeAreaView, Pressable, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
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

const black = '#343131';
const purple = '#664ac1'
const orange = '#8E05C2'

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      backgroundColor: "#121212",
    },
    card: {
        marginTop: 30,
        width: '90%',
        height: 80,
        alignSelf: 'center',
        backgroundColor: purple,
    },
    cardBody: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    cardText: {
        fontSize:28,
        fontWeight: 'bold',
        color: 'white',
    },
    title:{
        fontSize:42,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        marginTop: 50,
    },
})

export default MyComponent;
