export default function ProductVisual({ palette = ["#35b8ad", "#f6a7b8", "#f3c65f"], compact = false }) {
  return (
    <div className={`thread-visual ${compact ? "thread-visual--compact" : ""}`} aria-hidden="true">
      <div className="shade-card">
        {palette.map((color) => (
          <span key={color} style={{ "--shade": color }} />
        ))}
      </div>
      <div className="yarn-basket">
        <span />
        <span />
        <span />
      </div>
      <div className="yarn-ball ball-a" style={{ "--thread": palette[0] }} />
      <div className="yarn-ball ball-b" style={{ "--thread": palette[1] }} />
      <div className="yarn-ball ball-c" style={{ "--thread": palette[2] }} />
      <div className="hook-line" />
      <div className="thread-line line-one" />
      <div className="thread-line line-two" />
      <div className="bobbin-row">
        {palette.map((color, index) => (
          <span key={`${color}-${index}`} style={{ "--bobbin": color }} />
        ))}
      </div>
    </div>
  );
}
