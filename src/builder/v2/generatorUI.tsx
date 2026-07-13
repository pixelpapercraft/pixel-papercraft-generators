"use client";

import React from "react";
import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonState,
} from "@genroot/builder/ui/button/button";
import { Instructions } from "@genroot/builder/ui/instructions";
import { History } from "@genroot/builder/ui/history";
import { MediaHero } from "@genroot/builder/ui/mediaHero";

export type BooleanInputProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function BooleanInput({
  label,
  checked,
  onCheckedChange,
}: BooleanInputProps): JSX.Element {
  const inputId = React.useId();

  return (
    <label
      className="inline-flex items-center cursor-pointer"
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
            onChange={(event) => onCheckedChange(event.currentTarget.checked)}
          />
        </span>
      </span>
      <span className="ml-3">{label}</span>
    </label>
  );
}

export type SelectOption = {
  id: string;
  label: string;
};

export type SelectInputProps = {
  label: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
};

export function SelectInput({
  label,
  options,
  value,
  onValueChange,
}: SelectInputProps): JSX.Element {
  const inputId = React.useId();

  return (
    <div>
      <label className="font-bold mb-1 block" htmlFor={inputId}>
        {label}
      </label>
      <select
        id={inputId}
        className="p-2 outline outline-1 outline-gray-300 border-r-8 border-transparent"
        value={value}
        onChange={(event) => onValueChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export type RangeInputProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueLabel?: React.ReactNode;
  onValueChange: (value: number) => void;
};

export function RangeInput({
  label,
  min,
  max,
  step,
  value,
  valueLabel,
  onValueChange,
}: RangeInputProps): JSX.Element {
  const inputId = React.useId();

  return (
    <div>
      <label className="font-bold mb-1 block" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onValueChange(Number(event.currentTarget.value))}
      />
      {valueLabel ? <span className="ml-2">{valueLabel}</span> : null}
    </div>
  );
}

export type ButtonProps = {
  children: React.ReactNode;
  title: string;
  color?: ButtonColor;
  size?: ButtonSize;
  state?: ButtonState;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function GeneratorButton({
  children,
  title,
  color,
  size,
  state,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <Button
      title={title}
      color={color}
      size={size}
      state={state}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export type TextProps = {
  children: React.ReactNode;
};

export function Text({ children }: TextProps): JSX.Element {
  return <p>{children}</p>;
}

// V2 controls are controlled React components. They deliberately receive no
// generator model or renderer state; authors own state and arrange controls.
export const GeneratorUI = {
  BooleanInput,
  SelectInput,
  RangeInput,
  Button: GeneratorButton,
  Text,
  // Same collapsible markdown panel v1 renders from `GeneratorDef.instructions`.
  // V2 has no `instructions` field on `GeneratorV2` — authors place it
  // themselves, wherever it fits their custom UI layout.
  Instructions,
  // Preserve v1's video-first hero behavior, while authors choose where it
  // belongs in their custom page layout.
  MediaHero,
  // Same Updates list v1 renders below the generator surface.
  History,
};
