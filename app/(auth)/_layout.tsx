// app/(auth)/_layout.tsx
import { Slot } from 'expo-router';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AuthLayout() {
    const year = new Date().getFullYear();

    return (
        <ImageBackground
            source={require('../../assets/images/background1.jpeg')} // ⬅️ adjust if your image lives elsewhere
            style={styles.bg}
            resizeMode="cover"
            blurRadius={1} // optional
        >
            {/* Optional: dark overlay for contrast */}
            <View style={styles.overlay} />

            <StatusBar barStyle="light-content" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeAreaView style={styles.safe}>
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.center}>
                            {/* Brand / Logo */}
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Text style={styles.brand}>StepTogether</Text>
                            </View>

                            {/* Card that hosts each auth screen via <Slot /> */}
                            <View style={styles.card}>
                                <Slot />
                            </View>

                            {/* Footnote */}
                            <Text style={styles.footer}>© {year} StepTogether</Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, width: '100%', height: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,

    },
    safe: { flex: 1 },
    scroll: { flexGrow: 1 },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    brand: {
        fontSize: 42,
        fontWeight: '800',
        color: '#cad5e8ff', // Facebook blue
        letterSpacing: -0.5,
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,

    },
    card: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 12,
        padding: 16,
        // iOS shadow
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        // Android shadow
        elevation: 4,
    },
    footer: { marginTop: 16, color: '#E3E6EA', fontSize: 12, textAlign: 'center' },
});
