import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  email: string | null;
  instanceUrl: string | null;
  isAuthenticated: boolean;
  isBiometricUnlocked: boolean;

  setSession: (input: { userId: string; email: string; instanceUrl: string }) => void;
  setBiometricUnlocked: (unlocked: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  instanceUrl: null,
  isAuthenticated: false,
  isBiometricUnlocked: false,

  setSession: ({ userId, email, instanceUrl }) =>
    set({ userId, email, instanceUrl, isAuthenticated: true }),
  setBiometricUnlocked: (unlocked) => set({ isBiometricUnlocked: unlocked }),
  clearSession: () =>
    set({
      userId: null,
      email: null,
      instanceUrl: null,
      isAuthenticated: false,
      isBiometricUnlocked: false,
    }),
}));
