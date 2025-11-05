// components/dashboard/DashboardHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Assuming COLORS are defined/exported here

interface DashboardHeaderProps {
  animatedHeaderStyle: any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ animatedHeaderStyle }) => {
  return (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <Text style={styles.title}>Trustee Dashboard</Text>
      <Text style={styles.subtitle}>Monitor and respond to emergency alerts</Text>
    </Animated.View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, },
      android: { elevation: 4, },
    }),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(4),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: 0.1,
  },
});

export default DashboardHeader;