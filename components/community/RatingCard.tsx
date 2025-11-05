// components/community/RatingCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, { Layout, FadeInUp } from 'react-native-reanimated';
import { MapPin, Star } from 'lucide-react-native';
import { SafetyRating } from '@/types/app';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#FF6347', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', purple: '#8B5CF6', cyan: '#06B6D4',
};
const isTablet = Dimensions.get('window').width >= 768; // Assuming isTablet is defined

interface RatingCardProps {
  item: SafetyRating;
  index: number;
}

const RatingCard: React.FC<RatingCardProps> = ({ item, index }) => {
  return (
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
};

// Copy relevant styles from community.tsx here
const styles = StyleSheet.create({
  ratingCard: { backgroundColor: COLORS.surface, borderRadius: moderateScale(18), padding: scale(16), borderWidth: 1, borderColor: COLORS.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, }, android: { elevation: 2, }, }), },
  ratingCardTablet: { width: '48%', }, // Added for tablet layout
  ratingHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: scale(12), marginBottom: verticalScale(12), },
  ratingIconContainer: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', },
  ratingInfo: { flex: 1, gap: verticalScale(6), },
  ratingLocation: { fontSize: moderateScale(14), fontWeight: '700', color: COLORS.text, lineHeight: moderateScale(20), letterSpacing: 0.1, },
  ratingStars: { flexDirection: 'row', gap: scale(2), },
  ratingTime: { fontSize: moderateScale(11), fontWeight: '500', color: COLORS.textLight, letterSpacing: 0.1, },
  ratingComment: { fontSize: moderateScale(13), fontWeight: '400', color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: moderateScale(18), letterSpacing: 0.1, },
});

export default RatingCard;