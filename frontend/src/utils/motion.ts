/**
 * Motion design tokens, easing curves, and reusable animation variants.
 * Follows the Apple + Linear refined scientific motion philosophy.
 */

import { Variants } from 'framer-motion';

export const EASE_APPLE = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

export const TIMING = {
  micro: 0.16, // 160ms
  hover: 0.2, // 200ms
  page: 0.24, // 240ms
  modal: 0.22, // 220ms
  sidebar: 0.28, // 280ms
};

/**
 * Standard page entrance transition.
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.page,
      ease: EASE_APPLE,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: TIMING.micro,
      ease: EASE_SMOOTH,
    },
  },
};

/**
 * Staggered Hero section entrance sequence.
 * Order: Eyebrow -> Heading -> Description -> Actions/Metrics.
 */
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const heroChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_APPLE,
    },
  },
};

/**
 * Dialog / Modal overlay and dialog surface variants.
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TIMING.modal, ease: EASE_SMOOTH },
  },
  exit: {
    opacity: 0,
    transition: { duration: TIMING.micro, ease: EASE_SMOOTH },
  },
};

export const modalSurfaceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: TIMING.modal,
      ease: EASE_APPLE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: {
      duration: TIMING.micro,
      ease: EASE_SMOOTH,
    },
  },
};

/**
 * Staggered container for dashboard grids.
 */
export const gridStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const gridStaggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_APPLE },
  },
};
