// components/community/CommunityTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};
const { width } = Dimensions.get('window');

type CommunityTab = 'alerts' | 'ratings' | 'network';

interface CommunityTabsProps {
  activeTab: CommunityTab;
  setActiveTab: (tab: CommunityTab) => void;
  alertCount: number;
  animatedTabIndicatorStyle: any;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({
  activeTab,
  setActiveTab,
  alertCount,
  animatedTabIndicatorStyle,
}) => {
  const containerWidth = width - scale(40); // Width of the tab container
  const indicatorWidth = containerWidth / 3 - scale(8); // Width of the indicator

  return (
    <Animated.View
      style={styles.tabContainer}
      entering={FadeInUp.delay(500)}
    >
      <View style={styles.tabBackground}>
        <Animated.View style={[
            styles.tabIndicator,
            { width: indicatorWidth },
            animatedTabIndicatorStyle
        ]} />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('alerts')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'alerts' && styles.tabTextActive
          ]}>
            Alerts ({alertCount})
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
  );
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  tabContainer: { paddingHorizontal: scale(20), paddingBottom: verticalScale(16), alignItems: 'center', },
  tabBackground: { backgroundColor: COLORS.border, borderRadius: moderateScale(14), padding: scale(4), flexDirection: 'row', position: 'relative', width: '100%', },
  tabIndicator: { position: 'absolute', height: moderateScale(40), backgroundColor: COLORS.primaryDark, borderRadius: moderateScale(12), top: scale(4), ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, }, android: { elevation: 3, }, }), },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(10), zIndex: 1, },
  tabText: { fontSize: moderateScale(12), fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.2, textAlign: 'center', },
  tabTextActive: { color: COLORS.surface, fontWeight: '700', },
});

export default CommunityTabs;