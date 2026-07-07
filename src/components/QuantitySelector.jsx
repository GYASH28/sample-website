import { Minus, Plus } from "lucide-react";
import { useCallback } from "react";

export default function QuantitySelector({ options, value, onChange }) {
  const { unit = "pcs", min = 1, max = 500, step = 1, presets = [] } = options || {};

  const clamp = useCallback(
    (v) => Math.max(min, Math.min(max, v)),
    [min, max],
  );

  const handleDecrement = () => onChange(clamp(value - step));
  const handleIncrement = () => onChange(clamp(value + step));

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") return onChange(min);
    onChange(clamp(Number(raw)));
  };

  const presetLabel = (preset) => {
    if (preset === 12) return `Dozen (12)`;
    if (preset >= 50) return `Bulk (${preset})`;
    return `${preset} ${unit}`;
  };

  return (
    <div className="quantity-selector">
      <div className="quantity-label">
        Quantity: <strong>{value} {unit}</strong>
      </div>

      <div className="quantity-presets" role="group" aria-label="Quick quantity selection">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`quantity-preset ${value === preset ? "quantity-preset--active" : ""}`}
            onClick={() => onChange(clamp(preset))}
          >
            {presetLabel(preset)}
          </button>
        ))}
      </div>

      <div className="quantity-stepper">
        <button
          type="button"
          className="stepper-btn"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <label className="stepper-input-label">
          <span className="sr-only">Quantity</span>
          <input
            type="text"
            inputMode="numeric"
            className="stepper-input"
            value={value}
            onChange={handleInput}
            aria-live="polite"
          />
          <span className="stepper-unit">{unit}</span>
        </label>
        <button
          type="button"
          className="stepper-btn"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
