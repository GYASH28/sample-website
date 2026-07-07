import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { ease, duration } from "../motion-tokens.js";

/**
 * YarnTangleSVG — animated tangled ball of yarn with a crochet hook.
 * The yarn slowly unravels and re-tangles on a 6-second loop.
 */
function YarnTangleSVG() {
  return (
    <svg
      viewBox="0 0 240 240"
      width="100%"
      height="100%"
      style={{ maxWidth: "320px", margin: "0 auto" }}
      aria-hidden="true"
    >
      {/* Outer glow */}
      <circle cx="120" cy="120" r="100" fill="var(--gold-soft)" opacity="0.15" />

      {/* Yarn ball — tangled paths that animate */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "120px 120px" }}
      >
        {/* Tangled yarn loops */}
        <motion.path
          d="M 60,120 Q 80,60 120,80 T 180,120 Q 160,180 120,160 T 60,120"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
          initial={{ pathLength: 0.8 }}
          animate={{ pathLength: [0.8, 1, 0.8] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: ease.soft,
          }}
        />
        <motion.path
          d="M 70,90 Q 120,40 170,90 T 170,150 Q 120,200 70,150 T 70,90"
          fill="none"
          stroke="var(--pink)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
          initial={{ pathLength: 0.7 }}
          animate={{ pathLength: [0.7, 1, 0.7] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: ease.soft,
            delay: 0.5,
          }}
        />
        <motion.path
          d="M 90,70 Q 150,100 150,150 T 90,170"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
          initial={{ pathLength: 0.6 }}
          animate={{ pathLength: [0.6, 1, 0.6] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: ease.soft,
            delay: 1,
          }}
        />
      </motion.g>

      {/* Center knot */}
      <circle cx="120" cy="120" r="8" fill="var(--gold)" />

      {/* Crochet hook — top right */}
      <motion.g
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [0, -4, 0], rotate: [0, 2, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: ease.soft,
        }}
        style={{ transformOrigin: "190px 60px" }}
      >
        <path
          d="M 195,30 L 195,90 Q 195,100 185,100 Q 175,100 175,90"
          fill="none"
          stroke="var(--craft)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="195" cy="30" r="4" fill="var(--craft)" />
      </motion.g>

      {/* Loose thread drifting */}
      <motion.path
        d="M 120,160 Q 130,180 120,200 T 130,220"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: ease.soft,
        }}
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <section className="page-hero not-found-hero">
        <div className="container page-hero-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">404</p>
            <h1>Page not found</h1>
            <p className="page-hero-text">
              The page you're looking for doesn't exist. Browse our yarns instead.
            </p>
            <div className="button-row" style={{ marginTop: "24px" }}>
              <Link className="btn btn-primary" to="/">
                <Home size={18} aria-hidden="true" />
                Back to Home
              </Link>
              <Link className="btn btn-outline" to="/products">
                <Search size={18} aria-hidden="true" />
                Browse Products
              </Link>
            </div>
          </Reveal>
          <Reveal className="page-hero-side" delay={120} variant="scale-in">
            <YarnTangleSVG />
          </Reveal>
        </div>
      </section>
    </>
  );
}
