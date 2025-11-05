// components/trustees/TrusteeListItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, { FadeInUp, BounceIn, Layout } from 'react-native-reanimated';
import { MessageCircle, Shield, CheckCircle } from 'lucide-react-native';
import { Trustee } from '@/types/app';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface TrusteeListItemProps {
  item: Trustee;
  index: number;
  unreadCount: number;
  onPressMessage: (trusteeId: string) => void;
}

const TrusteeListItem: React.FC<TrusteeListItemProps> = React.memo(({
  item,
  index,
  unreadCount,
  onPressMessage,
}) => {
  return (
    <Animated.View
      style={[styles.trusteeCard, { width: isTablet ? '48%' : '100%' }]}
      layout={Layout.springify()}
      entering={FadeInUp.delay(index * 100).springify()}
    >
      <TouchableOpacity
        style={styles.trusteeContent}
        onPress={() => onPressMessage(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.trusteeLeft}>
          <View style={styles.trusteeImageContainer}>
            <Image
              source={{
                uri: item.profileImage || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
              }}
              style={styles.trusteeImage}
            />
            {item.isActive && (
              <Animated.View
                style={styles.onlineIndicator}
                entering={BounceIn.delay(200)}
              />
            )}
            {item.isVerified && (
              <Animated.View
                style={styles.verifiedBadge}
                entering={BounceIn.delay(400)}
              >
                <CheckCircle size={moderateScale(12)} color="#FFFFFF" />
              </Animated.View>
            )}
          </View>

          <View style={styles.trusteeInfo}>
            <View style={styles.trusteeNameRow}>
              <Text style={styles.trusteeName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.isVerified && (
                <Shield size={moderateScale(14)} color={COLORS.success} style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={styles.trusteeRelationship} numberOfLines={1}>
              {item.relationship}
            </Text>
            <View style={styles.trusteeContactInfo}>
              <Text style={styles.trusteePhone} numberOfLines={1}>
                {item.phone}
              </Text>
              {item.uniqueId && (
                <Text style={styles.trusteeId} numberOfLines={1}>
                  ID: {item.uniqueId}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.trusteeRight}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => onPressMessage(item.id)}
          >
            <MessageCircle size={moderateScale(20)} color={COLORS.primaryDark} />
            {unreadCount > 0 && (
              <Animated.View
                style={styles.unreadBadge}
                entering={BounceIn}
              >
                <Text style={styles.unreadBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </Animated.View>
            )}
          </TouchableOpacity>
          <Text style={styles.lastSeen}>
            {item.isActive ? 'Online' : '2h ago'} {/* TODO: Replace with real last seen */}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Copy relevant styles from trustees.tsx
const styles = StyleSheet.create({
  trusteeCard: { backgroundColor: COLORS.surface, borderRadius: moderateScale(20), marginBottom: verticalScale(16), borderWidth: 1, borderColor: '#F9FAFB', // Or COLORS.border?
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, }, android: { elevation: 3, }, }), },
  trusteeContent: { flexDirection: 'row', alignItems: 'center', padding: scale(20), minHeight: verticalScale(90), },
  trusteeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, },
  trusteeImageContainer: { position: 'relative', marginRight: scale(16), },
  trusteeImage: { width: moderateScale(56), height: moderateScale(56), borderRadius: moderateScale(28), borderWidth: 3, borderColor: COLORS.primary, }, // Use primary border
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: moderateScale(16), height: moderateScale(16), borderRadius: moderateScale(8), backgroundColor: COLORS.success, borderWidth: 3, borderColor: COLORS.surface, },
  verifiedBadge: { position: 'absolute', top: -4, right: -4, width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.surface, ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, }, android: { elevation: 2, }, }), },
  trusteeInfo: { flex: 1, },
  trusteeNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(6), },
  trusteeName: { fontSize: moderateScale(18), fontWeight: '700', color: COLORS.text, flexShrink: 1, },
  verifiedIcon: { marginLeft: scale(8), },
  trusteeRelationship: { fontSize: moderateScale(14), fontWeight: '500', color: COLORS.primaryDark, marginBottom: verticalScale(8), },
  trusteeContactInfo: { gap: verticalScale(3), },
  trusteePhone: { fontSize: moderateScale(13), color: COLORS.textSecondary, },
  trusteeId: { fontSize: moderateScale(12), color: COLORS.textLight, },
  trusteeRight: { alignItems: 'center', gap: verticalScale(10), marginLeft: scale(12), },
  messageButton: { position: 'relative', width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFE4E6', // Consider COLORS.primary border
    ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, }, android: { elevation: 2, }, }), },
  unreadBadge: { position: 'absolute', top: -6, right: -6, minWidth: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), backgroundColor: '#FF1744', // Use COLORS.error?
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.surface, paddingHorizontal: scale(4),
    ...Platform.select({ ios: { shadowColor: '#FF1744', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, }, android: { elevation: 3, }, }), },
  unreadBadgeText: { fontSize: moderateScale(10), fontWeight: '700', color: '#FFFFFF', },
  lastSeen: { fontSize: moderateScale(11), color: COLORS.textLight, textAlign: 'center', },
});

export default TrusteeListItem;