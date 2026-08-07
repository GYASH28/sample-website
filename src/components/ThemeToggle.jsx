import { MoonStars, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_theme";

function readTheme() {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (current === "dark" || current === "light") return current;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Storage is optional.
  }

  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  themeMeta?.setAttribute("content", theme === "dark" ? "#171717" : "#FFF7EC");
}

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Preference persistence is optional.
    }
  }, [theme]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY || (event.newValue !== "dark" && event.newValue !== "light")) return;
      setTheme(event.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "theme-toggle--compact" : ""}`}
      onClick={() => setTheme(nextTheme)}
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
