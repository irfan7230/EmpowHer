// components/ai/InputBar.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import { Send, Mic } from 'lucide-react-native';
import { MD3_COLORS, MD3_ELEVATION, BOTTOM_NAV_HEIGHT, BOTTOM_NAV_MARGIN } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';
import ListeningIndicator from './ListeningIndicator'; // Import the new component

interface InputBarProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  handleVoiceInput: () => void;
  isListening: boolean;
  keyboardHeight: number;
  insets: { bottom: number };
  inputBarHeight: number;
  setInputBarHeight: (height: number) => void;
  animatedMicStyle: any;
  animatedSendButtonStyle: any;
  animatedInputBarStyle: any;
  micPulse: SharedValue<number>;
}

const InputBar: React.FC<InputBarProps> = ({
  inputText,
  setInputText,
  handleSendMessage,
  handleVoiceInput,
  isListening,
  keyboardHeight,
  insets,
  inputBarHeight,
  setInputBarHeight,
  animatedMicStyle,
  animatedSendButtonStyle,
  animatedInputBarStyle,
  micPulse,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Animated.View
        style={[
          styles.bottomBar,
          animatedInputBarStyle,
          {
            bottom: keyboardHeight > 0
              ? 0
              : BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN + insets.bottom
          }
        ]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setInputBarHeight(height);
        }}
      >
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message EmpowHer AI..."
            placeholderTextColor={MD3_COLORS.onSurfaceVariant}
            multiline
            maxLength={500}
          />

          <View style={styles.actionButtons}>
            <Animated.View style={animatedMicStyle}>
              <TouchableOpacity
                style={[styles.fab, isListening && styles.fabActive]}
                onPress={handleVoiceInput}
                activeOpacity={0.85}
              >
                <Mic size={moderateScale(20)} color={MD3_COLORS.onPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={animatedSendButtonStyle}>
              <TouchableOpacity
                style={[styles.fab, !inputText.trim() && styles.fabDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
                activeOpacity={0.85}
              >
                <Send size={moderateScale(20)} color={MD3_COLORS.onPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {isListening && <ListeningIndicator micPulse={micPulse} />}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

// Add relevant styles from the original file here...
const styles = StyleSheet.create({
 bottomBar: { position: 'absolute', left: 0, right: 0, paddingHorizontal: moderateScale(16), paddingTop: moderateScale(12), paddingBottom: moderateScale(12), backgroundColor: MD3_COLORS.background, },
 inputCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: MD3_COLORS.surface, borderRadius: moderateScale(32), paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(8), ...MD3_ELEVATION.level4, borderWidth: 1, borderColor: MD3_COLORS.outline, minHeight: moderateScale(56), },
 textInput: { flex: 1, fontSize: moderateScale(14), fontWeight: '400', color: MD3_COLORS.onSurface, maxHeight: moderateScale(100), paddingVertical: moderateScale(8), paddingRight: moderateScale(12), letterSpacing: 0.25, },
 actionButtons: { flexDirection: 'row', gap: moderateScale(8), },
 fab: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: MD3_COLORS.primary, justifyContent: 'center', alignItems: 'center', ...MD3_ELEVATION.level3, },
 fabActive: { backgroundColor: MD3_COLORS.error, ...MD3_ELEVATION.level4, },
 fabDisabled: { backgroundColor: MD3_COLORS.outlineVariant, ...MD3_ELEVATION.level1, },
});

export default InputBar;