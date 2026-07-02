import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export type CatMood = 'neutral' | 'typing-email' | 'typing-password' | 'error' | 'success' | 'worried';

interface CatFaceProps {
  mood?: CatMood;
  className?: string;
}

const CAT_DARK = '#1A1A1A';
const CAT_PINK = '#FFB6C1';

export function CatFace({ mood = 'neutral', className = '' }: CatFaceProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const mousePos = useMousePosition(containerRef);
  const reducedMotion = usePrefersReducedMotion();
  const [isBlinking, setIsBlinking] = useState(false);
  const [noseTwitch, setNoseTwitch] = useState(false);

  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);

  const leftPupilX = useTransform(pupilX, (v) => v);
  const rightPupilX = useTransform(pupilX, (v) => v);
  const leftPupilY = useTransform(pupilY, (v) => v);
  const rightPupilY = useTransform(pupilY, (v) => v);

  useEffect(() => {
    if (reducedMotion) return;

    const clamp = (val: number, max: number) => Math.max(-max, Math.min(max, val));
    const maxMove = mood === 'typing-email' ? 3 : 4;
    const xOffset = mood === 'typing-email' ? -3 : 0;

    pupilX.set(clamp(mousePos.x / 30 + xOffset, maxMove));
    pupilY.set(clamp(mousePos.y / 30, maxMove));
  }, [mousePos, mood, pupilX, pupilY, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
        scheduleBlink();
      }, delay);
    };

    const timer = scheduleBlink();
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const twitch = () => {
      setNoseTwitch(true);
      setTimeout(() => setNoseTwitch(false), 200);
    };

    const interval = setInterval(twitch, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const showPawCover = mood === 'typing-password';
  const isError = mood === 'error' || mood === 'worried';
  const isSuccess = mood === 'success';
  const earRotate = isError ? 10 : 0;

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 200 160"
      className={`w-full max-w-[200px] mx-auto ${className}`}
      aria-hidden="true"
    >
      {/* Ears */}
      <motion.g
        animate={{ rotate: earRotate }}
        style={{ transformOrigin: '50px 40px' }}
      >
        <path d="M30 55 L20 15 L55 45 Z" fill={CAT_DARK} />
        <path d="M35 50 L28 25 L50 45 Z" fill={CAT_PINK} />
      </motion.g>
      <motion.g
        animate={{ rotate: -earRotate }}
        style={{ transformOrigin: '150px 40px' }}
      >
        <path d="M170 55 L180 15 L145 45 Z" fill={CAT_DARK} />
        <path d="M165 50 L172 25 L150 45 Z" fill={CAT_PINK} />
      </motion.g>

      {/* Head */}
      <circle cx="100" cy="85" r="55" fill={CAT_DARK} />

      {/* Whiskers */}
      <motion.g
        animate={reducedMotion ? {} : { rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: '100px 85px' }}
      >
        <line x1="45" y1="80" x2="15" y2="70" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="45" y1="90" x2="10" y2="90" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="45" y1="100" x2="15" y2="110" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="155" y1="80" x2="185" y2="70" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="155" y1="90" x2="190" y2="90" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="155" y1="100" x2="185" y2="110" stroke="white" strokeWidth="1.5" opacity="0.7" />
      </motion.g>

      {/* Eyes */}
      {isSuccess ? (
        <>
          <text x="72" y="88" fontSize="18" fill="white" fontWeight="bold">^</text>
          <text x="112" y="88" fontSize="18" fill="white" fontWeight="bold">^</text>
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="75" cy="80" rx="14" ry={isBlinking ? 1 : 14} fill="white" />
          {!isBlinking && !showPawCover && (
            <motion.g style={{ x: leftPupilX, y: leftPupilY }}>
              <circle cx="75" cy="80" r="5" fill="black" />
            </motion.g>
          )}
          {/* Right eye */}
          <ellipse cx="125" cy="80" rx="14" ry={isBlinking ? 1 : 14} fill="white" />
          {!isBlinking && !showPawCover && (
            <motion.g style={{ x: rightPupilX, y: rightPupilY }}>
              <circle cx="125" cy="80" r="5" fill="black" />
            </motion.g>
          )}
        </>
      )}

      {/* Paw cover for password typing */}
      <motion.g
        initial={{ y: 60, opacity: 0 }}
        animate={{
          y: showPawCover ? 0 : 60,
          opacity: showPawCover ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <ellipse cx="75" cy="78" rx="18" ry="14" fill="white" />
        <circle cx="68" cy="68" r="5" fill="white" />
        <circle cx="75" cy="65" r="5" fill="white" />
        <circle cx="82" cy="68" r="5" fill="white" />
        <ellipse cx="125" cy="78" rx="18" ry="14" fill="white" />
        <circle cx="118" cy="68" r="5" fill="white" />
        <circle cx="125" cy="65" r="5" fill="white" />
        <circle cx="132" cy="68" r="5" fill="white" />
      </motion.g>

      {/* Nose */}
      <motion.polygon
        points="100,92 95,100 105,100"
        fill={CAT_PINK}
        animate={{ scale: noseTwitch ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: '100px 96px' }}
      />

      {/* Mouth */}
      {isError ? (
        <path d="M88 108 Q100 102 112 108" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      ) : isSuccess ? (
        <path d="M85 105 Q100 118 115 105" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M92 108 Q100 114 108 108" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function SadCatIllustration({ className = '' }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 200 180"
      className={`w-32 h-32 mx-auto ${className}`}
      aria-hidden="true"
      animate={reducedMotion ? {} : { scale: [1, 0.98, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="100" cy="95" r="50" fill={CAT_DARK} />
      <path d="M55 65 L45 30 L75 55 Z" fill={CAT_DARK} />
      <path d="M145 65 L155 30 L125 55 Z" fill={CAT_DARK} />
      <path d="M60 65 L50 40 L72 58 Z" fill={CAT_PINK} />
      <path d="M140 65 L150 40 L128 58 Z" fill={CAT_PINK} />
      <ellipse cx="78" cy="88" rx="12" ry="12" fill="white" />
      <ellipse cx="122" cy="88" rx="12" ry="12" fill="white" />
      <circle cx="78" cy="90" r="4" fill="black" />
      <circle cx="122" cy="90" r="4" fill="black" />
      <polygon points="100,100 96,106 104,106" fill={CAT_PINK} />
      <path d="M88 115 Q100 108 112 115" fill="none" stroke="white" strokeWidth="2" />
      {/* Empty bowl */}
      <ellipse cx="100" cy="165" rx="35" ry="8" fill="#E2E8F0" />
      <path d="M70 155 Q100 145 130 155 L130 165 Q100 175 70 165 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
    </motion.svg>
  );
}
