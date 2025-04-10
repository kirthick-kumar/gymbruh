import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const TrainerListScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('isTrainer', '==', true));
        const snapshot = await getDocs(q);

        const trainerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrainers(trainerList);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7657df" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Registered Trainers</Text>

      {trainers.map((trainer) => {
        const details = trainer.trainerDetails || {};
        return (
          <View key={trainer.id} style={styles.card}>
            <Text style={styles.name}>{trainer.username || 'Unnamed Trainer'}</Text>
            <Text style={styles.label}>Experience:</Text>
            <Text style={styles.text}>{details.experience} years</Text>

            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.text}>{details.contact}</Text>

            <Text style={styles.label}>Gym:</Text>
            <Text style={styles.text}>{details.gymName} - {details.gymLocation}</Text>

            {details.certifications ? (
              <>
                <Text style={styles.label}>Certifications:</Text>
                <Text style={styles.text}>{details.certifications}</Text>
              </>
            ) : null}

            <Text style={styles.label}>Specialties:</Text>
            <View style={styles.specialtiesContainer}>
              {(details.specialties || []).map((spec, i) => (
                <Text key={i} style={styles.specialty}>
                  {spec}
                </Text>
              ))}
            </View>

            {details.bio ? (
              <>
                <Text style={styles.label}>Bio:</Text>
                <ScrollView
                  style={styles.bioScroll}
                  nestedScrollEnabled={true}
                >
                  <Text style={styles.text}>{details.bio}</Text>
                </ScrollView>
              </>
            ) : null}


          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1C1C1C',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    color: '#7657df',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    color: '#7657df',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    fontWeight: '600',
  },
  text: {
    color: '#eee',
    fontSize: 14,
    marginBottom: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  bioScroll: {
    maxHeight: 100,
    marginTop: 4,
    padding: 8,
    borderRadius: 5,
  },  
  specialty: {
    backgroundColor: '#42307e',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 6,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#42307e',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TrainerListScreen;
