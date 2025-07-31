import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useUser } from "../../context/UserContext";

export default function AdminChallengesScreen() {
    type User = {
        id: number;
        name: string;
        email: string;
    }

    type Team = {
        id: number;
        name: string;
        creator_id: number;
    };

    const { token, userId } = useUser();
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    console.log("Auth token:", token);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            console.log('No token found, abort fetch');
            return; // no token yet, don’t fetch
        }

        const fetchTeamsAndUsers = async () => {
            try {
                const [teamsRes, usersRes] = await Promise.all([
                    fetch('http://localhost:3000/api/v1/teams', {
                        headers: { Authorization: `Bearer ${token}`},
                    }),
                    fetch('http://localhost:3000/api/v1/users', {
                        headers: { Authorization: `Bearer ${token}`},
                    }),
                ]);
                if (!teamsRes.ok) throw new Error('Failed to fetch teams');
                if (!usersRes.ok) throw new Error('Failed to fetch users');

                const teamsData = await teamsRes.json();
                const usersData = await usersRes.json();

                setTeams(teamsData);
                setUsers(usersData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamsAndUsers();
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
            <Text style={styles.title}>Alle Teams</Text>
            <FlatList
                data={teams}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.creator}>Erstellt von: {
                            users.find(user => user.id === item.creator_id)?.name ?? 'Unknown'
                        }</Text>
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
    creator: {
        fontSize: 14,
        color: '#666',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});