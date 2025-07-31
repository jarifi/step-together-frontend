import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useUser } from "../../context/UserContext";

export default function AdminChallengesScreen() {
    type Challenge = {
        id: number;
        name: string;
        start_location: string;
        target_location: string;
    };

    const { token, userId } = useUser();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    console.log("Auth token:", token);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            console.log('No token found, abort fetch');
            return; // no token yet, don’t fetch
        }

        const fetchChallenges = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/challenges', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch challenges');

                const data = await response.json();
                setChallenges(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [token]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alle Challenges</Text>
            <FlatList
                data={challenges}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.location}>{item.start_location}</Text>
                        <Text style={styles.location}>{item.target_location}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    userItem: {
        padding: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});