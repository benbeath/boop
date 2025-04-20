import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  phoneNumber: string;
  username: string;
  profilePhoto?: string;
  connectedSocials: {
    instagram: boolean;
    tiktok: boolean;
    snapchat: boolean;
  };
  points: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signUp: (phoneNumber: string, username: string, password: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  signOut: () => void;
  connectSocial: (platform: "instagram" | "tiktok" | "snapchat") => Promise<void>;
  disconnectSocial: (platform: "instagram" | "tiktok" | "snapchat") => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfilePhoto: (photoUri: string) => Promise<void>;
  clearError: () => void;
}

// Mock user data for demo purposes
const mockUser: User = {
  id: "user-123",
  phoneNumber: "1234567890",
  username: "boopuser",
  connectedSocials: {
    instagram: false,
    tiktok: false,
    snapchat: false,
  },
  points: 250,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (phoneNumber, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo, we'll just check if the phone number matches our mock user
          if (phoneNumber === mockUser.phoneNumber && password === "password") {
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: "Invalid phone number or password", isLoading: false });
          }
        } catch (error) {
          set({ error: "Failed to sign in", isLoading: false });
        }
      },

      signUp: async (phoneNumber, username, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo, we'll create a new user based on the mock
          const newUser = {
            ...mockUser,
            phoneNumber,
            username,
          };
          
          set({ user: newUser, isLoading: false });
          // Note: In a real app, we would not set isAuthenticated here
          // until after verification
        } catch (error) {
          set({ error: "Failed to sign up", isLoading: false });
        }
      },

      verifyCode: async (code) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo, we'll just check if the code is "123456"
          if (code === "123456") {
            set({ isAuthenticated: true, isLoading: false });
          } else {
            set({ error: "Invalid verification code", isLoading: false });
          }
        } catch (error) {
          set({ error: "Failed to verify code", isLoading: false });
        }
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },

      connectSocial: async (platform) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error("User not found");
          
          const updatedUser = {
            ...user,
            connectedSocials: {
              ...user.connectedSocials,
              [platform]: true,
            },
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: `Failed to connect ${platform}`, isLoading: false });
        }
      },

      disconnectSocial: async (platform) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error("User not found");
          
          const updatedUser = {
            ...user,
            connectedSocials: {
              ...user.connectedSocials,
              [platform]: false,
            },
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: `Failed to disconnect ${platform}`, isLoading: false });
        }
      },

      updateUsername: async (username) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error("User not found");
          
          const updatedUser = {
            ...user,
            username,
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: "Failed to update username", isLoading: false });
        }
      },

      updatePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo, we'll just check if the current password is "password"
          if (currentPassword === "password") {
            set({ isLoading: false });
          } else {
            set({ error: "Current password is incorrect", isLoading: false });
          }
        } catch (error) {
          set({ error: "Failed to update password", isLoading: false });
        }
      },

      updateProfilePhoto: async (photoUri) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error("User not found");
          
          const updatedUser = {
            ...user,
            profilePhoto: photoUri,
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: "Failed to update profile photo", isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "boop-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);