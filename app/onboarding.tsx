import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Users, MessageCircle, ChevronRight, ChevronLeft, Heart, Phone, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Enhanced responsive configuration
const getResponsiveConfig = () => {
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414;
  const isTablet = width >= 768;
  
  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,
    
    // Icon sizes - smaller for cleaner look
    iconSize: isSmallScreen ? 48 : isMediumScreen ? 56 : isTablet ? 72 : 64,
    iconContainerSize: isSmallScreen ? 120 : isMediumScreen ? 140 : isTablet ? 180 : 160,
    
    // Typography - better hierarchy
    titleSize: isSmallScreen ? 28 : isMediumScreen ? 32 : isTablet ? 40 : 36,
    subtitleSize: isSmallScreen ? 16 : isMediumScreen ? 18 : isTablet ? 22 : 20,
    descriptionSize: isSmallScreen ? 15 : isMediumScreen ? 16 : isTablet ? 18 : 17,
    
    // Spacing - more breathing room
    horizontalPadding: isSmallScreen ? 28 : isMediumScreen ? 36 : isTablet ? 64 : 44,
    verticalSpacing: isSmallScreen ? 40 : isMediumScreen ? 48 : isTablet ? 64 : 56,
    
    // Button dimensions
    buttonHeight: isSmallScreen ? 56 : isMediumScreen ? 60 : isTablet ? 68 : 64,
    buttonRadius: 32,
  };
};

const onboardingData = [
  {
    id: 1,
    icon: Shield,
    title: 'Your Safety First',
    subtitle: 'Advanced Protection System',
    description: 'Instant SOS alerts with smart detection. One-tap emergency activation sends your location to trusted contacts and authorities.',
    primaryColor: '#FFB3BA',
    secondaryColor: '#FF8A95',
    accentColor: '#FFC1C6',
    backgroundColor: '#FFF8F9',
    decorativeIcons: [Phone, MapPin],
  },
  {
    id: 2,
    icon: Users,
    title: 'Trusted Network',
    subtitle: 'Community Support System',
    description: 'Build your circle of trust. Connect with verified helpers nearby and create a safety network that responds when needed.',
    primaryColor: '#FFB3BA',
    secondaryColor: '#FF8A95', 
    accentColor: '#FFC1C6',
    backgroundColor: '#FFF8F9',
    decorativeIcons: [Heart, Users],
  },
  {
    id: 3,
    icon: MessageCircle,
    title: 'Smart Assistant',
    subtitle: '24/7 AI Companion',
    description: 'AI-powered support with real-time guidance. Get instant help, safety tips, and emergency assistance whenever you need it.',
    primaryColor: '#FFB3BA',
    secondaryColor: '#FF8A95',
    accentColor: '#FFC1C6', 
    backgroundColor: '#FFF8F9',
    decorativeIcons: [MessageCircle, Shield],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use Zustand store
  const { completeOnboarding } = useAuthStore();
  const router = useRouter();
  const config = getResponsiveConfig();
  
  // Animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const floatingY = useSharedValue(0);
  const decorativeOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Smooth entrance animations
    scale.value = withSpring(1, { damping: 15, stiffness: 120 });
    iconScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    // Subtle floating animation
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // Decorative elements animation
    decorativeOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      true
    );
    
    // Progress animation
    progressWidth.value = withTiming((currentIndex + 1) / onboardingData.length, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Background fade
    backgroundOpacity.value = withTiming(1, { duration: 500 });
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      // Smooth exit animation
      scale.value = withSpring(0.95, { damping: 15 });
      opacity.value = withTiming(0.7, { duration: 150 });
      iconScale.value = withSpring(0.8, { damping: 12 });
      
      setTimeout(() => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
        
        // Entrance animation
        scale.value = withSpring(1, { damping: 15, stiffness: 120 });
        opacity.value = withTiming(1, { duration: 300 });
        iconScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      }, 150);
    } else {
      // Complete onboarding and navigate to login
      console.log('Onboarding completed');
      completeOnboarding();
      router.replace('/login');
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      scale.value = withSpring(0.95, { damping: 15 });
      opacity.value = withTiming(0.7, { duration: 150 });
      iconScale.value = withSpring(0.8, { damping: 12 });
      
      setTimeout(() => {
        runOnJS(setCurrentIndex)(currentIndex - 1);
        
        scale.value = withSpring(1, { damping: 15, stiffness: 120 });
        opacity.value = withTiming(1, { duration: 300 });
        iconScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      }, 150);
    }
  };

  const skip = () => {
    console.log('Skipping onboarding');
    completeOnboarding();
    router.replace('/login');
  };

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  // Animated styles
  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: interpolate(opacity.value, [0, 1], [30, 0]) },
    ],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateY: floatingY.value },
    ],
  }));

  const animatedDecorativeStyle = useAnimatedStyle(() => ({
    opacity: decorativeOpacity.value,
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const currentSlide = onboardingData[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentSlide.backgroundColor} translucent />
      
      {/* Animated Background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedBackgroundStyle]}>
        <LinearGradient
          colors={[currentSlide.backgroundColor, '#FFFFFF', currentSlide.accentColor + '10']}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      
      {/* Decorative floating elements */}
      <View style={styles.decorativeContainer}>
        {currentSlide.decorativeIcons.map((DecorativeIcon, index) => (
          <Animated.View
            key={index}
            style={[
              styles.decorativeIcon,
              {
                top: index === 0 ? '20%' : '75%',
                left: index === 0 ? '15%' : '75%',
                transform: [{ rotate: index === 0 ? '15deg' : '-15deg' }],
              },
              animatedDecorativeStyle,
            ]}
          >
            <DecorativeIcon size={24} color={currentSlide.accentColor} strokeWidth={1.5} />
          </Animated.View>
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Header */}
        <View style={[styles.header, { paddingHorizontal: config.horizontalPadding }]}>
          <View style={styles.progressContainer}>
            <Text style={styles.stepIndicator}>
              Step {currentIndex + 1} of {onboardingData.length}
            </Text>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  { backgroundColor: currentSlide.primaryColor },
                  animatedProgressStyle
                ]} 
              />
            </View>
          </View>
          <TouchableOpacity onPress={skip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={[styles.skipText, { color: currentSlide.secondaryColor }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.content, animatedContentStyle, { paddingHorizontal: config.horizontalPadding }]}>
          {/* Enhanced Icon Container */}
          <Animated.View style={animatedIconStyle}>
            <View style={[
              styles.iconContainer, 
              { 
                width: config.iconContainerSize,
                height: config.iconContainerSize,
                borderRadius: config.iconContainerSize / 2,
                backgroundColor: '#FFFFFF',
                shadowColor: currentSlide.primaryColor,
              }
            ]}>
              {/* Gradient Ring */}
              <View style={[
                styles.iconRing,
                {
                  width: config.iconContainerSize + 8,
                  height: config.iconContainerSize + 8,
                  borderRadius: (config.iconContainerSize + 8) / 2,
                  borderColor: currentSlide.accentColor,
                }
              ]} />
              
              {/* Icon Background */}
              <LinearGradient
                colors={[currentSlide.accentColor + '20', currentSlide.primaryColor + '10']}
                style={[
                  styles.iconBackground, 
                  { 
                    borderRadius: config.iconContainerSize / 2,
                  }
                ]}
              />
              
              {/* Main Icon */}
              <IconComponent 
                size={config.iconSize} 
                color={currentSlide.secondaryColor} 
                strokeWidth={2}
              />
            </View>
          </Animated.View>

          {/* Enhanced Text Content */}
          <View style={[styles.textContainer, { marginTop: config.verticalSpacing }]}>
            <Text style={[
              styles.title, 
              { 
                fontSize: config.titleSize,
                color: '#2D3748',
              }
            ]}>
              {currentSlide.title}
            </Text>
            
            <Text style={[
              styles.subtitle, 
              { 
                fontSize: config.subtitleSize,
                color: currentSlide.secondaryColor,
                marginTop: config.isSmallScreen ? 8 : 12,
              }
            ]}>
              {currentSlide.subtitle}
            </Text>
            
            <Text style={[
              styles.description, 
              { 
                fontSize: config.descriptionSize,
                marginTop: config.isSmallScreen ? 20 : 28,
                paddingHorizontal: config.isTablet ? 40 : config.isSmallScreen ? 8 : 20,
              }
            ]}>
              {currentSlide.description}
            </Text>
          </View>
        </Animated.View>

        {/* Enhanced Interactive Pagination */}
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentIndex 
                    ? currentSlide.primaryColor 
                    : currentSlide.accentColor + '40',
                  width: index === currentIndex ? 28 : 8,
                  transform: [{ scale: index === currentIndex ? 1 : 0.8 }],
                },
              ]}
              onPress={() => goToSlide(index)}
              activeOpacity={0.7}
            />
          ))}
        </View>

        {/* Enhanced Navigation */}
        <View style={[styles.navigation, { paddingHorizontal: config.horizontalPadding }]}>
          {currentIndex > 0 ? (
            <TouchableOpacity 
              onPress={prevSlide} 
              style={[styles.navButton, styles.prevButton, { borderColor: currentSlide.accentColor }]}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={currentSlide.secondaryColor} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <View style={styles.navButton} />
          )}
          
          <View style={styles.spacer} />
          
          <TouchableOpacity 
            onPress={nextSlide} 
            style={[
              styles.nextButton, 
              { 
                height: config.buttonHeight,
                borderRadius: config.buttonRadius,
                backgroundColor: currentSlide.primaryColor,
                shadowColor: currentSlide.secondaryColor,
              }
            ]}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[currentSlide.primaryColor, currentSlide.secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.nextButtonGradient, { borderRadius: config.buttonRadius }]}
            >
              {currentIndex === onboardingData.length - 1 ? (
                <Text style={[styles.nextButtonText, { fontSize: config.isSmallScreen ? 16 : 18 }]}>
                  Get Started
                </Text>
              ) : (
                <>
                  <Text style={[styles.nextButtonText, { fontSize: config.isSmallScreen ? 15 : 17 }]}>
                    Continue
                  </Text>
                  <ChevronRight size={18} color="#FFFFFF" style={{ marginLeft: 8 }} strokeWidth={2.5} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  decorativeIcon: {
    position: 'absolute',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  stepIndicator: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#718096',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F7FAFC',
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  iconRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  subtitle: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  description: {
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 36,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    paddingHorizontal: 40,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});