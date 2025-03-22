import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MotiView, MotiText } from 'moti';

const leaderboardData = [
  { rank: 1, name: 'Joe', bench: 315 },
  { rank: 2, name: 'Jackson', bench: 275 },
  { rank: 3, name: 'Emma Aria', bench: 185 },
  { rank: 4, name: 'Sebastian', bench: 225 },
  { rank: 5, name: 'Jason', bench: 245 },
  { rank: 6, name: 'Natalie', bench: 135 },
  { rank: 7, name: 'Serenity', bench: 155 },
  { rank: 8, name: 'Hannah', bench: 115 },
];

const getMedalIcon = (rank) => {
  if (rank === 1) return <Icon name="medal" size={20} color="#FFD700" />;
  if (rank === 2) return <Icon name="medal" size={20} color="#C0C0C0" />;
  if (rank === 3) return <Icon name="medal" size={20} color="#CD7F32" />;
  return null; // No medal for ranks beyond 3
};

const Leaderboard = () => {
  return (
    <View style={styles.container}>
      <MotiText 
        style={styles.title}
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1000 }}
      >
        Gym Leaderboard
      </MotiText>

      <MotiText 
        style={styles.quote}
        from={{ opacity: 0, translateY: -5 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1200, delay: 500 }}
      >
        "Push harder. Lift stronger. Stay unstoppable."
      </MotiText>

      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item, index }) => (
          <MotiView
            style={styles.leaderboardItem}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 800, delay: index * 200 }}
          >
            <Text style={styles.rank}>{item.rank}. </Text>
            <Text style={styles.name}>{item.name} </Text>
            {getMedalIcon(item.rank)}
            <Text style={styles.bench}>Bench: {item.bench} kg</Text>
          </MotiView>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#E6C200', // Goldish text color for better visibility
    textAlign: 'center',
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  bench: {
    fontSize: 16,
    color: '#bbb',
    marginLeft: 10,
  },
});

export default Leaderboard;
