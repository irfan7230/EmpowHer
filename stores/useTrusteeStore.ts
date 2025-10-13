import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trustee, TrusteeMessage } from '@/types/app';

interface TrusteeState {
  trustees: Trustee[];
  trusteeMessages: TrusteeMessage[];
  
  // Actions
  addTrustee: (trustee: Omit<Trustee, 'id' | 'addedAt'>) => void;
  removeTrustee: (id: string) => void;
  updateTrustee: (id: string, updates: Partial<Trustee>) => void;
  addTrusteeMessage: (text: string, trusteeId: string, sender: 'user' | 'trustee') => void;
  markMessageAsRead: (messageId: string) => void;
  markAllMessagesAsRead: (trusteeId: string) => void;
  getUnreadCount: (trusteeId?: string) => number;
  setupInitialTrustees: (trustees: Trustee[]) => void;
}

const mockTrustees: Trustee[] = [
  {
    id: '1',
    uniqueId: '1234567890',
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    email: 'sarah.j@email.com',
    relationship: 'Best Friend',
    isActive: true,
    isVerified: true,
    addedAt: new Date(Date.now() - 86400000),
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  },
  {
    id: '2',
    uniqueId: '0987654321',
    name: 'Mom',
    phone: '+1 (555) 987-6543',
    email: 'mom@email.com',
    relationship: 'Mother',
    isActive: true,
    isVerified: true,
    addedAt: new Date(Date.now() - 172800000),
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    id: '3',
    uniqueId: '5678901234',
    name: 'Alex Chen',
    phone: '+1 (555) 456-7890',
    email: 'alex.chen@email.com',
    relationship: 'Colleague',
    isActive: false,
    isVerified: true,
    addedAt: new Date(Date.now() - 259200000),
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  },
];

export const useTrusteeStore = create<TrusteeState>()(
  persist(
    (set, get) => ({
      trustees: mockTrustees,
      trusteeMessages: [],
      
      addTrustee: (trustee) => {
        const newTrustee: Trustee = {
          ...trustee,
          id: Date.now().toString(),
          addedAt: new Date(),
        };
        
        set((state) => ({
          trustees: [...state.trustees, newTrustee],
        }));
      },
      
      removeTrustee: (id) => set((state) => ({
        trustees: state.trustees.filter((t) => t.id !== id),
      })),
      
      updateTrustee: (id, updates) => set((state) => ({
        trustees: state.trustees.map((t) => 
          t.id === id ? { ...t, ...updates } : t
        ),
      })),
      
      addTrusteeMessage: (text, trusteeId, sender) => {
        const trustee = get().trustees.find((t) => t.id === trusteeId);
        if (!trustee) return;
        
        const newMessage: TrusteeMessage = {
          id: Date.now().toString(),
          text,
          sender,
          trusteeId,
          trusteeName: trustee.name,
          timestamp: new Date(),
          isRead: sender === 'user',
        };
        
        set((state) => ({
          trusteeMessages: [...state.trusteeMessages, newMessage],
        }));
      },
      
      markMessageAsRead: (messageId) => set((state) => ({
        trusteeMessages: state.trusteeMessages.map((m) =>
          m.id === messageId ? { ...m, isRead: true } : m
        ),
      })),
      
      markAllMessagesAsRead: (trusteeId) => set((state) => ({
        trusteeMessages: state.trusteeMessages.map((m) =>
          m.trusteeId === trusteeId ? { ...m, isRead: true } : m
        ),
      })),
      
      getUnreadCount: (trusteeId) => {
        const messages = get().trusteeMessages;
        if (trusteeId) {
          return messages.filter(
            (m) => m.trusteeId === trusteeId && !m.isRead && m.sender === 'trustee'
          ).length;
        }
        return messages.filter((m) => !m.isRead && m.sender === 'trustee').length;
      },
      
      setupInitialTrustees: (trustees) => set({ trustees }),
    }),
    {
      name: 'trustee-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        trustees: state.trustees,
        trusteeMessages: state.trusteeMessages,
      }),
    }
  )
);