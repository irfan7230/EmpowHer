// components/onboarding/DecorativeBackground.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';

interface DecorativeBackgroundProps {
  slideData: {
    backgroundColor: string;
    accentColor: string;
    decorativeIcons: LucideIcon[];
  };
  animatedBackgroundStyle: any; // Opacity fade
  animatedDecorativeStyle: any; // Floating/opacity pulse
}

const DecorativeBackground: React.FC<DecorativeBackgroundProps> = ({
  slideData,
  animatedBackgroundStyle,
  animatedDecorativeStyle,
}) => {
  return (
    <>
      {/* Animated Background Gradient */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedBackgroundStyle]}>
        <LinearGradient
          colors={[slideData.backgroundColor, '#FFFFFF', slideData.accentColor + '10']}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Decorative floating elements */}
      <View style={styles.decorativeContainer}>
        {slideData.decorativeIcons.map((DecorativeIcon, index) => (
          <Animated.View
            key={index}
            style={[
              styles.decorativeIcon,
              {
                top: index === 0 ? '20%' : '75%',
                left: index === 0 ? '15%' : '75%',
                transform: [{ rotate: index === 0 ? '15deg' : '-15deg' }],
              },
              animatedDecorativeStyle, // Apply floating/opacity pulse
            ]}
          >
            <DecorativeIcon size={24} color={slideData.accentColor} strokeWidth={1.5} />
          </Animated.View>
        ))}
      </View>
    </>
  );
};

// Copy relevant styles from onboarding.tsx
const styles = StyleSheet.create({
  decorativeContainer: { ...StyleSheet.absoluteFillObject, pointerEvents: 'none', },
  decorativeIcon: { position: 'absolute', width: 48, height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, shadowColor: '#FFB3BA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4, },
});

export default DecorativeBackground;