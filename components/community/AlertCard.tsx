// components/community/AlertCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, { Layout, FadeInUp, BounceIn, SlideInRight } from 'react-native-reanimated';
import { AlertTriangle, MapPin, Heart, Navigation } from 'lucide-react-native';
import { CommunityAlert } from '@/types/app';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};
const isTablet = Dimensions.get('window').width >= 768; // Assuming isTablet is defined

interface AlertCardProps {
  item: CommunityAlert;
  index: number;
  animatedAlertStyle: any; // Pass the pulse animation style
  onRespond: (alertId: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ item, index, animatedAlertStyle, onRespond }) => {
  return (
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
          onPress={() => onRespond(item.id)}
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
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  alertCard: { backgroundColor: COLORS.surface, borderRadius: moderateScale(18), padding: scale(16), borderLeftWidth: 4, borderLeftColor: COLORS.error, ...Platform.select({ ios: { shadowColor: COLORS.error, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, }, android: { elevation: 3, }, }), },
  alertCardTablet: { width: '48%', }, // Added for tablet layout
  alertHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: verticalScale(12), },
  alertUserInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: scale(12), },
  alertAvatar: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: COLORS.errorLight, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFE4E6', },
  alertDetails: { flex: 1, gap: verticalScale(2), },
  alertUserName: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.text, letterSpacing: 0.1, },
  alertTime: { fontSize: moderateScale(11), fontWeight: '500', color: COLORS.textLight, letterSpacing: 0.1, },
  alertDistance: { backgroundColor: COLORS.errorLight, paddingHorizontal: scale(10), paddingVertical: verticalScale(6), borderRadius: moderateScale(12), borderWidth: 1, borderColor: '#FFE4E6', },
  distanceText: { fontSize: moderateScale(11), fontWeight: '700', color: COLORS.error, letterSpacing: 0.2, },
  alertLocation: { flexDirection: 'row', alignItems: 'flex-start', gap: scale(8), marginBottom: verticalScale(16), paddingRight: scale(8), },
  locationText: { flex: 1, fontSize: moderateScale(13), fontWeight: '400', color: COLORS.textSecondary, lineHeight: moderateScale(18), letterSpacing: 0.1, },
  alertActions: { flexDirection: 'row', gap: scale(10), },
  respondButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(6), backgroundColor: COLORS.error, paddingVertical: verticalScale(12), borderRadius: moderateScale(12), ...Platform.select({ ios: { shadowColor: COLORS.error, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, }, android: { elevation: 3, }, }), },
  respondButtonText: { fontSize: moderateScale(13), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.2, },
  directionsButton: { width: moderateScale(44), height: moderateScale(44), backgroundColor: COLORS.primaryLight, borderRadius: moderateScale(12), borderWidth: 1.5, borderColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center', },
});

export default AlertCard;