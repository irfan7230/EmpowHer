import { create } from 'zustand';
import { CommunityAlert, SafetyRating } from '@/types/app';

interface CommunityState {
  communityAlerts: CommunityAlert[];
  safetyRatings: SafetyRating[];
  
  // Actions
  addCommunityAlert: (alert: Omit<CommunityAlert, 'id'>) => void;
  respondToCommunityAlert: (alertId: string) => void;
  addSafetyRating: (rating: Omit<SafetyRating, 'id'>) => void;
  getAlertsByDistance: (maxDistance: number) => CommunityAlert[];
  getRatingsByLocation: (latitude: number, longitude: number) => SafetyRating[];
}

const mockCommunityAlerts: CommunityAlert[] = [
  {
    id: '1',
    userId: 'user123',
    userName: 'Emma Wilson',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'Market Street, San Francisco, CA',
    },
    timestamp: new Date(Date.now() - 300000),
    distance: 0.8,
    isActive: true,
  },
  {
    id: '2',
    userId: 'user456',
    userName: 'Sophie Chen',
    location: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: 'Union Square, San Francisco, CA',
    },
    timestamp: new Date(Date.now() - 600000),
    distance: 1.2,
    isActive: true,
  },
];

const mockSafetyRatings: SafetyRating[] = [
  {
    id: '1',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'Market Street, San Francisco, CA',
    },
    rating: 4,
    comment: 'Well-lit area with good foot traffic. Felt safe walking here at night.',
    userId: 'user789',
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    location: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: 'Union Square, San Francisco, CA',
    },
    rating: 5,
    comment: 'Very safe area, lots of people around even late at night.',
    userId: 'user101',
    timestamp: new Date(Date.now() - 172800000),
  },
];

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communityAlerts: mockCommunityAlerts,
  safetyRatings: mockSafetyRatings,
  
  addCommunityAlert: (alert) => {
    const newAlert: CommunityAlert = {
      ...alert,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      communityAlerts: [...state.communityAlerts, newAlert],
    }));
  },
  
  respondToCommunityAlert: (alertId) => set((state) => ({
    communityAlerts: state.communityAlerts.map((alert) =>
      alert.id === alertId ? { ...alert, isActive: false } : alert
    ),
  })),
  
  addSafetyRating: (rating) => {
    const newRating: SafetyRating = {
      ...rating,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      safetyRatings: [...state.safetyRatings, newRating],
    }));
  },
  
  getAlertsByDistance: (maxDistance) => {
    return get().communityAlerts.filter(
      (alert) => alert.distance <= maxDistance && alert.isActive
    );
  },
  
  getRatingsByLocation: (latitude, longitude) => {
    // Simple distance calculation (can be enhanced with proper geolocation)
    return get().safetyRatings.filter((rating) => {
      const distance = Math.sqrt(
        Math.pow(rating.location.latitude - latitude, 2) +
        Math.pow(rating.location.longitude - longitude, 2)
      );
      return distance < 0.1; // Roughly 10km
    });
  },
}));