// components/trustees/TrusteeListEmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Users } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

const TrusteeListEmptyState: React.FC = () => {
  return (
    <Animated.View
      style={styles.emptyContainer}
      entering={FadeInUp.delay(400)}
    >
      <Animated.View
        style={styles.emptyIconContainer}
        entering={FadeInUp.delay(500)} // Adjusted delay
      >
        <Users size={moderateScale(64)} color={COLORS.primary} /> {/* Use primary */}
      </Animated.View>
      <Text style={styles.emptyTitle}>
        No Trustees Yet
      </Text>
      <Text style={styles.emptySubtitle}>
        Add trusted contacts who can help you in emergencies and receive your safety updates
      </Text>
    </Animated.View>
  );
};

// Copy relevant styles from trustees.tsx
const styles = StyleSheet.create({
  emptyContainer: { alignItems: 'center', paddingVertical: verticalScale(80), paddingHorizontal: scale(40), },
  emptyIconContainer: { width: moderateScale(120), height: moderateScale(120), borderRadius: moderateScale(60), backgroundColor: '#FFF5F5', // Consider COLORS.primaryLight
    justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(24), borderWidth: 2, borderColor: '#FFE4E6', // Consider COLORS.primary border
  },
  emptyTitle: { fontSize: moderateScale(22), fontWeight: '700', color: '#374151', marginBottom: verticalScale(12), textAlign: 'center', }, // Consider COLORS.text
  emptySubtitle: { fontSize: moderateScale(15), color: COLORS.textSecondary, textAlign: 'center', lineHeight: moderateScale(22), paddingHorizontal: scale(20), },
});

export default TrusteeListEmptyState;