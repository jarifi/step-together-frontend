import { Stack } from "expo-router";

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerBackVisible: false,
                headerShown: false,
            }}
        />
    );
}