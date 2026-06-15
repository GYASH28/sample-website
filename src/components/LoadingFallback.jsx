export default function LoadingFallback() {
  return (
    <div className="loading-fallback" role="status" aria-label="Loading page">
      <div className="loading-shimmer">
        <span className="loading-bar loading-bar--wide" />
        <span className="loading-bar loading-bar--medium" />
        <span className="loading-bar loading-bar--narrow" />
      </div>
    </div>
  );
}
