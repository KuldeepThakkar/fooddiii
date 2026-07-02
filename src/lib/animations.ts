import type { Transition, Variants } from 'framer-motion';

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalCatVariants: Variants = {
  hidden: { opacity: 0, y: -80, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springBouncy,
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.3 },
  },
};

export const modalCatReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const flipVariants: Variants = {
  login: { rotateY: 0 },
  signup: { rotateY: 180 },
};

export const crossfadeVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springGentle,
  },
  exit: {
    opacity: 0,
    x: 80,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const heartBurstVariants: Variants = {
  initial: { scale: 1 },
  burst: {
    scale: [1, 1.3, 1],
    transition: springBouncy,
  },
};

export const cardHoverVariants: Variants = {
  rest: { y: 0, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.3 },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export function getMotionProps(reducedMotion: boolean) {
  return reducedMotion
    ? { transition: { duration: 0 } }
    : {};
}
