import { MoonStars, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_theme";
const THEME_EVENT = "fakhri:theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value) {
  return value === "dark" || value === "light";
}

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function readTheme() {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (isTheme(current)) return current;
  }

  if (typeof window !== "undefined") {
    const stored = readStoredTheme();
    if (stored) return stored;
    return window.matchMedia?.(DARK_QUERY).matches ? "dark" : "light";
  }

  return "light";
}

function applyTheme(theme, { persist = false, broadcast = false } = {}) {
  if (!isTheme(theme) || typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  themeMeta?.setAttribute("content", theme === "dark" ? "#151816" : "#FFF7EC");

  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage is optional; the active theme still works for this session.
    }
  }

  if (broadcast && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
  }
}

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    // The pre-paint script normally applies the initial theme. This keeps the
    // component resilient if it is rendered in another document/test harness.
    applyTheme(theme);

    const media = window.matchMedia(DARK_QUERY);

    const syncTheme = (nextTheme) => {
      if (!isTheme(nextTheme)) return;
      applyTheme(nextTheme);
      setTheme((current) => (current === nextTheme ? current : nextTheme));
    };

    const onThemeEvent = (event) => syncTheme(event.detail?.theme);
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      if (isTheme(event.newValue)) {
        syncTheme(event.newValue);
        return;
      }

      // If an explicit preference is cleared in another tab, return to the
      // operating-system preference instead of getting stuck on stale state.
      syncTheme(media.matches ? "dark" : "light");
    };
    const onSystemTheme = (event) => {
      // Follow the OS only while the user has not made an explicit choice.
      if (!readStoredTheme()) syncTheme(event.matches ? "dark" : "light");
    };

    window.addEventListener(THEME_EVENT, onThemeEvent);
    window.addEventListener("storage", onStorage);
    media.addEventListener?.("change", onSystemTheme);

    return () => {
      window.removeEventListener(THEME_EVENT, onThemeEvent);
      window.removeEventListener("storage", onStorage);
      media.removeEventListener?.("change", onSystemTheme);
    };
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  const toggleTheme = () => {
    applyTheme(nextTheme, { persist: true, broadcast: true });
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "theme-toggle--compact" : ""}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          {theme === "dark" ? <MoonStars size={16} weight="fill" /> : <Sun size={16} weight="fill" />}
        </span>
      </span>
      {compact ? null : <span className="theme-toggle__label">{theme === "dark" ? "Dark" : "Light"}</span>}
    </button>
  );
}
