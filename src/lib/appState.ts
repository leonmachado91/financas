import { UserProfile } from '@/types';
import { create } from 'zustand';

interface AppState {
  selectedMonth: Date;
  selectedProfile: UserProfile;
  setSelectedMonth: (date: Date) => void;
  setSelectedProfile: (profile: UserProfile) => void;
}

export const useAppState = create<AppState>((set) => ({
  selectedMonth: new Date(),
  selectedProfile: 'Leonardo', // Default profile
  setSelectedMonth: (date) => set({ selectedMonth: date }),
  setSelectedProfile: (profile) => set({ selectedProfile: profile }),
}));
