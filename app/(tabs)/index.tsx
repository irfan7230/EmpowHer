// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';

// Import Stores and Hooks
import { useAuthStore } from '@/stores/useAuthStore';
import { useSOSStore } from '@/stores/useSOSStore';
import { useTrusteeStore } from '@/stores/useTrusteeStore';
import { useCommunityStore } from '@/stores/useCommunityStore';

// Import Constants & Utilities
import { SAFE_BOTTOM_PADDING } from './_layout';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

// Import Components
import HomeHeader from '@/components/home/HomeHeader';
import SOSButtonSection from '@/components/home/SOSButtonSection';
import SafetyStatusCard from '@/components/home/SafetyStatusCard';
import QuickActionsCard from '@/components/home/QuickActionsCard';
import NetworkStatsCard from '@/components/home/NetworkStatsCard';
import CommunityActivityCard from '@/components/home/CommunityActivityCard';
import VoiceCommandCard from '@/components/home/VoiceCommandCard';
import HomeFAB from '@/components/home/HomeFAB';

const { width } = Dimensions.get('window');

// MOCK DATA FOR TRUSTEE STATUSES (Consider moving to a mock data file)
const mockTrusteesWithStatus = [
    { id: '1', name: 'Jane Doe', isActive: true, profileImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg', status: { id: 's1', image: '...', timestamp: '5m ago' } },
    { id: '2', name: 'John Smith', isActive: true, profileImage: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg', status: null },
    // ... more mock trustees
];

export default function HomeScreen() {
  // Zustand stores
  const { user } = useAuthStore();
  const { sosStatus, activateSOS, isLocationSharing, toggleLocationSharing } = useSOSStore();
  const { trustees, trusteeMessages } = useTrusteeStore();
  const { communityAlerts } = useCommunityStore();

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const insets = useSafeAreaInsets(); // Keep insets here for header padding

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const sosButtonScale = useSharedValue(1);
  const sosButtonPulse = useSharedValue(0);
  const bellShake = useSharedValue(0);
  const fabScale = useSharedValue(0); // FAB entrance animation

  const unreadCount = trusteeMessages.filter(m => !m.isRead).length;

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 18, stiffness: 100 });
    sosButtonPulse.value = withRepeat(withSequence(withTiming(1, { duration: 1500 }), withTiming(0, { duration: 1500 })), -1, true);
    setTimeout(() => { fabScale.value = withSpring(1, { damping: 15, stiffness: 150 }); }, 800); // FAB entrance

    if (unreadCount > 0) {
      bellShake.value = withRepeat(withSequence(withTiming(10), withTiming(-10), withTiming(10), withTiming(0)), 2, true);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [trusteeMessages]); // Depend on trusteeMessages for unread count check

  const handleSOSPress = () => {
    sosButtonScale.value = withSequence(withSpring(0.9), withSpring(1.1), withSpring(1));
    setTimeout(() => {
      if (sosStatus.isActive) {
        Alert.alert('Deactivate SOS', 'An OTP is required...', [{ text: 'Understood' }]);
      } else {
        activateSOS();
        Alert.alert('SOS Activated', 'Your emergency alert has been sent...', [{ text: 'OK' }]);
      }
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'location': toggleLocationSharing(); break;
      case 'check-in': Alert.alert('Safety Check-in', 'Message sent!'); break;
      case 'fake-call': Alert.alert('Fake Call', 'Initiating...'); break;
      case 'ai-help': router.push('/(tabs)/ai-assistant'); break; // Cast if needed
    }
  };

  const handleFABPress = () => {
    fabScale.value = withSequence(withSpring(0.9), withSpring(1));
    router.push('/(tabs)/trustees'); // Cast if needed
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }],
  }));
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [50, 0], [0, 1])
  }));
  const animatedSOSButtonStyle = useAnimatedStyle(() => {
    const isActive = sosStatus.isActive;
    const pulseScale = isActive ? interpolate(sosButtonPulse.value, [0, 1], [1, 1.15]) : interpolate(sosButtonPulse.value, [0, 1], [1, 1.05]);
    const backgroundColor = isActive ? interpolateColor(sosButtonPulse.value, [0, 1], ['#D32F2F', '#FF1744']) : interpolateColor(sosButtonPulse.value, [0, 1], ['#FF7E86', '#FF5A64']); // Use specific colors or map from COLORS
    return { transform: [{ scale: sosButtonScale.value * pulseScale }], backgroundColor, shadowOpacity: interpolate(sosButtonPulse.value, [0, 1], [0.3, 0.6]) };
  });
  const animatedBellStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${bellShake.value}deg` }], }));
  const animatedFABStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }], }));

  const fabBottomPadding = SAFE_BOTTOM_PADDING + moderateScale(16); // Calculate FAB bottom position

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeHeader
        user={user}
        currentTime={currentTime}
        unreadCount={unreadCount}
        animatedHeaderStyle={animatedHeaderStyle}
        animatedBellStyle={animatedBellStyle}
        mockTrusteesWithStatus={mockTrusteesWithStatus}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: fabBottomPadding + moderateScale(64) } // Ensure content scrolls above FAB
        ]}
      >
        <Animated.View style={animatedContentStyle}>
          <SOSButtonSection
            isActive={sosStatus.isActive}
            onPress={handleSOSPress}
            animatedSOSButtonStyle={animatedSOSButtonStyle}
          />
          <SafetyStatusCard
            sosStatus={sosStatus}
            isLocationSharing={isLocationSharing}
            trustees={trustees}
            currentTime={currentTime}
          />
          <QuickActionsCard
            onAction={handleQuickAction}
            isLocationSharing={isLocationSharing}
          />
          <NetworkStatsCard trustees={trustees} />
          <CommunityActivityCard alerts={communityAlerts} />
          <VoiceCommandCard />
        </Animated.View>
      </ScrollView>

      <HomeFAB
        onPress={handleFABPress}
        unreadCount={unreadCount}
        animatedFABStyle={animatedFABStyle}
        bottomPadding={fabBottomPadding}
      />
    </View>
  );
}

// Keep only essential container/layout styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {}, // Keep paddingBottom dynamic
});