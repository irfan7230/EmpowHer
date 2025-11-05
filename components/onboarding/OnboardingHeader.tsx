// components/onboarding/OnboardingHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Use APP_COLORS

interface OnboardingHeaderProps {
  currentIndex: number;
  totalSlides: number;
  skip: () => void;
  animatedProgressStyle: any; // Style for the progress bar width
  currentSlideColors: { secondaryColor: string; accentColor: string }; // Pass colors for styling
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentIndex,
  totalSlides,
  skip,
  animatedProgressStyle,
  currentSlideColors,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.progressContainer}>
        <Text style={styles.stepIndicator}>
          Step {currentIndex + 1} of {totalSlides}
        </Text>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: currentSlideColors.secondaryColor }, // Use dynamic color
              animatedProgressStyle
            ]}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={skip}
        style={[styles.skipButton, { borderColor: currentSlideColors.accentColor }]} // Dynamic border
        activeOpacity={0.7}
      >
        <Text style={[styles.skipText, { color: currentSlideColors.secondaryColor }]}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

// Copy relevant styles from onboarding.tsx
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(24), // Adjusted padding
    paddingBottom: verticalScale(16),
    // Removed paddingHorizontal, will be handled by parent
  },
  progressContainer: {
    flex: 1,
    marginRight: scale(20),
  },
  stepIndicator: {
    fontSize: moderateScale(13),
    fontFamily: 'Inter-Medium', // Ensure font is loaded
    color: COLORS.textSecondary,
    marginBottom: verticalScale(8),
    letterSpacing: 0.3,
  },
  progressTrack: {
    height: moderateScale(6),
    backgroundColor: COLORS.surface, // Use surface for track
    borderRadius: moderateScale(3),
    overflow: 'hidden',
    shadowColor: COLORS.borderDark, // Use borderDark shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: moderateScale(3),
  },
  skipButton: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(20),
    borderWidth: 1,
    shadowColor: COLORS.primary, // Use primary shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skipText: {
    fontSize: moderateScale(14),
    fontFamily: 'Inter-SemiBold', // Ensure font is loaded
    letterSpacing: 0.2,
  },
});

export default OnboardingHeader;