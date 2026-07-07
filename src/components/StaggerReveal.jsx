import { motion } from "framer-motion";
import { stagger, ease, duration } from "../motion-tokens.js";

/**
 * StaggerReveal — wraps children in a Framer Motion stagger container.
 * Children animate with a 45ms interval, max 6 items in the chain.
 *
 * Usage:
 *   <StaggerReveal>
 *     <motion.div variants={staggerChild}>Item 1</motion.div>
 *     <motion.div variants={staggerChild}>Item 2</motion.div>
 *   </StaggerReveal>
 *
 * Each child MUST use `variants={staggerChild}` (exported below).
 */
export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.standard, ease: ease.soft },
  },
};

export default function StaggerReveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger.default,
          },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
