import { SIZES } from "../data/constants";

export default function SizePicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SIZES.map((size) => {
        const active = size === value;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-white bg-white text-coal-950"
                : "border-white/20 text-white/70 hover:border-white/40"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
