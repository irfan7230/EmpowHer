// components/home/CommunityActivityCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { CommunityAlert } from '@/types/app';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface CommunityActivityCardProps {
  alerts: CommunityAlert[];
}

const CommunityActivityCard: React.FC<CommunityActivityCardProps> = ({ alerts }) => {
  // Only render if there are alerts
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recent Community Activity</Text>
      {alerts.slice(0, 2).map((alert: CommunityAlert) => ( // Use slice from original
        <View key={alert.id} style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <AlertTriangle size={moderateScale(20)} color={COLORS.error} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityText}>{alert.userName} requested help</Text>
            <Text style={styles.activitySubText}>{`📍 Near ${alert.location.address}`}</Text>
          </View>
          <Text style={styles.activityTime}>{`${Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)}m ago`}</Text>
        </View>
      ))}
    </View>
  );
};

// Copy relevant styles from index.tsx here (card, cardTitle, activityItem, etc.)
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: moderateScale(20), padding: scale(16), marginBottom: verticalScale(16), marginHorizontal: scale(16), ...Platform.select({ ios: { shadowColor: '#D1D5DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 3, borderColor: COLORS.border, borderWidth: 1 } }) },
  cardTitle: { fontSize: moderateScale(18), fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: verticalScale(12) }, // Added marginBottom
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: verticalScale(12), borderTopWidth: 1, borderTopColor: COLORS.border },
  activityIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: COLORS.errorLight, justifyContent: 'center', alignItems: 'center', marginRight: scale(12) },
  activityText: { fontSize: moderateScale(14), fontFamily: 'Inter-Medium', color: COLORS.text }, // Adjusted color
  activitySubText: { fontSize: moderateScale(12), fontFamily: 'Inter-Regular', color: COLORS.textSecondary },
  activityTime: { fontSize: moderateScale(12), fontFamily: 'Inter-Regular', color: COLORS.textLight }, // Adjusted color
});

export default CommunityActivityCard;