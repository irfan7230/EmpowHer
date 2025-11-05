// components/dashboard/LiveStreamSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { Video, Mic, Volume2, Camera } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface LiveStreamSectionProps {
  animatedStreamStyle: any; // Border pulse
  audioBarStyles: any[]; // Array of animated styles for audio bars
}

const LiveStreamSection: React.FC<LiveStreamSectionProps> = ({
  animatedStreamStyle,
  audioBarStyles,
}) => {
  return (
    <Animated.View style={[styles.streamContainer, animatedStreamStyle]}>
      <View style={styles.streamHeader}>
        <View style={styles.streamTitleContainer}>
          <Video size={moderateScale(20)} color={COLORS.error} strokeWidth={2.5} />
          <Text style={styles.streamTitle}>Live Stream</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.streamControls}>
          <TouchableOpacity style={styles.streamControl} activeOpacity={0.7}>
            <Volume2 size={moderateScale(16)} color={COLORS.textSecondary} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.streamControl} activeOpacity={0.7}>
            <Camera size={moderateScale(16)} color={COLORS.textSecondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.streamPlaceholder}>
        <View style={styles.streamPlaceholderIcon}>
          <Video size={moderateScale(48)} color={COLORS.textLight} strokeWidth={2} />
        </View>
        <Text style={styles.streamPlaceholderTitle}>Live Video Feed</Text>
        <Text style={styles.streamPlaceholderSubtitle}>
          Real-time video and audio from Jessica's device
        </Text>
        <View style={styles.streamQuality}>
          <View style={styles.qualityDot} />
          <Text style={styles.qualityText}>HD Quality • Stable Connection</Text>
        </View>
      </View>

      <View style={styles.audioIndicator}>
        <Mic size={moderateScale(16)} color={COLORS.error} strokeWidth={2.5} />
        <Text style={styles.audioText}>Audio Active</Text>
        <View style={styles.audioWave}>
          {[0, 1, 2, 3, 4].map((index) => (
            <Animated.View
              key={index}
              style={[styles.audioBar, audioBarStyles[index]]} // Apply pre-created animated styles
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  streamContainer: { margin: scale(20), backgroundColor: COLORS.surface, borderRadius: moderateScale(20), overflow: 'hidden', borderWidth: 2, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  streamHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: scale(16), backgroundColor: COLORS.errorLight, borderBottomWidth: 1, borderBottomColor: '#FECACA', },
  streamTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(10), },
  streamTitle: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.error, letterSpacing: 0.1, },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: scale(4), backgroundColor: COLORS.error, paddingHorizontal: scale(8), paddingVertical: verticalScale(4), borderRadius: moderateScale(8), },
  liveDot: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), backgroundColor: COLORS.surface, },
  liveText: { fontSize: moderateScale(9), fontWeight: '800', color: COLORS.surface, letterSpacing: 0.8, },
  streamControls: { flexDirection: 'row', gap: scale(8), },
  streamControl: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, }, android: { elevation: 2, }, }), },
  streamPlaceholder: { backgroundColor: COLORS.background, padding: scale(32), alignItems: 'center', minHeight: verticalScale(180), justifyContent: 'center', gap: verticalScale(12), },
  streamPlaceholderIcon: { width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(8), },
  streamPlaceholderTitle: { fontSize: moderateScale(18), fontWeight: '700', color: COLORS.text, letterSpacing: 0.1, },
  streamPlaceholderSubtitle: { fontSize: moderateScale(13), fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', lineHeight: moderateScale(18), paddingHorizontal: scale(20), letterSpacing: 0.1, },
  streamQuality: { flexDirection: 'row', alignItems: 'center', gap: scale(6), backgroundColor: COLORS.surface, paddingHorizontal: scale(12), paddingVertical: verticalScale(6), borderRadius: moderateScale(10), marginTop: verticalScale(8), },
  qualityDot: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), backgroundColor: COLORS.success, },
  qualityText: { fontSize: moderateScale(11), fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.2, },
  audioIndicator: { flexDirection: 'row', alignItems: 'center', gap: scale(10), backgroundColor: COLORS.errorLight, padding: scale(16), borderTopWidth: 1, borderTopColor: '#FECACA', },
  audioText: { fontSize: moderateScale(13), fontWeight: '700', color: COLORS.error, letterSpacing: 0.2, },
  audioWave: { flexDirection: 'row', alignItems: 'flex-end', gap: scale(3), marginLeft: 'auto', height: moderateScale(24), },
  audioBar: { width: moderateScale(4), backgroundColor: COLORS.error, borderRadius: moderateScale(2), },
});

export default LiveStreamSection;