import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Location from "expo-location";
import { MotiView, MotiText } from "moti";

// ⚠️ Replace this with your actual API key
const GOOGLE_API_KEY = "AIzaSyBsKawNZGIhtDBOp-EYVaM73QPKLmZQfSU"; 

const leaderboardData = [
  { rank: 1, name: "Joe", bench: 315 },
  { rank: 2, name: "Jackson", bench: 275 },
  { rank: 3, name: "Emma Aria", bench: 185 },
  { rank: 4, name: "Sebastian", bench: 225 },
  { rank: 5, name: "Jason", bench: 245 },
  { rank: 6, name: "Natalie", bench: 135 },
  { rank: 7, name: "Serenity", bench: 155 },
  { rank: 8, name: "Hannah", bench: 115 },
];

const getMedalIcon = (rank) => {
  if (rank === 1) return <Icon name="medal" size={22} color="#FFD700" />;
  if (rank === 2) return <Icon name="medal" size={22} color="#C0C0C0" />;
  if (rank === 3) return <Icon name="medal" size={22} color="#CD7F32" />;
  return null;
};

const Leaderboard = () => {
  const [city, setCity] = useState("Fetching location...");

  useEffect(() => {
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

        if (data.status !== "OK") {
          console.error("Geocoding API Error:", data.error_message);
          setCity("Failed to fetch city");
          return;
        }

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

    getLocation();
  }, []);

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

      {/* 📍 City name below the quote and above the leaderboard */}
      <MotiText
        style={styles.cityText}
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1000, delay: 1200 }}
      >
        📍 {city}
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
    backgroundColor: "#121212",
    padding: 20,
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
    color: "#fff",  // Changed to white
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
});


export default Leaderboard;
