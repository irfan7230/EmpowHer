// components/SplashScreen.tsx (Fixed for APK)
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Ensure callback exists before starting animation
    if (!onAnimationComplete) {
      console.warn('SplashScreen: onAnimationComplete callback is missing');
      return;
    }

    const startAnimation = () => {
      try {
        // Background fade in
        backgroundOpacity.value = withTiming(1, { duration: 500 });
        
        // Logo entrance with spring effect
        logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
        logoScale.value = withDelay(200, withSpring(1, {
          damping: 15,
          stiffness: 120,
          mass: 1,
        }));
        
        // Gentle pulse effect
        pulseScale.value = withDelay(800, withSequence(
          withTiming(1.05, { duration: 400, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.sin) })
        ));
        
        // Complete animation after 2.5 seconds
        const timer = setTimeout(() => {
          try {
            runOnJS(onAnimationComplete)();
          } catch (error) {
            console.error('SplashScreen animation completion error:', error);
            // Fallback: call directly if runOnJS fails
            onAnimationComplete();
          }
        }, 2500);

        // Cleanup
        return () => {
          if (timer) clearTimeout(timer);
        };
      } catch (error) {
        console.error('SplashScreen animation error:', error);
        // Fallback to immediate completion
        setTimeout(onAnimationComplete, 1000);
      }
    };

    const cleanup = startAnimation();
    return cleanup;
  }, [onAnimationComplete]);

  const animatedLogoStyle = useAnimatedStyle(() => {
    try {
      return {
        opacity: logoOpacity.value,
        transform: [
          { scale: logoScale.value * pulseScale.value },
        ],
      };
    } catch (error) {
      console.error('Logo animation style error:', error);
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    try {
      return {
        opacity: backgroundOpacity.value,
      };
    } catch (error) {
      console.error('Background animation style error:', error);
      return { opacity: 1 };
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFB3BA" translucent={false} />
      
      {/* Animated Background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedBackgroundStyle]}>
        <LinearGradient
          colors={['#FFB3BA', '#FF8FA3', '#FFFFFF']}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.logoWrapper, animatedLogoStyle]}>
          {/* Glow effect */}
          <View style={styles.logoGlow} />
          
          {/* Your PNG Logo */}
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
            defaultSource={require('../assets/images/icon.png')}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB3BA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    opacity: 0.15,
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImage: {
    width: 150,
    height: 150,
    zIndex: 2,
  },
});