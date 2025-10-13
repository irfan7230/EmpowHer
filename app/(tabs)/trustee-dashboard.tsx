import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { 
  TriangleAlert as AlertTriangle, 
  MapPin, 
  Clock, 
  Video, 
  Mic, 
  Car, 
  Shield, 
  Key, 
  Phone, 
  Navigation, 
  Eye, 
  Volume2, 
  Camera, 
  Users,
  Zap,
  Activity,
  CheckCircle,
  X
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolateColor,
  withRepeat,
  withTiming,
  interpolate,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  BounceIn,
  ZoomIn,
} from 'react-native-reanimated';
import { SAFE_BOTTOM_PADDING } from './_layout';

const { width, height } = Dimensions.get('window');

// Enhanced responsive scaling
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.3);
  return Math.round(size * limitedScale);
};

const verticalScale = (size: number) => {
  const baseHeight = 812;
  const scaleFactor = height / baseHeight;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.2);
  return Math.round(size * limitedScale);
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Device detection
const isTablet = width >= 768;

// Theme colors
const COLORS = {
  primary: '#FFB3BA',
  primaryDark: '#FF8A95',
  primaryLight: '#FFF0F0',
  secondary: '#FF6B9D',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#F3F4F6',
  borderDark: '#E5E7EB',
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#FF6347',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',
  info: '#6366F1',
  infoLight: '#E0E7FF',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
};

interface SOSStatus {
  isActive: boolean;
  startTime: Date | null;
  location?: {
    address?: string;
  };
}

interface AppState {
  sosStatus: SOSStatus;
  deactivateSOS: () => void;
  user: any;
}

export default function TrusteeDashboardScreen() {
  const { sosStatus, deactivateSOS } = useAppState() as AppState;
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

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 90 });
    
    if (sosStatus.isActive) {
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        false
      );
      
      streamPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      );

      audioPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      pulseAnimation.value = withTiming(0);
      streamPulse.value = withTiming(0);
      audioPulse.value = withTiming(0);
    }
  }, [sosStatus.isActive]);

  React.useEffect(() => {
    if (showOTPModal) {
      modalScale.value = withSpring(1, { damping: 15, stiffness: 120 });
    } else {
      modalScale.value = withSpring(0, { damping: 15, stiffness: 120 });
    }
  }, [showOTPModal]);

  const handleRespondingSOS = useCallback(() => {
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    
    setIsResponding(true);
    Alert.alert(
      'Response Sent',
      'Your response has been sent to Jessica. She will see that help is on the way.',
      [{ text: 'OK' }]
    );
  }, [buttonScale]);

  const handleDeactivateSOS = useCallback(() => {
    setShowOTPModal(true);
  }, []);

  const handleOTPSubmit = useCallback(() => {
    if (otpCode === '123456') {
      deactivateSOS();
      setIsResponding(false);
      setShowOTPModal(false);
      setOtpCode('');
      Alert.alert('Success', 'SOS has been deactivated safely.');
    } else {
      Alert.alert('Invalid OTP', 'Please enter the correct 6-digit code.');
    }
  }, [otpCode, deactivateSOS]);
  
  const handleCancelOTP = useCallback(() => {
    setShowOTPModal(false);
    setOtpCode('');
  }, []);

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) },
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [30, 0], [0, 1]),
  }));

  const animatedAlertStyle = useAnimatedStyle(() => {
    const backgroundColor = sosStatus.isActive
      ? interpolateColor(pulseAnimation.value, [0, 1], ['#FEF2F2', '#FEE2E2'])
      : COLORS.background;
    
    return { backgroundColor };
  });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalScale.value,
  }));

  const animatedStreamStyle = useAnimatedStyle(() => ({
    borderColor: sosStatus.isActive 
      ? interpolateColor(streamPulse.value, [0, 1], [COLORS.primary, COLORS.secondary])
      : COLORS.borderDark,
  }));

  // Pre-create all audio bar animated styles (FIX for hooks issue)
  const audioBar0Style = useAnimatedStyle(() => {
    const baseHeight = 12;
    const animatedHeight = sosStatus.isActive
      ? interpolate(
          audioPulse.value,
          [0, 0.5, 1],
          [baseHeight, baseHeight * 1.5, baseHeight]
        )
      : baseHeight;
    
    return {
      height: animatedHeight,
      opacity: sosStatus.isActive 
        ? interpolate(audioPulse.value, [0, 1], [0.7, 1])
        : 0.5,
    };
  });

  const audioBar1Style = useAnimatedStyle(() => {
    const baseHeight = 20;
    const animatedHeight = sosStatus.isActive
      ? interpolate(
          audioPulse.value,
          [0, 0.5, 1],
          [baseHeight * 1.2, baseHeight, baseHeight * 1.3]
        )
      : baseHeight;
    
    return {
      height: animatedHeight,
      opacity: sosStatus.isActive 
        ? interpolate(audioPulse.value, [0, 1], [0.7, 1])
        : 0.5,
    };
  });

  const audioBar2Style = useAnimatedStyle(() => {
    const baseHeight = 8;
    const animatedHeight = sosStatus.isActive
      ? interpolate(
          audioPulse.value,
          [0, 0.5, 1],
          [baseHeight, baseHeight * 1.5, baseHeight]
        )
      : baseHeight;
    
    return {
      height: animatedHeight,
      opacity: sosStatus.isActive 
        ? interpolate(audioPulse.value, [0, 1], [0.7, 1])
        : 0.5,
    };
  });

  const audioBar3Style = useAnimatedStyle(() => {
    const baseHeight = 16;
    const animatedHeight = sosStatus.isActive
      ? interpolate(
          audioPulse.value,
          [0, 0.5, 1],
          [baseHeight * 1.2, baseHeight, baseHeight * 1.3]
        )
      : baseHeight;
    
    return {
      height: animatedHeight,
      opacity: sosStatus.isActive 
        ? interpolate(audioPulse.value, [0, 1], [0.7, 1])
        : 0.5,
    };
  });

  const audioBar4Style = useAnimatedStyle(() => {
    const baseHeight = 14;
    const animatedHeight = sosStatus.isActive
      ? interpolate(
          audioPulse.value,
          [0, 0.5, 1],
          [baseHeight, baseHeight * 1.5, baseHeight]
        )
      : baseHeight;
    
    return {
      height: animatedHeight,
      opacity: sosStatus.isActive 
        ? interpolate(audioPulse.value, [0, 1], [0.7, 1])
        : 0.5,
    };
  });

  // Create an array to easily access them by index
  const audioBarStyles = [
    audioBar0Style,
    audioBar1Style,
    audioBar2Style,
    audioBar3Style,
    audioBar4Style,
  ];

  if (!sosStatus.isActive) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.View style={[styles.header, animatedHeaderStyle]}>
          <Text style={styles.title}>Trustee Dashboard</Text>
          <Text style={styles.subtitle}>Monitor and respond to emergency alerts</Text>
        </Animated.View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(40) }
          ]}
          bounces={true}
        >
          <Animated.View 
            style={[styles.inactiveContainer, animatedContentStyle]}
            entering={FadeInUp.delay(300)}
          >
            <Animated.View 
              style={styles.inactiveIconContainer}
              entering={BounceIn.delay(500)}
            >
              <Shield size={moderateScale(72)} color={COLORS.success} strokeWidth={2} />
            </Animated.View>
            <Text style={styles.inactiveTitle}>All Safe & Secure</Text>
            <Text style={styles.inactiveSubtitle}>
              No active emergencies. You'll be instantly notified when someone in your network needs help.
            </Text>
            
            <Animated.View 
              style={styles.featuresCard}
              entering={FadeInUp.delay(700)}
            >
              <View style={styles.featuresHeader}>
                <Shield size={moderateScale(20)} color={COLORS.primaryDark} strokeWidth={2.5} />
                <Text style={styles.featuresTitle}>Trustee Capabilities</Text>
              </View>
              <View style={styles.featuresList}>
                <Animated.View 
                  style={styles.featureItem}
                  entering={SlideInRight.delay(800)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: COLORS.infoLight }]}>
                    <Eye size={moderateScale(14)} color={COLORS.info} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.featureText}>Live video & audio streaming</Text>
                </Animated.View>
                <Animated.View 
                  style={styles.featureItem}
                  entering={SlideInRight.delay(900)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: COLORS.successLight }]}>
                    <MapPin size={moderateScale(14)} color={COLORS.success} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.featureText}>Real-time location tracking</Text>
                </Animated.View>
                <Animated.View 
                  style={styles.featureItem}
                  entering={SlideInRight.delay(1000)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: COLORS.errorLight }]}>
                    <Key size={moderateScale(14)} color={COLORS.error} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.featureText}>Secure OTP deactivation</Text>
                </Animated.View>
                <Animated.View 
                  style={styles.featureItem}
                  entering={SlideInRight.delay(1100)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: COLORS.primaryLight }]}>
                    <Users size={moderateScale(14)} color={COLORS.primaryDark} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.featureText}>Coordinate with other trustees</Text>
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.View 
              style={styles.quickStats}
              entering={FadeInUp.delay(1200)}
            >
              <View style={styles.quickStatItem}>
                <View style={[styles.quickStatIcon, { backgroundColor: COLORS.successLight }]}>
                  <Activity size={moderateScale(16)} color={COLORS.success} strokeWidth={2.5} />
                </View>
                <Text style={styles.quickStatValue}>24/7</Text>
                <Text style={styles.quickStatLabel}>Monitoring</Text>
              </View>
              <View style={styles.quickStatItem}>
                <View style={[styles.quickStatIcon, { backgroundColor: COLORS.infoLight }]}>
                  <Zap size={moderateScale(16)} color={COLORS.info} strokeWidth={2.5} />
                </View>
                <Text style={styles.quickStatValue}>2.1m</Text>
                <Text style={styles.quickStatLabel}>Avg Response</Text>
              </View>
              <View style={styles.quickStatItem}>
                <View style={[styles.quickStatIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <CheckCircle size={moderateScale(16)} color={COLORS.primaryDark} strokeWidth={2.5} />
                </View>
                <Text style={styles.quickStatValue}>98.7%</Text>
                <Text style={styles.quickStatLabel}>Success Rate</Text>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.alertHeader, animatedAlertStyle, animatedHeaderStyle]}>
        <View style={styles.alertTitleContainer}>
          <View style={styles.alertIconContainer}>
            <AlertTriangle size={moderateScale(28)} color={COLORS.error} strokeWidth={2.5} />
          </View>
          <View style={styles.alertTitleInfo}>
            <Text style={styles.alertTitle}>🚨 EMERGENCY ACTIVE</Text>
            <Text style={styles.alertSubtitle}>Jessica Wilson needs immediate help</Text>
          </View>
        </View>
        
        <View style={styles.alertMetrics}>
          <View style={styles.metricItem}>
            <Clock size={moderateScale(14)} color={COLORS.errorDark} strokeWidth={2.5} />
            <Text style={styles.metricText}>
              {sosStatus.startTime 
                ? `${Math.floor((Date.now() - sosStatus.startTime.getTime()) / 60000)}m ago` 
                : 'Just now'
              }
            </Text>
          </View>
          <View style={styles.metricItem}>
            <MapPin size={moderateScale(14)} color={COLORS.errorDark} strokeWidth={2.5} />
            <Text style={styles.metricText}>0.8km away</Text>
          </View>
        </View>
      </Animated.View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContentActive,
            { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(40) }
          ]}
          bounces={true}
        >
          <Animated.View style={animatedContentStyle}>
            <Animated.View style={[styles.streamContainer, animatedStreamStyle]}>
              <View style={styles.streamHeader}>
                <View style={styles.streamTitleContainer}>
                  <Video size={moderateScale(20)} color={COLORS.error} strokeWidth={2.5} />
                  <Text style={styles.streamTitle}>Live Stream</Text>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <View style={styles.streamControls}>
                  <TouchableOpacity style={styles.streamControl} activeOpacity={0.7}>
                    <Volume2 size={moderateScale(16)} color={COLORS.textSecondary} strokeWidth={2.5} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.streamControl} activeOpacity={0.7}>
                    <Camera size={moderateScale(16)} color={COLORS.textSecondary} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.streamPlaceholder}>
                <View style={styles.streamPlaceholderIcon}>
                  <Video size={moderateScale(48)} color={COLORS.textLight} strokeWidth={2} />
                </View>
                <Text style={styles.streamPlaceholderTitle}>Live Video Feed</Text>
                <Text style={styles.streamPlaceholderSubtitle}>
                  Real-time video and audio from Jessica's device
                </Text>
                <View style={styles.streamQuality}>
                  <View style={styles.qualityDot} />
                  <Text style={styles.qualityText}>HD Quality • Stable Connection</Text>
                </View>
              </View>
              
              <View style={styles.audioIndicator}>
                <Mic size={moderateScale(16)} color={COLORS.error} strokeWidth={2.5} />
                <Text style={styles.audioText}>Audio Active</Text>
                <View style={styles.audioWave}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Animated.View 
                      key={index}
                      style={[styles.audioBar, audioBarStyles[index]]} 
                    />
                  ))}
                </View>
              </View>
            </Animated.View>

            <View style={styles.infoSection}>
              <Animated.View 
                style={styles.locationCard}
                entering={FadeInUp.delay(400)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconContainer, { backgroundColor: COLORS.successLight }]}>
                    <MapPin size={moderateScale(16)} color={COLORS.success} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.cardTitle}>Live Location</Text>
                  <View style={styles.updateBadge}>
                    <View style={styles.updateDot} />
                    <Text style={styles.updateText}>Updating</Text>
                  </View>
                </View>
                <Text style={styles.locationAddress}>
                  {sosStatus.location?.address || 'Market Street, San Francisco, CA'}
                </Text>
                <Text style={styles.locationUpdate}>Last updated: Just now</Text>
                <TouchableOpacity style={styles.directionsButton} activeOpacity={0.7}>
                  <Navigation size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View 
                style={styles.evidenceCard}
                entering={FadeInUp.delay(500)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconContainer, { backgroundColor: COLORS.warningLight }]}>
                    <Camera size={moderateScale(16)} color={COLORS.warning} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.cardTitle}>Evidence Collection</Text>
                </View>
                <View style={styles.evidenceItems}>
                  <View style={styles.evidenceItem}>
                    <View style={styles.evidenceIcon}>
                      <Camera size={moderateScale(12)} color={COLORS.success} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.evidenceText}>Photos: 3 captured</Text>
                    <View style={styles.evidenceStatus}>
                      <CheckCircle size={moderateScale(10)} color={COLORS.success} strokeWidth={2.5} />
                    </View>
                  </View>
                  <View style={styles.evidenceItem}>
                    <View style={styles.evidenceIcon}>
                      <Mic size={moderateScale(12)} color={COLORS.error} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.evidenceText}>Audio: Recording</Text>
                    <View style={[styles.evidenceStatus, styles.evidenceStatusActive]}>
                      <Activity size={moderateScale(10)} color={COLORS.error} strokeWidth={2.5} />
                    </View>
                  </View>
                  <View style={styles.evidenceItem}>
                    <View style={styles.evidenceIcon}>
                      <Video size={moderateScale(12)} color={COLORS.info} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.evidenceText}>Video: Streaming</Text>
                    <View style={[styles.evidenceStatus, styles.evidenceStatusActive]}>
                      <Activity size={moderateScale(10)} color={COLORS.info} strokeWidth={2.5} />
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>

            <View style={styles.actionButtons}>
              <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
                <TouchableOpacity 
                  style={[styles.respondButton, isResponding && styles.respondingButton]} 
                  onPress={handleRespondingSOS}
                  disabled={isResponding}
                  activeOpacity={0.7}
                >
                  <Car size={moderateScale(20)} color={COLORS.surface} strokeWidth={2.5} />
                  <Text style={styles.respondButtonText}>
                    {isResponding ? "✓ On My Way!" : "I'm On My Way"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => Alert.alert('Calling', 'Calling Jessica...')}
                activeOpacity={0.7}
              >
                <Phone size={moderateScale(18)} color={COLORS.surface} strokeWidth={2.5} />
                <Text style={styles.callButtonText}>Call Jessica</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deactivateButton} 
                onPress={handleDeactivateSOS}
                activeOpacity={0.7}
              >
                <Key size={moderateScale(18)} color={COLORS.surface} strokeWidth={2.5} />
                <Text style={styles.deactivateButtonText}>Secure Deactivate (OTP)</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showOTPModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleCancelOTP}
          />
          <Animated.View style={[styles.otpModal, animatedModalStyle]}>
            <View style={styles.otpHeader}>
              <View style={styles.otpIconContainer}>
                <Key size={moderateScale(24)} color={COLORS.surface} strokeWidth={2.5} />
              </View>
              <TouchableOpacity 
                style={styles.otpCloseButton}
                onPress={handleCancelOTP}
                activeOpacity={0.7}
              >
                <X size={moderateScale(20)} color={COLORS.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.otpTitle}>OTP Verification</Text>
            <Text style={styles.otpSubtitle}>Security verification required</Text>
            
            <Text style={styles.otpDescription}>
              Enter the 6-digit OTP sent to Jessica to safely deactivate the alert. This ensures she is truly safe.
            </Text>
            
            <View style={styles.otpInputContainer}>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="000000"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
                maxLength={6}
                autoFocus
                textAlign="center"
              />
            </View>
            
            <View style={styles.otpHintContainer}>
              <Text style={styles.otpHint}>💡 Demo OTP: 123456</Text>
            </View>
            
            <View style={styles.otpActions}>
              <TouchableOpacity 
                style={styles.otpCancelButton}
                onPress={handleCancelOTP}
                activeOpacity={0.7}
              >
                <Text style={styles.otpCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.otpSubmitButton, otpCode.length !== 6 && styles.otpSubmitDisabled]}
                onPress={handleOTPSubmit}
                disabled={otpCode.length !== 6}
                activeOpacity={0.7}
              >
                <Shield size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
                <Text style={styles.otpSubmitText}>Verify & Deactivate</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  scrollContentActive: {
    flexGrow: 1,
    paddingTop: verticalScale(16),
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(4),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: 0.1,
  },
  inactiveContainer: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
  },
  inactiveIconContainer: {
    width: moderateScale(130),
    height: moderateScale(130),
    borderRadius: moderateScale(65),
    backgroundColor: COLORS.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    borderWidth: 3,
    borderColor: '#BBF7D0',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  inactiveTitle: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(10),
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  inactiveSubtitle: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(32),
    paddingHorizontal: scale(8),
    letterSpacing: 0.1,
  },
  featuresCard: {
    backgroundColor: COLORS.surface,
    padding: scale(20),
    borderRadius: moderateScale(20),
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: verticalScale(24),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  featuresTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  featuresList: {
    gap: verticalScale(14),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  featureIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: moderateScale(20),
    letterSpacing: 0.1,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(18),
    padding: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickStatItem: {
    alignItems: 'center',
    gap: verticalScale(8),
  },
  quickStatIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  quickStatLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  alertHeader: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
    marginBottom: verticalScale(16),
  },
  alertIconContainer: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  alertTitleInfo: {
    flex: 1,
    gap: verticalScale(4),
  },
  alertTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.error,
    letterSpacing: 0.2,
  },
  alertSubtitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.errorDark,
    letterSpacing: 0.1,
  },
  alertMetrics: {
    flexDirection: 'row',
    gap: scale(20),
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
  },
  metricText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.errorDark,
    letterSpacing: 0.2,
  },
  streamContainer: {
    margin: scale(20),
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  streamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    backgroundColor: COLORS.errorLight,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  streamTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  streamTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.error,
    letterSpacing: 0.1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: COLORS.error,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  liveDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.surface,
  },
  liveText: {
    fontSize: moderateScale(9),
    fontWeight: '800',
    color: COLORS.surface,
    letterSpacing: 0.8,
  },
  streamControls: {
    flexDirection: 'row',
    gap: scale(8),
  },
  streamControl: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  streamPlaceholder: {
    backgroundColor: COLORS.background,
    padding: scale(32),
    alignItems: 'center',
    minHeight: verticalScale(180),
    justifyContent: 'center',
    gap: verticalScale(12),
  },
  streamPlaceholderIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  streamPlaceholderTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  streamPlaceholderSubtitle: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(18),
    paddingHorizontal: scale(20),
    letterSpacing: 0.1,
  },
  streamQuality: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: COLORS.surface,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(8),
  },
  qualityDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.success,
  },
  qualityText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: COLORS.errorLight,
    padding: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  audioText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.error,
    letterSpacing: 0.2,
  },
  audioWave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: scale(3),
    marginLeft: 'auto',
    height: moderateScale(24),
  },
  audioBar: {
    width: moderateScale(4),
    backgroundColor: COLORS.error,
    borderRadius: moderateScale(2),
  },
  infoSection: {
    paddingHorizontal: scale(20),
    gap: verticalScale(16),
    marginBottom: verticalScale(20),
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    padding: scale(18),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(14),
  },
  cardIconContainer: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: COLORS.successLight,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  updateDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.success,
  },
  updateText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: COLORS.success,
    letterSpacing: 0.3,
  },
  locationAddress: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(20),
    letterSpacing: 0.1,
  },
  locationUpdate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: verticalScale(16),
    letterSpacing: 0.1,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: COLORS.success,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  directionsButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.2,
  },
  evidenceCard: {
    backgroundColor: COLORS.surface,
    padding: scale(18),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  evidenceItems: {
    gap: verticalScale(12),
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: COLORS.background,
    padding: scale(12),
    borderRadius: moderateScale(12),
  },
  evidenceIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  evidenceStatus: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: COLORS.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceStatusActive: {
    backgroundColor: COLORS.errorLight,
  },
  actionButtons: {
    paddingHorizontal: scale(20),
    gap: verticalScale(12),
  },
  buttonWrapper: {
    width: '100%',
  },
  respondButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    backgroundColor: COLORS.success,
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(14),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  respondingButton: {
    backgroundColor: COLORS.successDark,
  },
  respondButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.3,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: COLORS.info,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.info,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  callButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.2,
  },
  deactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: COLORS.errorDark,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    borderWidth: 2,
    borderColor: COLORS.error,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.errorDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  deactivateButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  otpModal: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(24),
    padding: scale(24),
    width: '100%',
    maxWidth: isTablet ? 480 : 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  otpIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: COLORS.errorDark,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.errorDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  otpCloseButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(6),
    letterSpacing: -0.3,
  },
  otpSubtitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: COLORS.errorDark,
    marginBottom: verticalScale(20),
    letterSpacing: 0.1,
  },
  otpDescription: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: moderateScale(19),
    marginBottom: verticalScale(24),
    letterSpacing: 0.1,
  },
  otpInputContainer: {
    marginBottom: verticalScale(16),
  },
  otpInput: {
    height: moderateScale(58),
    backgroundColor: COLORS.background,
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(16),
    fontSize: moderateScale(22),
    fontWeight: '700',
    letterSpacing: moderateScale(8),
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    color: COLORS.text,
  },
  otpHintContainer: {
    backgroundColor: COLORS.warningLight,
    padding: scale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  otpHint: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  otpActions: {
    flexDirection: 'row',
    gap: scale(12),
  },
  otpCancelButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
  },
  otpCancelText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
  otpSubmitButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    backgroundColor: COLORS.errorDark,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.errorDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  otpSubmitDisabled: {
    backgroundColor: COLORS.borderDark,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  otpSubmitText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.3,
  },
});