import { SHIRT_COLORS } from "../data/constants";

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SHIRT_COLORS.map((color) => {
        const active = value === color.hex;
        return (
          <button
            key={color.hex}
            type="button"
            onClick={() => onChange(color.hex)}
            className={`h-8 w-8 rounded-full border-2 transition ${
              active ? "border-white" : "border-white/20"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.label}
            aria-label={color.label}
          />
        );
      })}
    </div>
  );
}
