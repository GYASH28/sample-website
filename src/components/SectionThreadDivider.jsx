import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ease, duration, prefersReducedMotion } from "../motion-tokens.js";

/**
 * SectionThreadDivider — a SUBTLE hairline gold thread that draws itself
 * across the viewport as the user scrolls into a new section.
 *
 * Refined, restrained, present but never loud. The thread is the signature
 * motif of the site — used consistently between sections to tie everything
 * together visually.
 *
 * Props:
 *  - variant: "wave" (default), "diagonal", "straight"
 *  - className
 */
export default function SectionThreadDivider({ variant = "wave", className = "" }) {
  const ref = useRef(null);
  const reduce = prefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 70%"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  const paths = {
    wave: "M 0,20 Q 25,18 50,20 T 100,20",
    diagonal: "M 0,25 L 100,18",
    straight: "M 0,20 L 100,20",
  };

  if (reduce) {
    return (
      <div className={`section-thread-divider ${className}`} aria-hidden="true">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="section-thread-svg">
          <path d={paths[variant]} fill="none" stroke="var(--gold)" strokeWidth="0.3" opacity="0.25" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`section-thread-divider ${className}`} aria-hidden="true" ref={ref}>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="section-thread-svg">
        {/* Faint background track */}
        <path d={paths[variant]} fill="none" stroke="var(--gold)" strokeWidth="0.2" opacity="0.12" />

        {/* Active drawing thread — hairline, subtle */}
        <motion.path
          d={paths[variant]}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="0.4"
          strokeLinecap="round"
          style={{ pathLength }}
          initial={{ pathLength: 0 }}
        />
      </svg>
    </div>
  );
}
