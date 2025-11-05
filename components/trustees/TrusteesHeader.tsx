// components/trustees/TrusteesHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Use APP_COLORS

interface TrusteesHeaderProps {
  trusteeCount: number;
  onlineCount: number;
  animatedHeaderStyle: any;
}

const TrusteesHeader: React.FC<TrusteesHeaderProps> = ({
  trusteeCount,
  onlineCount,
  animatedHeaderStyle,
}) => {
  return (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>My Trustees</Text>
          <Text style={styles.subtitle}>
            {trusteeCount} trusted contact{trusteeCount !== 1 ? 's' : ''} • {onlineCount} online
          </Text>
        </View>
        <View style={styles.headerStats}>
          <Animated.View
            style={styles.statBadge}
            entering={SlideInRight.delay(300)}
          >
            <Heart size={moderateScale(14)} color={COLORS.primaryDark} />
            <Text style={styles.statBadgeText}>
              {trusteeCount}
            </Text>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from trustees.tsx
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.surface, // Use surface color
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use border color
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, },
      android: { elevation: 3, },
    }),
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  headerLeft: { flex: 1, },
  title: { fontSize: moderateScale(28), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(4), },
  subtitle: { fontSize: moderateScale(14), color: COLORS.textSecondary, },
  headerStats: { alignItems: 'center', },
  statBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, // Use light primary
    paddingHorizontal: scale(12), paddingVertical: verticalScale(8), borderRadius: moderateScale(20), gap: scale(6),
    ...Platform.select({
      ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, },
      android: { elevation: 1, },
    }),
  },
  statBadgeText: { fontSize: moderateScale(12), fontWeight: '700', color: COLORS.primaryDark, }, // Use dark primary
});

export default TrusteesHeader;