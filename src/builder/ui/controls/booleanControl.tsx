import React from "react";

export function BooleanControl({
  id,
  checked,
  onChange,
  inRow = false,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  inRow?: boolean;
}) {
  const inputId = React.useId();
  const onInputChange = () => onChange(!checked);
  const marginTopClass = inRow ? "mt-6" : "mt-3";

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <label
          className={`${marginTopClass} inline-flex items-center cursor-pointer`}
          htmlFor={inputId}
        >
          <span className="relative">
            <span className="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
            <span
              className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-50 ease-in-out ${
                checked ? "bg-blue-500 transform translate-x-full" : "bg-white"
              }`}
            >
              <input
                id={inputId}
                type="checkbox"
                className="absolute opacity-0 w-0 h-0"
                checked={checked}
                onChange={onInputChange}
              />
            </span>
          </span>
          <span className="ml-3">{id}</span>
        </label>
      </div>
    </div>
  );
}
