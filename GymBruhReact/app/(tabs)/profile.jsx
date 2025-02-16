import React from 'react';
import { View, Text, TouchableOpacity, Switch, Image, ScrollView } from "react-native";
import styles from '../styles/about';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Image style={styles.image} source={require('../default.png')}></Image>
        <Text style={[styles.sectionTitle, {fontSize: 30, alignSelf:'center'}]}>John</Text>
      </View>
      {/* User Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Account</Text>
        <Text style={styles.userDetail}>Name: John Doe</Text>
        <Text style={styles.userDetail}>Age: 28</Text>
        <Text style={styles.userDetail}>Weight: 75kg</Text>
        <Text style={styles.userDetail}>Height: 180cm</Text>
        {/* <Text style={styles.userDetail}>Progress: 70%</Text> */}
        <View style={styles.switchContainer}>
          <Text style={styles.userDetail}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </View>
      </View>

      {/* Register as Trainer Section */}
      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Register as Trainer</Text>
      </TouchableOpacity>

      {/* Premium Section */}
      <TouchableOpacity style={styles.section}>
        <Text style={[styles.sectionTitle, {color: 'gold'}]}>Premium</Text>
      </TouchableOpacity>

      {/* GymBruh Section */}
      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
      </TouchableOpacity>


      {/* Logout and Delete Account Section */}
      <TouchableOpacity style={[styles.section, styles.logoutSection]}>
        <Text style={[styles.sectionTitle, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.section, styles.deleteAccountSection]}>
        <Text style={[styles.sectionTitle, styles.deleteText]}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
