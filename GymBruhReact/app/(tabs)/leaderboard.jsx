import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const leaderboardData = [
  { name: "Joe", bench: 315, deadlift: 500, squat: 405 },
  { name: "Jackson", bench: 275, deadlift: 450, squat: 385 },
  { name: "Emma Aria", bench: 185, deadlift: 350, squat: 265 },
  { name: "Sebastian", bench: 225, deadlift: 405, squat: 315 },
  { name: "Jason", bench: 245, deadlift: 430, squat: 355 },
  { name: "Natalie", bench: 135, deadlift: 300, squat: 225 },
  { name: "Serenity", bench: 155, deadlift: 320, squat: 240 },
  { name: "Hannah", bench: 115, deadlift: 280, squat: 205 },
];

const GymLeaderboard = () => {
  const others = leaderboardData.slice(3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym Leaderboard</Text>
      
      <View style={[styles.itemContainer, {backgroundColor: 'gold'}]}>
        <Text style={styles.name}>{`${1}. ${leaderboardData[0].name}`}</Text>
        <Text style={styles.lift}>{`Bench: ${leaderboardData[0].bench} kg`}</Text>
      </View>
      <View style={[styles.itemContainer, {backgroundColor: '#7E99A3'}]}>
        <Text style={styles.name}>{`${2}. ${leaderboardData[1].name}`}</Text>
        <Text style={styles.lift}>{`Bench: ${leaderboardData[1].bench} kg`}</Text>
      </View>
      <View style={[styles.itemContainer, {backgroundColor: '#C14600'}]}>
        <Text style={styles.name}>{`${2}. ${leaderboardData[2].name}`}</Text>
        <Text style={styles.lift}>{`Bench: ${leaderboardData[2].bench} kg`}</Text>
      </View>

      {others.map((item, index) => (
        <View key={item.name} style={styles.itemContainer}>
          <Text style={styles.name}>{`${index + 4}. ${item.name}`}</Text>
          <Text style={styles.lift}>{`Bench: ${item.bench} kg`}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  lift: {
    fontSize: 16,
    color: "#fff",
  },
});

export default GymLeaderboard;




// import React from 'react';
// import { SafeAreaView, Pressable, Button } from 'react-native';
// import { Card, Text } from 'react-native-paper';
// import styles from '../styles/workout';
// import { Ionicons } from '@expo/vector-icons';

// const color = '#42307e'

// const workouts = [
//   {
//     id: '1',
//     name: 'Push',
//     muscle: 'Chest, Shoulder, Triceps',
//   },
//   {
//     id: '2',
//     name: 'Pull',
//     muscle: 'Back, Biceps',
//   },
//   {
//     id: '3',
//     name: 'Legs',
//     muscle: 'Legs, Forearms, Abs',
//   },
// ];

// const MyComponent = () => (
//   <SafeAreaView style={styles.container}>
//     <Text style={styles.title}>Workouts</Text>
//     {workouts.map((workout, index) => (
//       <Card key={workout.id} style={[styles.card, { backgroundColor: index % 2 === 0 ? color : 'white' }]}>
//         <Card.Content style={styles.cardBody}>
//           <SafeAreaView>
//             <Text style={[styles.cardText, { color: index % 2 === 0 ? 'white' : color }]}>
//               {workout.name}
//             </Text>
//             <Text style={{ color: index % 2 === 0 ? 'white' : color, fontSize: 16 }}>
//               {workout.muscle}
//             </Text>
//           </SafeAreaView>
//           <Pressable onPress={() => console.log(`Delete ${workout.name}`)}>
//             <Ionicons name="trash-outline" size={24} color={index % 2 === 0 ? 'white' : color} />
//           </Pressable>
//         </Card.Content>
//       </Card>
//     ))}
//   </SafeAreaView>
// );

// export default MyComponent;
