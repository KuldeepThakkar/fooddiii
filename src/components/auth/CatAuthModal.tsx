import { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { CatFace, type CatMood } from './CatFace';
import { CatPawButton } from './CatPawButton';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  modalBackdropVariants,
  modalCatVariants,
  modalCatReducedVariants,
  crossfadeVariants,
} from '../../lib/animations';

type AuthMode = 'login' | 'signup';

export function CatAuthModal() {
  const { activeModal, closeModal, addToast } = useUIStore();
  const { login, signup, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const reducedMotion = usePrefersReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const isOpen = activeModal === 'auth';

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [catMood, setCatMood] = useState<CatMood>('neutral');
  const [tailHovered, setTailHovered] = useState(false);
  const [tailClicked, setTailClicked] = useState(false);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearError();
      setCatMood('neutral');
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen, clearError]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setCatMood('success');
      setShowStars(true);
      addToast({
        type: 'success',
        title: mode === 'login' ? 'Welcome back!' : 'Welcome to the litter!',
        message: 'You are now signed in.',
      });
      const timer = setTimeout(() => {
        closeModal();
        setShowStars(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isOpen, closeModal, addToast, mode]);

  useEffect(() => {
    if (error) setCatMood('error');
  }, [error]);

  useEffect(() => {
    if (focusedField === 'password' && password.length > 0) {
      setCatMood('typing-password');
    } else if (focusedField === 'email' && email.length > 0) {
      setCatMood('typing-email');
    } else if (!error) {
      setCatMood('neutral');
    }
  }, [focusedField, password, email, error]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const elements = Array.from(focusable).filter((el) => !el.hasAttribute('disabled'));
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleTab);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'signup') {
      await signup(name.trim(), email, password);
    } else {
      await login(email, password);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    clearError();
    setCatMood('neutral');
  };

  const handleTailClick = () => {
    setTailClicked(true);
    if (mode === 'login') toggleMode();
    setTimeout(() => setTailClicked(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="presentation"
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cat-auth-title"
            className="relative w-full max-w-sm xs:max-w-sm max-[375px]:max-w-none max-[375px]:min-h-screen max-[375px]:rounded-none max-[375px]:flex max-[375px]:items-center"
            variants={reducedMotion ? modalCatReducedVariants : modalCatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Stars poof on exit/success */}
            {showStars && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                {['✨', '⭐', '🌟', '✨', '⭐'].map((star, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [1, 1, 0],
                      x: Math.cos((i * 72 * Math.PI) / 180) * 60,
                      y: Math.sin((i * 72 * Math.PI) / 180) * 60,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {star}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Cat body container */}
            <div className="relative bg-[#1A1A1A] rounded-[32px] pt-6 pb-8 px-4 shadow-2xl">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Close authentication modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cat face */}
              <div className="mb-2">
                <CatFace mood={catMood} />
              </div>

              {/* White belly / form */}
              <motion.div
                key={mode}
                className="bg-white rounded-2xl p-6 sm:p-8"
                initial={reducedMotion ? false : { rotateY: mode === 'signup' ? 180 : 0, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <h2 id="cat-auth-title" className="text-xl font-black text-slate-900 text-center mb-1">
                  {mode === 'login' ? 'Welcome back, human!' : 'Join the litter!'}
                </h2>
                <p className="text-slate-500 text-sm text-center mb-6">
                  {mode === 'login' ? 'Sign in to save your favorite spots' : 'Create an account to discover food'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {mode === 'signup' && (
                      <motion.div
                        key="name-field"
                        variants={crossfadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <FloatingInput
                          ref={firstInputRef}
                          id="auth-name"
                          label="Your name"
                          type="text"
                          value={name}
                          onChange={setName}
                          icon={<User className="w-4 h-4" />}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FloatingInput
                    ref={mode === 'login' ? firstInputRef : undefined}
                    id="auth-email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    icon={<Mail className="w-4 h-4" />}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />

                  <div className="relative">
                    <FloatingInput
                      id="auth-password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={setPassword}
                      icon={<Lock className="w-4 h-4" />}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium text-center"
                      role="alert"
                    >
                      {error}
                    </motion.p>
                  )}

                  <CatPawButton
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label={mode === 'login' ? 'Submit login' : 'Create account'}
                  >
                    {mode === 'login' ? 'Paw-ssword Submit' : 'Join the Litter!'}
                  </CatPawButton>
                </form>

                <p className="text-center text-sm text-slate-500 mt-4">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-emerald-600 font-bold hover:underline min-h-[44px]"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </motion.div>

              {/* Bottom paws */}
              <div className="absolute -bottom-3 left-6 w-10 h-10 bg-white rounded-full shadow-md" />
              <div className="absolute -bottom-3 right-6 w-10 h-10 bg-white rounded-full shadow-md" />

              {/* Tail */}
              <motion.button
                type="button"
                onClick={handleTailClick}
                onMouseEnter={() => setTailHovered(true)}
                onMouseLeave={() => setTailHovered(false)}
                className="absolute -right-8 bottom-8 w-16 h-24 cursor-pointer"
                aria-label="Switch to sign up"
                animate={
                  reducedMotion
                    ? {}
                    : tailHovered
                      ? { rotate: [-15, 15, -15] }
                      : { rotate: [-5, 5, -5] }
                }
                transition={
                  tailHovered
                    ? { duration: 0.5, repeat: Infinity }
                    : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
                style={{ transformOrigin: 'bottom left' }}
              >
                <svg viewBox="0 0 60 80" className="w-full h-full">
                  <path
                    d="M10 70 Q40 50 50 10 Q55 0 45 5 Q30 15 10 70"
                    fill="#1A1A1A"
                    stroke="#1A1A1A"
                  />
                  <circle cx="48" cy="8" r="6" fill="white" />
                </svg>
                {tailClicked && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 -right-4 bg-white text-xs font-bold text-slate-700 px-2 py-1 rounded-lg shadow whitespace-nowrap"
                  >
                    New here? Join the litter! 🐾
                  </motion.span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ id, label, type, value, onChange, icon, onFocus, onBlur, required }, ref) => {
    const [focused, setFocused] = useState(false);
    const isActive = focused || value.length > 0;

    return (
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">{icon}</span>
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          required={required}
          className="w-full h-12 pl-11 pr-4 bg-slate-100 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 peer"
          placeholder=" "
        />
        <label
          htmlFor={id}
          className={`absolute left-11 transition-all duration-200 pointer-events-none ${
            isActive
              ? '-top-2 left-3 text-xs font-bold text-emerald-600 bg-white px-1'
              : 'top-1/2 -translate-y-1/2 text-slate-400 text-sm'
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';
