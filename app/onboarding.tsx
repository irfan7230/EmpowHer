// app/onboarding.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Shield, Users, MessageCircle, Heart, Phone, MapPin } from 'lucide-react-native';

// Import Store
import { useAuthStore } from '@/stores/useAuthStore';

// Import Components
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingSlideContent from '@/components/onboarding/OnboardingSlideContent';
import OnboardingPagination from '@/components/onboarding/OnboardingPagination';
import OnboardingNavigation from '@/components/onboarding/OnboardingNavigation';
import DecorativeBackground from '@/components/onboarding/DecorativeBackground';

// Import Constants & Utilities
import { moderateScale, scale } from '@/utils/scaling'; // Assuming this exists
// Keep responsive config local or move to constants
const config = {
    horizontalPadding: moderateScale(44), // Example value, adjust as needed
};

// Onboarding Data (Keep local or move to constants)
const onboardingData = [
  { id: 1, icon: Shield, title: 'Your Safety First', subtitle: 'Advanced Protection System', description: 'Instant SOS alerts...', primaryColor: '#FFB3BA', secondaryColor: '#FF8A95', accentColor: '#FFC1C6', backgroundColor: '#FFF8F9', decorativeIcons: [Phone, MapPin], },
  { id: 2, icon: Users, title: 'Trusted Network', subtitle: 'Community Support System', description: 'Build your circle of trust...', primaryColor: '#FFB3BA', secondaryColor: '#FF8A95', accentColor: '#FFC1C6', backgroundColor: '#FFF8F9', decorativeIcons: [Heart, Users], },
  { id: 3, icon: MessageCircle, title: 'Smart Assistant', subtitle: '24/7 AI Companion', description: 'AI-powered support...', primaryColor: '#FFB3BA', secondaryColor: '#FF8A95', accentColor: '#FFC1C6', backgroundColor: '#FFF8F9', decorativeIcons: [MessageCircle, Shield], },
];


export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useAuthStore();
  const router = useRouter();

  // Animation values
  const opacity = useSharedValue(1);
  const scaleAnim = useSharedValue(1); // Renamed to avoid conflict
  const iconScale = useSharedValue(1);
  const floatingY = useSharedValue(0);
  const decorativeOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1); // For background fade

  useEffect(() => {
    // Reset animations on index change before starting new ones
    opacity.value = 1;
    scaleAnim.value = 1;
    iconScale.value = 1;
    backgroundOpacity.value = 1;

    // Subtle floating animation
    floatingY.value = withRepeat(withSequence(withTiming(-8), withTiming(8)), -1, true);
    // Decorative elements animation
    decorativeOpacity.value = withRepeat(withSequence(withTiming(0.6), withTiming(0.3)), -1, true);
    // Progress animation
    progressWidth.value = withTiming((currentIndex + 1) / onboardingData.length, { duration: 600 });

    // Cleanup animations on unmount or index change if needed
    return () => {
        // You might want to cancel animations here if behavior is complex
    }

  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      // Exit animation
      scaleAnim.value = withSpring(0.95);
      opacity.value = withTiming(0.7, { duration: 150 });
      iconScale.value = withSpring(0.8);
      backgroundOpacity.value = withTiming(0.8, { duration: 150 }); // Fade background slightly

      setTimeout(() => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
        // Entrance is handled by useEffect triggering on currentIndex change
      }, 150);
    } else {
      completeOnboarding();
      router.replace('/login');
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
       // Exit animation
       scaleAnim.value = withSpring(0.95);
       opacity.value = withTiming(0.7, { duration: 150 });
       iconScale.value = withSpring(0.8);
       backgroundOpacity.value = withTiming(0.8, { duration: 150 });

      setTimeout(() => {
        runOnJS(setCurrentIndex)(currentIndex - 1);
        // Entrance handled by useEffect
      }, 150);
    }
  };

  const skip = () => {
    completeOnboarding();
    router.replace('/login');
  };

  const goToSlide = (index: number) => {
      if (index !== currentIndex) {
          // You might want similar exit/entrance animations as next/prev
          setCurrentIndex(index);
      }
  };

  // Animated styles
  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scaleAnim.value }],
  }));
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: floatingY.value }],
  }));
  const animatedDecorativeStyle = useAnimatedStyle(() => ({ opacity: decorativeOpacity.value }));
  const animatedProgressStyle = useAnimatedStyle(() => ({ width: `${progressWidth.value * 100}%` }));
  const animatedBackgroundStyle = useAnimatedStyle(() => ({ opacity: backgroundOpacity.value }));

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={currentSlide.backgroundColor} translucent />

      <DecorativeBackground
          slideData={currentSlide}
          animatedBackgroundStyle={animatedBackgroundStyle}
          animatedDecorativeStyle={animatedDecorativeStyle}
       />

      <SafeAreaView style={styles.safeArea}>
        <View style={{ paddingHorizontal: config.horizontalPadding }}>
            <OnboardingHeader
              currentIndex={currentIndex}
              totalSlides={onboardingData.length}
              skip={skip}
              animatedProgressStyle={animatedProgressStyle}
              currentSlideColors={currentSlide}
            />
        </View>

        <OnboardingSlideContent
          slideData={currentSlide}
          animatedIconStyle={animatedIconStyle}
          animatedContentStyle={animatedContentStyle}
        />

        <OnboardingPagination
          totalSlides={onboardingData.length}
          currentIndex={currentIndex}
          goToSlide={goToSlide}
          currentSlideColors={currentSlide}
        />

         <View style={{ paddingHorizontal: config.horizontalPadding }}>
             <OnboardingNavigation
               currentIndex={currentIndex}
               totalSlides={onboardingData.length}
               prevSlide={prevSlide}
               nextSlide={nextSlide}
               currentSlideColors={currentSlide}
             />
         </View>
      </SafeAreaView>
    </View>
  );
}

// Keep only essential container styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between', // Push header/nav to top/bottom
  },
  // Remove component-specific styles now that they are in separate files
});