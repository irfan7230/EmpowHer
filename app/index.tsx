import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { View, StyleSheet } from 'react-native';
import SplashScreen from '@/components/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  AsyncStorage.clear();

  
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  
  // Get auth state from Zustand store
  const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuthStore();

  const handleSplashComplete = useCallback(() => {
    console.log('Splash screen animation completed');
    setShowSplash(false);
  }, []);

  const navigateToNextScreen = useCallback(() => {
    if (isNavigating || isLoading) return;
    
    setIsNavigating(true);
    
    try {
      console.log('Navigation State:', { 
        isAuthenticated, 
        hasSeenOnboarding,
        segments: segments.join('/') 
      });

      // Determine next screen based on auth state
      if (!hasSeenOnboarding) {
        // First time user - show onboarding
        console.log('→ Navigating to onboarding');
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        // Returning user but not authenticated - show login
        console.log('→ Navigating to login');
        router.replace('/login');
      } else {
        // Authenticated user - go to main app
        console.log('→ Navigating to main app');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to login on error
      router.replace('/login');
    } finally {
      // Reset navigation flag after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  }, [isAuthenticated, hasSeenOnboarding, isLoading, router, isNavigating, segments]);

  // Handle navigation after splash screen
  useEffect(() => {
    if (!showSplash && !isNavigating && !isLoading) {
      const navigationTimer = setTimeout(navigateToNextScreen, 300);
      return () => clearTimeout(navigationTimer);
    }
  }, [showSplash, navigateToNextScreen, isNavigating, isLoading]);

  // Show splash screen while initializing
  if (showSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  // Show loading state while navigating
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFB3BA',
  },
});