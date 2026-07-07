export default function ProductVisual({ palette = ["#35b8ad", "#f6a7b8", "#f3c65f"], compact = false, activeColor }) {
  // When activeColor is set, use it as the primary colour and derive the rest
  const effectivePalette = activeColor
    ? [activeColor, palette[1] || "#f6a7b8", palette[2] || "#f3c65f"]
    : palette;

  return (
    <div className={`thread-visual ${compact ? "thread-visual--compact" : ""}`} aria-hidden="true">
      <div className="shade-card">
        {effectivePalette.map((color, i) => (
          <span
            key={`${color}-${i}`}
            style={{ "--shade": color, transition: "background 300ms ease" }}
          />
        ))}
      </div>
      <div className="yarn-basket">
        <span />
        <span />
        <span />
      </div>
      <div
        className="yarn-ball ball-a"
        style={{ "--thread": effectivePalette[0], transition: "background 300ms ease" }}
      />
      <div
        className="yarn-ball ball-b"
        style={{ "--thread": effectivePalette[1], transition: "background 300ms ease" }}
      />
      <div
        className="yarn-ball ball-c"
        style={{ "--thread": effectivePalette[2], transition: "background 300ms ease" }}
      />
      <div className="hook-line" />
      <div className="thread-line line-one" />
      <div className="thread-line line-two" />
      <div className="bobbin-row">
        {effectivePalette.map((color, index) => (
          <span
            key={`${color}-${index}`}
            style={{ "--bobbin": color, transition: "background 300ms ease" }}
          />
        ))}
      </div>
    </div>
  );
}
