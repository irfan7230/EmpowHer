// components/ai/AITypingIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';
import { Bot } from 'lucide-react-native';
import { MD3_COLORS, MD3_ELEVATION } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';

interface AITypingIndicatorProps {
  typingDots: SharedValue<number>;
  contentPaddingBottom: number;
}

const AITypingIndicator: React.FC<AITypingIndicatorProps> = ({
  typingDots,
  contentPaddingBottom,
}) => {
  return (
    <Animated.View
      style={[
        styles.typingSection,
        { paddingBottom: contentPaddingBottom }
      ]}
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.typingCard}>
        <View style={styles.typingIcon}>
          <Bot size={moderateScale(13)} color={MD3_COLORS.primary} strokeWidth={2.5} />
        </View>
        <Text style={styles.typingLabel}>Thinking</Text>
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: interpolate(
                    typingDots.value,
                    [0, 0.33, 0.66, 1],
                    i === 0 ? [0.3, 1, 0.5, 0.3] :
                    i === 1 ? [0.5, 0.3, 1, 0.5] :
                    [1, 0.5, 0.3, 1],
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
 typingSection: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: moderateScale(16), paddingTop: moderateScale(12), backgroundColor: MD3_COLORS.background, },
 typingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: MD3_COLORS.surface, paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), borderRadius: moderateScale(20), borderBottomLeftRadius: moderateScale(4), alignSelf: 'flex-start', gap: moderateScale(10), ...MD3_ELEVATION.level1, borderWidth: 1, borderColor: MD3_COLORS.outlineVariant, },
 typingIcon: { width: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), backgroundColor: MD3_COLORS.primaryContainer, justifyContent: 'center', alignItems: 'center', },
 typingLabel: { fontSize: moderateScale(13), fontWeight: '600', color: MD3_COLORS.onSurfaceVariant, letterSpacing: 0.1, },
 dotsContainer: { flexDirection: 'row', gap: moderateScale(4), },
 dot: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), backgroundColor: MD3_COLORS.primary, },
});

export default AITypingIndicator;