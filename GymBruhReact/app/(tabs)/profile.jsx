import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Image, ScrollView, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router'; // Get params (token) from navigation

import { useAuth } from '../AuthContext'; 

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { token } = useAuth(); 

  const handleProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data.msg);
      if (response.ok) {
        setUserData(data.user); // Store received data in state
      } else {
        Alert.alert("Error", data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  // Fetch profile data when the component mounts
  useEffect(() => {
    handleProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.section, {marginTop: 30, paddingTop: 40, backgroundColor: 'white'}]}>
        <Image style={styles.image} source={require('../defaultp.png')} />
        <Text style={[styles.sectionTitle, { fontSize: 30, alignSelf: 'center' }]}>
          {userData?.username || "N/A"}
        </Text>

      {/* User Information Section */}
        <Text style={styles.userDetail}>Age: {userData?.age || "N/A"}</Text>
        <Text style={styles.userDetail}>Weight: {userData?.weight || "N/A"} kg</Text>
        <Text style={styles.userDetail}>Height: {userData?.height || "N/A"} cm</Text>
        <Text style={styles.userDetail}>Goal: Weight {userData?.goal || "Weight Maintain"}</Text>
        
        <View style={styles.switchContainer}>
          <Text style={styles.userDetail}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </View>
      </View>

      {/* Other sections */}
      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Register as Trainer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#dbad12' }]}>Premium</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={[styles.section, styles.logoutSection]} onPress={() => router.push('/')}>
        <Text style={[styles.sectionTitle, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.section, styles.deleteAccountSection]}>
        <Text style={[styles.sectionTitle, styles.deleteText]}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 30,
    backgroundColor: "#e6e2e2",
  },
  image: {
    width: 100,
    height: 100, 
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10
  },   
  section: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#47328c",
  },
  userDetail: {
    fontSize: 16,
    color: "black",
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  logoutSection: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
  },
  logoutText: {
    color: "white",
    textAlign: "center",
  },
  deleteAccountSection: {
    backgroundColor: "#d9534f",
  },
  deleteText: {
    color: "white",
    textAlign: "center",
  },
});

export default ProfileScreen;
