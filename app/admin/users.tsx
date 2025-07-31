import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useUser } from "../../context/UserContext";

export default function AdminUsersScreen() {
    type User = {
        id: number;
        name: string;
        email: string;
    };

    const { token, userId } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    console.log("Auth token:", token);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            console.log('No token found, abort fetch');
            return; // no token yet, don’t fetch
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch users');

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
            <Text style={styles.title}>Alle Benutzer</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.email}>{item.email}</Text>
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
    email: {
        fontSize: 14,
        color: '#666',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});