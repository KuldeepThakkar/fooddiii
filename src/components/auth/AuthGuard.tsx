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
      openModal('auth');
    }
  }, [isAuthenticated, isLoading, openModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Please sign in to continue...</p>
      </div>
    );
  }

  return <>{children}</>;
}
