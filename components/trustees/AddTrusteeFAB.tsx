// components/trustees/AddTrusteeFAB.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface AddTrusteeFABProps {
  onPress: () => void;
  animatedFabStyle: any; // Pass the animation style
}

const AddTrusteeFAB: React.FC<AddTrusteeFABProps> = ({ onPress, animatedFabStyle }) => {
  return (
    <Animated.View style={[styles.fabContainer, animatedFabStyle]}>
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Plus size={moderateScale(28)} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Copy relevant styles from trustees.tsx
const styles = StyleSheet.create({
  fabContainer: { position: 'absolute', bottom: verticalScale(120), right: scale(24), }, // Adjust bottom based on tab bar height if needed
  fab: {
    width: moderateScale(64), height: moderateScale(64), borderRadius: moderateScale(32), backgroundColor: COLORS.primaryDark, justifyContent: 'center', alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, }, android: { elevation: 8, }, }),
  },
});

export default AddTrusteeFAB;