// components/community/ImpactStats.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';
import { TrendingUp, Eye, Shield } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};

interface ImpactStatsProps {
  animatedStatsStyle: any;
}

const ImpactStats: React.FC<ImpactStatsProps> = ({ animatedStatsStyle }) => {
  return (
    <Animated.View
      style={[styles.impactStatsContainer, animatedStatsStyle]}
      entering={FadeInDown.delay(300).springify()}
    >
      <View style={styles.impactStats}>
        <Animated.View
          style={styles.impactStatItem}
          entering={BounceIn.delay(400)}
        >
          <TrendingUp size={moderateScale(14)} color={COLORS.success} strokeWidth={2.5} />
          <Text style={styles.impactStatNumber}>847</Text>
          <Text style={styles.impactStatLabel}>Lives Protected</Text>
        </Animated.View>
        <Animated.View
          style={styles.impactStatItem}
          entering={BounceIn.delay(500)}
        >
          <Eye size={moderateScale(14)} color={COLORS.info} strokeWidth={2.5} />
          <Text style={styles.impactStatNumber}>24/7</Text>
          <Text style={styles.impactStatLabel}>Monitoring</Text>
        </Animated.View>
        <Animated.View
          style={styles.impactStatItem}
          entering={BounceIn.delay(600)}
        >
          <Shield size={moderateScale(14)} color={COLORS.purple} strokeWidth={2.5} />
          <Text style={styles.impactStatNumber}>99.2%</Text>
          <Text style={styles.impactStatLabel}>Safety Rate</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  impactStatsContainer: { paddingHorizontal: scale(20), paddingVertical: verticalScale(16), },
  impactStats: { backgroundColor: COLORS.surface, borderRadius: moderateScale(18), flexDirection: 'row', paddingVertical: verticalScale(16), paddingHorizontal: scale(8), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, }, android: { elevation: 2, }, }), },
  impactStatItem: { flex: 1, alignItems: 'center', gap: verticalScale(6), },
  impactStatNumber: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, letterSpacing: -0.3, },
  impactStatLabel: { fontSize: moderateScale(10), fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', letterSpacing: 0.2, },
});

export default ImpactStats;