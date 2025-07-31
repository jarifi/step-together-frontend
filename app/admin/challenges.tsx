import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useUser } from "../../context/UserContext";
import { styles } from './style';

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
            
            <View style={{ flex: 1 }}>
            <FlatList
                data={challenges}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable style={styles.userItem} onPress={() => openUserModal(item)}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.subname}>{item.start_location}</Text>
                        <Text style={styles.subname}>{item.target_location}</Text>
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
