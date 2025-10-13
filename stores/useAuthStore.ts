import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/app';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setAuthenticated: (value: boolean) => void;
  completeOnboarding: () => void;
  login: (email: string, token: string) => void;
  signup: (email: string) => void;
  logout: () => void;
  completeProfile: (userData: Partial<User>) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasSeenOnboarding: false,
      isLoading: true, // Start as loading
      error: null,
      isInitialized: false,

      setUser: (user) => {
        console.log('Setting user:', user.email);
        set({ user });
      },
      
      setAuthenticated: (value) => {
        console.log('Setting authenticated:', value);
        set({ isAuthenticated: value });
      },
      
      completeOnboarding: () => {
        console.log('Completing onboarding');
        set({ hasSeenOnboarding: true });
      },
      
      login: (email, token) => {
        console.log('Login attempt:', email);
        
        // Mock user for demo - replace with actual API call
        const mockUser: User = {
          id: '1',
          uniqueId: '1234567890',
          email,
          name: 'Jessica Wilson',
          phone: '+1 (555) 123-4567',
          gender: 'female',
          isOnboardingComplete: true,
          isProfileComplete: true,
          createdAt: new Date(Date.now() - 86400000),
          profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        };
        
        set({ 
          user: mockUser, 
          isAuthenticated: true,
          hasSeenOnboarding: true,
          error: null 
        });
        
        console.log('Login successful');
      },
      
      signup: (email) => {
        console.log('Signup attempt:', email);
        
        const newUser: User = {
          id: Date.now().toString(),
          uniqueId: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
          email,
          name: '',
          phone: '',
          gender: 'prefer-not-to-say',
          isOnboardingComplete: true,
          isProfileComplete: false,
          createdAt: new Date(),
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true,
          hasSeenOnboarding: true,
          error: null 
        });
        
        console.log('Signup successful');
      },
      
      logout: () => {
        console.log('Logging out');
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null 
        });
      },
      
      completeProfile: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          console.log('Completing profile');
          set({ 
            user: { 
              ...currentUser, 
              ...userData, 
              isProfileComplete: true 
            } 
          });
        }
      },
      
      setLoading: (value) => set({ isLoading: value }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      initialize: async () => {
        console.log('Initializing auth store...');
        try {
          // Check if we have stored data
          const storedData = await AsyncStorage.getItem('auth-storage');
          
          if (storedData) {
            const { state } = JSON.parse(storedData);
            console.log('Restored auth state:', {
              isAuthenticated: state.isAuthenticated,
              hasSeenOnboarding: state.hasSeenOnboarding,
              userEmail: state.user?.email,
            });
          } else {
            console.log('No stored auth data found');
          }
          
          set({ isInitialized: true, isLoading: false });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isInitialized: true, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Hydration started');
        if (state) {
          console.log('Hydration complete:', {
            isAuthenticated: state.isAuthenticated,
            hasSeenOnboarding: state.hasSeenOnboarding,
          });
          state.isLoading = false;
          state.isInitialized = true;
        }
      },
    }
  )
);

// Initialize store when module loads
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}