import { useCallback, useEffect, useRef, useState } from "react";
import {
  rememberIntroPlayback,
  shouldPlayIntro,
} from "../lib/introPlayback.js";
import styles from "./IntroAnimation.module.css";

export default function IntroAnimation() {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [exiting, setExiting] = useState(false);
  const overlayRef = useRef(null);
  const skipRef = useRef(null);
  const finishedRef = useRef(false);
  const skipTimerRef = useRef(0);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    rememberIntroPlayback();
    document.body.classList.remove("intro-running");
    setVisible(false);
  }, []);

  const skip = useCallback(() => {
    if (finishedRef.current) return;
    setExiting(true);
    clearTimeout(skipTimerRef.current);
    skipTimerRef.current = window.setTimeout(finish, 260);
  }, [finish]);

  useEffect(() => {
    if (!visible) return undefined;

    rememberIntroPlayback();
    document.body.classList.add("intro-running");
    const previousFocus = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => {
      skipRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const safetyTimer = window.setTimeout(finish, 3600);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(skipTimerRef.current);
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("intro-running");
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [finish, skip, visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${exiting ? styles.exiting : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart introduction"
      onAnimationEnd={(event) => {
        if (event.target === overlayRef.current && !exiting) finish();
      }}
    >
      <div className={styles.panelTop} aria-hidden="true" />
      <div className={styles.panelBottom} aria-hidden="true" />

      <svg
        className={styles.threadJourney}
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={`${styles.journeyPath} ${styles.journeyGold}`}
          d="M-40 468 C114 410 157 169 302 208 S422 367 514 287 C548 204 667 184 714 263 C766 353 650 445 546 405 C447 366 468 244 559 214 C778 149 887 481 1240 294"
          pathLength="1"
        />
        <path
          className={`${styles.journeyPath} ${styles.journeyTeal}`}
          d="M-40 468 C114 410 157 169 302 208 S422 367 514 287 C548 204 667 184 714 263 C766 353 650 445 546 405 C447 366 468 244 559 214 C778 149 887 481 1240 294"
          pathLength="1"
        />
        <path
          className={`${styles.journeyPath} ${styles.journeyRose}`}
          d="M-40 468 C114 410 157 169 302 208 S422 367 514 287 C548 204 667 184 714 263 C766 353 650 445 546 405 C447 366 468 244 559 214 C778 149 887 481 1240 294"
          pathLength="1"
        />
      </svg>

      <div className={styles.identity}>
        <span className={styles.prelude}>From a single thread</span>
        <figure className={styles.logo}>
          <img
            src="/assets/brand/fakhri-logo-256.webp"
            alt="Fakhri Mart Yarn Store"
            width="256"
            height="256"
          />
        </figure>
        <h2>Fakhri Mart</h2>
        <p>Yarn and craft materials · Pune</p>
      </div>

      <button ref={skipRef} className={styles.skip} type="button" onClick={skip}>
        Skip intro
      </button>
    </div>
  );
}
