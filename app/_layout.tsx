import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/stores/useAuthStore';

// Prevent auto-hide of splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  // Initialize auth store on app load
  const { isLoading } = useAuthStore();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      // Hide splash screen when fonts are loaded and auth is initialized
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* Entry point - handles routing logic */}
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        
        {/* Onboarding flow */}
        <Stack.Screen 
          name="onboarding" 
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        
        {/* Authentication */}
        <Stack.Screen 
          name="login" 
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        
        {/* Main app with tabs */}
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Add (screens) group */}
        <Stack.Screen 
          name="(screens)" 
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        
        {/* Trustee Messenger */}
        <Stack.Screen 
          name="trustee-messenger" 
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        
        {/* 404 - Not found */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}