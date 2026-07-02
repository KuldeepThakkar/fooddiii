import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

/**
 * Hook that returns a wrapper function to check auth before executing an action
 * Shows auth modal if user is not authenticated
 */
export function useProtectedAction() {
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useUIStore();

  const executeIfAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        openModal('auth');
      }
    },
    [isAuthenticated, openModal]
  );

  return executeIfAuth;
}
