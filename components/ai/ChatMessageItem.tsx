// components/ai/ChatMessageItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { User, Bot } from 'lucide-react-native';
import { ChatMessage } from '@/types/app';
import { MD3_COLORS, MD3_ELEVATION } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';

interface ChatMessageItemProps {
  item: ChatMessage;
  index: number;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(({ item, index }) => {
  return (
    <Animated.View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessageContainer : styles.aiMessageContainer
      ]}
      entering={FadeIn.duration(350).delay(index * 40)}
    >
      <View style={styles.messageHeader}>
        <View style={[
          styles.avatarContainer,
          item.sender === 'user' ? styles.userAvatar : styles.aiAvatar
        ]}>
          {item.sender === 'user' ? (
            <User size={moderateScale(15)} color="#FFFFFF" strokeWidth={2.5} />
          ) : (
            <Bot size={moderateScale(15)} color="#FFFFFF" strokeWidth={2.5} />
          )}
        </View>
        <Text style={styles.senderName}>
          {item.sender === 'user' ? 'You' : 'EmpowHer AI'}
        </Text>
        {item.type && item.type !== 'text' && (
          <View style={[
            styles.messageTypeBadge,
            { backgroundColor: item.type === 'fake-call' ? MD3_COLORS.secondary : '#F59E0B' }
          ]}>
            <Text style={styles.messageTypeText}>
              {item.type === 'fake-call' ? 'Fake Call' : 'Guidance'}
            </Text>
          </View>
        )}
      </View>

      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
      </View>

      <Text style={styles.messageTime}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );
});

// Add relevant styles from the original file here...
const styles = StyleSheet.create({
 messageContainer: { marginBottom: moderateScale(20), },
 userMessageContainer: { alignItems: 'flex-end', },
 aiMessageContainer: { alignItems: 'flex-start', },
 messageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(8), },
 avatarContainer: { width: moderateScale(32), height: moderateScale(32), borderRadius: moderateScale(16), justifyContent: 'center', alignItems: 'center', marginRight: moderateScale(8), ...MD3_ELEVATION.level1, },
 userAvatar: { backgroundColor: MD3_COLORS.primary, },
 aiAvatar: { backgroundColor: MD3_COLORS.secondary, },
 senderName: { fontSize: moderateScale(12), fontWeight: '600', color: MD3_COLORS.onSurfaceVariant, letterSpacing: 0.1, },
 messageTypeBadge: { paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(3), borderRadius: moderateScale(8), marginLeft: moderateScale(6), },
 messageTypeText: { fontSize: moderateScale(9), fontWeight: '700', color: MD3_COLORS.onPrimary, letterSpacing: 0.3, },
 messageBubble: { maxWidth: '80%', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), borderRadius: moderateScale(20), ...MD3_ELEVATION.level1, },
 userBubble: { backgroundColor: MD3_COLORS.primaryContainer, borderBottomRightRadius: moderateScale(4), },
 aiBubble: { backgroundColor: MD3_COLORS.surface, borderBottomLeftRadius: moderateScale(4), borderWidth: 1, borderColor: MD3_COLORS.outlineVariant, },
 messageText: { fontSize: moderateScale(14), fontWeight: '400', lineHeight: moderateScale(20), letterSpacing: 0.25, },
 userMessageText: { color: MD3_COLORS.onPrimaryContainer, },
 aiMessageText: { color: MD3_COLORS.onSurface, },
 messageTime: { fontSize: moderateScale(10), fontWeight: '500', color: MD3_COLORS.onSurfaceVariant, marginTop: moderateScale(4), letterSpacing: 0.1, },
});

export default ChatMessageItem;