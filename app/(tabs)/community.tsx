// app/(tabs)/community.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { CommunityAlert, SafetyRating } from '@/types/app';
import { Shield, Star } from 'lucide-react-native';
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
} from 'react-native-reanimated';

// Import Constants & Utilities
import { SAFE_BOTTOM_PADDING } from './_layout';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Assuming COLORS are moved

// Import Components
import CommunityHeader from '@/components/community/CommunityHeader';
import ImpactStats from '@/components/community/ImpactStats';
import CommunityTabs from '@/components/community/CommunityTabs';
import AlertCard from '@/components/community/AlertCard';
import RatingCard from '@/components/community/RatingCard';
import NetworkStatsSection from '@/components/community/NetworkStatsSection';
import ListEmptyState from '@/components/community/ListEmptyState';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
type CommunityTab = 'alerts' | 'ratings' | 'network';

export default function CommunityScreen() {
  const {
    communityAlerts,
    safetyRatings,
    isLocationSharing,
    toggleLocationSharing,
    respondToCommunityAlert
  } = useAppState();

  const [activeTab, setActiveTab] = useState<CommunityTab>('alerts');

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const tabIndicatorPosition = useSharedValue(0);
  const alertPulse = useSharedValue(0);
  const networkPulse = useSharedValue(0);
  const statsScale = useSharedValue(0.8);
  const locationToggleScale = useSharedValue(0.9);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 90 });
    statsScale.value = withSpring(1, { damping: 12 });
    locationToggleScale.value = withSpring(1, { damping: 10 });

    alertPulse.value = withRepeat(withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 1800 })), -1, false);
    networkPulse.value = withRepeat(withSequence(withTiming(1, { duration: 2200 }), withTiming(0, { duration: 2200 })), -1, false);
  }, []);

  useEffect(() => {
    const tabPositions: Record<CommunityTab, number> = { alerts: 0, ratings: 1, network: 2 };
    const containerWidth = width - scale(40);
    const tabWidth = containerWidth / 3;
    const indicatorOffset = scale(4);

    tabIndicatorPosition.value = withSpring(
      tabPositions[activeTab] * tabWidth + indicatorOffset,
      { damping: 18, stiffness: 120, mass: 0.8 }
    );
  }, [activeTab]);

  const handleRespondToAlert = (alertId: string) => {
    respondToCommunityAlert(alertId);
    // Optional: Add feedback like a confirmation message
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }],
  }));
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [50, 0], [0, 1]),
  }));
  const animatedTabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorPosition.value }],
  }));
  const animatedAlertStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(alertPulse.value, [0, 1], [COLORS.surface, '#FFFAFA']),
  }));
  const animatedNetworkStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(networkPulse.value, [0, 1], ['#F0FDF4', '#ECFDF5']),
  }));
  const animatedStatsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsScale.value }],
  }));
  const animatedLocationToggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: locationToggleScale.value }],
  }));

  // Memoized Render Items
  const renderAlertItem = React.useCallback(({ item, index }: { item: CommunityAlert; index: number }) => (
    <AlertCard
      item={item}
      index={index}
      animatedAlertStyle={animatedAlertStyle}
      onRespond={handleRespondToAlert}
    />
  ), [animatedAlertStyle, handleRespondToAlert]);

  const renderRatingItem = React.useCallback(({ item, index }: { item: SafetyRating; index: number }) => (
    <RatingCard item={item} index={index} />
  ), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CommunityHeader
        isLocationSharing={isLocationSharing}
        toggleLocationSharing={toggleLocationSharing}
        animatedHeaderStyle={animatedHeaderStyle}
        animatedLocationToggleStyle={animatedLocationToggleStyle}
      />
      <ImpactStats animatedStatsStyle={animatedStatsStyle} />

      <CommunityTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={communityAlerts.length}
        animatedTabIndicatorStyle={animatedTabIndicatorStyle}
      />

      <Animated.View style={[styles.content, animatedContentStyle]}>
        {activeTab === 'alerts' && (
          <FlatList
            data={communityAlerts}
            renderItem={renderAlertItem}
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
              <ListEmptyState
                icon={Shield}
                iconColor={COLORS.success}
                iconBackgroundColor={COLORS.successLight}
                iconBorderColor="#BBF7D0"
                title="All Clear!"
                subtitle="No active alerts in your area. Your community is safe and secure."
              />
            }
          />
        )}

        {activeTab === 'ratings' && (
          <FlatList
            data={safetyRatings}
            renderItem={renderRatingItem}
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
              <ListEmptyState
                icon={Star}
                iconColor={COLORS.warning}
                iconBackgroundColor={COLORS.warningLight} // Use warningLight
                iconBorderColor="#FDE68A" // Use a border related to warning
                title="No Ratings Yet"
                subtitle="Be the first to rate locations in your area for safety."
              />
            }
          />
        )}

        {activeTab === 'network' && (
          <NetworkStatsSection animatedNetworkStyle={animatedNetworkStyle} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

// Keep only essential container/layout styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    gap: verticalScale(12),
  },
  row: { // Style for tablet columns
    justifyContent: 'space-between',
    gap: scale(12),
  },
});