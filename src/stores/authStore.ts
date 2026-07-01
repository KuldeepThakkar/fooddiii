import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    isOfflineMode: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            isOfflineMode: !isSupabaseConfigured(),

            initialize: async () => {
                if (!isSupabaseConfigured()) {
                    set({ isOfflineMode: true });
                    return;
                }

                set({ isLoading: true });
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id, session.user.email || '');
                    set({ user: profile, isLoading: false });
                } else {
                    set({ isLoading: false });
                }

                // Listen for auth state changes
                supabase.auth.onAuthStateChange(async (_event, session) => {
                    if (session?.user) {
                        const profile = await fetchProfile(session.user.id, session.user.email || '');
                        set({ user: profile });
                    } else {
                        set({ user: null });
                    }
                });
            },

            login: async (email: string, password: string) => {
                if (get().isOfflineMode) {
                    // Demo mode offline login
                    const mockUser: UserProfile = {
                        id: 'demo_' + email.split('@')[0],
                        displayName: email.split('@')[0],
                        email,
                        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=004F30&color=fff`,
                    };
                    set({ user: mockUser });
                    return { success: true };
                }

                set({ isLoading: true });
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                set({ isLoading: false });

                if (error) return { success: false, error: error.message };

                if (data.user) {
                    const profile = await fetchProfile(data.user.id, data.user.email || '');
                    set({ user: profile });
                }
                return { success: true };
            },

            register: async (email: string, password: string, displayName: string) => {
                if (get().isOfflineMode) {
                    const mockUser: UserProfile = {
                        id: 'demo_' + Math.random().toString(36).substring(2, 9),
                        displayName,
                        email,
                        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=004F30&color=fff`,
                    };
                    set({ user: mockUser });
                    return { success: true };
                }

                set({ isLoading: true });
                const { data, error } = await supabase.auth.signUp({ email, password });
                set({ isLoading: false });

                if (error) return { success: false, error: error.message };

                if (data.user) {
                    // Upsert profile
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        display_name: displayName,
                        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=004F30&color=fff`,
                    });
                }
                return { success: true };
            },

            logout: async () => {
                if (!get().isOfflineMode) {
                    await supabase.auth.signOut();
                }
                set({ user: null });
            },
        }),
        {
            name: 'foodiespot-auth',
            // Only persist the user object
            partialize: (state) => ({ user: state.user }),
        }
    )
);

async function fetchProfile(userId: string, email: string): Promise<UserProfile> {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            return {
                id: userId,
                displayName: data.display_name || email.split('@')[0],
                email,
                avatarUrl: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.display_name || email)}&background=004F30&color=fff`,
            };
        }
    } catch {
        // Fallback
    }

    return {
        id: userId,
        displayName: email.split('@')[0],
        email,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=004F30&color=fff`,
    };
}
