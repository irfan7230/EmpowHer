// components/home/VoiceCommandCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Mic, Volume2 } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

const VoiceCommandCard: React.FC = () => {
  return (
    <View style={[styles.card, styles.voiceCard]}>
      <Mic size={moderateScale(24)} color={COLORS.purple} />
      <View style={{ flex: 1, marginLeft: scale(12) }}>
        <Text style={styles.voiceTitle}>Voice Command</Text>
        <Text style={styles.voiceDescription}>Say "Hey EmpowHer, help" for hands-free SOS</Text>
      </View>
      <View style={styles.voiceListeningIndicator}>
        <Volume2 size={moderateScale(14)} color={COLORS.purple} />
      </View>
    </View>
  );
};

// Copy relevant styles from index.tsx here (card, voiceCard, etc.)
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: moderateScale(20), padding: scale(16), marginBottom: verticalScale(16), marginHorizontal: scale(16), ...Platform.select({ ios: { shadowColor: '#D1D5DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 3, borderColor: COLORS.border, borderWidth: 1 } }) },
  voiceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF' }, // Adjusted color slightly for contrast if needed
  voiceTitle: { fontSize: moderateScale(15), fontFamily: 'Inter-Bold', color: '#5B21B6' },
  voiceDescription: { fontSize: moderateScale(13), fontFamily: 'Inter-Regular', color: '#6D28D9', marginTop: 2 },
  voiceListeningIndicator: { width: moderateScale(32), height: moderateScale(32), borderRadius: moderateScale(16), backgroundColor: 'rgba(139, 92, 246, 0.2)', justifyContent: 'center', alignItems: 'center' },
});

export default VoiceCommandCard;