import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useUser } from "../../context/UserContext";

export default function AdminChallengesScreen() {
    type Challenge = {
        id: number;
        name: string;
        start_location: string;
        target_location: string;
        distance: number;
        start_date: Date;
        end_date: Date;
    };

    const { token, userId } = useUser();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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

                const parsedData = data.map((item: any) => ({
                    ...item,
                    start_date: new Date(item.start_date),
                    end_date: new Date(item.end_date),
                })); 

                setChallenges(parsedData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [token]);


    const openUserModal = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setModalVisible(true);
    };

    const closeUserModal = () => {
        setModalVisible(false);
        setSelectedChallenge(null);
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
            <Text style={styles.title}>Alle Challenges</Text>
            <FlatList
                data={challenges}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable style={styles.userItem} onPress={() => openUserModal(item)}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.location}>{item.start_location}</Text>
                        <Text style={styles.location}>{item.target_location}</Text>
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
                        <Text style={styles.modalTitle}>Challenge Details</Text>
                        {selectedChallenge && (
                            <>
                                <Text style={styles.modalText}><strong>Name:</strong> {selectedChallenge.name}</Text>
                                <Text style={styles.modalText}><strong>Startort:</strong> {selectedChallenge.start_location}</Text>
                                <Text style={styles.modalText}><strong>Zielort:</strong> {selectedChallenge.target_location}</Text>
                                <Text style={styles.modalText}><strong>Entfernung:</strong> {selectedChallenge.distance}</Text>
                                <Text style={styles.modalText}><strong>Startdatum:</strong> {selectedChallenge.start_date.toLocaleDateString('de-DE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</Text>
                                <Text style={styles.modalText}><strong>Enddatum:</strong> {selectedChallenge.end_date.toLocaleDateString('de-DE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</Text>
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
    location: {
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