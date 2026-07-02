import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { ToastItem } from './Toast';

export function ToastProvider() {
  const toasts = useUIStore((state) => state.toasts);

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 right-4 z-[300] flex flex-col gap-3 pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
