// components/ai/ChatEmptyState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bot, Sparkles, MessageCircle } from 'lucide-react-native';
import { MD3_COLORS, MD3_ELEVATION } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';
import { BOTTOM_NAV_HEIGHT, BOTTOM_NAV_MARGIN } from '@/constants/theme';

interface ChatEmptyStateProps {
  toggleQuickActions: () => void;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ toggleQuickActions }) => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Bot size={moderateScale(56)} color={MD3_COLORS.primary} strokeWidth={1.8} />
        <View style={styles.emptySparkle}>
          <Sparkles size={moderateScale(18)} color="#FCD34D" />
        </View>
      </View>
      <Text style={styles.emptyTitle}>Start Your Conversation</Text>
      <Text style={styles.emptySubtitle}>
        I'm here to help keep you safe and supported
      </Text>
      <TouchableOpacity
        style={styles.fabExtended}
        onPress={toggleQuickActions}
        activeOpacity={0.85}
      >
        <MessageCircle size={moderateScale(18)} color={MD3_COLORS.onPrimary} strokeWidth={2.5} />
        <Text style={styles.fabLabel}>Show Quick Actions</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add relevant styles from the original file here...
const styles = StyleSheet.create({
 emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: moderateScale(32), paddingBottom: BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN + moderateScale(80), },
 emptyIconContainer: { position: 'relative', marginBottom: moderateScale(24), },
 emptySparkle: { position: 'absolute', top: -6, right: -6, },
 emptyTitle: { fontSize: moderateScale(22), fontWeight: '700', color: MD3_COLORS.onSurface, marginBottom: moderateScale(8), letterSpacing: 0.15, textAlign: 'center', },
 emptySubtitle: { fontSize: moderateScale(14), fontWeight: '400', color: MD3_COLORS.onSurfaceVariant, marginBottom: moderateScale(32), textAlign: 'center', lineHeight: moderateScale(20), letterSpacing: 0.25, },
 fabExtended: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(8), paddingHorizontal: moderateScale(24), paddingVertical: moderateScale(14), backgroundColor: MD3_COLORS.primary, borderRadius: moderateScale(16), ...MD3_ELEVATION.level3, },
 fabLabel: { fontSize: moderateScale(14), fontWeight: '600', color: MD3_COLORS.onPrimary, letterSpacing: 0.1, },
});

export default ChatEmptyState;
