"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({ value, onChange, min = 0, max = 99, disabled = false }: Props) {
  const blocked = disabled;
  return (
    <div className="flex items-center gap-2">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold transition-colors"
        style={{
          borderColor: blocked || value <= min ? "#ded5d1" : "#d598aa",
          color: blocked || value <= min ? "#ded5d1" : "#d598aa",
        }}
        onClick={() => !blocked && onChange(Math.max(min, value - 1))}
        disabled={blocked || value <= min}
        aria-label="Diminuer"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" style={{ color: blocked ? "#bba8a1" : undefined }}>{value}</span>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold transition-colors"
        style={{
          borderColor: blocked || value >= max ? "#ded5d1" : "#d598aa",
          color: blocked || value >= max ? "#ded5d1" : "#d598aa",
        }}
        onClick={() => !blocked && onChange(Math.min(max, value + 1))}
        disabled={blocked}
        aria-label="Augmenter"
      >
        +
      </button>
    </div>
  );
}
