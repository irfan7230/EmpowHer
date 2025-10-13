import { create } from 'zustand';
import { ChatMessage } from '@/types/app';

interface ChatState {
  chatMessages: ChatMessage[];
  isAITyping: boolean;
  
  // Actions
  addChatMessage: (text: string) => void;
  addAIResponse: (text: string, type?: ChatMessage['type']) => void;
  setAITyping: (value: boolean) => void;
  clearChat: () => void;
}

const mockInitialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hello! I\'m your AI safety assistant. I\'m here to help you stay safe and provide support whenever you need it. How are you feeling today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 60000),
    type: 'guidance',
  },
];

export const useChatStore = create<ChatState>((set, get) => ({
  chatMessages: mockInitialMessages,
  isAITyping: false,
  
  addChatMessage: (text) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isAITyping: true,
    }));
    
    // Simulate AI response after delay
    setTimeout(() => {
      let aiResponseText = 'I understand your concern. I\'m here to help you stay safe.';
      let aiType: ChatMessage['type'] = 'text';
      
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('fake call')) {
        aiResponseText = 'I can simulate a fake call for you. This will help you exit a situation safely. Would you like me to start the fake call now?';
        aiType = 'fake-call';
      } else if (lowerText.includes('help') || lowerText.includes('scared') || lowerText.includes('danger')) {
        aiResponseText = 'I can sense you might be in distress. Would you like me to activate your SOS alert or provide you with safety guidance?';
        aiType = 'guidance';
      } else if (lowerText.includes('route') || lowerText.includes('safe')) {
        aiResponseText = 'I can help you find the safest route to your destination. Based on community ratings, I\'ll suggest well-lit, populated areas.';
        aiType = 'guidance';
      } else if (lowerText.includes('check') || lowerText.includes('status')) {
        aiResponseText = 'Let me check your safety status. Your location sharing is active, and 3 trustees are currently online. Everything looks good!';
        aiType = 'guidance';
      }
      
      get().addAIResponse(aiResponseText, aiType);
    }, 1500);
  },
  
  addAIResponse: (text, type = 'text') => {
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text,
      sender: 'ai',
      timestamp: new Date(),
      type,
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, aiMessage],
      isAITyping: false,
    }));
  },
  
  setAITyping: (value) => set({ isAITyping: value }),
  
  clearChat: () => set({ 
    chatMessages: mockInitialMessages,
    isAITyping: false,
  }),
}));