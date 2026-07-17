"use client";

import React from "react";
import { type ButtonColor } from "@genroot/builder/ui/button/button";
import { Instructions } from "@genroot/builder/ui/instructions";
import { History } from "@genroot/builder/ui/history";
import { MediaHero } from "@genroot/builder/ui/mediaHero";
import { AtlasControl } from "@genroot/builder/ui/controls/atlasControl";
import { TextureControl } from "@genroot/builder/ui/controls/textureControl";
import { BooleanControl as BooleanControlV1 } from "@genroot/builder/ui/controls/booleanControl";
import { ButtonControl as ButtonControlV1 } from "@genroot/builder/ui/controls/buttonControl";
import { RangeControl as RangeControlV1 } from "@genroot/builder/ui/controls/rangeControl";
import { LoadedTextureControl } from "./loadedTextureControl";

// V2's controls wrap v1's so both generations render identical markup while v2
// authors get explicit, controlled props (`label`/`onValueChange`) instead of
// v1's `id`-doubles-as-label convention. `builder/ui` is being retired; when it
// goes, these wrappers absorb the markup and the v1 modules are deleted.
// Generators must reach these only through `GeneratorUI` — see the eslint
// boundary rule for `src/generators/*V2/`.

export type BooleanControlProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function BooleanControl({
  label,
  checked,
  onCheckedChange,
}: BooleanControlProps): JSX.Element {
  return (
    <BooleanControlV1 id={label} checked={checked} onChange={onCheckedChange} />
  );
}

export type SelectOption = {
  id: string;
  label: string;
};

export type SelectControlProps = {
  label: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
};

// Not delegated to v1's `SelectControl`: that one takes `string[]`, so an
// option's id and label are always the same. V2 authors need them to differ
// (Item's "Version" select has a `custom` id behind a display label), so this
// keeps the richer `SelectOption[]` API and reproduces v1's markup directly.
export function SelectControl({
  label,
  options,
  value,
  onValueChange,
}: SelectControlProps): JSX.Element {
  const inputId = React.useId();

  return (
    <div className="mb-4">
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

export type RangeControlProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  showValue?: boolean;
  onValueChange: (value: number) => void;
};

export function RangeControl({
  label,
  min,
  max,
  step,
  value,
  showValue,
  onValueChange,
}: RangeControlProps): JSX.Element {
  return (
    <RangeControlV1
      id={label}
      min={min}
      max={max}
      step={step}
      value={value}
      showValue={showValue}
      onChange={onValueChange}
    />
  );
}

export type ButtonControlProps = {
  label: string;
  color?: ButtonColor;
  onClick: () => void;
};

export function ButtonControl({
  label,
  color,
  onClick,
}: ButtonControlProps): JSX.Element {
  return <ButtonControlV1 id={label} color={color} onClick={onClick} />;
}

export type TextControlProps = {
  children: React.ReactNode;
};

// v1's `TextControl` takes a `text: string`, so it can't carry the rich
// children v2 authors pass; this reproduces its wrapper instead.
export function TextControl({ children }: TextControlProps): JSX.Element {
  return (
    <div className="mb-4">
      <p>{children}</p>
    </div>
  );
}

// V2 controls are controlled React components. They deliberately receive no
// generator model or renderer state; authors own state and arrange controls.
export const GeneratorUI = {
  BooleanControl,
  SelectControl,
  RangeControl,
  ButtonControl,
  TextControl,
  AtlasControl,
  TextureControl,
  // Owns its own texture-choice loading, so authors never see the load
  // lifecycle. See the framework-owned loading plan.
  LoadedTextureControl,
  // Same collapsible markdown panel v1 renders from `GeneratorDef.instructions`.
  // V2 has no `instructions` field on `GeneratorV2` — authors place it
  // themselves, wherever it fits their custom UI layout.
  Instructions,
  // Preserve v1's video-first hero behavior, while authors choose where it
  // belongs in their custom page layout.
  MediaHero,
  // Same Updates list v1 renders below the generator surface.
  History,

  // Deprecated `*Input` names, kept so this slice changes no generator. Each
  // is the same component under its new name; they are removed once every V2
  // generator is repointed.
  /** @deprecated Use `BooleanControl`. */
  BooleanInput: BooleanControl,
  /** @deprecated Use `SelectControl`. */
  SelectInput: SelectControl,
  /** @deprecated Use `RangeControl`. */
  RangeInput: RangeControl,
  /** @deprecated Use `TextControl`. */
  Text: TextControl,
};
