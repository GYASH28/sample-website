export default function ProductVisual({ palette = ["#1d3557", "#f4a261", "#2a9d8f"], compact = false }) {
  return (
    <div className={`thread-visual ${compact ? "thread-visual--compact" : ""}`} aria-hidden="true">
      <div className="shade-card">
        {palette.map((color) => (
          <span key={color} style={{ "--shade": color }} />
        ))}
      </div>
      <div className="thread-cone cone-a" style={{ "--thread": palette[0] }}>
        <span />
      </div>
      <div className="thread-cone cone-b" style={{ "--thread": palette[1] }}>
        <span />
      </div>
      <div className="thread-cone cone-c" style={{ "--thread": palette[2] }}>
        <span />
      </div>
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
