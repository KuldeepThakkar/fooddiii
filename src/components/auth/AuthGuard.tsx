import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Route protection component
 * Shows auth modal if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Show auth modal instead of redirecting
      openModal('auth');
    }
  }, [isAuthenticated, isLoading, openModal]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Return children - modal will show if not authenticated
  return <>{children}</>;
}
