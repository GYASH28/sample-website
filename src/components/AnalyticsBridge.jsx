import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEngagement } from "../lib/engagementAnalytics.js";

const SCRIPT_ID = "fakhri-vercel-analytics";

function isVercelHost() {
  const host = window.location.hostname.toLocaleLowerCase();
  return host === "fakhriyarns.vercel.app" || host.endsWith(".vercel.app");
}

export default function AnalyticsBridge() {
  const location = useLocation();

  useEffect(() => {
    if (!isVercelHost()) return;
    window.va = window.va || function vercelAnalyticsQueue(...args) {
      (window.vaq = window.vaq || []).push(args);
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.defer = true;
      script.src = "/_vercel/insights/script.js";
      script.dataset.sdkn = "fakhri-v14";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackEngagement("route_view", { route: location.pathname });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
