import { create } from 'zustand';
import type { User } from '../types';
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  createUser,
  validateCredentials,
  updateUserProfile,
} from '../lib/mockAuth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    const user = getCurrentUser();
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = validateCredentials(email, password);
      
      if (!user) {
        set({
          isLoading: false,
          error: 'Invalid email or password',
        });
        return;
      }
      
      saveCurrentUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  },

  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = createUser(name, email, password);
      saveCurrentUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      });
    }
  },

  logout: () => {
    clearCurrentUser();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  updateProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const updatedUser = updateUserProfile(user.id, data);
      
      if (updatedUser) {
        saveCurrentUser(updatedUser);
        set({
          user: updatedUser,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          error: 'Failed to update profile',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Update failed',
      });
    }
  },
}));
