// components/dashboard/LocationCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MapPin, Navigation } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface LocationCardProps {
  address?: string; // Make address optional
}

const LocationCard: React.FC<LocationCardProps> = ({ address }) => {
  return (
    <Animated.View
      style={styles.locationCard}
      entering={FadeInUp.delay(400)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: COLORS.successLight }]}>
          <MapPin size={moderateScale(16)} color={COLORS.success} strokeWidth={2.5} />
        </View>
        <Text style={styles.cardTitle}>Live Location</Text>
        <View style={styles.updateBadge}>
          <View style={styles.updateDot} />
          <Text style={styles.updateText}>Updating</Text>
        </View>
      </View>
      <Text style={styles.locationAddress}>
        {address || 'Market Street, San Francisco, CA'} {/* Default */}
      </Text>
      <Text style={styles.locationUpdate}>Last updated: Just now</Text>
      <TouchableOpacity style={styles.directionsButton} activeOpacity={0.7}>
        <Navigation size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
        <Text style={styles.directionsButtonText}>Get Directions</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  locationCard: { backgroundColor: COLORS.surface, padding: scale(18), borderRadius: moderateScale(18), borderWidth: 1, borderColor: COLORS.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, }, android: { elevation: 2, }, }), },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: verticalScale(14), },
  cardIconContainer: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), justifyContent: 'center', alignItems: 'center', },
  cardTitle: { flex: 1, fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, letterSpacing: 0.1, },
  updateBadge: { flexDirection: 'row', alignItems: 'center', gap: scale(4), backgroundColor: COLORS.successLight, paddingHorizontal: scale(8), paddingVertical: verticalScale(4), borderRadius: moderateScale(8), },
  updateDot: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), backgroundColor: COLORS.success, },
  updateText: { fontSize: moderateScale(10), fontWeight: '700', color: COLORS.success, letterSpacing: 0.3, },
  locationAddress: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.text, marginBottom: verticalScale(8), lineHeight: moderateScale(20), letterSpacing: 0.1, },
  locationUpdate: { fontSize: moderateScale(12), fontWeight: '500', color: COLORS.textSecondary, marginBottom: verticalScale(16), letterSpacing: 0.1, },
  directionsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), backgroundColor: COLORS.success, paddingVertical: verticalScale(12), borderRadius: moderateScale(12), ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, }, android: { elevation: 3, }, }), },
  directionsButtonText: { fontSize: moderateScale(14), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.2, },
});

export default LocationCard;
