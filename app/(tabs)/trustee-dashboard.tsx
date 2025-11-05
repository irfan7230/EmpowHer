// app/(tabs)/trustee-dashboard.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolateColor,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

// Import Constants & Utilities
import { SAFE_BOTTOM_PADDING } from './_layout';
import { verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

// Import Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardInactiveState from '@/components/dashboard/DashboardInactiveState';
import ActiveAlertHeader from '@/components/dashboard/ActiveAlertHeader';
import LiveStreamSection from '@/components/dashboard/LiveStreamSection';
import LocationCard from '@/components/dashboard/LocationCard';
import EvidenceStatusCard from '@/components/dashboard/EvidenceStatusCard';
import DashboardActionButtons from '@/components/dashboard/DashboardActionButtons';
import OTPModal from '@/components/dashboard/OTPModal';

// Redefine AppState interface locally if useAppState doesn't provide specific types
interface DashboardAppState {
  sosStatus: {
    isActive: boolean;
    startTime: Date | null;
    location?: {
      address?: string;
    };
  };
  deactivateSOS: () => void;
  // user: any; // Add if user data is needed
}

export default function TrusteeDashboardScreen() {
  // Cast useAppState result if necessary for stricter typing
  const { sosStatus, deactivateSOS } = useAppState() as DashboardAppState;
  const [isResponding, setIsResponding] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Animation values
  const pulseAnimation = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const modalScale = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const streamPulse = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const audioPulse = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 90 });

    if (sosStatus.isActive) {
      pulseAnimation.value = withRepeat(withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1, false);
      streamPulse.value = withRepeat(withSequence(withTiming(1, { duration: 1500 }), withTiming(0, { duration: 1500 })), -1, false);
      audioPulse.value = withRepeat(withSequence(withTiming(1, { duration: 600 }), withTiming(0, { duration: 600 })), -1, false);
    } else {
      pulseAnimation.value = withTiming(0);
      streamPulse.value = withTiming(0);
      audioPulse.value = withTiming(0);
    }
     // Cleanup function
     return () => {
        pulseAnimation.value = 0;
        streamPulse.value = 0;
        audioPulse.value = 0;
     }
  }, [sosStatus.isActive]);

  // Modal animation control
  useEffect(() => {
    if (showOTPModal) {
      modalScale.value = withSpring(1, { damping: 15, stiffness: 120 });
    } else {
      // Don't reset immediately, let the close animation run
    }
  }, [showOTPModal]);

  const handleRespondingSOS = useCallback(() => {
    buttonScale.value = withSequence(withSpring(0.95), withSpring(1));
    setIsResponding(true);
    Alert.alert('Response Sent', 'Your response has been sent to Jessica. She will see that help is on the way.', [{ text: 'OK' }]);
  }, [buttonScale]);

  const handleDeactivateSOS = useCallback(() => setShowOTPModal(true), []);

  const handleOTPSubmit = useCallback(() => {
    if (otpCode === '123456') { // TODO: Replace with real OTP validation
      deactivateSOS();
      setIsResponding(false); // Reset responding state as well
      // Animate modal out before setting state
      modalScale.value = withTiming(0, { duration: 200 });
      setTimeout(() => {
        setShowOTPModal(false);
        setOtpCode(''); // Reset OTP after modal is hidden
        Alert.alert('Success', 'SOS has been deactivated safely.');
      }, 200);
    } else {
      Alert.alert('Invalid OTP', 'Please enter the correct 6-digit code.');
      setOtpCode(''); // Clear incorrect OTP
    }
  }, [otpCode, deactivateSOS, modalScale]);

  const handleCancelOTP = useCallback(() => {
    // Animate modal out before setting state
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowOTPModal(false);
      setOtpCode(''); // Reset OTP after modal is hidden
    }, 200);
  }, [modalScale]);


  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }],
  }));
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [30, 0], [0, 1]),
  }));
  const animatedAlertStyle = useAnimatedStyle(() => ({ // For active header pulse
    backgroundColor: sosStatus.isActive ? interpolateColor(pulseAnimation.value, [0, 1], ['#FEF2F2', '#FEE2E2']) : COLORS.background,
  }));
  const animatedButtonStyle = useAnimatedStyle(() => ({ // For respond button press
    transform: [{ scale: buttonScale.value }],
  }));
  const animatedModalStyle = useAnimatedStyle(() => ({ // For OTP modal entry/exit
    transform: [{ scale: modalScale.value }],
    opacity: modalScale.value, // Link opacity to scale
  }));
  const animatedStreamStyle = useAnimatedStyle(() => ({ // For live stream border pulse
    borderColor: sosStatus.isActive ? interpolateColor(streamPulse.value, [0, 1], [COLORS.primary, COLORS.secondary]) : COLORS.borderDark,
  }));

  // Create audio bar styles array (remains in main component as it depends on audioPulse)
  const audioBarStyles = Array.from({ length: 5 }).map((_, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAnimatedStyle(() => {
      const baseHeights = [12, 20, 8, 16, 14];
      const baseHeight = baseHeights[index % 5];
      const interpolationRanges = [
        [baseHeight, baseHeight * 1.5, baseHeight],
        [baseHeight * 1.2, baseHeight, baseHeight * 1.3],
        [baseHeight, baseHeight * 1.6, baseHeight * 0.8],
        [baseHeight * 1.1, baseHeight * 0.7, baseHeight * 1.4],
        [baseHeight * 0.9, baseHeight * 1.7, baseHeight],
      ];
      const range = interpolationRanges[index % 5];

      const animatedHeight = sosStatus.isActive
        ? interpolate(audioPulse.value, [0, 0.5, 1], range)
        : baseHeight;
      const animatedOpacity = sosStatus.isActive
        ? interpolate(audioPulse.value, [0, 1], index === 2 ? [0.6, 1] : [0.5, 0.9])
        : 0.5;

      return { height: animatedHeight, opacity: animatedOpacity };
    });
  });


  // Render Inactive State
  if (!sosStatus.isActive) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <DashboardHeader animatedHeaderStyle={animatedHeaderStyle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(40) }]}
          bounces={true}
        >
          <DashboardInactiveState animatedContentStyle={animatedContentStyle} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render Active State
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ActiveAlertHeader
        animatedAlertStyle={animatedAlertStyle}
        animatedHeaderStyle={animatedHeaderStyle}
        startTime={sosStatus.startTime}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust as needed
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContentActive, { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(40) }]}
          bounces={true}
        >
          <Animated.View style={animatedContentStyle}>
            <LiveStreamSection
              animatedStreamStyle={animatedStreamStyle}
              audioBarStyles={audioBarStyles}
            />

            <View style={styles.infoSection}>
              <LocationCard address={sosStatus.location?.address} />
              <EvidenceStatusCard />
              {/* Add other info cards here if needed */}
            </View>

            <DashboardActionButtons
              isResponding={isResponding}
              onRespond={handleRespondingSOS}
              onCall={() => Alert.alert('Calling', 'Calling Jessica...')} // Simple handler
              onDeactivate={handleDeactivateSOS}
              animatedButtonStyle={animatedButtonStyle}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP Modal Render */}
      <OTPModal
        visible={showOTPModal}
        otpCode={otpCode}
        setOtpCode={setOtpCode}
        onClose={handleCancelOTP}
        onSubmit={handleOTPSubmit}
        animatedModalStyle={animatedModalStyle}
      />
    </SafeAreaView>
  );
}

// Keep only essential container/layout styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: { // For inactive state
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  scrollContentActive: { // For active state
    flexGrow: 1,
    paddingTop: verticalScale(16),
  },
  infoSection: { // Container for Location & Evidence cards
    paddingHorizontal: scale(20),
    gap: verticalScale(16),
    marginBottom: verticalScale(20),
  },
});


