import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const leaderboardData = [
  { name: "Joe", bench: 315 },
  { name: "Jackson", bench: 275 },
  { name: "Emma Aria", bench: 185 },
  { name: "Sebastian", bench: 225 },
  { name: "Jason", bench: 245 },
  { name: "Natalie", bench: 135 },
  { name: "Serenity", bench: 155 },
  { name: "Hannah", bench: 115 },
];

const GymLeaderboard = () => {
  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(1000)} style={styles.title}>
        Gym Leaderboard
      </Animated.Text>
      {leaderboardData.map((item, index) => (
        <Animated.View
          key={item.name}
          style={[
            styles.itemContainer,
            index === 0 ? { backgroundColor: "gold" } :
            index === 1 ? { backgroundColor: "#7E99A3" } :
            index === 2 ? { backgroundColor: "#C14600" } : {},
          ]}
          entering={FadeInUp.delay(index * 150).springify()}
        >
          <Text style={styles.name}>{`${index + 1}. ${item.name}`}</Text>
          <Text style={styles.lift}>{`Bench: ${item.bench} kg`}</Text>
        </Animated.View>
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