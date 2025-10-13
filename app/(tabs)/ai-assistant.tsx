import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Pressable,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { ChatMessage } from '@/types/app';
import { 
  Send, 
  Bot, 
  User, 
  Phone, 
  Shield, 
  MapPin, 
  Heart, 
  Mic, 
  AlertTriangle,
  Zap,
  Volume2,
  Eye,
  MessageCircle,
  Headphones,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  withRepeat,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  Extrapolation,
  ZoomIn,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Responsive sizing
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.3);
  return Math.round(size * limitedScale);
};

const verticalScale = (size: number) => {
  const baseHeight = 812;
  const scaleFactor = height / baseHeight;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.2);
  return Math.round(size * limitedScale);
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Material Design 3 Color System
const MD3_COLORS = {
  primary: '#FF6B9D',
  primaryContainer: '#FFD9E5',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#3E001F',
  
  secondary: '#6750A4',
  secondaryContainer: '#E8DEF8',
  onSecondary: '#FFFFFF',
  
  tertiary: '#10B981',
  tertiaryContainer: '#D1FAE5',
  
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  
  outline: '#E5E7EB',
  outlineVariant: '#CAC4D0',
  
  error: '#EF4444',
  errorContainer: '#FEE2E2',
  
  background: '#FAFAFA',
  scrim: 'rgba(0, 0, 0, 0.32)',
};

// Material Design elevation
const MD3_ELEVATION = {
  level0: {
    elevation: 0,
    shadowOpacity: 0,
  },
  level1: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  level2: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  level3: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  level4: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
};

interface QuickActionType {
  id: string;
  icon: any;
  label: string;
  color: string;
  description: string;
}

// Bottom navigation constants
const BOTTOM_NAV_HEIGHT = moderateScale(75);
const BOTTOM_NAV_MARGIN = Platform.OS === 'ios' ? moderateScale(16) : moderateScale(8);

export default function AIAssistantScreen() {
  const { chatMessages, addChatMessage } = useAppState();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Layout measurements
  const [inputBarHeight, setInputBarHeight] = useState(moderateScale(70));
  
  // Shared animation values
  const sendButtonScale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);
  const micPulse = useSharedValue(0);
  const aiStatusPulse = useSharedValue(0);
  const typingDots = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const inputBarTranslateY = useSharedValue(0);

  // Keyboard listeners with proper cleanup
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        inputBarTranslateY.value = withSpring(0, {
          damping: 20,
          stiffness: 120,
        });
        
        // Scroll to bottom when keyboard opens
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        inputBarTranslateY.value = withSpring(0, {
          damping: 20,
          stiffness: 120,
        });
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Initialize animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    
    aiStatusPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      false
    );

    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 2500 }),
      -1,
      false
    );

    return () => {
      headerOpacity.value = 0;
      aiStatusPulse.value = 0;
      micPulse.value = 0;
      typingDots.value = 0;
      sparkleRotation.value = 0;
    };
  }, []);

  useEffect(() => {
    micPulse.value = isListening
      ? withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          -1,
          false
        )
      : withTiming(0, { duration: 250 });
  }, [isListening]);

  useEffect(() => {
    typingDots.value = isAITyping
      ? withRepeat(
          withSequence(
            withTiming(1, { duration: 350 }),
            withTiming(0, { duration: 350 })
          ),
          -1,
          false
        )
      : 0;
  }, [isAITyping]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    sendButtonScale.value = withSequence(
      withSpring(0.88, { damping: 12, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    setIsAITyping(true);
    addChatMessage(inputText.trim());
    setInputText('');
    
    if (showQuickActions && chatMessages.length > 0) {
      setShowQuickActions(false);
    }
    
    setTimeout(() => {
      setIsAITyping(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1200);
  }, [inputText, addChatMessage, chatMessages.length, showQuickActions]);

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
      addChatMessage(message);
      setShowQuickActions(false);
      
      setTimeout(() => {
        setIsAITyping(false);
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 1200);
    }
  }, [addChatMessage]);

  const handleVoiceInput = useCallback(() => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        addChatMessage('Hey EmpowHer, I need help');
        setShowQuickActions(false);
      }, 1800);
    }
  }, [isListening, addChatMessage]);

  const toggleQuickActions = useCallback(() => {
    setShowQuickActions(prev => !prev);
  }, []);

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-15, 0]) },
    ],
  }));

  const animatedSendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
  }));

  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ 
      scale: isListening 
        ? interpolate(micPulse.value, [0, 1], [1, 1.12], Extrapolation.CLAMP) 
        : 1 
    }],
  }));

  const animatedAIStatusStyle = useAnimatedStyle(() => ({
    opacity: interpolate(aiStatusPulse.value, [0, 1], [0.7, 1]),
    transform: [
      { scale: interpolate(aiStatusPulse.value, [0, 1], [0.96, 1.04]) }
    ],
  }));

  const animatedSparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const animatedInputBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputBarTranslateY.value }],
  }));

  const renderMessage = useCallback(({ item, index }: { item: ChatMessage; index: number }) => (
    <Animated.View 
      key={item.id}
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
  ), []);

  const quickActions: QuickActionType[] = useMemo(() => [
    { id: 'fake-call', icon: Phone, label: 'Fake Call', color: MD3_COLORS.secondary, description: 'Safe exit strategy' },
    { id: 'safe-route', icon: MapPin, label: 'Safe Route', color: MD3_COLORS.tertiary, description: 'Find safe path' },
    { id: 'check-in', icon: Heart, label: 'Check-in', color: '#F59E0B', description: 'Safety status' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency', color: MD3_COLORS.error, description: 'Immediate help' },
    { id: 'threat-detection', icon: Eye, label: 'Threat Alert', color: '#8B5CF6', description: 'Monitor area' },
    { id: 'guidance', icon: Shield, label: 'Support', color: '#06B6D4', description: 'Get guidance' },
  ], []);

  const quickActionWidth = useMemo(() => {
    const padding = moderateScale(36);
    const gap = moderateScale(10);
    return (width - padding - gap) / 2;
  }, []);

  // Calculate safe content padding - Messages should never go behind navbar
  const contentPaddingBottom = useMemo(() => {
    // Always add bottom nav height regardless of keyboard state
    const baseBottomPadding = BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN + insets.bottom;
    const inputPadding = inputBarHeight + moderateScale(16);
    
    // When keyboard is visible, only add input bar padding
    // When keyboard is hidden, add both input bar and bottom nav padding
    return keyboardHeight > 0 ? inputPadding : inputPadding + baseBottomPadding;
  }, [inputBarHeight, keyboardHeight, insets.bottom]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Material Design App Bar */}
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

      {/* Quick Actions */}
      {showQuickActions && (
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
                    style={({pressed}) => [
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
      )}

      {/* Chat Area with proper keyboard handling */}
      <View style={styles.chatArea}>
        {chatMessages.length === 0 && !showQuickActions ? (
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
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.messageList,
              { paddingBottom: contentPaddingBottom }
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Typing Indicator */}
        {isAITyping && (
          <Animated.View 
            style={[
              styles.typingSection, 
              { 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: contentPaddingBottom 
              }
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
        )}
      </View>

      {/* Material Design Bottom Input Bar - WhatsApp style keyboard handling */}
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
          
          {isListening && (
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
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MD3_COLORS.background,
  },
  appBar: {
    backgroundColor: MD3_COLORS.surface,
    paddingBottom: moderateScale(12),
    ...MD3_ELEVATION.level2,
  },
  appBarContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  aiIconWrapper: {
    position: 'relative',
    marginRight: moderateScale(12),
  },
  aiIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: MD3_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...MD3_ELEVATION.level3,
  },
  aiStatusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: MD3_COLORS.tertiary,
    borderWidth: 2.5,
    borderColor: MD3_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPulse: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: MD3_COLORS.onPrimary,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -3,
    right: -3,
  },
  titleInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: MD3_COLORS.onSurface,
    marginRight: moderateScale(8),
    letterSpacing: 0.1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_COLORS.primary,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(8),
    gap: moderateScale(3),
  },
  aiText: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: MD3_COLORS.onPrimary,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(3.5),
    backgroundColor: MD3_COLORS.tertiary,
    marginRight: moderateScale(6),
  },
  statusText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: MD3_COLORS.tertiary,
    letterSpacing: 0.1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipGroup: {
    flexDirection: 'row',
    gap: moderateScale(6),
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_COLORS.primaryContainer,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  chipLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: MD3_COLORS.primary,
    letterSpacing: 0.1,
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: MD3_COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsSection: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    backgroundColor: MD3_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: MD3_COLORS.outline,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(14),
    gap: moderateScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: MD3_COLORS.onSurface,
    letterSpacing: 0.15,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(10),
  },
  materialCard: {
    backgroundColor: MD3_COLORS.surface,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    ...MD3_ELEVATION.level1,
    borderWidth: 1,
    borderColor: MD3_COLORS.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: moderateScale(72),
  },
  materialCardPressed: {
    ...MD3_ELEVATION.level0,
    opacity: 0.9,
  },
  cardIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  cardIcon: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    marginBottom: moderateScale(2),
    letterSpacing: 0.1,
  },
  cardSubtitle: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: MD3_COLORS.onSurfaceVariant,
    letterSpacing: 0.1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: MD3_COLORS.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(32),
    paddingBottom: BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN + moderateScale(80),
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: moderateScale(24),
  },
  emptySparkle: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  emptyTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: MD3_COLORS.onSurface,
    marginBottom: moderateScale(8),
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    color: MD3_COLORS.onSurfaceVariant,
    marginBottom: moderateScale(32),
    textAlign: 'center',
    lineHeight: moderateScale(20),
    letterSpacing: 0.25,
  },
  fabExtended: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(14),
    backgroundColor: MD3_COLORS.primary,
    borderRadius: moderateScale(16),
    ...MD3_ELEVATION.level3,
  },
  fabLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: MD3_COLORS.onPrimary,
    letterSpacing: 0.1,
  },
  messageList: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  messageContainer: {
    marginBottom: moderateScale(20),
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  avatarContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(8),
    ...MD3_ELEVATION.level1,
  },
  userAvatar: {
    backgroundColor: MD3_COLORS.primary,
  },
  aiAvatar: {
    backgroundColor: MD3_COLORS.secondary,
  },
  senderName: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: MD3_COLORS.onSurfaceVariant,
    letterSpacing: 0.1,
  },
  messageTypeBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(8),
    marginLeft: moderateScale(6),
  },
  messageTypeText: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: MD3_COLORS.onPrimary,
    letterSpacing: 0.3,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(20),
    ...MD3_ELEVATION.level1,
  },
  userBubble: {
    backgroundColor: MD3_COLORS.primaryContainer,
    borderBottomRightRadius: moderateScale(4),
  },
  aiBubble: {
    backgroundColor: MD3_COLORS.surface,
    borderBottomLeftRadius: moderateScale(4),
    borderWidth: 1,
    borderColor: MD3_COLORS.outlineVariant,
  },
  messageText: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    lineHeight: moderateScale(20),
    letterSpacing: 0.25,
  },
  userMessageText: {
    color: MD3_COLORS.onPrimaryContainer,
  },
  aiMessageText: {
    color: MD3_COLORS.onSurface,
  },
  messageTime: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: MD3_COLORS.onSurfaceVariant,
    marginTop: moderateScale(4),
    letterSpacing: 0.1,
  },
  typingSection: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    backgroundColor: MD3_COLORS.background,
  },
  typingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_COLORS.surface,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(20),
    borderBottomLeftRadius: moderateScale(4),
    alignSelf: 'flex-start',
    gap: moderateScale(10),
    ...MD3_ELEVATION.level1,
    borderWidth: 1,
    borderColor: MD3_COLORS.outlineVariant,
  },
  typingIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: MD3_COLORS.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: MD3_COLORS.onSurfaceVariant,
    letterSpacing: 0.1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: moderateScale(4),
  },
  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: MD3_COLORS.primary,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(12),
    backgroundColor: MD3_COLORS.background,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_COLORS.surface,
    borderRadius: moderateScale(32),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    ...MD3_ELEVATION.level4,
    borderWidth: 1,
    borderColor: MD3_COLORS.outline,
    minHeight: moderateScale(56),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '400',
    color: MD3_COLORS.onSurface,
    maxHeight: moderateScale(100),
    paddingVertical: moderateScale(8),
    paddingRight: moderateScale(12),
    letterSpacing: 0.25,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  fab: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: MD3_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...MD3_ELEVATION.level3,
  },
  fabActive: {
    backgroundColor: MD3_COLORS.error,
    ...MD3_ELEVATION.level4,
  },
  fabDisabled: {
    backgroundColor: MD3_COLORS.outlineVariant,
    ...MD3_ELEVATION.level1,
  },
  listeningCard: {
    marginTop: moderateScale(12),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  listeningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_COLORS.errorContainer,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    gap: moderateScale(10),
    borderWidth: 1,
    borderColor: MD3_COLORS.error,
    borderRadius: moderateScale(16),
  },
  listeningLabel: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: MD3_COLORS.error,
    flex: 1,
    letterSpacing: 0.1,
  },
  waveformContainer: {
    flexDirection: 'row',
    gap: moderateScale(4),
    alignItems: 'center',
    height: moderateScale(24),
  },
  waveBar: {
    width: moderateScale(4),
    backgroundColor: MD3_COLORS.error,
    borderRadius: moderateScale(2),
  },
});