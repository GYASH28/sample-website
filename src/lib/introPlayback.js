export const INTRO_SESSION_KEY = "fakhri_intro_v3";

export function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const forceReplay =
    new URLSearchParams(window.location.search).get("intro") === "1";
  if (forceReplay) return true;

  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== "played";
  } catch {
    return true;
  }
}

export function rememberIntroPlayback() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "played");
  } catch {
    // Storage can be unavailable in strict privacy modes. The intro remains skippable.
  }
}
