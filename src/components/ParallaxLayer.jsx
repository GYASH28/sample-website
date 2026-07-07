import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { prefersReducedMotion } from "../motion-tokens.js";

/**
 * ParallaxLayer — moves a layer at a fraction of scroll speed.
 * Respects prefers-reduced-motion (becomes static when set).
 *
 * Props:
 *  - children: content to parallax
 *  - speed: 0-1, how fast the layer moves (0 = static, 1 = full scroll)
 *           negative values reverse direction
 *  - className
 */
export default function ParallaxLayer({ children, speed = 0.5, className = "" }) {
  const ref = useRef(null);
  const reduce = prefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, -120 * speed],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
