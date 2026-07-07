// src/components/Reveal.jsx
// Scroll-into-view reveal — one-shot, reduced-motion safe.
// Not a loop. Hard constraint: max 2-3 ambient animations per page; this isn't one of them.

import { motion } from "framer-motion";
import { revealVariants, staggerVariants, staggerChildVariants, viewportOnce, usePrefersReducedMotion } from "../lib/motion.js";

export function Reveal({ children, as = "div", className, style, delay = 0 }) {
  const MotionTag = motion[as] || motion.div;
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Tag = as;
    return <Tag className={className} style={style}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={revealVariants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerReveal({ children, as = "div", className, style, stagger = 0.06 }) {
  const MotionTag = motion[as] || motion.div;
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Tag = as;
    return <Tag className={className} style={style}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerVariants(stagger)}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, as = "div", className, style }) {
  const MotionTag = motion[as] || motion.div;
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Tag = as;
    return <Tag className={className} style={style}>{children}</Tag>;
  }
  return (
    <MotionTag className={className} style={style} variants={staggerChildVariants}>
      {children}
    </MotionTag>
  );
}
