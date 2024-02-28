import React from "react";

export function RangeControl({
  id,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const onRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className="mb-4">
      <div className="font-bold">{id}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onRangeChange}
      />
    </div>
  );
}
