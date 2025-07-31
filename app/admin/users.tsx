import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useUser } from "../../context/UserContext";
import { styles } from './style';

export default function AdminUsersScreen() {
    type User = {
        id: number;
        name: string;
        email: string;
        step_length: number;
    };

    const { token, userId } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    const openUserModal = (user: User) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const closeUserModal = () => {
        setModalVisible(false);
        setSelectedUser(null);
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
            <Text style={styles.title}>Alle Benutzer</Text>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => openUserModal(item)} style={styles.userItem}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.subname}>{item.email}</Text>
                        </Pressable>
                    )}
                    ListFooterComponent={
                        <View style={styles.addButtonContainer}>
                            <Pressable style={styles.addButton} onPress={() => console.log("Add new user")}>
                                <Text style={styles.addButtonText}>+</Text>
                            </Pressable>
                        </View>
                    }
                />
            </View>

            <Modal
                visible={modalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={closeUserModal}
            >

                <Pressable style={styles.modalBackground} onPress={closeUserModal}>

                    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Benutzer Details</Text>
                        {selectedUser && (
                            <>
                                <Text style={styles.modalText}><strong>Name:</strong> {selectedUser.name}</Text>
                                <Text style={styles.modalText}><strong>E-Mail:</strong> {selectedUser.email}</Text>
                                <Text style={styles.modalText}><strong>Schrittlänge:</strong> {selectedUser.step_length}</Text>

                                <View style={styles.buttonContainer}>
                                    <Pressable style={styles.button}>
                                        <Text style={styles.buttonText}>Bearbeiten</Text>
                                    </Pressable>
                                    <Pressable style={styles.button}>
                                        <Text style={styles.buttonText}>Löschen</Text>
                                    </Pressable>
                                    <Pressable style={styles.button} onPress={closeUserModal}>
                                        <Text style={styles.buttonText}>Schließen</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
