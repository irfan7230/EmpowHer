import { create } from 'zustand';
import { SOSStatus } from '@/types/app';

interface SOSState {
  sosStatus: SOSStatus;
  isLocationSharing: boolean;
  
  // Actions
  activateSOS: () => void;
  deactivateSOS: () => void;
  updateSOSLocation: (latitude: number, longitude: number, address?: string) => void;
  toggleLocationSharing: () => void;
  updateEvidenceCollection: (evidence: Partial<SOSStatus['evidenceCollected']>) => void;
}

export const useSOSStore = create<SOSState>((set, get) => ({
  sosStatus: {
    isActive: false,
  },
  isLocationSharing: false,
  
  activateSOS: () => set({
    sosStatus: {
      isActive: true,
      startTime: new Date(),
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Market Street, San Francisco, CA',
      },
      activeScenario: 'Emergency Activated',
      evidenceCollected: {
        photos: [],
        audioRecording: true,
        videoRecording: true,
      },
      alertsSent: {
        trustees: true,
        community: true,
        emergency: true,
      },
    },
    isLocationSharing: true,
  }),
  
  deactivateSOS: () => set({
    sosStatus: {
      isActive: false,
    },
  }),
  
  updateSOSLocation: (latitude, longitude, address) => {
    const currentStatus = get().sosStatus;
    set({
      sosStatus: {
        ...currentStatus,
        location: {
          latitude,
          longitude,
          address: address || currentStatus.location?.address,
        },
      },
    });
  },
  
  toggleLocationSharing: () => set((state) => ({
    isLocationSharing: !state.isLocationSharing,
  })),
  
  updateEvidenceCollection: (evidence) => {
    const currentStatus = get().sosStatus;
    set({
      sosStatus: {
        ...currentStatus,
        evidenceCollected: {
          ...currentStatus.evidenceCollected!,
          ...evidence,
        },
      },
    });
  },
}));