// components/community/NetworkStatsSection.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming,
  interpolateColor, ZoomIn, BounceIn, SlideInLeft, FadeInUp, SlideInUp
} from 'react-native-reanimated';
import { Globe, Radio, Users, Zap, Award, Star, Activity, Target, Sparkles } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { SAFE_BOTTOM_PADDING } from '@/app/(tabs)/_layout'; // Assuming this export exists

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};
const isTablet = Dimensions.get('window').width >= 768;

interface NetworkStatsSectionProps {
  animatedNetworkStyle: any; // Pass the pulse animation style
}

const NetworkStatsSection: React.FC<NetworkStatsSectionProps> = ({ animatedNetworkStyle }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.networkScrollContent}
    >
      <Animated.View
        style={[styles.networkContainer, animatedNetworkStyle]}
        entering={ZoomIn.delay(200).springify()}
      >
        <View style={styles.networkHeader}>
          <View style={styles.networkTitleContainer}>
            <Globe size={moderateScale(22)} color={COLORS.success} strokeWidth={2.5} />
            <Text style={styles.networkTitle}>
              EmpowHer Network
            </Text>
          </View>
          <Animated.View
            style={styles.liveBadge}
            entering={BounceIn.delay(400)}
          >
            <Radio size={moderateScale(10)} color={COLORS.surface} strokeWidth={2.5} />
            <Text style={styles.liveText}>LIVE</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.globalStats,
            isTablet && styles.globalStatsTablet
          ]}
        >
          {/* Global Stat Items */}
          <Animated.View
            style={[styles.globalStatItem, isTablet && styles.globalStatItemTablet]}
            entering={SlideInLeft.delay(300)}
          >
            <View style={[styles.globalStatIcon, { backgroundColor: COLORS.primaryDark }]}>
              <Users size={moderateScale(22)} color={COLORS.surface} strokeWidth={2.5} />
            </View>
            <Text style={styles.globalStatNumber}>12,847</Text>
            <Text style={styles.globalStatLabel}>Active Users</Text>
          </Animated.View>

          <Animated.View
            style={[styles.globalStatItem, isTablet && styles.globalStatItemTablet]}
            entering={SlideInLeft.delay(400)}
          >
            <View style={[styles.globalStatIcon, { backgroundColor: COLORS.success }]}>
              <Zap size={moderateScale(22)} color={COLORS.surface} strokeWidth={2.5} />
            </View>
            <Text style={styles.globalStatNumber}>98.7%</Text>
            <Text style={styles.globalStatLabel}>Response Rate</Text>
          </Animated.View>

          <Animated.View
            style={[styles.globalStatItem, isTablet && styles.globalStatItemTablet]}
            entering={SlideInLeft.delay(500)}
          >
            <View style={[styles.globalStatIcon, { backgroundColor: COLORS.info }]}>
              <Award size={moderateScale(22)} color={COLORS.surface} strokeWidth={2.5} />
            </View>
            <Text style={styles.globalStatNumber}>2.1m</Text>
            <Text style={styles.globalStatLabel}>Avg Response</Text>
          </Animated.View>
        </Animated.View>

        {/* Network Metrics */}
        <Animated.View
          style={styles.networkMetrics}
          entering={FadeInUp.delay(600)}
        >
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Nearby Active Users</Text>
            <Text style={styles.metricValue}>47 within 1km</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Community Safety Score</Text>
            <View style={styles.safetyScore}>
              <Star size={moderateScale(12)} color={COLORS.warning} fill={COLORS.warning} strokeWidth={2} />
              <Text style={styles.metricValue}>4.8/5.0</Text>
            </View>
          </View>
          <View style={[styles.metricRow, styles.metricRowLast]}>
            <Text style={styles.metricLabel}>Emergency Response Time</Text>
            <Text style={styles.metricValue}>2.3 minutes</Text>
          </View>
        </Animated.View>

        {/* Network Insights */}
        <Animated.View
          style={styles.networkInsights}
          entering={FadeInUp.delay(800)}
        >
          <Text style={styles.insightsTitle}>Network Insights</Text>

          {/* Activity Chart */}
          <View style={styles.insightChartRow}>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Activity size={moderateScale(14)} color={COLORS.primaryDark} strokeWidth={2.5} />
                <Text style={styles.chartTitle}>Peak activity: 6-9 PM</Text>
              </View>
              <Text style={styles.chartSubtext}>Most community members online</Text>

              <View style={styles.activityChart}>
                <View style={styles.chartGrid}>
                  {[...Array(12)].map((_, i) => (
                    <View key={i} style={styles.gridLine} />
                  ))}
                </View>
                <View style={styles.chartBars}>
                  {[30, 25, 20, 15, 10, 8, 12, 18, 35, 45, 60, 70, 80, 85, 75, 70, 65, 90, 95, 85, 75, 60, 45, 35].map((height, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.chartBar,
                        {
                          height: (height / 100) * moderateScale(50),
                          backgroundColor: i >= 18 && i <= 21 ? COLORS.primaryDark : COLORS.primary,
                        }
                      ]}
                      entering={SlideInUp.delay(900 + i * 15)}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Coverage Chart */}
          <View style={styles.insightChartRow}>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Target size={moderateScale(14)} color={COLORS.success} strokeWidth={2.5} />
                <Text style={styles.chartTitle}>Coverage: 99.2%</Text>
              </View>
              <Text style={styles.chartSubtext}>Comprehensive safety network</Text>

              <View style={styles.coverageChart}>
                <View style={styles.coverageBackground}>
                  <View style={[styles.hexagon, styles.hexagonBg]} />
                  <View style={[styles.hexagon, styles.hexagonBg, { top: 12, left: 16 }]} />
                  <View style={[styles.hexagon, styles.hexagonBg, { top: 24, left: 32 }]} />
                  <View style={[styles.hexagon, styles.hexagonBg, { top: 36, left: 16 }]} />
                  <View style={[styles.hexagon, styles.hexagonBg, { top: 12, left: 48 }]} />
                </View>
                <Animated.View
                  style={styles.coverageFilled}
                  entering={ZoomIn.delay(1000).springify()}
                >
                  <View style={[styles.hexagon, styles.hexagonFilled]} />
                  <View style={[styles.hexagon, styles.hexagonFilled, { top: 12, left: 16 }]} />
                  <View style={[styles.hexagon, styles.hexagonFilled, { top: 24, left: 32 }]} />
                  <View style={[styles.hexagon, styles.hexagonFilled, { top: 36, left: 16 }]} />
                  <View style={[styles.hexagon, styles.hexagonFilled, { top: 12, left: 48, opacity: 0.3 }]} />
                </Animated.View>
              </View>
            </View>
          </View>

          {/* Trust Score Chart */}
          <View style={styles.insightChartRow}>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Sparkles size={moderateScale(14)} color={COLORS.info} strokeWidth={2.5} />
                <Text style={styles.chartTitle}>Trust Score: Excellent</Text>
              </View>
              <Text style={styles.chartSubtext}>High verification among members</Text>

              <View style={styles.trustChart}>
                <View style={[styles.trustRing, styles.trustRingBg]} />
                <Animated.View
                  style={[styles.trustRing, styles.trustRingFilled]}
                  entering={ZoomIn.delay(1200).springify()}
                />
                <View style={styles.trustCenter}>
                  <Text style={styles.trustScore}>96%</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  networkScrollContent: { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(20), },
  networkContainer: { margin: scale(20), borderRadius: moderateScale(20), padding: scale(20), borderWidth: 1, borderColor: COLORS.successLight, ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, }, android: { elevation: 4, }, }), },
  networkHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: verticalScale(20), },
  networkTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(10), flex: 1, },
  networkTitle: { fontSize: moderateScale(19), fontWeight: '700', color: COLORS.text, letterSpacing: -0.3, },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: scale(4), backgroundColor: COLORS.success, paddingHorizontal: scale(10), paddingVertical: verticalScale(6), borderRadius: moderateScale(10), ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, }, android: { elevation: 2, }, }), },
  liveText: { fontSize: moderateScale(9), fontWeight: '800', color: COLORS.surface, letterSpacing: 0.8, },
  globalStats: { gap: verticalScale(16), marginBottom: verticalScale(24), },
  globalStatsTablet: { flexDirection: 'row', justifyContent: 'space-around', },
  globalStatItem: { alignItems: 'center', gap: verticalScale(8), },
  globalStatItemTablet: { flex: 1, },
  globalStatIcon: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 2, }, }), },
  globalStatNumber: { fontSize: moderateScale(17), fontWeight: '700', color: COLORS.text, letterSpacing: -0.3, },
  globalStatLabel: { fontSize: moderateScale(11), fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', letterSpacing: 0.2, },
  networkMetrics: { backgroundColor: COLORS.surface, borderRadius: moderateScale(14), padding: scale(16), marginBottom: verticalScale(20), gap: verticalScale(12), },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: verticalScale(10), borderBottomWidth: 1, borderBottomColor: COLORS.border, },
  metricRowLast: { borderBottomWidth: 0, },
  metricLabel: { fontSize: moderateScale(13), fontWeight: '500', color: COLORS.text, flex: 1, letterSpacing: 0.1, },
  metricValue: { fontSize: moderateScale(13), fontWeight: '700', color: COLORS.text, letterSpacing: 0.1, },
  safetyScore: { flexDirection: 'row', alignItems: 'center', gap: scale(4), },
  networkInsights: { backgroundColor: COLORS.surface, borderRadius: moderateScale(14), padding: scale(16), gap: verticalScale(16), },
  insightsTitle: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(4), letterSpacing: 0.1, },
  insightChartRow: { gap: verticalScale(8), },
  chartContainer: { backgroundColor: COLORS.background, borderRadius: moderateScale(12), padding: scale(14), borderWidth: 1, borderColor: COLORS.border, },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: verticalScale(6), },
  chartTitle: { fontSize: moderateScale(12), fontWeight: '600', color: COLORS.text, flex: 1, letterSpacing: 0.1, },
  chartSubtext: { fontSize: moderateScale(11), fontWeight: '400', color: COLORS.textLight, marginBottom: verticalScale(12), letterSpacing: 0.1, },
  activityChart: { position: 'relative', backgroundColor: COLORS.surface, borderRadius: moderateScale(8), padding: scale(8), height: moderateScale(70), },
  chartGrid: { position: 'absolute', top: scale(8), left: scale(8), right: scale(8), bottom: scale(8), flexDirection: 'row', justifyContent: 'space-between', },
  gridLine: { width: 1, height: '100%', backgroundColor: COLORS.border, },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', paddingHorizontal: scale(2), },
  chartBar: { width: moderateScale(6), borderRadius: moderateScale(2), marginHorizontal: scale(0.5), },
  coverageChart: { position: 'relative', backgroundColor: COLORS.surface, borderRadius: moderateScale(8), padding: scale(12), alignSelf: 'flex-start', width: moderateScale(100), height: moderateScale(70), },
  coverageBackground: { position: 'absolute', top: scale(12), left: scale(12), right: scale(12), bottom: scale(12), },
  coverageFilled: { position: 'relative', },
  hexagon: { position: 'absolute', width: moderateScale(14), height: moderateScale(14), transform: [{ rotate: '45deg' }], },
  hexagonBg: { backgroundColor: COLORS.border, borderWidth: 1, borderColor: COLORS.borderDark, },
  hexagonFilled: { backgroundColor: COLORS.success, borderWidth: 1, borderColor: '#059669', ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, }, android: { elevation: 1, }, }), },
  trustChart: { position: 'relative', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', width: moderateScale(90), height: moderateScale(90), },
  trustRing: { position: 'absolute', width: moderateScale(70), height: moderateScale(70), borderRadius: moderateScale(35), borderWidth: moderateScale(6), },
  trustRingBg: { borderColor: COLORS.borderDark, },
  trustRingFilled: { borderTopColor: COLORS.info, borderRightColor: COLORS.purple, borderBottomColor: COLORS.borderDark, borderLeftColor: COLORS.borderDark, transform: [{ rotate: '180deg' }], ...Platform.select({ ios: { shadowColor: COLORS.info, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, }, android: { elevation: 2, }, }), },
  trustCenter: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', position: 'absolute', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 2, }, }), },
  trustScore: { fontSize: moderateScale(14), fontWeight: '800', color: COLORS.info, letterSpacing: -0.3, },
});

export default NetworkStatsSection;