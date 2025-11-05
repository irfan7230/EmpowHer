// components/dashboard/EvidenceStatusCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Camera, Mic, Video, CheckCircle, Activity } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

// TODO: Define or import evidence status type if available
interface EvidenceStatus {
  photos: boolean; // True if captured/active
  audio: boolean; // True if recording/active
  video: boolean; // True if streaming/active
}

interface EvidenceStatusCardProps {
  // Pass actual evidence status when available
  // evidenceStatus: EvidenceStatus;
}

const EvidenceStatusCard: React.FC<EvidenceStatusCardProps> = (/* { evidenceStatus } */) => {
  // Using mock status for now based on original code's implied state
  const mockStatus = { photos: true, audio: true, video: true };

  return (
    <Animated.View
      style={styles.evidenceCard}
      entering={FadeInUp.delay(500)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: COLORS.warningLight }]}>
          <Camera size={moderateScale(16)} color={COLORS.warning} strokeWidth={2.5} />
        </View>
        <Text style={styles.cardTitle}>Evidence Collection</Text>
      </View>
      <View style={styles.evidenceItems}>
        {/* Photos */}
        <View style={styles.evidenceItem}>
          <View style={styles.evidenceIcon}>
            <Camera size={moderateScale(12)} color={COLORS.success} strokeWidth={2.5} />
          </View>
          <Text style={styles.evidenceText}>Photos: 3 captured</Text>
          <View style={styles.evidenceStatus}>
            <CheckCircle size={moderateScale(10)} color={COLORS.success} strokeWidth={2.5} />
          </View>
        </View>
        {/* Audio */}
        <View style={styles.evidenceItem}>
          <View style={styles.evidenceIcon}>
            <Mic size={moderateScale(12)} color={COLORS.error} strokeWidth={2.5} />
          </View>
          <Text style={styles.evidenceText}>Audio: Recording</Text>
          <View style={[styles.evidenceStatus, styles.evidenceStatusActive]}>
            <Activity size={moderateScale(10)} color={COLORS.error} strokeWidth={2.5} />
          </View>
        </View>
        {/* Video */}
        <View style={styles.evidenceItem}>
          <View style={styles.evidenceIcon}>
            <Video size={moderateScale(12)} color={COLORS.info} strokeWidth={2.5} />
          </View>
          <Text style={styles.evidenceText}>Video: Streaming</Text>
          <View style={[styles.evidenceStatus, styles.evidenceStatusActive, { backgroundColor: COLORS.infoLight }]}>
             <Activity size={moderateScale(10)} color={COLORS.info} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  evidenceCard: { backgroundColor: COLORS.surface, padding: scale(18), borderRadius: moderateScale(18), borderWidth: 1, borderColor: COLORS.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, }, android: { elevation: 2, }, }), },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: verticalScale(14), },
  cardIconContainer: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), justifyContent: 'center', alignItems: 'center', },
  cardTitle: { flex: 1, fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, letterSpacing: 0.1, },
  evidenceItems: { gap: verticalScale(12), },
  evidenceItem: { flexDirection: 'row', alignItems: 'center', gap: scale(10), backgroundColor: COLORS.background, padding: scale(12), borderRadius: moderateScale(12), },
  evidenceIcon: { width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(14), backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', },
  evidenceText: { flex: 1, fontSize: moderateScale(13), fontWeight: '600', color: COLORS.text, letterSpacing: 0.1, },
  evidenceStatus: { width: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), backgroundColor: COLORS.successLight, justifyContent: 'center', alignItems: 'center', },
  evidenceStatusActive: { backgroundColor: COLORS.errorLight, }, // Default active is error, override per item if needed
});

export default EvidenceStatusCard;