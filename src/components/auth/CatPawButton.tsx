import { useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface CatPawButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

export function CatPawButton({
  children,
  onClick,
  type = 'submit',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
}: CatPawButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

    onClick?.();
  };

  const playMeow = () => {
    if (reducedMotion) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio not available
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={(e) => {
        playMeow();
        handleClick(e);
      }}
      aria-label={ariaLabel}
      className="relative w-full min-h-[48px] overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.97 }}
      style={{
        clipPath:
          'polygon(12% 35%, 22% 15%, 32% 35%, 42% 12%, 52% 35%, 62% 15%, 72% 35%, 88% 35%, 95% 100%, 5% 100%)',
      }}
    >
      <span className="absolute inset-0 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-b-2xl shadow-lg shadow-emerald-400/30" />
      <span className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 text-white font-black text-sm">
        {loading ? (
          <>
            <motion.span
              className="flex gap-1"
              animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, staggerChildren: 0.1 }}
            >
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="w-2 h-2 bg-white rounded-full" />
            </motion.span>
            <Loader2 className="w-4 h-4 animate-spin" />
          </>
        ) : (
          children
        )}
      </span>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
          animate={{ width: 200, height: 200, x: -100, y: -100, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </motion.button>
  );
}
