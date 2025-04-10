import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Image, ScrollView, Alert, StyleSheet, Modal } from "react-native";
import { useRouter } from 'expo-router';
import { useAuth } from '../AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
// import { useStripe } from '@stripe/stripe-react-native';

const defaultProfilePics = [
  require('../../assets/profile1.png'),
  require('../../assets/profile2.png'),
  require('../../assets/profile3.png'),
];

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const fetchUserData = async () => {
    try {
      if (!user || !user.id) {
        console.log("User not logged in");
        return;
      }

      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        Alert.alert("Error", "User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Something went wrong while fetching profile");
    }
  };

  const handleProfilePicSelect = async (index) => {
    try {
      const selectedPic = index;
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { profilePicIndex: selectedPic });
      setUserData((prev) => ({ ...prev, profilePicIndex: selectedPic }));
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const selectedProfilePic = defaultProfilePics[userData?.profilePicIndex || 0];

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.section, { marginTop: 30, paddingTop: 40 }]}>
        <View style={styles.profileImageContainer}>
          <Image style={styles.image} source={selectedProfilePic} />
          <TouchableOpacity style={styles.editIcon} onPress={() => setModalVisible(true)}>
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: 26, alignSelf: 'center', color: '#D6EFFF' }]}>
          {userData?.username || "N/A"}
        </Text>
        <Text style={styles.userDetail}>Age: {userData?.age || "N/A"}</Text>
        <Text style={styles.userDetail}>Weight: {userData?.weight || "N/A"} kg</Text>
        <Text style={styles.userDetail}>Height: {userData?.height || "N/A"} cm</Text>
        <Text style={styles.userDetail}>Goal: Weight {userData?.goal || "Maintain"}</Text>

        <View style={styles.switchContainer}>
          <Text style={styles.userDetail}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.section}
      onPress={() => router.push('/edit-profile')}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => router.push('/register-trainer')}>
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

      <TouchableOpacity style={[styles.section, styles.logoutSection]} onPress={() => router.push('/')}>
        <Text style={[styles.sectionTitle, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.section, styles.deleteAccountSection]}>
        <Text style={[styles.sectionTitle, styles.deleteText]}>Delete Account</Text>
      </TouchableOpacity>

      {/* Modal for selecting profile picture */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Profile Picture</Text>
            <View style={styles.profilePicOptions}>
              {defaultProfilePics.map((pic, index) => (
                <TouchableOpacity key={index} onPress={() => handleProfilePicSelect(index)}>
                  <Image source={pic} style={styles.optionPic} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  section: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D6EFFF",
  },
  userDetail: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 50,
  },
  profileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#555',
    borderRadius: 15,
    padding: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#2A2A2A",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: "#D6EFFF",
    marginBottom: 15,
  },
  profilePicOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  optionPic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: "#D6EFFF",
    fontSize: 16,
  },
});

export default ProfileScreen;
