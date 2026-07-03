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
  updateAvatar: (avatar: User['catAvatar']) => void;
  updateAvatarConfig: (config: User['avatarConfig']) => void;
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

  updateAvatar: (avatar: User['catAvatar'] | User['torikoAvatar']) => {
    const { user } = get();
    if (!user || !avatar) return;
    
    const updatedUser = { ...user };
    if ('character' in avatar) {
      updatedUser.torikoAvatar = avatar;
    } else {
      updatedUser.catAvatar = avatar;
    }
    saveCurrentUser(updatedUser);
    set({ user: updatedUser });
  },

  updateAvatarConfig: (config: User['avatarConfig']) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      avatarConfig: config,
    };

    if (config?.type === 'cat') {
      updatedUser.catAvatar = {
        furColor: config.furColor || '#1A1A1A',
        eyeColor: config.eyeColor || '#FFD700',
        accessory: (config.accessory as 'none' | 'bow' | 'glasses' | 'hat' | 'crown') || 'none',
      };
    } else if (config?.type === 'anime') {
      updatedUser.torikoAvatar = {
        type: 'toriko',
        character: (config.character as 'toriko' | 'komatsu' | 'sunny' | 'zebra' | 'coco') || 'toriko',
      };
    }

    saveCurrentUser(updatedUser);
    set({ user: updatedUser });
  },
}));
