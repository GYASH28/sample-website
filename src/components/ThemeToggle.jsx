import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

/**
 * ThemeToggle — Light / Warm / System toggle.
 * Three states: light (cream, default), warm (darker, easier at night), system (follows OS).
 * Persisted in localStorage. Applies by setting data-theme on <html>.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("fakhri_theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem("fakhri_theme", theme);
    } catch {}
  }, [theme]);

  function applyTheme(t) {
    const html = document.documentElement;
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.setAttribute("data-theme", prefersDark ? "warm" : "light");
    } else {
      html.setAttribute("data-theme", t);
    }
  }

  // Listen for system changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "warm", icon: Moon, label: "Warm" },
    { value: "system", icon: Monitor, label: "Auto" },
  ];

  return (
    <div
      className="theme-toggle"
      style={{
        display: "inline-flex",
        gap: "2px",
        padding: "3px",
        background: "var(--bg-warm)",
        borderRadius: "var(--radius-pill, 999px)",
        border: "1px solid var(--line)",
      }}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={`${opt.label} theme`}
            aria-pressed={active}
            title={`${opt.label} theme`}
            style={{
              background: active ? "var(--surface)" : "transparent",
              border: "none",
              borderRadius: "var(--radius-pill, 999px)",
              padding: "5px 8px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: active ? "var(--gold)" : "var(--muted)",
              transition: "all var(--duration-quick) var(--ease-soft)",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <Icon size={14} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
