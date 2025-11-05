// components/onboarding/OnboardingSlideContent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, verticalScale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native'; // Import LucideIcon type

// Responsive Config - Define locally or import if made global
const config = { // Simplified version from original
    iconSize: moderateScale(64),
    iconContainerSize: moderateScale(160),
    titleSize: moderateScale(36),
    subtitleSize: moderateScale(20),
    descriptionSize: moderateScale(17),
    verticalSpacing: verticalScale(48),
    isTablet: false, // Simplified
    isSmallScreen: false, // Simplified
};

interface SlideData {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
}

interface OnboardingSlideContentProps {
  slideData: SlideData;
  animatedIconStyle: any;
  animatedContentStyle: any; // Style for the overall content block (opacity, scale)
}

const OnboardingSlideContent: React.FC<OnboardingSlideContentProps> = ({
  slideData,
  animatedIconStyle,
  animatedContentStyle,
}) => {
  const IconComponent = slideData.icon;

  return (
    <Animated.View style={[styles.content, animatedContentStyle]}>
      {/* Icon Container */}
      <Animated.View style={animatedIconStyle}>
        <View style={[
          styles.iconContainer,
          {
            width: config.iconContainerSize,
            height: config.iconContainerSize,
            borderRadius: config.iconContainerSize / 2,
            backgroundColor: COLORS.surface,
            shadowColor: slideData.primaryColor,
          }
        ]}>
          <View style={[
            styles.iconRing,
            {
              width: config.iconContainerSize + 8,
              height: config.iconContainerSize + 8,
              borderRadius: (config.iconContainerSize + 8) / 2,
              borderColor: slideData.accentColor,
            }
          ]} />
          <LinearGradient
            colors={[slideData.accentColor + '20', slideData.primaryColor + '10']}
            style={[styles.iconBackground, { borderRadius: config.iconContainerSize / 2 }]}
          />
          <IconComponent
            size={config.iconSize}
            color={slideData.secondaryColor}
            strokeWidth={2}
          />
        </View>
      </Animated.View>

      {/* Text Content */}
      <View style={[styles.textContainer, { marginTop: config.verticalSpacing }]}>
        <Text style={[styles.title, { fontSize: config.titleSize, color: '#2D3748' }]}>
          {slideData.title}
        </Text>
        <Text style={[
            styles.subtitle,
            { fontSize: config.subtitleSize, color: slideData.secondaryColor, marginTop: config.isSmallScreen ? 8 : 12 }
        ]}>
          {slideData.subtitle}
        </Text>
        <Text style={[
            styles.description,
            { fontSize: config.descriptionSize, marginTop: config.isSmallScreen ? 20 : 28, paddingHorizontal: config.isTablet ? 40 : (config.isSmallScreen ? 8 : 20) }
        ]}>
          {slideData.description}
        </Text>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from onboarding.tsx
const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }, // Added width
  iconContainer: { justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8, position: 'relative', },
  iconRing: { position: 'absolute', borderWidth: 2, borderStyle: 'dashed', },
  iconBackground: { ...StyleSheet.absoluteFillObject, },
  textContainer: { alignItems: 'center', maxWidth: '100%', },
  title: { fontFamily: 'Inter-Bold', textAlign: 'center', letterSpacing: -0.8, lineHeight: 42, }, // Ensure fonts are loaded
  subtitle: { fontFamily: 'Inter-SemiBold', textAlign: 'center', letterSpacing: 0.2, lineHeight: 24, },
  description: { fontFamily: 'Inter-Regular', color: '#4A5568', textAlign: 'center', lineHeight: 26, letterSpacing: 0.1, },
});

export default OnboardingSlideContent;