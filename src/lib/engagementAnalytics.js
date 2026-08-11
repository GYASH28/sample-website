const LOCAL_KEY = "fakhri_event_summary_v1";
const ALLOWED_KEYS = new Set([
  "source",
  "product",
  "category",
  "craft",
  "project",
  "shade",
  "filter",
  "sort",
  "queryType",
  "route",
  "count",
]);

function cleanData(data = {}) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key, value]) => ALLOWED_KEYS.has(key) && value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value).slice(0, 120)]),
  );
}

function recordLocalAggregate(name) {
  try {
    const current = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    current[name] = (Number(current[name]) || 0) + 1;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(current));
  } catch {
    // Analytics must never affect the shopping experience.
  }
}

export function trackEngagement(name, data = {}) {
  if (typeof window === "undefined" || !name) return;
  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
  const safeData = cleanData(data);

  recordLocalAggregate(safeName);
  window.dispatchEvent(new CustomEvent("fakhri:engagement", {
    detail: { name: safeName, data: safeData },
  }));

  try {
    if (typeof window.va === "function") {
      window.va("event", safeName, safeData);
    }
  } catch {
    // Vercel Analytics is optional and may be disabled by browser privacy tools.
  }
}

export function getLocalEngagementSummary() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
  } catch {
    return {};
  }
}
