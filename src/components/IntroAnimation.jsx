import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { businessInfo } from "../data/siteData.js";
import { ease, duration } from "../motion-tokens.js";

/**
 * IntroAnimation — Premium Boutique enhanced opening animation.
 *
 * Sequence (3.6s total):
 *  1. 0.0s — Three concentric thread circles draw in sequence (gold, teal, pink)
 *  2. 0.8s — Yarn ball graphic unravels from center
 *  3. 1.4s — "Fakhri Mart" title reveals letter-by-letter
 *  4. 2.0s — Tagline fades in below
 *  5. 2.8s — Logo flies to navbar position
 *  6. 3.6s — Animation completes, page reveals
 *
 * Accessibility:
 *  - Skip button always visible
 *  - Respects prefers-reduced-motion (skips entirely)
 *  - aria-hidden on decorative SVGs
 *  - Plays once per session (sessionStorage)
 */
export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState("circle-1"); // circle-1, circle-2, circle-3, ball, title, tagline, flying, done
  const [flyStyle, setFlyStyle] = useState({});
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPlayed = sessionStorage.getItem("fakhri_intro_played_v2") === "true";

    if (prefersReducedMotion || isPlayed) {
      setVisible(false);
      onComplete();
      return;
    }

    document.body.classList.add("intro-running");

    // Phase sequence with refined timing
    const timers = [
      setTimeout(() => setPhase("circle-2"), 350),   // 2nd circle starts
      setTimeout(() => setPhase("circle-3"), 650),   // 3rd circle starts
      setTimeout(() => setPhase("ball"), 950),       // yarn ball unravels
      setTimeout(() => setPhase("title"), 1400),     // title reveals
      setTimeout(() => setPhase("tagline"), 2000),   // tagline fades in
      setTimeout(() => setPhase("flying"), 2800),    // logo flies to navbar
      setTimeout(() => {
        setPhase("done");
        sessionStorage.setItem("fakhri_intro_played_v2", "true");
        document.body.classList.remove("intro-running");
        onComplete();
      }, 3600),
    ];

    return () => {
      timers.forEach(clearTimeout);
      document.body.classList.remove("intro-running");
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase("done");
    sessionStorage.setItem("fakhri_intro_played_v2", "true");
    document.body.classList.remove("intro-running");
    onComplete();
  };

  // Compute fly-to-navbar transform
  useEffect(() => {
    if (phase !== "flying") return;
    const navLogo = document.getElementById("navbar-logo");
    if (navLogo) {
      const rect = navLogo.getBoundingClientRect();
      const logoSize = 140;
      const xDiff = rect.left + rect.width / 2 - window.innerWidth / 2;
      const yDiff = rect.top + rect.height / 2 - window.innerHeight / 2;
      const scaleFactor = rect.width / logoSize;
      setFlyStyle({
        transform: `translate(calc(-50% + ${xDiff}px), calc(-50% + ${yDiff}px)) scale(${scaleFactor})`,
        opacity: 0.85,
        transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      });
    }
  }, [phase]);

  if (phase === "done" || !visible) return null;

  const titleLetters = "Fakhri Mart".split("");

  return (
    <motion.div
      className={`intro-overlay ${phase === "flying" ? "intro-overlay--fade" : ""}`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Skip button */}
      <button
        type="button"
        className="intro-skip-btn"
        onClick={handleSkip}
        aria-label="Skip intro animation"
      >
        Skip Intro
      </button>

      <div className="intro-container">
        {/* Three concentric thread circles — draw in sequence */}
        <svg className="intro-stitch intro-stitch-1" viewBox="0 0 240 240" width="240" height="240" aria-hidden="true">
          <motion.circle
            cx="120"
            cy="120"
            r="108"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="679"
            initial={{ strokeDashoffset: 679, opacity: 0 }}
            animate={{
              strokeDashoffset: phase === "circle-1" || phase === "circle-2" || phase === "circle-3" || phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 0 : 679,
              opacity: 1,
            }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
        </svg>

        <svg className="intro-stitch intro-stitch-2" viewBox="0 0 240 240" width="200" height="200" aria-hidden="true">
          <motion.circle
            cx="120"
            cy="120"
            r="108"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="679"
            initial={{ strokeDashoffset: 679, opacity: 0 }}
            animate={{
              strokeDashoffset: phase === "circle-2" || phase === "circle-3" || phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 0 : 679,
              opacity: phase === "circle-2" || phase === "circle-3" || phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 0.7 : 0,
            }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
        </svg>

        <svg className="intro-stitch intro-stitch-3" viewBox="0 0 240 240" width="160" height="160" aria-hidden="true">
          <motion.circle
            cx="120"
            cy="120"
            r="108"
            fill="none"
            stroke="var(--pink)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="679"
            initial={{ strokeDashoffset: 679, opacity: 0 }}
            animate={{
              strokeDashoffset: phase === "circle-3" || phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 0 : 679,
              opacity: phase === "circle-3" || phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 0.6 : 0,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
        </svg>

        {/* Yarn ball graphic — unravels from center */}
        <motion.div
          className="intro-yarn-ball"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{
            scale: phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 1 : 0,
            opacity: phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 1 : 0,
            rotate: phase === "ball" || phase === "title" || phase === "tagline" || phase === "flying" ? 0 : -180,
          }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          aria-hidden="true"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* Yarn ball body */}
            <circle cx="60" cy="60" r="32" fill="var(--gold)" opacity="0.9" />
            {/* Yarn wraps — curved lines over the ball */}
            <path d="M 30,60 Q 60,30 90,60" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M 30,60 Q 60,90 90,60" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M 60,28 Q 92,60 60,92" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M 60,28 Q 28,60 60,92" stroke="var(--gold-soft)" strokeWidth="2" fill="none" opacity="0.5" />
            {/* Highlight */}
            <ellipse cx="50" cy="50" rx="8" ry="5" fill="var(--bg)" opacity="0.4" />
          </svg>
        </motion.div>

        {/* Logo — flies to navbar at the end */}
        <motion.div
          className={`intro-logo-wrapper ${phase === "flying" ? "intro-logo--flying" : ""}`}
          style={phase === "flying" ? flyStyle : {}}
          aria-hidden="true"
        >
          <img src="/assets/fakhri-mart-logo.webp" alt="" className="intro-logo-img" />
        </motion.div>

        {/* Title — letter-by-letter reveal */}
        <div className={`intro-text intro-text-title ${phase === "title" || phase === "tagline" || phase === "flying" ? "intro-text--visible" : ""} ${phase === "flying" ? "intro-text--hide" : ""}`}>
          <h2 className="intro-title">
            {titleLetters.map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{
                  opacity: phase === "title" || phase === "tagline" || phase === "flying" ? 1 : 0,
                  y: phase === "title" || phase === "tagline" || phase === "flying" ? 0 : 20,
                  rotateX: phase === "title" || phase === "tagline" || phase === "flying" ? 0 : -90,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: i * 0.04,
                }}
                style={{ display: "inline-block", transformOrigin: "bottom" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* Tagline — fades in below title */}
        <motion.p
          className="intro-tagline"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase === "tagline" || phase === "flying" ? 1 : 0,
            y: phase === "tagline" || phase === "flying" ? 0 : 10,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {businessInfo.tagline}
        </motion.p>
      </div>
    </motion.div>
  );
}
