// components/community/ListEmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};

interface ListEmptyStateProps {
  icon: LucideIcon;
  iconColor: string;
  iconBackgroundColor: string;
  iconBorderColor: string;
  title: string;
  subtitle: string;
}

const ListEmptyState: React.FC<ListEmptyStateProps> = ({
  icon: Icon,
  iconColor,
  iconBackgroundColor,
  iconBorderColor,
  title,
  subtitle,
}) => {
  return (
    <Animated.View
      style={styles.emptyContainer}
      entering={FadeInUp.delay(400).springify()}
    >
      <Animated.View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: iconBackgroundColor, borderColor: iconBorderColor }
        ]}
        entering={BounceIn.delay(600)}
      >
        <Icon size={moderateScale(64)} color={iconColor} strokeWidth={2} />
      </Animated.View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </Animated.View>
  );
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  emptyContainer: { alignItems: 'center', paddingVertical: verticalScale(60), paddingHorizontal: scale(32), },
  emptyIconContainer: { width: moderateScale(110), height: moderateScale(110), borderRadius: moderateScale(55), justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(20), borderWidth: 2, },
  emptyTitle: { fontSize: moderateScale(21), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(10), textAlign: 'center', letterSpacing: -0.3, },
  emptySubtitle: { fontSize: moderateScale(14), fontWeight: '400', color: COLORS.textSecondary, textAlign: 'center', lineHeight: moderateScale(20), letterSpacing: 0.1, },
});

export default ListEmptyState;