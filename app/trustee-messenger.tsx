import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import { TrusteeMessage } from '@/types/app';
import { Send, ArrowLeft, User, Phone, Video, MoreVertical, CheckCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Layout,
  withTiming,
  interpolate,
  withSequence,
} from 'react-native-reanimated';

export default function TrusteeMessengerScreen() {
  const { trusteeId } = useLocalSearchParams<{ trusteeId: string }>();
  const { trustees, trusteeMessages, addTrusteeMessage } = useAppState();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  
  const sendButtonScale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);
  const messagesTranslateY = useSharedValue(50);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    messagesTranslateY.value = withSpring(0, { damping: 15 });
  }, []);

  const trustee = trustees.find(t => t.id === trusteeId);
  const messages = trusteeMessages.filter(m => m.trusteeId === trusteeId);

  const handleSendMessage = () => {
    if (!inputText.trim() || !trusteeId) return;

    sendButtonScale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    addTrusteeMessage(inputText.trim(), trusteeId);
    setInputText('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) },
    ],
  }));

  const animatedMessagesStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: messagesTranslateY.value }],
  }));

  const animatedSendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
  }));

  const renderMessage = ({ item, index }: { item: TrusteeMessage; index: number }) => (
    <Animated.View 
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessageContainer : styles.trusteeMessageContainer
      ]}
      layout={Layout.springify()}
      entering={Layout.springify().delay(index * 50)}
    >
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.trusteeBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.trusteeMessageText
        ]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {item.sender === 'user' && (
            <CheckCircle size={12} color={item.isRead ? '#10B981' : '#9CA3AF'} />
          )}
        </View>
      </View>
    </Animated.View>
  );

  if (!trustee) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trustee not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* WhatsApp-style Header */}
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.trusteeInfo}>
          <Image 
            source={{ 
              uri: trustee.profileImage || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' 
            }} 
            style={styles.trusteeImage} 
          />
          <View style={styles.trusteeDetails}>
            <Text style={styles.trusteeName}>{trustee.name}</Text>
            <Text style={styles.trusteeStatus}>
              {trustee.isActive ? 'Online' : 'Last seen 2h ago'}
            </Text>
          </View>
          {trustee.isActive && <View style={styles.onlineIndicator} />}
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Video size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Phone size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <MoreVertical size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <Animated.View style={[styles.messagesContainer, animatedMessagesStyle]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            ListEmptyComponent={
              <View style={styles.emptyMessagesContainer}>
                <View style={styles.emptyMessagesIcon}>
                  <User size={40} color="#FFB3BA" />
                </View>
                <Text style={styles.emptyMessagesTitle}>Start Conversation</Text>
                <Text style={styles.emptyMessagesSubtitle}>
                  Send a message to {trustee.name} to start your secure conversation
                </Text>
              </View>
            }
          />
        </Animated.View>

        {/* Enhanced Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Message ${trustee.name}...`}
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
            />
            <Animated.View style={animatedSendButtonStyle}>
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FF8A95',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#FF8A95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  backIcon: {
    marginRight: 16,
    padding: 4,
  },
  trusteeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  trusteeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  trusteeDetails: {
    flex: 1,
  },
  trusteeName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  trusteeStatus: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  trusteeMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#FF8A95',
    borderBottomRightRadius: 6,
  },
  trusteeBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  trusteeMessageText: {
    color: '#1F2937',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyMessagesIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyMessagesTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyMessagesSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#FF8A95',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF8A95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#FF8A95',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});