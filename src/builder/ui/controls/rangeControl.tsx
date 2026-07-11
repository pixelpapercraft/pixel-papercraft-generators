import React from "react";

export function RangeControl({
  id,
  min,
  max,
  step,
  value,
  showValue,
  onChange,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  showValue?: boolean;
  onChange: (value: number) => void;
}) {
  const inputId = React.useId();
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const onRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseFloat(e.target.value);
    setCurrentValue(nextValue);
    onChange(nextValue);
  };

  return (
    <div className="mb-4">
      <label className="font-bold mb-1 block" htmlFor={inputId}>
        {id}
      </label>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        value={currentValue}
        step={step}
        onChange={onRangeChange}
      />
      {showValue ? <span className="ml-2">{currentValue}</span> : null}
    </div>
  );
}
