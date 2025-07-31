// app/(auth)/login.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { useUser } from '../../context/UserContext';
import { saveToken, saveUserId } from '../../lib/auth';

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function LoginScreen() {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('StrongPassword123');
  const { setUser, setToken, setUserId } = useUser();

  const handleLogin = async () => {
    const url = `${API_BASE_URL}/auth/login`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Prefer FastAPI's `detail` over `message` for errors
      const data = await response.json().catch(() => ({} as any));
      if (!response.ok) {
        const msg = data?.detail || data?.message || 'Login fehlgeschlagen';
        throw new Error(msg);
      }

      // Be flexible: FastAPI returns access_token; user_id may be absent
      const token =
        data?.access_token ??
        data?.accessToken ??
        data?.token ??
        null;

      if (!token) {
        throw new Error('Token fehlt in der Antwort');
      }

      const userId =
        data?.user_id ??
        data?.userId ??
        data?.user?.id ??
        null;

      // Persist & set state
      await saveToken(token);
      setToken(token);

      if (userId != null) {
        await saveUserId(String(userId));
        setUserId(String(userId));
      }

      if (data?.user) {
        setUser(data.user);
      }

      // If you use an (app) group: router.replace('/(app)/home')
      router.replace('/home');
    } catch (err: any) {
      console.error('Login-Fehler:', err?.message ?? err);
      Alert.alert('Fehler', err?.message ?? 'Unbekannter Fehler');
    }
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}></Text>

        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Passwort"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Einloggen</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: 'rgba(5, 5, 5, 0.75)',
    padding: 24,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    width: '100%',
    maxWidth: 400,

  },
  title: { fontSize: 26, color: '#fff', textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  input: {

    color: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: { backgroundColor: '#1e604c', paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
