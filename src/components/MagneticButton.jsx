import { motion, useMotionValue, useSpring } from "framer-motion";
import { spring, prefersReducedMotion, isTouchDevice } from "../motion-tokens.js";

/**
 * MagneticButton — subtly attracts the cursor within a 60px radius.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 *
 * Props:
 *  - children: button content
 *  - strength: 0-1, how strongly the button follows the cursor (default 0.3)
 *  - href: if provided, renders an <a>; otherwise renders a <button>
 *  - className, onClick, target, rel, ariaLabel, type, disabled: standard
 */
export default function MagneticButton({
  children,
  strength = 0.3,
  className = "",
  onClick,
  href,
  target,
  rel,
  ariaLabel,
  type = "button",
  disabled = false,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.soft);
  const sy = useSpring(y, spring.soft);

  const enabled = !prefersReducedMotion() && !isTouchDevice() && !disabled;

  function handleMove(e) {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const commonProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: { x: sx, y: sy },
    className,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} {...commonProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...commonProps}>
      {children}
    </motion.button>
  );
}
