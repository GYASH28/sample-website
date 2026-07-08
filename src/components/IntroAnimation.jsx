// src/components/IntroAnimation.jsx
// Brand-new opening animation — cinematic, optimized, reduced-motion safe.
// Plays ONCE per session (sessionStorage). Skip button always visible.
//
// Sequence (3.2s total):
//  1. 0.0s  — Cream overlay fades in, three concentric thread-circles draw (gold → teal → pink)
//  2. 0.7s  — Yarn ball SVG unravels from center with spring overshoot
//  3. 1.2s  — "Fakhri Mart" reveals letter-by-letter with 3D rotateX
//  4. 1.8s  — Tagline fades in beneath
//  5. 2.4s  — Entire overlay lifts up and fades out (curtain reveal)
//  6. 3.2s  — onComplete fires, page is interactive
//
// Accessibility:
//  - Skip button always visible (top-right)
//  - Respects prefers-reduced-motion (skips entirely, calls onComplete immediately)
//  - aria-hidden on all decorative SVGs
//  - Body scroll locked during animation

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { businessInfo } from "../data/siteData.js";
import { ease } from "../motion-tokens.js";

const PHASES = {
  CIRCLE_1: "circle-1",
  CIRCLE_2: "circle-2",
  CIRCLE_3: "circle-3",
  BALL: "ball",
  TITLE: "title",
  TAGLINE: "tagline",
  LIFT: "lift",
  DONE: "done",
};

const TIMINGS = [
  [PHASES.CIRCLE_2, 300],
  [PHASES.CIRCLE_3, 550],
  [PHASES.BALL, 800],
  [PHASES.TITLE, 1200],
  [PHASES.TAGLINE, 1800],
  [PHASES.LIFT, 2400],
  [PHASES.DONE, 3200],
];

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState(PHASES.CIRCLE_1);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPlayed = sessionStorage.getItem("fakhri_intro_v3") === "true";

    if (prefersReducedMotion || isPlayed) {
      setVisible(false);
      onComplete();
      return;
    }

    document.body.classList.add("intro-running");

    const timers = TIMINGS.map(([p, delay]) =>
      setTimeout(() => {
        setPhase(p);
        if (p === PHASES.DONE) {
          sessionStorage.setItem("fakhri_intro_v3", "true");
          document.body.classList.remove("intro-running");
          setVisible(false);
          onComplete();
        }
      }, delay)
    );

    return () => {
      timers.forEach(clearTimeout);
      document.body.classList.remove("intro-running");
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem("fakhri_intro_v3", "true");
    document.body.classList.remove("intro-running");
    setVisible(false);
    onComplete();
  };

  const isPast = (p) => {
    const order = Object.values(PHASES);
    return order.indexOf(phase) >= order.indexOf(p);
  };

  const titleLetters = businessInfo.shortName.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          animate={{
            opacity: phase === PHASES.LIFT || phase === PHASES.DONE ? 0 : 1,
            y: phase === PHASES.LIFT || phase === PHASES.DONE ? "-100%" : "0%",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: ease.soft }}
        >
          {/* Skip button */}
          <button
            type="button"
            className="intro-skip-btn"
            onClick={handleSkip}
            aria-label="Skip intro animation"
          >
            Skip Intro →
          </button>

          <div className="intro-container">
            {/* Three concentric thread circles — draw in sequence */}
            <svg className="intro-stitch intro-stitch-1" viewBox="0 0 240 240" width="240" height="240" aria-hidden="true">
              <motion.circle
                cx="120" cy="120" r="108"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="679"
                initial={{ strokeDashoffset: 679, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 0.9 }}
                transition={{ duration: 1.0, ease: ease.soft }}
                style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
              />
            </svg>

            {isPast(PHASES.CIRCLE_2) && (
              <svg className="intro-stitch intro-stitch-2" viewBox="0 0 240 240" width="200" height="200" aria-hidden="true">
                <motion.circle
                  cx="120" cy="120" r="108"
                  fill="none"
                  stroke="var(--teal)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="679"
                  initial={{ strokeDashoffset: 679, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 0.6 }}
                  transition={{ duration: 0.9, ease: ease.soft }}
                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
              </svg>
            )}

            {isPast(PHASES.CIRCLE_3) && (
              <svg className="intro-stitch intro-stitch-3" viewBox="0 0 240 240" width="160" height="160" aria-hidden="true">
                <motion.circle
                  cx="120" cy="120" r="108"
                  fill="none"
                  stroke="var(--pink)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="679"
                  initial={{ strokeDashoffset: 679, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 0.5 }}
                  transition={{ duration: 0.8, ease: ease.soft }}
                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
              </svg>
            )}

            {/* Yarn ball — unravels from center with spring overshoot */}
            {isPast(PHASES.BALL) && (
              <motion.div
                className="intro-yarn-ball"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                aria-hidden="true"
              >
                <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="32" fill="var(--gold)" opacity="0.9" />
                  <path d="M 30,60 Q 60,30 90,60" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.7" />
                  <path d="M 30,60 Q 60,90 90,60" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.7" />
                  <path d="M 60,28 Q 92,60 60,92" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.5" />
                  <path d="M 60,28 Q 28,60 60,92" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.5" />
                  <ellipse cx="50" cy="50" rx="8" ry="5" fill="var(--bg)" opacity="0.4" />
                </svg>
              </motion.div>
            )}

            {/* Logo — the real Fakhri Mart logo, appears center with spring overshoot */}
            {isPast(PHASES.BALL) && (
              <motion.div
                className="intro-logo-wrapper"
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                aria-hidden="true"
              >
                <img src="/assets/fakhri-mart-logo.webp" alt="" className="intro-logo-img" />
              </motion.div>
            )}

            {/* Title — letter-by-letter 3D reveal */}
            {isPast(PHASES.TITLE) && (
              <div className="intro-text">
                <h2 className="intro-title">
                  {titleLetters.map((letter, i) => (
                    <motion.span
                      key={`${letter}-${i}`}
                      initial={{ opacity: 0, y: 20, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.04 }}
                      style={{ display: "inline-block", transformOrigin: "bottom" }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </h2>
              </div>
            )}

            {/* Tagline — fades in below title */}
            {isPast(PHASES.TAGLINE) && (
              <motion.p
                className="intro-tagline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.soft }}
              >
                {businessInfo.tagline}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
