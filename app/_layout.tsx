import { router, Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import { isLoggedIn } from '../lib/auth';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '../context/UserContext';
import { useColorScheme } from '../hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const [authChecked, setAuthChecked] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();

      if (!loggedIn && pathname !== '/login') {
        router.replace('/login');
      } else {
        setShowSidebar(loggedIn && pathname !== '/login');
      }

      setAuthChecked(true);
    };
    checkAuth();
  }, [pathname]);

  if (!authChecked) return null;

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {showSidebar && <Sidebar />}
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}
