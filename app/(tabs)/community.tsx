import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { CommunityAlert, SafetyRating } from '@/types/app';
import { 
  MapPin, 
  Users, 
  Star, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Heart, 
  Navigation, 
  Zap, 
  Eye,
  TrendingUp,
  Award,
  Globe,
  Radio,
  Activity,
  Target,
  Sparkles
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Layout,
  interpolate,
  withSequence,
  withRepeat,
  interpolateColor,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  BounceIn,
  ZoomIn,
  SlideInLeft,
  SlideInUp
} from 'react-native-reanimated';
import { SAFE_BOTTOM_PADDING } from './_layout';

const { width, height } = Dimensions.get('window');

// Enhanced responsive scaling with proper constraints
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  // Limit scaling to prevent extreme sizes
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.3);
  return Math.round(size * limitedScale);
};

const verticalScale = (size: number) => {
  const baseHeight = 812;
  const scaleFactor = height / baseHeight;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.2);
  return Math.round(size * limitedScale);
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Device detection with proper breakpoints
const isTablet = width >= 768;
const isSmallScreen = width <= 360;
const isLargeScreen = width >= 428;

// Theme colors matching your app
const COLORS = {
  primary: '#FFB3BA',
  primaryDark: '#FF8A95',
  primaryLight: '#FFF0F0',
  secondary: '#FF6B9D',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#F3F4F6',
  borderDark: '#E5E7EB',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  error: '#FF6347',
  errorLight: '#FEE2E2',
  info: '#6366F1',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
};

export default function CommunityScreen() {
  const { 
    communityAlerts, 
    safetyRatings, 
    isLocationSharing, 
    toggleLocationSharing,
    respondToCommunityAlert 
  } = useAppState();
  
  const [activeTab, setActiveTab] = useState<'alerts' | 'ratings' | 'network'>('alerts');
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const tabIndicatorPosition = useSharedValue(0);
  const alertPulse = useSharedValue(0);
  const networkPulse = useSharedValue(0);
  const statsScale = useSharedValue(0.8);
  const locationToggleScale = useSharedValue(0.9);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 90 });
    statsScale.value = withSpring(1, { damping: 12 });
    locationToggleScale.value = withSpring(1, { damping: 10 });
    
    // Subtle alert pulse
    alertPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );

    // Network pulse
    networkPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200 }),
        withTiming(0, { duration: 2200 })
      ),
      -1,
      false
    );
  }, []);

  React.useEffect(() => {
    const tabPositions = { alerts: 0, ratings: 1, network: 2 };
    const containerWidth = width - scale(40);
    const tabWidth = containerWidth / 3;
    const indicatorWidth = tabWidth - scale(8);
    const indicatorOffset = scale(4);
    
    tabIndicatorPosition.value = withSpring(
      tabPositions[activeTab] * tabWidth + indicatorOffset, 
      { 
        damping: 18,
        stiffness: 120,
        mass: 0.8
      }
    );
  }, [activeTab]);

  const handleRespondToAlert = (alertId: string) => {
    respondToCommunityAlert(alertId);
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) },
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [50, 0], [0, 1]),
  }));

  const animatedTabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorPosition.value }],
  }));

  const animatedAlertStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      alertPulse.value,
      [0, 1],
      [COLORS.surface, '#FFFAFA']
    ),
  }));

  const animatedNetworkStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      networkPulse.value,
      [0, 1],
      ['#F0FDF4', '#ECFDF5']
    ),
  }));

  const animatedStatsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsScale.value }],
  }));

  const animatedLocationToggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: locationToggleScale.value }],
  }));

  const renderAlert = ({ item, index }: { item: CommunityAlert; index: number }) => (
    <Animated.View 
      style={[
        styles.alertCard, 
        animatedAlertStyle,
        isTablet && styles.alertCardTablet
      ]}
      layout={Layout.springify().damping(15).stiffness(100)}
      entering={FadeInUp.delay(index * 80).springify()}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertUserInfo}>
          <Animated.View 
            style={styles.alertAvatar}
            entering={BounceIn.delay(200)}
          >
            <AlertTriangle size={moderateScale(18)} color={COLORS.error} strokeWidth={2.5} />
          </Animated.View>
          <View style={styles.alertDetails}>
            <Text style={styles.alertUserName} numberOfLines={1}>
              {item.userName}
            </Text>
            <Text style={styles.alertTime}>
              {Math.floor((Date.now() - item.timestamp.getTime()) / 60000)}m ago
            </Text>
          </View>
        </View>
        <Animated.View 
          style={styles.alertDistance}
          entering={SlideInRight.delay(300)}
        >
          <Text style={styles.distanceText}>
            {item.distance}km
          </Text>
        </Animated.View>
      </View>

      <View style={styles.alertLocation}>
        <MapPin size={moderateScale(14)} color={COLORS.textSecondary} strokeWidth={2} />
        <Text style={styles.locationText} numberOfLines={2}>
          {item.location.address}
        </Text>
      </View>

      <View style={styles.alertActions}>
        <TouchableOpacity 
          style={styles.respondButton}
          onPress={() => handleRespondToAlert(item.id)}
          activeOpacity={0.7}
        >
          <Heart size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
          <Text style={styles.respondButtonText}>
            I'm helping!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.directionsButton}
          activeOpacity={0.7}
        >
          <Navigation size={moderateScale(16)} color={COLORS.primaryDark} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderRating = ({ item, index }: { item: SafetyRating; index: number }) => (
    <Animated.View 
      style={[
        styles.ratingCard,
        isTablet && styles.ratingCardTablet
      ]}
      layout={Layout.springify().damping(15).stiffness(100)}
      entering={FadeInUp.delay(index * 80).springify()}
    >
      <View style={styles.ratingHeader}>
        <View style={styles.ratingIconContainer}>
          <MapPin size={moderateScale(18)} color={COLORS.primaryDark} strokeWidth={2} />
        </View>
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingLocation} numberOfLines={2}>
            {item.location.address}
          </Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={moderateScale(14)} 
                color={star <= item.rating ? COLORS.warning : COLORS.borderDark}
                fill={star <= item.rating ? COLORS.warning : 'transparent'}
                strokeWidth={2}
              />
            ))}
          </View>
        </View>
        <Text style={styles.ratingTime}>
          {Math.floor((Date.now() - item.timestamp.getTime()) / 86400000)}d ago
        </Text>
      </View>
      {item.comment && (
        <Text style={styles.ratingComment} numberOfLines={3}>
          "{item.comment}"
        </Text>
      )}
    </Animated.View>
  );

  const renderNetworkStats = () => (
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

  const renderHeader = () => (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <View style={styles.headerContent}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.subtitle}>
            Stay connected with your safety network
          </Text>
        </View>
      </View>
      
      <Animated.View 
        style={[styles.locationToggle, animatedLocationToggleStyle]}
        entering={SlideInRight.delay(400)}
      >
        <View style={styles.toggleInfo}>
          <MapPin size={moderateScale(18)} color={COLORS.primaryDark} strokeWidth={2.5} />
          <Text style={styles.toggleLabel}>Share location</Text>
        </View>
        <Switch
          value={isLocationSharing}
          onValueChange={toggleLocationSharing}
          trackColor={{ false: COLORS.borderDark, true: COLORS.primary }}
          thumbColor={isLocationSharing ? COLORS.primaryDark : COLORS.surface}
          ios_backgroundColor={COLORS.borderDark}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderImpactStats = () => (
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderImpactStats()}

      {/* Tab Navigation */}
      <Animated.View 
        style={styles.tabContainer}
        entering={FadeInUp.delay(500)}
      >
        <View style={styles.tabBackground}>
          <Animated.View style={[styles.tabIndicator, animatedTabIndicatorStyle]} />
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('alerts')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'alerts' && styles.tabTextActive
            ]}>
              Alerts ({communityAlerts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('ratings')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'ratings' && styles.tabTextActive
            ]}>
              Ratings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('network')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'network' && styles.tabTextActive
            ]}>
              Network
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, animatedContentStyle]}>
        {activeTab === 'alerts' && (
          <FlatList
            data={communityAlerts}
            renderItem={renderAlert}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(20) }
            ]}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? 'tablet-alerts' : 'mobile-alerts'}
            columnWrapperStyle={isTablet ? styles.row : undefined}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Animated.View 
                style={styles.emptyContainer}
                entering={FadeInUp.delay(400).springify()}
              >
                <Animated.View 
                  style={styles.emptyIconContainer}
                  entering={BounceIn.delay(600)}
                >
                  <Shield size={moderateScale(64)} color={COLORS.success} strokeWidth={2} />
                </Animated.View>
                <Text style={styles.emptyTitle}>All Clear!</Text>
                <Text style={styles.emptySubtitle}>
                  No active alerts in your area. Your community is safe and secure.
                </Text>
              </Animated.View>
            }
          />
        )}

        {activeTab === 'ratings' && (
          <FlatList
            data={safetyRatings}
            renderItem={renderRating}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(20) }
            ]}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? 'tablet-ratings' : 'mobile-ratings'}
            columnWrapperStyle={isTablet ? styles.row : undefined}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Animated.View 
                style={styles.emptyContainer}
                entering={FadeInUp.delay(400).springify()}
              >
                <Animated.View 
                  style={styles.emptyIconContainer}
                  entering={BounceIn.delay(600)}
                >
                  <Star size={moderateScale(64)} color={COLORS.warning} strokeWidth={2} />
                </Animated.View>
                <Text style={styles.emptyTitle}>No Ratings Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Be the first to rate locations in your area for safety.
                </Text>
              </Animated.View>
            }
          />
        )}

        {activeTab === 'network' && renderNetworkStats()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    marginBottom: verticalScale(16),
  },
  headerTextContainer: {
    gap: verticalScale(4),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: 0.1,
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(16),
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flex: 1,
  },
  toggleLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  impactStatsContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
  },
  impactStats: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(18),
    flexDirection: 'row',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  impactStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(6),
  },
  impactStatNumber: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  impactStatLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  tabContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(16),
    alignItems: 'center',
  },
  tabBackground: {
    backgroundColor: COLORS.border,
    borderRadius: moderateScale(14),
    padding: scale(4),
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
  },
  tabIndicator: {
    position: 'absolute',
    width: `${100 / 3}%`,
    height: moderateScale(40),
    backgroundColor: COLORS.primaryDark,
    borderRadius: moderateScale(12),
    left: scale(4),
    top: scale(4),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    zIndex: 1,
  },
  tabText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  tabTextActive: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    gap: verticalScale(12),
  },
  row: {
    justifyContent: 'space-between',
    gap: scale(12),
  },
  alertCard: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(18),
    padding: scale(16),
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  alertCardTablet: {
    width: '48%',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  alertUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(12),
  },
  alertAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE4E6',
  },
  alertDetails: {
    flex: 1,
    gap: verticalScale(2),
  },
  alertUserName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  alertTime: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: COLORS.textLight,
    letterSpacing: 0.1,
  },
  alertDistance: {
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  distanceText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: COLORS.error,
    letterSpacing: 0.2,
  },
  alertLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(8),
    marginBottom: verticalScale(16),
    paddingRight: scale(8),
  },
  locationText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: moderateScale(18),
    letterSpacing: 0.1,
  },
  alertActions: {
    flexDirection: 'row',
    gap: scale(10),
  },
  respondButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    backgroundColor: COLORS.error,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  respondButtonText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.2,
  },
  directionsButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    backgroundColor: COLORS.primaryLight,
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(18),
    padding: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ratingCardTablet: {
    width: '48%',
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  ratingIconContainer: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingInfo: {
    flex: 1,
    gap: verticalScale(6),
  },
  ratingLocation: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: moderateScale(20),
    letterSpacing: 0.1,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: scale(2),
  },
  ratingTime: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: COLORS.textLight,
    letterSpacing: 0.1,
  },
  ratingComment: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: moderateScale(18),
    letterSpacing: 0.1,
  },
  networkScrollContent: {
    paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(20),
  },
  networkContainer: {
    margin: scale(20),
    borderRadius: moderateScale(20),
    padding: scale(20),
    borderWidth: 1,
    borderColor: COLORS.successLight,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  networkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  networkTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flex: 1,
  },
  networkTitle: {
    fontSize: moderateScale(19),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: COLORS.success,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  liveText: {
    fontSize: moderateScale(9),
    fontWeight: '800',
    color: COLORS.surface,
    letterSpacing: 0.8,
  },
  globalStats: {
    gap: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  globalStatsTablet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  globalStatItem: {
    alignItems: 'center',
    gap: verticalScale(8),
  },
  globalStatItemTablet: {
    flex: 1,
  },
  globalStatIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  globalStatNumber: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  globalStatLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  networkMetrics: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(14),
    padding: scale(16),
    marginBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metricRowLast: {
    borderBottomWidth: 0,
  },
  metricLabel: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
    letterSpacing: 0.1,
  },
  metricValue: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  safetyScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  networkInsights: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(14),
    padding: scale(16),
    gap: verticalScale(16),
  },
  insightsTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(4),
    letterSpacing: 0.1,
  },
  insightChartRow: {
    gap: verticalScale(8),
  },
  chartContainer: {
    backgroundColor: COLORS.background,
    borderRadius: moderateScale(12),
    padding: scale(14),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(6),
  },
  chartTitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    letterSpacing: 0.1,
  },
  chartSubtext: {
    fontSize: moderateScale(11),
    fontWeight: '400',
    color: COLORS.textLight,
    marginBottom: verticalScale(12),
    letterSpacing: 0.1,
  },
  activityChart: {
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(8),
    padding: scale(8),
    height: moderateScale(70),
  },
  chartGrid: {
    position: 'absolute',
    top: scale(8),
    left: scale(8),
    right: scale(8),
    bottom: scale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLine: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: scale(2),
  },
  chartBar: {
    width: moderateScale(6),
    borderRadius: moderateScale(2),
    marginHorizontal: scale(0.5),
  },
  coverageChart: {
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(8),
    padding: scale(12),
    alignSelf: 'flex-start',
    width: moderateScale(100),
    height: moderateScale(70),
  },
  coverageBackground: {
    position: 'absolute',
    top: scale(12),
    left: scale(12),
    right: scale(12),
    bottom: scale(12),
  },
  coverageFilled: {
    position: 'relative',
  },
  hexagon: {
    position: 'absolute',
    width: moderateScale(14),
    height: moderateScale(14),
    transform: [{ rotate: '45deg' }],
  },
  hexagonBg: {
    backgroundColor: COLORS.border,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  hexagonFilled: {
    backgroundColor: COLORS.success,
    borderWidth: 1,
    borderColor: '#059669',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  trustChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    width: moderateScale(90),
    height: moderateScale(90),
  },
  trustRing: {
    position: 'absolute',
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    borderWidth: moderateScale(6),
  },
  trustRingBg: {
    borderColor: COLORS.borderDark,
  },
  trustRingFilled: {
    borderTopColor: COLORS.info,
    borderRightColor: COLORS.purple,
    borderBottomColor: COLORS.borderDark,
    borderLeftColor: COLORS.borderDark,
    transform: [{ rotate: '180deg' }],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.info,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  trustCenter: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  trustScore: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: COLORS.info,
    letterSpacing: -0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(32),
  },
  emptyIconContainer: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(55),
    backgroundColor: COLORS.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  emptyTitle: {
    fontSize: moderateScale(21),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(10),
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    letterSpacing: 0.1,
  },
});