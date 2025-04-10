import { useEffect } from 'react';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext';

export default function SuccessPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { session_id } = useLocalSearchParams();

  useEffect(() => {
    const confirmAndUpdate = async () => {
      try {
        if (!session_id) {
          console.warn("No session ID");
          return;
        }

        // Optionally: confirm session status from your backend
        // const res = await fetch(`https://your-ngrok-url.ngrok.io/verify-session?session_id=${sessionId}`);
        // const sessionData = await res.json();

        // Update Firestore
        if (!user) throw new Error("User not authenticated");

        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          isPremium: true,
          stripeSessionId: session_id,
        });

        console.log(userRef.isPremium, 'ADSFDASF');

        // Navigate to a premium page or show confirmation
        setTimeout(() => {
          router.push('/profile');
        }, 500);
      } catch (err) {
        console.error(err);
      }
    };

    confirmAndUpdate();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1C' }}>
      <Text style={{ color: '#D6EFFF', fontSize: 18 }}>Payment Successful 🎉</Text>
      <ActivityIndicator style={{ marginTop: 20 }} color="#D6EFFF" />
      <Link href="/(tabs)/profile">Profile</Link>
    </View>
  );
}
