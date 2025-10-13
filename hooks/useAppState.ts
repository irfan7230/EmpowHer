import { useAuthStore } from '@/stores/useAuthStore';
import { useSOSStore } from '@/stores/useSOSStore';
import { useTrusteeStore } from '@/stores/useTrusteeStore';
import { useChatStore } from '@/stores/useChatStore';
import { useCommunityStore } from '@/stores/useCommunityStore';
import { User } from '@/types/app';

/**
 * Legacy hook for backward compatibility
 * Combines all Zustand stores into a single interface
 * This allows existing components to work without changes
 */
export function useAppState() {
  // Auth store
  const {
    user,
    isAuthenticated,
    hasSeenOnboarding,
    isLoading: authLoading,
    error: authError,
    isInitialized,
    setUser,
    setAuthenticated,
    completeOnboarding,
    login,
    signup,
    logout,
    completeProfile,
    setLoading: setAuthLoading,
    setError: setAuthError,
    clearError: clearAuthError,
    initialize,
  } = useAuthStore();

  // SOS store
  const {
    sosStatus,
    isLocationSharing,
    activateSOS,
    deactivateSOS,
    updateSOSLocation,
    toggleLocationSharing,
    updateEvidenceCollection,
  } = useSOSStore();

  // Trustee store
  const {
    trustees,
    trusteeMessages,
    addTrustee,
    removeTrustee,
    updateTrustee,
    addTrusteeMessage,
    markMessageAsRead,
    markAllMessagesAsRead,
    getUnreadCount,
    setupInitialTrustees,
  } = useTrusteeStore();

  // Chat store
  const {
    chatMessages,
    isAITyping,
    addChatMessage,
    addAIResponse,
    setAITyping,
    clearChat,
  } = useChatStore();

  // Community store
  const {
    communityAlerts,
    safetyRatings,
    addCommunityAlert,
    respondToCommunityAlert,
    addSafetyRating,
    getAlertsByDistance,
    getRatingsByLocation,
  } = useCommunityStore();

  // Helper function to find user by contact (mock implementation)
  const findUserByContact = (contact: string): User | null => {
    if (contact.includes('@') || contact.includes('+')) {
      return {
        id: 'found-user',
        uniqueId: '9876543210',
        email: contact.includes('@') ? contact : 'user@example.com',
        name: 'Found User',
        phone: contact.includes('+') ? contact : '+1 (555) 999-8888',
        gender: 'prefer-not-to-say',
        isOnboardingComplete: true,
        isProfileComplete: true,
        createdAt: new Date(),
        profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      };
    }
    return null;
  };

  // Empty array for backward compatibility
  const emergencyContacts: string[] = [];

  return {
    // Auth state
    user,
    isAuthenticated,
    hasSeenOnboarding,
    isLoading: authLoading,
    error: authError,
    isInitialized,

    // SOS state
    sosStatus,
    isLocationSharing,

    // Trustee state
    trustees,
    trusteeMessages,

    // Chat state
    chatMessages,
    isAITyping,

    // Community state
    communityAlerts,
    safetyRatings,

    // Other state
    emergencyContacts,

    // Auth actions
    setUser,
    setAuthenticated,
    completeOnboarding,
    login,
    signup,
    logout,
    completeProfile,
    setLoading: setAuthLoading,
    setError: setAuthError,
    clearError: clearAuthError,
    initialize,

    // SOS actions
    activateSOS,
    deactivateSOS,
    updateSOSLocation,
    toggleLocationSharing,
    updateEvidenceCollection,

    // Trustee actions
    addTrustee,
    removeTrustee,
    updateTrustee,
    addTrusteeMessage,
    markMessageAsRead,
    markAllMessagesAsRead,
    getUnreadCount,
    setupInitialTrustees,
    findUserByContact,

    // Chat actions
    addChatMessage,
    addAIResponse,
    setAITyping,
    clearChat,

    // Community actions
    addCommunityAlert,
    respondToCommunityAlert,
    addSafetyRating,
    getAlertsByDistance,
    getRatingsByLocation,
  };
}