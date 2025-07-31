import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
    const [loading, setLoading] = useState(true);

    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!token) {
            console.log('No token found, abort fetch');
            return; // no token yet, don’t fetch
        }

        const fetchTeamsAndUsers = async () => {
            try {
                const [teamsRes, usersRes] = await Promise.all([
                    fetch('http://localhost:3000/api/v1/teams', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch('http://localhost:3000/api/v1/users', {
                        headers: { Authorization: `Bearer ${token}` },
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

    const openUserModal = (team: Team) => {
        setSelectedTeam(team);
        setModalVisible(true);
    };

    const closeUserModal = () => {
        setModalVisible(false);
        setSelectedTeam(null);
    };


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
                    <Pressable onPress={() => openUserModal(item)} style={styles.userItem}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.creator}>Erstellt von: {
                            users.find(user => user.id === item.creator_id)?.name ?? 'Unknown'
                        }</Text>
                    </Pressable>
                )}
            />
            <Modal
                visible={modalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={closeUserModal}
            >

                <Pressable style={styles.modalBackground} onPress={closeUserModal}>

                    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Team Details</Text>
                        {selectedTeam && (
                            <>
                                <Text style={styles.modalText}><strong>Name:</strong> {selectedTeam.name}</Text>
                                <Text style={styles.modalText}><strong>Ersteller:</strong> {
                                    users.find(user => user.id === selectedTeam.creator_id)?.name ?? 'Unknown'
                                }</Text>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalText: {
        fontSize: 18,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#1e604c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});