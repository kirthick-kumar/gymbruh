import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const dummyTrainers = [
  { id: '1', name: 'John Doe', experience: '5 years', contact: '1234567890' },
  { id: '2', name: 'Jane Smith', experience: '3 years', contact: '9876543210' },
  { id: '3', name: 'Mike Johnson', experience: '7 years', contact: '4567891230' },
];

// Placeholder image URL (replace with local asset if needed)
const placeholderImage = 'https://via.placeholder.com/100x100.png?text=Trainer';

const TrainersScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: placeholderImage }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Experience: {item.experience}</Text>
        <Text style={styles.details}>Contact: {item.contact}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyTrainers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#D6EFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: 'white',
    marginTop: 4,
  },
});

export default TrainersScreen;
