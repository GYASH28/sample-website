import { WifiHigh, WifiSlash } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export default function ConnectionStatus() {
  const [status, setStatus] = useState(() =>
    typeof navigator === "undefined" || navigator.onLine ? "online" : "offline",
  );
  const [visible, setVisible] = useState(() =>
    typeof navigator !== "undefined" && !navigator.onLine,
  );
  const hideTimerRef = useRef(0);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = 0;
      }
    };

    const onOffline = () => {
      clearHideTimer();
      setStatus("offline");
      setVisible(true);
    };

    const onOnline = () => {
      clearHideTimer();
      setStatus("restored");
      setVisible(true);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        setStatus("online");
      }, 2600);
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      clearHideTimer();
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  if (!visible || status === "online") return null;

  const offline = status === "offline";

  return (
    <div
      className={`connection-status ${offline ? "is-offline" : "is-restored"}`}
      role="status"
      aria-live="polite"
    >
      {offline ? <WifiSlash size={18} /> : <WifiHigh size={18} />}
      <div>
        <strong>{offline ? "You’re offline" : "Back online"}</strong>
        <span>
          {offline
            ? "WhatsApp and external links may be unavailable until you reconnect."
            : "Everything is connected again."}
        </span>
      </div>
      {offline ? (
        <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss offline notice">
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
