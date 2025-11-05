// components/ai/ListeningIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';
import { Volume2 } from 'lucide-react-native';
import { MD3_COLORS } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';

interface ListeningIndicatorProps {
  micPulse: SharedValue<number>;
}

const ListeningIndicator: React.FC<ListeningIndicatorProps> = ({ micPulse }) => {
  return (
    <Animated.View
      style={styles.listeningCard}
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.listeningContent}>
        <Volume2 size={moderateScale(18)} color={MD3_COLORS.error} strokeWidth={2.5} />
        <Text style={styles.listeningLabel}>Listening...</Text>
        <View style={styles.waveformContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveBar,
                {
                  height: interpolate(
                    micPulse.value,
                    [0, 0.5, 1],
                    i === 0 ? [10, 20, 10] :
                    i === 1 ? [16, 28, 12] :
                    [20, 12, 18],
                    Extrapolation.CLAMP
                  ),
                  opacity: interpolate(
                    micPulse.value,
                    [0, 1],
                    i === 1 ? [0.7, 1] : [0.5, 0.9],
                    Extrapolation.CLAMP
                  )
                }
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// Add relevant styles from the original file here...
const styles = StyleSheet.create({
 listeningCard: { marginTop: moderateScale(12), borderRadius: moderateScale(16), overflow: 'hidden', },
 listeningContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: MD3_COLORS.errorContainer, paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), gap: moderateScale(10), borderWidth: 1, borderColor: MD3_COLORS.error, borderRadius: moderateScale(16), },
 listeningLabel: { fontSize: moderateScale(13), fontWeight: '700', color: MD3_COLORS.error, flex: 1, letterSpacing: 0.1, },
 waveformContainer: { flexDirection: 'row', gap: moderateScale(4), alignItems: 'center', height: moderateScale(24), },
 waveBar: { width: moderateScale(4), backgroundColor: MD3_COLORS.error, borderRadius: moderateScale(2), },
});

export default ListeningIndicator;