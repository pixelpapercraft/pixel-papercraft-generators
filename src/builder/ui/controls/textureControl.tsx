import React from "react";

import { type Texture } from "../../engine/texture";
import { type SelectOption, Select } from "../form/select";
import {
  isSupportedTextureUploadFile,
  loadTextureUploadFile,
  textureUploadAccept,
} from "./textureUpload";

export function TextureControl({
  label,
  choices,
  standardWidth,
  standardHeight,
  textures,
  onChange,
  disabled = false,
  statusMessage,
}: {
  label: string;
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  textures: Map<string, Texture>;
  onChange: (image: Texture | null) => void;
  disabled?: boolean;
  statusMessage?: string;
}) {
  const baseId = React.useId();
  const legendId = `${baseId}-legend`;
  const selectId = `${baseId}-select`;
  const fileInputId = `${baseId}-file`;
  const selectChoices: SelectOption[] =
    choices.length > 0
      ? [
          { id: "", label: "None" },
          ...choices.map((choice) => ({ id: choice, label: choice })),
        ]
      : [];

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] ?? null : null;
    if (!file) {
      return;
    }

    if (!isSupportedTextureUploadFile(file)) {
      return;
    }

    loadTextureUploadFile(file, standardWidth, standardHeight)
      .then(onChange)
      .catch((error) => console.error(error));
  };

  const onChoiceChange = (choice: SelectOption) => {
    const texture = textures.get(choice.id) ?? null;
    onChange(texture);
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
                disabled={disabled}
              />
              <div>or</div>
            </>
          ) : null}

          <div>
            <label className="sr-only" htmlFor={fileInputId}>
              Upload {label} texture file
            </label>
            <input
              id={fileInputId}
              className="border border-gray-300 p-1 bg-white text-gray-400"
              type="file"
              accept={textureUploadAccept}
              disabled={disabled}
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>
      {statusMessage ? (
        <p className="text-sm text-gray-500" role="status">
          {statusMessage}
        </p>
      ) : null}
    </fieldset>
  );
}
