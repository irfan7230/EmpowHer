// components/dashboard/DashboardInactiveState.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp, SlideInRight, BounceIn } from 'react-native-reanimated';
import { Shield, Eye, MapPin, Key, Users, Activity, Zap, CheckCircle } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface DashboardInactiveStateProps {
  animatedContentStyle: any;
}

// Internal Feature Card Component
const FeaturesCard: React.FC = () => (
    <Animated.View
      style={styles.featuresCard}
      entering={FadeInUp.delay(700)}
    >
      <View style={styles.featuresHeader}>
        <Shield size={moderateScale(20)} color={COLORS.primaryDark} strokeWidth={2.5} />
        <Text style={styles.featuresTitle}>Trustee Capabilities</Text>
      </View>
      <View style={styles.featuresList}>
        <Animated.View style={styles.featureItem} entering={SlideInRight.delay(800)}>
          <View style={[styles.featureIcon, { backgroundColor: COLORS.infoLight }]}>
            <Eye size={moderateScale(14)} color={COLORS.info} strokeWidth={2.5} />
          </View>
          <Text style={styles.featureText}>Live video & audio streaming</Text>
        </Animated.View>
        <Animated.View style={styles.featureItem} entering={SlideInRight.delay(900)}>
          <View style={[styles.featureIcon, { backgroundColor: COLORS.successLight }]}>
            <MapPin size={moderateScale(14)} color={COLORS.success} strokeWidth={2.5} />
          </View>
          <Text style={styles.featureText}>Real-time location tracking</Text>
        </Animated.View>
        <Animated.View style={styles.featureItem} entering={SlideInRight.delay(1000)}>
          <View style={[styles.featureIcon, { backgroundColor: COLORS.errorLight }]}>
            <Key size={moderateScale(14)} color={COLORS.error} strokeWidth={2.5} />
          </View>
          <Text style={styles.featureText}>Secure OTP deactivation</Text>
        </Animated.View>
        <Animated.View style={styles.featureItem} entering={SlideInRight.delay(1100)}>
          <View style={[styles.featureIcon, { backgroundColor: COLORS.primaryLight }]}>
            <Users size={moderateScale(14)} color={COLORS.primaryDark} strokeWidth={2.5} />
          </View>
          <Text style={styles.featureText}>Coordinate with other trustees</Text>
        </Animated.View>
      </View>
    </Animated.View>
);

// Internal Quick Stats Component
const QuickStats: React.FC = () => (
    <Animated.View
      style={styles.quickStats}
      entering={FadeInUp.delay(1200)}
    >
      <View style={styles.quickStatItem}>
        <View style={[styles.quickStatIcon, { backgroundColor: COLORS.successLight }]}>
          <Activity size={moderateScale(16)} color={COLORS.success} strokeWidth={2.5} />
        </View>
        <Text style={styles.quickStatValue}>24/7</Text>
        <Text style={styles.quickStatLabel}>Monitoring</Text>
      </View>
      <View style={styles.quickStatItem}>
        <View style={[styles.quickStatIcon, { backgroundColor: COLORS.infoLight }]}>
          <Zap size={moderateScale(16)} color={COLORS.info} strokeWidth={2.5} />
        </View>
        <Text style={styles.quickStatValue}>2.1m</Text>
        <Text style={styles.quickStatLabel}>Avg Response</Text>
      </View>
      <View style={styles.quickStatItem}>
        <View style={[styles.quickStatIcon, { backgroundColor: COLORS.primaryLight }]}>
          <CheckCircle size={moderateScale(16)} color={COLORS.primaryDark} strokeWidth={2.5} />
        </View>
        <Text style={styles.quickStatValue}>98.7%</Text>
        <Text style={styles.quickStatLabel}>Success Rate</Text>
      </View>
    </Animated.View>
);


const DashboardInactiveState: React.FC<DashboardInactiveStateProps> = ({ animatedContentStyle }) => {
  return (
    <Animated.View
      style={[styles.inactiveContainer, animatedContentStyle]}
      entering={FadeInUp.delay(300)}
    >
      <Animated.View
        style={styles.inactiveIconContainer}
        entering={BounceIn.delay(500)}
      >
        <Shield size={moderateScale(72)} color={COLORS.success} strokeWidth={2} />
      </Animated.View>
      <Text style={styles.inactiveTitle}>All Safe & Secure</Text>
      <Text style={styles.inactiveSubtitle}>
        No active emergencies. You'll be instantly notified when someone in your network needs help.
      </Text>

      <FeaturesCard />
      <QuickStats />

    </Animated.View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  inactiveContainer: { flex: 1, paddingHorizontal: scale(24), paddingTop: verticalScale(20), paddingBottom: verticalScale(20), alignItems: 'center', },
  inactiveIconContainer: { width: moderateScale(130), height: moderateScale(130), borderRadius: moderateScale(65), backgroundColor: COLORS.successLight, justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(24), borderWidth: 3, borderColor: '#BBF7D0', ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, }, android: { elevation: 6, }, }), },
  inactiveTitle: { fontSize: moderateScale(26), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(10), textAlign: 'center', letterSpacing: -0.5, },
  inactiveSubtitle: { fontSize: moderateScale(14), fontWeight: '400', color: COLORS.textSecondary, textAlign: 'center', lineHeight: moderateScale(22), marginBottom: verticalScale(32), paddingHorizontal: scale(8), letterSpacing: 0.1, },
  featuresCard: { backgroundColor: COLORS.surface, padding: scale(20), borderRadius: moderateScale(20), width: '100%', borderWidth: 1, borderColor: COLORS.border, marginBottom: verticalScale(24), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, }, android: { elevation: 3, }, }), },
  featuresHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: verticalScale(20), paddingBottom: verticalScale(16), borderBottomWidth: 1, borderBottomColor: COLORS.border, },
  featuresTitle: { fontSize: moderateScale(17), fontWeight: '700', color: COLORS.text, letterSpacing: 0.1, },
  featuresList: { gap: verticalScale(14), },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: scale(12), },
  featureIcon: { width: moderateScale(32), height: moderateScale(32), borderRadius: moderateScale(10), justifyContent: 'center', alignItems: 'center', },
  featureText: { flex: 1, fontSize: moderateScale(14), fontWeight: '500', color: COLORS.textSecondary, lineHeight: moderateScale(20), letterSpacing: 0.1, },
  quickStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: COLORS.surface, borderRadius: moderateScale(18), padding: scale(16), borderWidth: 1, borderColor: COLORS.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, }, android: { elevation: 2, }, }), },
  quickStatItem: { alignItems: 'center', gap: verticalScale(8), },
  quickStatIcon: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), justifyContent: 'center', alignItems: 'center', },
  quickStatValue: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, letterSpacing: -0.3, },
  quickStatLabel: { fontSize: moderateScale(11), fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', letterSpacing: 0.2, },
});

export default DashboardInactiveState;