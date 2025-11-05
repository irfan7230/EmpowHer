// components/ai/AIAssistantHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Bot, Sparkles, Headphones, Eye, Zap, ChevronDown, ChevronUp } from 'lucide-react-native';
import { MD3_COLORS, MD3_ELEVATION } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';

interface AIAssistantHeaderProps {
  animatedHeaderStyle: any;
  animatedAIStatusStyle: any;
  animatedSparkleStyle: any;
  showQuickActions: boolean;
  toggleQuickActions: () => void;
}

const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({
  animatedHeaderStyle,
  animatedAIStatusStyle,
  animatedSparkleStyle,
  showQuickActions,
  toggleQuickActions,
}) => {
  return (
    <Animated.View style={[styles.appBar, animatedHeaderStyle]}>
      <View style={styles.appBarContent}>
        <View style={styles.titleSection}>
          <View style={styles.aiIconWrapper}>
            <View style={styles.aiIconContainer}>
              <Bot size={moderateScale(26)} color={MD3_COLORS.onPrimary} strokeWidth={2.5} />
              <Animated.View style={[styles.aiStatusIndicator, animatedAIStatusStyle]}>
                <View style={styles.statusPulse} />
              </Animated.View>
            </View>
            <Animated.View style={[styles.sparkleIcon, animatedSparkleStyle]}>
              <Sparkles size={moderateScale(11)} color="#FCD34D" />
            </Animated.View>
          </View>
          <View style={styles.titleInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>EmpowHer AI</Text>
              <View style={styles.aiBadge}>
                <Sparkles size={moderateScale(8)} color={MD3_COLORS.onPrimary} />
                <Text style={styles.aiText}>AI</Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Animated.View style={[styles.onlineDot, animatedAIStatusStyle]} />
              <Text style={styles.statusText}>Always here for you</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsBar}>
          <View style={styles.chipGroup}>
            <View style={styles.chip}>
              <Headphones size={moderateScale(10)} color={MD3_COLORS.primary} strokeWidth={2.5} />
              <Text style={styles.chipLabel}>Listen</Text>
            </View>
            <View style={styles.chip}>
              <Eye size={moderateScale(10)} color={MD3_COLORS.primary} strokeWidth={2.5} />
              <Text style={styles.chipLabel}>Watch</Text>
            </View>
            <View style={styles.chip}>
              <Zap size={moderateScale(10)} color={MD3_COLORS.primary} strokeWidth={2.5} />
              <Text style={styles.chipLabel}>Protect</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleQuickActions}
            activeOpacity={0.6}
          >
            {showQuickActions ? (
              <ChevronUp size={moderateScale(20)} color={MD3_COLORS.onSurfaceVariant} strokeWidth={2} />
            ) : (
              <ChevronDown size={moderateScale(20)} color={MD3_COLORS.onSurfaceVariant} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Add relevant styles from the original file here...
const styles = StyleSheet.create({
 appBar: { backgroundColor: MD3_COLORS.surface, paddingBottom: moderateScale(12), ...MD3_ELEVATION.level2, },
 appBarContent: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(12), },
 titleSection: { flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(12), },
 aiIconWrapper: { position: 'relative', marginRight: moderateScale(12), },
 aiIconContainer: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), backgroundColor: MD3_COLORS.primary, justifyContent: 'center', alignItems: 'center', ...MD3_ELEVATION.level3, },
 aiStatusIndicator: { position: 'absolute', bottom: -2, right: -2, width: moderateScale(16), height: moderateScale(16), borderRadius: moderateScale(8), backgroundColor: MD3_COLORS.tertiary, borderWidth: 2.5, borderColor: MD3_COLORS.surface, justifyContent: 'center', alignItems: 'center', },
 statusPulse: { width: moderateScale(6), height: moderateScale(6), borderRadius: moderateScale(3), backgroundColor: MD3_COLORS.onPrimary, },
 sparkleIcon: { position: 'absolute', top: -3, right: -3, },
 titleInfo: { flex: 1, },
 titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(4), },
 title: { fontSize: moderateScale(20), fontWeight: '700', color: MD3_COLORS.onSurface, marginRight: moderateScale(8), letterSpacing: 0.1, },
 aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: MD3_COLORS.primary, paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(3), borderRadius: moderateScale(8), gap: moderateScale(3), },
 aiText: { fontSize: moderateScale(9), fontWeight: '700', color: MD3_COLORS.onPrimary, letterSpacing: 0.5, },
 statusRow: { flexDirection: 'row', alignItems: 'center', },
 onlineDot: { width: moderateScale(7), height: moderateScale(7), borderRadius: moderateScale(3.5), backgroundColor: MD3_COLORS.tertiary, marginRight: moderateScale(6), },
 statusText: { fontSize: moderateScale(12), fontWeight: '500', color: MD3_COLORS.tertiary, letterSpacing: 0.1, },
 actionsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
 chipGroup: { flexDirection: 'row', gap: moderateScale(6), flex: 1, },
 chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: MD3_COLORS.primaryContainer, paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(6), borderRadius: moderateScale(8), gap: moderateScale(4), },
 chipLabel: { fontSize: moderateScale(11), fontWeight: '600', color: MD3_COLORS.primary, letterSpacing: 0.1, },
 iconButton: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: MD3_COLORS.surfaceVariant, justifyContent: 'center', alignItems: 'center', },
});

export default AIAssistantHeader;