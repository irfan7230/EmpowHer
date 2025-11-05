// components/onboarding/OnboardingPagination.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface OnboardingPaginationProps {
  totalSlides: number;
  currentIndex: number;
  goToSlide: (index: number) => void;
  currentSlideColors: { primaryColor: string; accentColor: string };
}

const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({
  totalSlides,
  currentIndex,
  goToSlide,
  currentSlideColors,
}) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex
                ? currentSlideColors.primaryColor // Use dynamic color
                : currentSlideColors.accentColor + '40', // Use dynamic color
              width: index === currentIndex ? moderateScale(28) : moderateScale(8),
              transform: [{ scale: index === currentIndex ? 1 : 0.8 }],
            },
          ]}
          onPress={() => goToSlide(index)}
          activeOpacity={0.7}
        />
      ))}
    </View>
  );
};

// Copy relevant styles from onboarding.tsx
const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(32), // Use moderateScale for consistency
    gap: scale(8),
  },
  paginationDot: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    // Transition properties can be added with reanimated if desired
  },
});

export default OnboardingPagination;