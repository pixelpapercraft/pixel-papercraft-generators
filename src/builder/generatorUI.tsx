"use client";

import React from "react";
import { Button, type ButtonColor } from "@genroot/builder/ui/button/button";
import { Instructions } from "@genroot/builder/ui/instructions";
import { History } from "@genroot/builder/ui/history";
import { MediaHero } from "@genroot/builder/ui/mediaHero";
import { TextureControl } from "@genroot/builder/ui/controls/textureControl";
import { type Texture, makeTextureFromUrl } from "@genroot/builder/engine/texture";
import {
  type SelectOption as FormSelectOption,
  Select,
} from "@genroot/builder/ui/form/select";
import {
  isSupportedTextureUploadFile,
  loadTextureUploadImage,
  textureUploadAccept,
} from "@genroot/builder/ui/controls/textureUpload";
import { createAtlas } from "@genroot/builder/ui/controls/atlasControlLogic";
import { LoadedTextureControl } from "./loadedTextureControl";
import { LoadedTextureControlV2 } from "./loadedTextureControlV2";

// Generic controls available to generator authors. Generators reach these only
// through `GeneratorUI`; implementation modules remain builder internals.

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
  const inputId = React.useId();
  const onInputChange = () => onCheckedChange(!checked);

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <label
          className="mt-3 inline-flex items-center cursor-pointer"
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
          <span className="ml-3">{label}</span>
        </label>
      </div>
    </div>
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
  const inputId = React.useId();
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const onRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseFloat(event.target.value);
    setCurrentValue(nextValue);
    onValueChange(nextValue);
  };

  return (
    <div className="mb-4">
      <label className="font-bold mb-1 block" htmlFor={inputId}>
        {label}
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
  return (
    <div className="mb-4 mr-2 inline-block">
      <Button title={label} size="Small" color={color} onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}

export type AtlasControlProps = {
  label: string;
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  textures: Map<string, Texture>;
  onChange: (texture: Texture | null, frames: string | null) => void;
};

export function AtlasControl({
  label,
  choices,
  standardWidth,
  standardHeight,
  textures,
  onChange,
}: AtlasControlProps): JSX.Element {
  const baseId = React.useId();
  const legendId = `${baseId}-legend`;
  const selectId = `${baseId}-select`;
  const fileInputId = `${baseId}-file`;
  const selectChoices: FormSelectOption[] =
    choices.length > 0
      ? [
          { id: "", label: "None" },
          ...choices.map((choice) => ({ id: choice, label: choice })),
        ]
      : [];

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) {
      onChange(null, null);
      return;
    }

    const supportedFiles = files.filter(isSupportedTextureUploadFile);
    if (supportedFiles.length === 0) {
      onChange(null, null);
      return;
    }

    const loadedImages = await Promise.allSettled(
      supportedFiles.map(loadTextureUploadImage)
    );

    const images = loadedImages
      .filter(
        (result): result is PromiseFulfilledResult<HTMLImageElement> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    if (images.length === 0) {
      onChange(null, null);
      return;
    }

    const { url, framesJson, atlasWidth, atlasHeight } = createAtlas(
      images,
      standardWidth,
      standardHeight
    );
    const texture = await makeTextureFromUrl(url, atlasWidth, atlasHeight);
    onChange(texture, framesJson);
  };

  const onChoiceChange = (choice: FormSelectOption) => {
    const texture = textures.get(choice.id) ?? null;
    onChange(texture, null);
  };

  return (
    <fieldset className="mb-4 min-w-0">
      <legend className="font-bold mb-1" id={legendId}>
        {label}
      </legend>
      <div className="flex flex-wrap">
        <div className="flex mb-4 space-x-4 items-center mr-4">
          {selectChoices.length > 0 ? (
            <>
              <Select
                id={selectId}
                ariaLabelledBy={legendId}
                choices={selectChoices}
                onChange={onChoiceChange}
              />
              <div>or</div>
            </>
          ) : null}

          <div>
            <label className="sr-only" htmlFor={fileInputId}>
              Select one or more {label} texture files
            </label>
            <input
              id={fileInputId}
              className="border border-gray-300 p-1 bg-white text-gray-400"
              type="file"
              accept={textureUploadAccept}
              multiple
              onChange={onInputChange}
            />
            <p className="mt-2 text-sm text-gray-600">
              Select one or more texture files.
            </p>
          </div>
        </div>
      </div>
    </fieldset>
  );
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
  LoadedTextureControlV2,
  // Same collapsible markdown panel v1 renders from `GeneratorDef.instructions`.
  // V2 has no `instructions` field on `Generator` — authors place it
  // themselves, wherever it fits their custom UI layout.
  Instructions,
  // Preserve v1's video-first hero behavior, while authors choose where it
  // belongs in their custom page layout.
  MediaHero,
  // Same Updates list v1 renders below the generator surface.
  History,
};
