import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Toast as ToastType } from '../../types';
import { useUIStore } from '../../stores/uiStore';
import { toastVariants } from '../../lib/animations';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const variantStyles = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    bar: 'bg-emerald-500',
    cat: '😺',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    bar: 'bg-red-500',
    cat: '😿',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: Info,
    iconColor: 'text-blue-500',
    bar: 'bg-blue-500',
    cat: '🐱',
  },
};

interface ToastItemProps {
  toast: ToastType;
}

export function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useUIStore();
  const reducedMotion = usePrefersReducedMotion();
  const style = variantStyles[toast.type];
  const Icon = style.icon;
  const duration = toast.duration ?? 4000;

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative overflow-hidden rounded-2xl border shadow-lg ${style.bg} min-w-[280px] max-w-sm`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4 pr-10">
        <span className="text-xl" aria-hidden="true">{style.cat}</span>
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm">{toast.title}</p>
          {toast.message && (
            <p className="text-slate-600 text-xs mt-0.5">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-slate-400"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${style.bar}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: reducedMotion ? 0 : duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}
