// src/components/LoadingFallback.jsx
// Skeleton fallback for Suspense. No spinner animation — just a calm skeleton.

export function LoadingFallback() {
  return (
    <div className="loading-skeleton" aria-busy="true" aria-live="polite">
      <div className="ls-header">
        <div className="ls-bar" style={{ width: "40%", height: 28 }} />
        <div className="ls-bar" style={{ width: "60%", height: 14, marginTop: 8 }} />
      </div>
    </div>
  );
}
