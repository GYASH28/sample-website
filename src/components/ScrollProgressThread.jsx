import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef } from "react";
import { prefersReducedMotion } from "../motion-tokens.js";

/**
 * ScrollProgressThread — a persistent gold thread that runs down the
 * right side of the viewport and draws itself as the user scrolls.
 * Visible on every page throughout the whole site.
 *
 * A1 fix: previously called setState on every 1% scroll change to update the
 * percentage label, forcing a full component re-render many times per second
 * while scrolling. Now uses a direct ref.current.textContent write inside the
 * useMotionValueEvent callback — no React re-render at all for the percentage.
 *
 * Features:
 *  - Vertical SVG path with subtle wave (like a hanging thread)
 *  - strokeDashoffset linked to scroll progress (thread "draws" itself)
 *  - Small spool indicator at current scroll position
 *  - Section markers (small stitch dots) at 25%, 50%, 75%
 *  - Reduced-motion safe (becomes a static thin line)
 *  - Hidden on mobile (would clutter small screens)
 */
export default function ScrollProgressThread() {
  const reduce = prefersReducedMotion();
  const percentageRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Track scroll percentage for the spool indicator — write directly to DOM via ref
  // to avoid re-rendering this component on every 1% change.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (percentageRef.current) {
      percentageRef.current.textContent = `${Math.round(v * 100)}%`;
    }
  });

  // Spool Y position: 8% from top to 92% from top as scroll progresses
  const spoolY = useTransform(scrollYProgress, [0, 1], ["8vh", "92vh"]);

  // Don't render on mobile or when reduced motion is preferred
  if (reduce) return null;

  return (
    <>
      {/* The thread itself — fixed to the right side of viewport */}
      <div className="scroll-thread-container" aria-hidden="true">
        <svg
          className="scroll-thread-svg"
          viewBox="0 0 40 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background track (faint) */}
          <path
            d="M 20,20 Q 28,150 20,300 Q 12,450 20,600 Q 28,750 20,900 Q 12,950 20,980"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.12"
          />

          {/* Active thread — draws as you scroll */}
          <motion.path
            d="M 20,20 Q 28,150 20,300 Q 12,450 20,600 Q 28,750 20,900 Q 12,950 20,980"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength }}
            initial={{ pathLength: 0 }}
          />

          {/* Section markers at 25%, 50%, 75% */}
          <circle cx="20" cy="255" r="3" fill="var(--gold)" opacity="0.4" />
          <circle cx="20" cy="500" r="3" fill="var(--gold)" opacity="0.4" />
          <circle cx="20" cy="745" r="3" fill="var(--gold)" opacity="0.4" />

          {/* Top anchor — spool */}
          <circle cx="20" cy="20" r="6" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="2" fill="var(--gold)" />

          {/* Bottom anchor — needle eye */}
          <ellipse cx="20" cy="980" rx="4" ry="6" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
        </svg>

        {/* Spool indicator that moves down as you scroll */}
        <motion.div
          className="scroll-thread-spool"
          style={{ y: spoolY }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Spool shape */}
            <rect x="6" y="4" width="12" height="16" rx="1" fill="var(--gold)" opacity="0.95" />
            <rect x="4" y="3" width="16" height="2" rx="0.5" fill="var(--craft)" />
            <rect x="4" y="19" width="16" height="2" rx="0.5" fill="var(--craft)" />
            {/* Thread wraps */}
            <line x1="6" y1="8" x2="18" y2="8" stroke="var(--bg)" strokeWidth="0.5" opacity="0.5" />
            <line x1="6" y1="12" x2="18" y2="12" stroke="var(--bg)" strokeWidth="0.5" opacity="0.5" />
            <line x1="6" y1="16" x2="18" y2="16" stroke="var(--bg)" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Percentage label next to spool — updated via ref, no React re-render */}
        <motion.div
          className="scroll-thread-percentage"
          style={{ y: spoolY }}
          aria-hidden="true"
          ref={percentageRef}
        >
          0%
        </motion.div>
      </div>
    </>
  );
}
