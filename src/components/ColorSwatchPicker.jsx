export default function ColorSwatchPicker({ colors = [], activeColor, onSelect }) {
  if (!colors.length) return null;

  return (
    <div className="color-swatch-picker">
      <div className="swatch-label">
        Colour: <strong>{activeColor?.name || "Select"}</strong>
      </div>
      <div className="swatch-row" role="radiogroup" aria-label="Select shade colour">
        {colors.map((color) => {
          const isActive = activeColor?.hex === color.hex;
          const isLight = isLightColor(color.hex);
          return (
            <button
              key={color.hex}
              type="button"
              className={`swatch-btn ${isActive ? "swatch-btn--active" : ""} ${isLight ? "swatch-btn--light" : ""}`}
              style={{ "--swatch-color": color.hex }}
              aria-pressed={isActive}
              aria-label={`Select ${color.name} shade`}
              title={color.name}
              onClick={() => onSelect(color)}
            />
          );
        })}
      </div>
    </div>
  );
}

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Relative luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.78;
}
