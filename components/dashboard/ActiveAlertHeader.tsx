// components/dashboard/ActiveAlertHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { TriangleAlert as AlertTriangle, Clock, MapPin } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface ActiveAlertHeaderProps {
  animatedAlertStyle: any; // Header pulse
  animatedHeaderStyle: any; // Initial entry animation
  startTime: Date | null;
}

const ActiveAlertHeader: React.FC<ActiveAlertHeaderProps> = ({
  animatedAlertStyle,
  animatedHeaderStyle,
  startTime,
}) => {
  const timeAgo = startTime
    ? `${Math.floor((Date.now() - startTime.getTime()) / 60000)}m ago`
    : 'Just now';

  return (
    <Animated.View style={[styles.alertHeader, animatedAlertStyle, animatedHeaderStyle]}>
      <View style={styles.alertTitleContainer}>
        <View style={styles.alertIconContainer}>
          <AlertTriangle size={moderateScale(28)} color={COLORS.error} strokeWidth={2.5} />
        </View>
        <View style={styles.alertTitleInfo}>
          <Text style={styles.alertTitle}>🚨 EMERGENCY ACTIVE</Text>
          {/* TODO: Replace with dynamic user name */}
          <Text style={styles.alertSubtitle}>Jessica Wilson needs immediate help</Text>
        </View>
      </View>

      <View style={styles.alertMetrics}>
        <View style={styles.metricItem}>
          <Clock size={moderateScale(14)} color={COLORS.errorDark} strokeWidth={2.5} />
          <Text style={styles.metricText}>{timeAgo}</Text>
        </View>
        <View style={styles.metricItem}>
          <MapPin size={moderateScale(14)} color={COLORS.errorDark} strokeWidth={2.5} />
          {/* TODO: Replace with dynamic distance */}
          <Text style={styles.metricText}>0.8km away</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  alertHeader: { paddingHorizontal: scale(20), paddingTop: verticalScale(16), paddingBottom: verticalScale(16), borderBottomWidth: 1, borderBottomColor: '#FECACA', },
  alertTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(14), marginBottom: verticalScale(16), },
  alertIconContainer: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(26), backgroundColor: COLORS.errorLight, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FEE2E2', },
  alertTitleInfo: { flex: 1, gap: verticalScale(4), },
  alertTitle: { fontSize: moderateScale(20), fontWeight: '700', color: COLORS.error, letterSpacing: 0.2, },
  alertSubtitle: { fontSize: moderateScale(14), fontWeight: '600', color: COLORS.errorDark, letterSpacing: 0.1, },
  alertMetrics: { flexDirection: 'row', gap: scale(20), },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: scale(6), backgroundColor: COLORS.errorLight, paddingHorizontal: scale(12), paddingVertical: verticalScale(8), borderRadius: moderateScale(10), },
  metricText: { fontSize: moderateScale(12), fontWeight: '600', color: COLORS.errorDark, letterSpacing: 0.2, },
});

export default ActiveAlertHeader;