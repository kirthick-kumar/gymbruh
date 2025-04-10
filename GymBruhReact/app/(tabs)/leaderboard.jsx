import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Location from "expo-location";
import { Menu, Button } from 'react-native-paper';
import { MotiView, MotiText } from "moti";
import { db } from '@/config/firebaseConfig';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const GOOGLE_API_KEY = "AIzaSyBsKawNZGIhtDBOp-EYVaM73QPKLmZQfSU";

const getMedalIcon = (rank) => {
  if (rank === 1) return <Icon name="medal" size={22} color="#FFD700" />;
  if (rank === 2) return <Icon name="medal" size={22} color="#C0C0C0" />;
  if (rank === 3) return <Icon name="medal" size={22} color="#CD7F32" />;
  return null;
};

const Leaderboard = () => {
  const [city, setCity] = useState("Fetching location...");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("Select an Exercise");
  const [exercises, setExercises] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "exercises"));
        const exerciseList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          exerciseList.push({ id: doc.id, ...data });
        });
        setExercises(exerciseList);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCity("Permission Denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
        );

        const data = await response.json();

        let cityName = null;
        for (let result of data.results) {
          for (let component of result.address_components) {
            if (component.types.includes("locality")) {
              cityName = component.long_name;
              break;
            }
          }
          if (cityName) break;
        }

        if (!cityName) {
          for (let result of data.results) {
            for (let component of result.address_components) {
              if (component.types.includes("administrative_area_level_2")) {
                cityName = component.long_name;
                break;
              }
            }
            if (cityName) break;
          }
        }

        setCity(cityName || "City not found");
      } catch (error) {
        console.error("Location Fetch Error:", error);
        setCity("Failed to get location");
      }
    };

    fetchExercises();
    getLocation();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedExercise || selectedExercise === "Select an Exercise") return;

      try {
        const exerciseMatch = exercises.find((e) => e.name === selectedExercise);
        if (!exerciseMatch) return;

        const exerciseId = exerciseMatch.id;
        const sessionSnap = await getDocs(collection(db, "sessions"));

        const userMaxWeights = {}; // userId => maxWeight

        sessionSnap.forEach((doc) => {
          const data = doc.data();
          const { user_id, exercises } = data;

          exercises.forEach((ex) => {
            if (ex.exercise_id === exerciseId) {
              ex.sets.forEach((set) => {
                const weight = set.weight || 0;

                if (!userMaxWeights[user_id] || weight > userMaxWeights[user_id]) {
                  userMaxWeights[user_id] = weight;
                }
              });
            }
          });
        });

        const leaderboardArray = await Promise.all(
          Object.entries(userMaxWeights)
            .sort((a, b) => b[1] - a[1]) // Sort by max weight desc
            .map(async ([userId, weight], index) => {
              let username = `User ${userId.substring(0, 5)}...`;
              try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  if (userData.username) username = userData.username;
                }
              } catch (err) {
                console.warn(`Error fetching user ${userId}`, err);
              }

              return {
                rank: index + 1,
                name: username,
                bench: weight,
              };
            })
        );

        setLeaderboardData(leaderboardArray);

      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [selectedExercise, exercises]);

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

      <MotiText
        style={styles.cityText}
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1000, delay: 1200 }}
      >
        📍 {city}
      </MotiText>

      <FlatList
        key={selectedExercise}
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
            <Text style={styles.bench}>Weight: {item.bench} kg</Text>
          </MotiView>
        )}
      />

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={styles.menuButton}
              labelStyle={{ color: 'black' }}
              uppercase={false}
            >
              {selectedExercise}
            </Button>
          }
          contentStyle={{ backgroundColor: '#1e1e1e' }}
        >
          {exercises.map((exercise, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                setSelectedExercise(exercise.name);
                setMenuVisible(false);
              }}
              title={exercise.name}
              titleStyle={{ color: '#fff' }}
            />
          ))}
        </Menu>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#E6C200",
    textAlign: "center",
    marginBottom: 15,
  },
  cityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginRight: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  bench: {
    fontSize: 16,
    color: "#bbb",
    marginLeft: 10,
  },
  menuButton: {
    backgroundColor: 'gold',
    paddingVertical: 6,
    borderRadius: 10,
    width: 250,
    alignSelf: 'center',
  },
});

export default Leaderboard;
