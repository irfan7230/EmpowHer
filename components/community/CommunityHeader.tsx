// components/community/CommunityHeader.tsx
import React from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { MapPin } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import from constants/theme.ts
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};

interface CommunityHeaderProps {
  isLocationSharing: boolean;
  toggleLocationSharing: () => void;
  animatedHeaderStyle: any;
  animatedLocationToggleStyle: any;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  isLocationSharing,
  toggleLocationSharing,
  animatedHeaderStyle,
  animatedLocationToggleStyle,
}) => {
  return (
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
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.surface, paddingHorizontal: scale(20), paddingTop: verticalScale(16), paddingBottom: verticalScale(16), borderBottomWidth: 1, borderBottomColor: COLORS.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  headerContent: { marginBottom: verticalScale(16), },
  headerTextContainer: { gap: verticalScale(4), },
  title: { fontSize: moderateScale(26), fontWeight: '700', color: COLORS.text, letterSpacing: -0.5, },
  subtitle: { fontSize: moderateScale(13), fontWeight: '400', color: COLORS.textSecondary, letterSpacing: 0.1, },
  locationToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primaryLight, paddingHorizontal: scale(16), paddingVertical: verticalScale(14), borderRadius: moderateScale(16), borderWidth: 1.5, borderColor: COLORS.primary, },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: scale(10), flex: 1, },
  toggleLabel: { fontSize: moderateScale(14), fontWeight: '600', color: COLORS.text, letterSpacing: 0.1, },
});

export default CommunityHeader;