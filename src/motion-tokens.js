/**
 * Fakhri Mart — Motion Tokens
 * ═══════════════════════════════════════════════════════════════
 * Single source of truth for all motion in the redesigned site.
 * Every component imports from here — no inline easing or duration.
 *
 * Three rules:
 *  1. Subtle — animations should not be consciously noticed on first view
 *  2. Slow — most interactions sit in 300-600ms range; slowest is 1200ms
 *  3. Earned — no element animates without a reason (scroll, input, state)
 */

// Easing curves
export const ease = {
  soft: [0.22, 1, 0.36, 1], // primary — slow start, gentle end
  precise: [0.4, 0, 0.2, 1], // state changes, toggles
  emphasis: [0.34, 1.56, 0.64, 1], // hero entrances, modal opens (slight overshoot)
  exit: [0.4, 0, 1, 1], // exits, dismissals (faster than entrance)
};

// Spring physics (for Framer Motion)
export const spring = {
  soft: { type: "spring", stiffness: 220, damping: 28 },
  medium: { type: "spring", stiffness: 320, damping: 26 },
  snappy: { type: "spring", stiffness: 420, damping: 30 },
};

// Durations (in seconds, for Framer Motion)
export const duration = {
  instant: 0.1,
  quick: 0.2,
  standard: 0.4,
  slow: 0.7,
  cinematic: 1.2,
};

// Stagger
export const stagger = {
  fast: 0.03,
  default: 0.045, // 45ms — the standard
  slow: 0.08,
  maxItems: 6, // items beyond 6 reveal simultaneously with item 6
};

// Reveal variants — used by Reveal.jsx and motion components
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.standard, ease: ease.soft },
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.standard, ease: ease.soft },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.slow, ease: ease.soft },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration.standard, ease: ease.soft },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration.standard, ease: ease.soft },
    },
  },
  // ── New Phase 2 variants ──
  clipReveal: {
    hidden: { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
    visible: {
      clipPath: "inset(0 0 0 0)",
      scale: 1,
      transition: { duration: duration.slow, ease: ease.soft },
    },
  },
  clipRevealLeft: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: {
      clipPath: "inset(0 0 0 0)",
      transition: { duration: duration.slow, ease: ease.soft },
    },
  },
  threadDraw: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: duration.cinematic, ease: ease.soft },
        opacity: { duration: duration.quick },
      },
    },
  },
};

// Viewport options for whileInView
export const viewport = {
  once: true,
  margin: "-80px 0px", // tighter than the old 160px — feels more responsive
};

// Reduced-motion check (used by parallax, magnetic, etc.)
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Touch device check (magnetic effect disabled on touch)
export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
