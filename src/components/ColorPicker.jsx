import { SHIRT_COLORS } from "../data/constants";

export default function ColorPicker({ value, onChange, colors }) {
  const palette = colors?.length
    ? colors
    : SHIRT_COLORS.map((color) => ({ name: color.label, hex: color.hex }));

  return (
    <div className="flex flex-wrap gap-2">
      {palette.map((color) => {
        const active = String(value || "").toLowerCase() === String(color.hex || "").toLowerCase();
        return (
          <button
            key={`${color.hex}-${color.name || ""}`}
            type="button"
            onClick={() => onChange(color)}
            className={`h-8 w-8 rounded-full border-2 transition ${
              active ? "border-white" : "border-white/20"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={color.name}
          />
        );
      })}
    </div>
  );
}
