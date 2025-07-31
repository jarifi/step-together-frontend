import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function AdminScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}><h1>Admin-Bereich</h1></Text>

            <View style={styles.buttonColumn}>
                <Pressable style={styles.button} onPress={() => router.push('/admin/users')}>
                    <Ionicons name="person-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Benutzer</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => router.push('/admin/challenges')}>
                    <Ionicons name="trophy-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Challenges</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => router.push('/admin/teams')}>
                    <Ionicons name="people-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Teams</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonColumn: {
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'green',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 20, // space between buttons
        width: 200,
    },
    buttonText: {
        marginTop: 8,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
})