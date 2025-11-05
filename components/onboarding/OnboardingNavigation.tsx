// components/onboarding/OnboardingNavigation.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

// Define config locally or import
const config = { // Simplified version
    buttonHeight: moderateScale(64),
    buttonRadius: 32,
    isSmallScreen: false,
};


interface OnboardingNavigationProps {
  currentIndex: number;
  totalSlides: number;
  prevSlide: () => void;
  nextSlide: () => void;
  currentSlideColors: { primaryColor: string; secondaryColor: string; accentColor: string };
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentIndex,
  totalSlides,
  prevSlide,
  nextSlide,
  currentSlideColors,
}) => {
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <View style={styles.navigation}>
      {currentIndex > 0 ? (
        <TouchableOpacity
          onPress={prevSlide}
          style={[styles.navButton, styles.prevButton, { borderColor: currentSlideColors.accentColor }]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={moderateScale(20)} color={currentSlideColors.secondaryColor} strokeWidth={2.5} />
        </TouchableOpacity>
      ) : (
        <View style={styles.navButton} /> // Placeholder for alignment
      )}

      <View style={styles.spacer} />

      <TouchableOpacity
        onPress={nextSlide}
        style={[
          styles.nextButton,
          {
            height: config.buttonHeight,
            borderRadius: config.buttonRadius,
            backgroundColor: currentSlideColors.primaryColor,
            shadowColor: currentSlideColors.secondaryColor,
          }
        ]}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[currentSlideColors.primaryColor, currentSlideColors.secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.nextButtonGradient, { borderRadius: config.buttonRadius }]}
        >
          {isLastSlide ? (
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
  );
};

// Copy relevant styles from onboarding.tsx
const styles = StyleSheet.create({
  navigation: { flexDirection: 'row', alignItems: 'center', paddingBottom: verticalScale(36), }, // Removed paddingHorizontal
  navButton: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), justifyContent: 'center', alignItems: 'center', },
  prevButton: { backgroundColor: COLORS.surface, borderWidth: 2, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, },
  spacer: { flex: 1, },
  nextButton: { paddingHorizontal: scale(40), shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8, },
  nextButtonGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(28), },
  nextButtonText: { fontFamily: 'Inter-Bold', color: '#FFFFFF', letterSpacing: 0.3, },
});

export default OnboardingNavigation;