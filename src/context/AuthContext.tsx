// AuthContext.tsx — Thin compatibility wrapper over the Zustand authStore
// This allows old pages that consume useAuth() to continue working
// without modification while new code uses useAuthStore() directly.

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { UserProfile } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isOfflineMode: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isOfflineMode, login, register, logout, initialize } = useAuthStore();
    const { syncFromSupabase } = useFavoritesStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Sync favorites whenever user logs in
    useEffect(() => {
        if (user) {
            syncFromSupabase(user.id);
        }
    }, [user, syncFromSupabase]);

    return (
        <AuthContext.Provider value={{ user, isLoading, isOfflineMode, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
