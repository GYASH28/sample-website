export const MOTION_PROFILES = {
  reduced: "reduced",
  lite: "lite",
  compact: "compact",
  full: "full",
};

export function resolveMotionProfile() {
  if (typeof window === "undefined") return MOTION_PROFILES.reduced;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return MOTION_PROFILES.reduced;
  }

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const constrainedConnection =
    connection?.saveData ||
    ["slow-2g", "2g"].includes(connection?.effectiveType);
  const veryConstrainedHardware =
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

  if (constrainedConnection || veryConstrainedHardware) {
    return MOTION_PROFILES.lite;
  }

  const midRangeHardware =
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const compactViewport =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 42rem)").matches;

  if (midRangeHardware || compactViewport) {
    return MOTION_PROFILES.compact;
  }

  return MOTION_PROFILES.full;
}

export function applyMotionProfile() {
  const profile = resolveMotionProfile();
  document.documentElement.dataset.motionProfile = profile;
  document.documentElement.classList.toggle(
    "motion-ready",
    profile !== MOTION_PROFILES.reduced,
  );
  return profile;
}
