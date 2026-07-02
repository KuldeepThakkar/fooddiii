import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Convenience hook that combines auth store with localStorage checks
 * Auto-initializes auth state on mount
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, error, initialize, login, signup, logout, clearError, updateProfile } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    updateProfile,
  };
}
