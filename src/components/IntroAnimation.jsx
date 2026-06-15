import { useEffect, useState } from "react";
import { businessInfo } from "../data/siteData.js";

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState("logo-in"); // logo-in, drawing, text-in, flying, done
  const [flyStyle, setFlyStyle] = useState({});

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPlayed = sessionStorage.getItem("fakhri_intro_played") === "true";

    if (prefersReducedMotion || isPlayed) {
      onComplete();
      return;
    }

    // Set body class to lock scrolling and hide navbar logo
    document.body.classList.add("intro-running");

    // Phase 1: logo-in (immediately active)

    // Phase 2: drawing circle stitch
    const timer1 = setTimeout(() => {
      setPhase("drawing");
    }, 700);

    // Phase 3: text-in
    const timer2 = setTimeout(() => {
      setPhase("text-in");
    }, 1400);

    // Phase 4: fly logo to navbar
    const timer3 = setTimeout(() => {
      setPhase("flying");

      const navLogo = document.getElementById("navbar-logo");
      if (navLogo) {
        const rect = navLogo.getBoundingClientRect();
        // Logo size in intro is 140px
        const logoSize = 140;
        const xDiff = rect.left + rect.width / 2 - window.innerWidth / 2;
        const yDiff = rect.top + rect.height / 2 - window.innerHeight / 2;
        const scaleFactor = rect.width / logoSize;

        setFlyStyle({
          transform: `translate(calc(-50% + ${xDiff}px), calc(-50% + ${yDiff}px)) scale(${scaleFactor})`,
          opacity: 0.8,
          transition: "transform 750ms cubic-bezier(0.25, 1, 0.5, 1), opacity 700ms cubic-bezier(0.25, 1, 0.5, 1)",
        });
      } else {
        setPhase("done");
      }
    }, 2300);

    // Phase 5: done
    const timer4 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("fakhri_intro_played", "true");
      document.body.classList.remove("intro-running");
      onComplete();
    }, 3050);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      document.body.classList.remove("intro-running");
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className={`intro-overlay ${phase === "flying" ? "intro-overlay--fade" : ""}`}>
      <div className="intro-container">
        {/* Circle stitch thread drawing */}
        <svg className="intro-stitch" viewBox="0 0 200 200" width="200" height="200">
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="var(--pink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="516"
            strokeDashoffset={phase === "logo-in" ? "516" : "0"}
            style={{
              transition: "stroke-dashoffset 900ms cubic-bezier(0.4, 0, 0.2, 1)",
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
          />
        </svg>

        {/* Centered logo wrapper */}
        <div
          className={`intro-logo-wrapper ${phase === "logo-in" ? "intro-logo--initial" : "intro-logo--sharp"}`}
          style={phase === "flying" ? flyStyle : {}}
        >
          <img src="/assets/fakhri-mart-logo.webp" alt="Fakhri Mart logo" className="intro-logo-img" />
        </div>

        {/* Text and Tagline */}
        <div className={`intro-text ${phase === "text-in" ? "intro-text--visible" : ""} ${phase === "flying" ? "intro-text--hide" : ""}`}>
          <h2 className="intro-title">Fakhri Mart</h2>
          <p className="intro-tagline">Colourful Threads, Endless Creation</p>
        </div>
      </div>
    </div>
  );
}
