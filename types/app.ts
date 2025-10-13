export interface User {
  id: string;
  uniqueId: string; // 10-digit unique ID for connecting with others
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  isOnboardingComplete: boolean;
  isProfileComplete: boolean;
  createdAt: Date;
}

export interface Trustee {
  id: string;
  uniqueId?: string;
  name: string;
  phone: string;
  email: string;
  profileImage?: string;
  relationship: string;
  isActive: boolean;
  isVerified: boolean;
  addedAt: Date;
}

export interface SOSStatus {
  isActive: boolean;
  startTime?: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  activeScenario?: string;
  evidenceCollected?: {
    photos: string[];
    audioRecording: boolean;
    videoRecording: boolean;
  };
  alertsSent?: {
    trustees: boolean;
    community: boolean;
    emergency: boolean;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'fake-call' | 'guidance';
}

export interface TrusteeMessage {
  id: string;
  text: string;
  sender: 'user' | 'trustee';
  trusteeId: string;
  trusteeName: string;
  timestamp: Date;
  isRead: boolean;
}

export interface CommunityAlert {
  id: string;
  userId: string;
  userName: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: Date;
  distance: number;
  isActive: boolean;
}

export interface SafetyRating {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rating: number; // 1-5 stars
  comment?: string;
  userId: string;
  timestamp: Date;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  sosStatus: SOSStatus;
  trustees: Trustee[];
  chatMessages: ChatMessage[];
  trusteeMessages: TrusteeMessage[];
  communityAlerts: CommunityAlert[];
  safetyRatings: SafetyRating[];
  isLocationSharing: boolean;
  emergencyContacts: string[];
}