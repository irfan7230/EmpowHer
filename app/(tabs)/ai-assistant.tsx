// app/(tabs)/ai-assistant.tsx
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { ChatMessage } from '@/types/app';
import { Phone, Shield, MapPin, Heart, AlertTriangle, Eye } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  withRepeat,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

// Import Constants & Utilities
import { MD3_COLORS, BOTTOM_NAV_HEIGHT, BOTTOM_NAV_MARGIN } from '@/constants/theme';
import { moderateScale } from '@/utils/scaling';

// Import Components
import AIAssistantHeader from '@/components/ai/AIAssistantHeader';
import QuickActionsSection from '@/components/ai/QuickActionsSection';
import ChatMessageItem from '@/components/ai/ChatMessageItem';
import ChatEmptyState from '@/components/ai/ChatEmptyState';
import AITypingIndicator from '@/components/ai/AITypingIndicator';
import InputBar from '@/components/ai/InputBar';

const { width } = Dimensions.get('window');

interface QuickActionType {
  id: string;
  icon: any;
  label: string;
  color: string;
  description: string;
}

export default function AIAssistantScreen() {
  const { chatMessages, addChatMessage } = useAppState();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [inputBarHeight, setInputBarHeight] = useState(moderateScale(70));

  // Shared animation values
  const sendButtonScale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);
  const micPulse = useSharedValue(0);
  const aiStatusPulse = useSharedValue(0);
  const typingDots = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const inputBarTranslateY = useSharedValue(0);

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const newKeyboardHeight = e.endCoordinates.height;
        runOnJS(setKeyboardHeight)(newKeyboardHeight);
        inputBarTranslateY.value = withSpring(-(newKeyboardHeight - insets.bottom), { damping: 20, stiffness: 120 });
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        runOnJS(setKeyboardHeight)(0);
        inputBarTranslateY.value = withSpring(0, { damping: 20, stiffness: 120 });
      }
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [insets.bottom]);


  // Initialize animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    aiStatusPulse.value = withRepeat(withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1, false);
    sparkleRotation.value = withRepeat(withTiming(360, { duration: 2500 }), -1, false);
    return () => { // Cleanup function
      headerOpacity.value = 0;
      aiStatusPulse.value = 0;
      sparkleRotation.value = 0;
      micPulse.value = 0; // Ensure pulses stop on unmount
      typingDots.value = 0;
    };
  }, []);

  // Mic pulse animation
  useEffect(() => {
    micPulse.value = isListening
      ? withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 })), -1, false)
      : withTiming(0, { duration: 250 });
  }, [isListening]);

  // Typing dots animation
  useEffect(() => {
    typingDots.value = isAITyping
      ? withRepeat(withSequence(withTiming(1, { duration: 350 }), withTiming(0, { duration: 350 })), -1, false)
      : 0;
  }, [isAITyping]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;
    sendButtonScale.value = withSequence(withSpring(0.88), withSpring(1));
    setIsAITyping(true);
    addChatMessage(inputText.trim()); // Call zustand action
    setInputText('');
    if (showQuickActions && chatMessages.length > 0) setShowQuickActions(false);
    setTimeout(() => {
        setIsAITyping(false); // Stop typing indicator
        flatListRef.current?.scrollToEnd({ animated: true });
    }, 1200); // Simulate AI thinking time
  }, [inputText, addChatMessage, chatMessages.length, showQuickActions, sendButtonScale]);


  const handleQuickAction = useCallback((action: string) => {
    const messages: Record<string, string> = {
      'fake-call': 'I need a fake call to help me exit this situation safely',
      'safe-route': 'Can you help me find the safest route to my destination?',
      'check-in': 'I want to do a safety check-in',
      'emergency': 'I think I might be in danger and need immediate help',
      'threat-detection': 'Can you listen for any threats around me?',
      'guidance': 'I need emotional support and guidance right now',
    };
    const message = messages[action];
    if (message) {
      setIsAITyping(true);
      addChatMessage(message); // Call zustand action
      setShowQuickActions(false);
      setTimeout(() => {
        setIsAITyping(false); // Stop typing indicator
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 1200); // Simulate AI thinking time
    }
  }, [addChatMessage]);


  const handleVoiceInput = useCallback(() => {
      const currentlyListening = !isListening;
      setIsListening(currentlyListening); // Toggle listening state immediately

      if (currentlyListening) {
          // If starting to listen, set a timeout to simulate processing
          setTimeout(() => {
              // This part runs after the timeout (e.g., 1.8 seconds)
              setIsListening(false); // Stop listening indicator
              addChatMessage('Hey EmpowHer, I need help'); // Add simulated voice message
              if (showQuickActions) setShowQuickActions(false); // Hide quick actions
          }, 1800);
      }
      // If stopping listening (currentlyListening is false), do nothing immediately,
      // the effect linked to isListening will handle stopping the pulse.
  }, [isListening, addChatMessage, showQuickActions]);


  const toggleQuickActions = useCallback(() => {
    setShowQuickActions(prev => !prev);
  }, []);

  // Animated styles (Keep only those needed in this component)
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-15, 0]) }],
  }));
  const animatedAIStatusStyle = useAnimatedStyle(() => ({
    opacity: interpolate(aiStatusPulse.value, [0, 1], [0.7, 1]),
    transform: [{ scale: interpolate(aiStatusPulse.value, [0, 1], [0.96, 1.04]) }],
  }));
  const animatedSparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));
  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isListening ? interpolate(micPulse.value, [0, 1], [1, 1.12], Extrapolation.CLAMP) : 1 }],
  }));
  const animatedSendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
  }));
  const animatedInputBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputBarTranslateY.value }],
  }));


  // Memoized Render Item
  const renderMessageItem = useCallback(({ item, index }: { item: ChatMessage; index: number }) => (
    <ChatMessageItem item={item} index={index} />
  ), []);

  const quickActions: QuickActionType[] = useMemo(() => [
    { id: 'fake-call', icon: Phone, label: 'Fake Call', color: MD3_COLORS.secondary, description: 'Safe exit strategy' },
    { id: 'safe-route', icon: MapPin, label: 'Safe Route', color: MD3_COLORS.tertiary, description: 'Find safe path' },
    { id: 'check-in', icon: Heart, label: 'Check-in', color: '#F59E0B', description: 'Safety status' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency', color: MD3_COLORS.error, description: 'Immediate help' },
    { id: 'threat-detection', icon: Eye, label: 'Threat Alert', color: '#8B5CF6', description: 'Monitor area' },
    { id: 'guidance', icon: Shield, label: 'Support', color: '#06B6D4', description: 'Get guidance' },
  ], []);

  const quickActionWidth = useMemo(() => (width - moderateScale(36) - moderateScale(10)) / 2, []);

  const contentPaddingBottom = useMemo(() => {
    const basePadding = moderateScale(16); // Base padding above input/nav
    const inputHeightWithPadding = inputBarHeight + basePadding;
    const navHeightWithPadding = BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN + insets.bottom + basePadding;

    // When keyboard is up, padding is just above the input bar
    // When keyboard is down, padding is above the bottom nav bar
    return keyboardHeight > 0 ? inputHeightWithPadding : navHeightWithPadding;
  }, [inputBarHeight, keyboardHeight, insets.bottom]);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AIAssistantHeader
        animatedHeaderStyle={animatedHeaderStyle}
        animatedAIStatusStyle={animatedAIStatusStyle}
        animatedSparkleStyle={animatedSparkleStyle}
        showQuickActions={showQuickActions}
        toggleQuickActions={toggleQuickActions}
      />

      {showQuickActions && (
        <QuickActionsSection
          quickActions={quickActions}
          handleQuickAction={handleQuickAction}
          quickActionWidth={quickActionWidth}
        />
      )}

      <View style={styles.chatArea}>
        {chatMessages.length === 0 && !showQuickActions ? (
          <ChatEmptyState toggleQuickActions={toggleQuickActions} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.messageList, { paddingBottom: contentPaddingBottom }]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          />
        )}

        {isAITyping && (
          <AITypingIndicator
            typingDots={typingDots}
            contentPaddingBottom={contentPaddingBottom}
          />
        )}
      </View>

      <InputBar
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        handleVoiceInput={handleVoiceInput}
        isListening={isListening}
        keyboardHeight={keyboardHeight}
        insets={insets}
        inputBarHeight={inputBarHeight}
        setInputBarHeight={setInputBarHeight}
        animatedMicStyle={animatedMicStyle}
        animatedSendButtonStyle={animatedSendButtonStyle}
        animatedInputBarStyle={animatedInputBarStyle}
        micPulse={micPulse}
      />
    </SafeAreaView>
  );
}

// Keep only essential container styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MD3_COLORS.background,
  },
  chatArea: {
    flex: 1,
    backgroundColor: MD3_COLORS.background,
    position: 'relative',
    // Add position: 'relative' if needed for absolute positioning inside
  },
  messageList: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    flexGrow: 1, // Ensure it tries to fill space
  },
});