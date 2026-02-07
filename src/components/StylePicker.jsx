import { STYLE_PRESETS } from "../data/constants";

export default function StylePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {STYLE_PRESETS.map((preset) => {
        const active = value === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`rounded-lg border px-2 py-2 text-center text-xs transition ${
              active
                ? "border-white/60 bg-coal-700 text-white"
                : "border-white/10 bg-coal-800 text-white/60 hover:border-white/25"
            }`}
          >
            <span className="mb-1 block text-base">{preset.icon}</span>
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
