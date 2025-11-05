// components/home/HomeFAB.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface HomeFABProps {
  onPress: () => void;
  unreadCount: number;
  animatedFABStyle: any;
  bottomPadding: number; // Pass calculated bottom padding
}

const HomeFAB: React.FC<HomeFABProps> = ({
  onPress,
  unreadCount,
  animatedFABStyle,
  bottomPadding,
}) => {
  return (
    <Animated.View
      style={[
        styles.fabContainer,
        animatedFABStyle,
        { bottom: bottomPadding } // Use dynamic bottom padding
      ]}
    >
      <TouchableOpacity
        style={[styles.messengerButton, styles.elevatedFAB]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MessageCircle size={moderateScale(28)} color="#FFFFFF" />
        {unreadCount > 0 && (
          <View style={styles.messengerBadge}>
            <Text style={styles.messengerBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Copy relevant styles from index.tsx here
const styles = StyleSheet.create({
  fabContainer: { position: 'absolute', right: scale(20), zIndex: 1000, },
  messengerButton: { width: moderateScale(64), height: moderateScale(64), borderRadius: moderateScale(32), backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center', }, // Use secondary color
  elevatedFAB: { shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 16, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.2)', },
  messengerBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.surface, minWidth: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.secondary, paddingHorizontal: scale(6), },
  messengerBadgeText: { color: COLORS.secondary, fontSize: moderateScale(11), fontFamily: 'Inter-Bold', fontWeight: '700', },
});

export default HomeFAB;