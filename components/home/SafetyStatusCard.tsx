// components/home/SafetyStatusCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Shield, MapPin, Users, Clock } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';
import { Trustee, SOSStatus } from '@/types/app'; // Assuming types are defined

// Reusable InfoRow sub-component
const InfoRow = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <View style={styles.infoRow}>
        <Icon size={moderateScale(16)} color={COLORS.textSecondary} />
        <Text style={styles.infoRowText}>{text}</Text>
    </View>
);

interface SafetyStatusCardProps {
  sosStatus: SOSStatus;
  isLocationSharing: boolean;
  trustees: Trustee[];
  currentTime: Date;
}

const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({
  sosStatus,
  isLocationSharing,
  trustees,
  currentTime,
}) => {
  const isActive = sosStatus.isActive;
  const onlineTrustees = trustees.filter((t: any) => t.isActive).length;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Shield size={moderateScale(22)} color={isActive ? COLORS.error : COLORS.success} />
        <Text style={styles.cardTitle}>Safety Status</Text>
        <View style={[styles.safetyIndicator, { backgroundColor: isActive ? COLORS.errorLight : COLORS.successLight }]}>
          <Text style={[styles.safetyIndicatorText, { color: isActive ? '#C53030' : '#065F46' }]}>
            {isActive ? 'EMERGENCY' : 'SAFE'}
          </Text>
        </View>
      </View>
      <View style={styles.safetyDetails}>
        <InfoRow icon={MapPin} text={`Location: ${isLocationSharing ? 'Sharing' : 'Private'}`} />
        <InfoRow icon={Users} text={`${onlineTrustees} trustees online`} />
        <InfoRow icon={Clock} text={`Last check: ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
      </View>
    </View>
  );
};

// Copy relevant styles from index.tsx here (including card, cardHeader, etc.)
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: moderateScale(20), padding: scale(16), marginBottom: verticalScale(16), marginHorizontal: scale(16), ...Platform.select({ ios: { shadowColor: '#D1D5DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 3, borderColor: COLORS.border, borderWidth: 1 } }) },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(12) },
  cardTitle: { fontSize: moderateScale(18), fontFamily: 'Inter-Bold', color: COLORS.text, marginLeft: scale(8), flex: 1 },
  safetyIndicator: { paddingHorizontal: scale(12), paddingVertical: verticalScale(6), borderRadius: moderateScale(16) },
  safetyIndicatorText: { fontSize: moderateScale(10), fontFamily: 'Inter-Bold' },
  safetyDetails: { paddingTop: verticalScale(8), gap: verticalScale(8) },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoRowText: { marginLeft: scale(12), fontSize: moderateScale(14), fontFamily: 'Inter-Regular', color: COLORS.textSecondary }, // Adjusted color
});

export default SafetyStatusCard;