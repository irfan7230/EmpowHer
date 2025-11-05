// components/home/SOSButtonSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

interface SOSButtonSectionProps {
  isActive: boolean;
  onPress: () => void;
  animatedSOSButtonStyle: any;
}

const SOSButtonSection: React.FC<SOSButtonSectionProps> = ({
  isActive,
  onPress,
  animatedSOSButtonStyle,
}) => {
  return (
    <View style={styles.sosSection}>
      <Animated.View style={[styles.sosButtonContainer, animatedSOSButtonStyle]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.sosButton}>
          <Text style={styles.sosButtonText}>SOS</Text>
          {isActive && <Text style={styles.sosActiveText}>ACTIVE</Text>}
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.sosDescription}>
        {isActive ? 'Alert is active. Help is on the way.' : 'Press for immediate assistance'}
      </Text>
    </View>
  );
};

// Copy relevant styles from index.tsx here
const styles = StyleSheet.create({
  sosSection: { alignItems: 'center', marginTop: verticalScale(24), marginBottom: verticalScale(16), paddingHorizontal: scale(16) },
  sosButtonContainer: { width: width * 0.55, height: width * 0.55, borderRadius: width * 0.275, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 12 },
  sosButton: { width: '100%', height: '100%', borderRadius: width * 0.275, justifyContent: 'center', alignItems: 'center' },
  sosButtonText: { fontSize: isSmallDevice ? moderateScale(32) : moderateScale(40), fontFamily: 'Inter-Bold', color: '#FFFFFF', letterSpacing: 2 },
  sosActiveText: { fontSize: moderateScale(12), fontFamily: 'Inter-Bold', color: '#FFFFFF', letterSpacing: 1, position: 'absolute', bottom: '25%' },
  sosDescription: { fontSize: moderateScale(14), fontFamily: 'Inter-Regular', color: COLORS.textSecondary, marginTop: verticalScale(16), textAlign: 'center' },
});

export default SOSButtonSection;