// components/trustees/UniqueIdCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Hash, Share2 } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface UniqueIdCardProps {
  uniqueId: string | undefined;
}

const UniqueIdCard: React.FC<UniqueIdCardProps> = ({ uniqueId }) => {

  const handleShareUniqueId = () => {
    // In a real app, use Clipboard API or Share API
    Alert.alert('Unique ID Shared', 'Your unique ID has been copied to clipboard');
  };

  return (
    <Animated.View
      style={styles.uniqueIdCard}
      entering={FadeInDown.delay(200).springify()}
    >
      <View style={styles.uniqueIdHeader}>
        <Hash size={moderateScale(20)} color={COLORS.primaryDark} />
        <Text style={styles.uniqueIdTitle}>
          Your Unique ID
        </Text>
      </View>
      <View style={styles.uniqueIdContainer}>
        <Text style={styles.uniqueIdText}>
          {uniqueId || '1234567890'} {/* Fallback for display */}
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareUniqueId}
          activeOpacity={0.8}
        >
          <Share2 size={moderateScale(12)} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.shareButtonText}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.uniqueIdDescription}>
        Share this ID with people you trust so they can add you as their trustee
      </Text>
    </Animated.View>
  );
};

// Copy relevant styles from trustees.tsx
const styles = StyleSheet.create({
  uniqueIdCard: {
    backgroundColor: COLORS.surface, marginHorizontal: scale(20), marginTop: verticalScale(16), marginBottom: verticalScale(20), padding: scale(20), borderRadius: moderateScale(20), borderWidth: 1, borderColor: '#FFE4E6', // Consider using COLORS.primaryLight border
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, }, android: { elevation: 3, }, }),
  },
  uniqueIdHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(16), },
  uniqueIdTitle: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, marginLeft: scale(12), },
  uniqueIdContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primaryLight, padding: scale(16), borderRadius: moderateScale(16), marginBottom: verticalScale(12), borderWidth: 1, borderColor: COLORS.primary, // Use primary border
  },
  uniqueIdText: { fontSize: moderateScale(20), fontWeight: '700', color: COLORS.primaryDark, letterSpacing: 2, flex: 1, },
  shareButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryDark, paddingHorizontal: scale(16), paddingVertical: verticalScale(10), borderRadius: moderateScale(12),
    ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, }, android: { elevation: 2, }, }),
  },
  shareButtonText: { fontSize: moderateScale(12), fontWeight: '700', color: '#FFFFFF', },
  uniqueIdDescription: { fontSize: moderateScale(12), color: COLORS.textSecondary, lineHeight: moderateScale(18), },
});

export default UniqueIdCard;