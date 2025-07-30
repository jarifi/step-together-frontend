import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import WelcomeCard from '../components/WelcomeCard';
import { useUser } from '../context/UserContext';
import { getToken, getUserId } from '../lib/auth';

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

console.log("ARIFI " + API_BASE_URL);

interface SchrittLog {
  datum: string;
  anzahlSchritte: number;
}

interface TeamMemberView {
  id: number;
  name: string;
  steps: number;
}

export default function HomeScreen() {
  const { setUser } = useUser();
  const [user, setUserLocal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const token = await getToken();
        const userId = await getUserId();

        if (!token || !userId) return;
        const headers = { Authorization: `Bearer ${token}` };
        const userRes = await fetch(`${API_BASE_URL}/users/${userId}`, { headers });
        const userData = await userRes.json();
        setUser(userData); // Context
        setUserLocal(userData); // Lokaler State
      } catch (err) {
        console.error('Fehler beim Laden:', err);
        Alert.alert('Fehler', 'Dashboard konnte nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#1b5e20" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WelcomeCard name={user?.name} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logoutBtn: { marginTop: 30 },
});



