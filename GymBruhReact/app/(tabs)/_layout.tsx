import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const color = '#664ac1';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workouts',
          tabBarIcon: () => <Ionicons name='barbell-outline' size={29} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="sesh"
        options={{
          title: 'Sessions',
          tabBarIcon: () => <Ionicons name='list-outline' size={29} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: () => <Ionicons name='pizza-outline' size={29} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <Ionicons name='person-outline' size={29} color={color}/>,
        }}
      />
    </Tabs>
  );
}
