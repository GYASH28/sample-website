const PREVIEW_GROUPS = [
  {
    label: "Neutrals",
    colors: [
      ["Ivory", "#F4EFE5"],
      ["Natural", "#D8C4A8"],
      ["Camel", "#B77B4D"],
      ["Chocolate", "#654431"],
      ["Charcoal", "#45484D"],
      ["Black", "#18191B"],
    ],
  },
  {
    label: "Warm",
    colors: [
      ["Butter", "#E7C95E"],
      ["Mustard", "#C99A2E"],
      ["Tangerine", "#DF7A39"],
      ["Coral", "#DF6C63"],
      ["Scarlet", "#BD414A"],
      ["Wine", "#743746"],
    ],
  },
  {
    label: "Pink & purple",
    colors: [
      ["Blush", "#E3A8B7"],
      ["Rose", "#C96F90"],
      ["Fuchsia", "#C44789"],
      ["Lilac", "#B4A0D3"],
      ["Violet", "#7861A8"],
      ["Plum", "#5A3B60"],
    ],
  },
  {
    label: "Cool",
    colors: [
      ["Sky", "#78B5D6"],
      ["Cobalt", "#4169AC"],
      ["Navy", "#304267"],
      ["Mint", "#91C8B4"],
      ["Teal", "#328F89"],
      ["Forest", "#496F59"],
    ],
  },
];

export const SHADE_PREVIEW_PRESETS = PREVIEW_GROUPS.flatMap((group) =>
  group.colors.map(([name, hex]) => ({ name, hex, group: group.label })),
);

export function ShadePreviewTint({ value }) {
  if (!value) return null;
  return (
    <span
      className="shade-preview-tint"
      style={{ "--shade-preview-color": value }}
      aria-hidden="true"
    />
  );
}

export default function ShadePreviewStudio({ value, onChange, compact = false, preservePackaging = false }) {
  return (
    <section className={`shade-preview-studio ${compact ? "shade-preview-studio--compact" : ""}`} aria-label={preservePackaging ? "Colour reference picker" : "Digital colour preview"}>
      <div className="shade-preview-studio__heading">
        <div>
          <span className="shade-preview-studio__eyebrow">{preservePackaging ? "Colour enquiry reference" : "Digital colour preview"}</span>
          <strong>{value ? `${preservePackaging ? "Colour reference" : "Previewing"} ${value.toUpperCase()}` : preservePackaging ? "Choose a colour to ask about" : "Try any colour on this product"}</strong>
        </div>
        {value ? (
          <button type="button" className="shade-preview-studio__reset" onClick={() => onChange(null)}>
            {preservePackaging ? "Clear" : "Original"}
          </button>
        ) : null}
      </div>

      <div className="shade-preview-studio__groups">
        {PREVIEW_GROUPS.map((group) => (
          <div className="shade-preview-studio__group" key={group.label}>
            {!compact ? <span>{group.label}</span> : null}
            <div className="shade-preview-studio__swatches">
              {group.colors.map(([name, hex]) => {
                const active = value?.toUpperCase() === hex.toUpperCase();
                return (
                  <button
                    key={hex}
                    type="button"
                    className={active ? "is-active" : ""}
                    style={{ "--preview-swatch": hex }}
                    onClick={() => onChange(active ? null : hex)}
                    aria-label={`${active ? "Remove" : preservePackaging ? "Select" : "Preview"} ${name}`}
                    aria-pressed={active}
                    title={`${name} — ${preservePackaging ? "enquiry reference only" : "digital preview only"}`}
                  >
                    <i aria-hidden="true" />
                    {!compact ? <small>{name}</small> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <label className="shade-preview-studio__custom">
        <span>Custom colour</span>
        <input
          type="color"
          value={value || "#328F89"}
          onChange={(event) => onChange(event.target.value)}
          aria-label={preservePackaging ? "Choose a custom colour enquiry reference" : "Choose a custom digital preview colour"}
        />
        <code>{value ? value.toUpperCase() : "ANY"}</code>
      </label>

      <p className="shade-preview-studio__notice">
        {preservePackaging
          ? "Colour reference only — the labelled product image stays unchanged so its packaging remains readable. Ask for the current supplier shade card or live stock photo before ordering."
          : "Preview only — this recolours the existing photo in your browser. It does not mean this exact shade is in stock. Confirm the current supplier shade card or live product photo before ordering."}
      </p>
    </section>
  );
}
