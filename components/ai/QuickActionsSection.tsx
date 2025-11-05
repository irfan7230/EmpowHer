// components/ai/QuickActionsSection.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { SlideInDown, SlideOutDown, ZoomIn } from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { MD3_COLORS, MD3_ELEVATION } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';

interface QuickActionType {
  id: string;
  icon: any;
  label: string;
  color: string;
  description: string;
}

interface QuickActionsSectionProps {
  quickActions: QuickActionType[];
  handleQuickAction: (actionId: string) => void;
  quickActionWidth: number;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  quickActions,
  handleQuickAction,
  quickActionWidth,
}) => {
  return (
    <Animated.View
      style={styles.quickActionsSection}
      entering={SlideInDown.duration(350).springify()}
      exiting={SlideOutDown.duration(250)}
    >
      <View style={styles.sectionHeader}>
        <MessageCircle size={moderateScale(18)} color={MD3_COLORS.primary} strokeWidth={2.5} />
        <Text style={styles.sectionTitle}>How can I help you?</Text>
      </View>
      <View style={styles.cardGrid}>
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Animated.View
              key={action.id}
              style={{ width: quickActionWidth }}
              entering={ZoomIn.duration(300).delay(index * 50).springify()}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.materialCard,
                  pressed && styles.materialCardPressed,
                ]}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={[styles.cardIconContainer, { backgroundColor: `${action.color}15` }]}>
                  <View style={[styles.cardIcon, { backgroundColor: action.color }]}>
                    <IconComponent size={moderateScale(15)} color={MD3_COLORS.onPrimary} strokeWidth={2.5} />
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: action.color }]} numberOfLines={1}>
                    {action.label}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {action.description}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

// Add relevant styles from the original file here...
const styles = StyleSheet.create({
 quickActionsSection: { paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(16), backgroundColor: MD3_COLORS.surface, borderBottomWidth: 1, borderBottomColor: MD3_COLORS.outline, },
 sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(14), gap: moderateScale(8), },
 sectionTitle: { fontSize: moderateScale(16), fontWeight: '700', color: MD3_COLORS.onSurface, letterSpacing: 0.15, },
 cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(10), },
 materialCard: { backgroundColor: MD3_COLORS.surface, borderRadius: moderateScale(16), padding: moderateScale(14), ...MD3_ELEVATION.level1, borderWidth: 1, borderColor: MD3_COLORS.outlineVariant, flexDirection: 'row', alignItems: 'center', minHeight: moderateScale(72), },
 materialCardPressed: { ...MD3_ELEVATION.level0, opacity: 0.9, },
 cardIconContainer: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(12), justifyContent: 'center', alignItems: 'center', marginRight: moderateScale(12), },
 cardIcon: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(10), justifyContent: 'center', alignItems: 'center', },
 cardContent: { flex: 1, justifyContent: 'center', },
 cardTitle: { fontSize: moderateScale(13), fontWeight: '700', marginBottom: moderateScale(2), letterSpacing: 0.1, },
 cardSubtitle: { fontSize: moderateScale(10), fontWeight: '500', color: MD3_COLORS.onSurfaceVariant, letterSpacing: 0.1, },
});

export default QuickActionsSection;