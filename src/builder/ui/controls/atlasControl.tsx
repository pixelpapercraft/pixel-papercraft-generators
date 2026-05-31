import React from "react";

import {
  type Texture,
  makeTextureFromUrl,
} from "../../modules/texture";
import { type SelectOption, Select } from "../form/select";
import {
  isSupportedTextureUploadFile,
  loadTextureUploadImage,
  textureUploadAccept,
} from "./textureUpload";
import { createAtlas } from "./atlasControlLogic";

export function AtlasControl({
  id,
  label,
  choices,
  standardWidth,
  standardHeight,
  textures,
  onChange,
}: {
  id: string;
  label?: string;
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  textures: Map<string, Texture>;
  onChange: (texture: Texture | null, frames: string | null) => void;
}) {
  const baseId = React.useId();
  const legendId = `${baseId}-legend`;
  const selectId = `${baseId}-select`;
  const fileInputId = `${baseId}-file`;
  const displayLabel = label ?? id;
  const selectChoices: SelectOption[] =
    choices.length > 0
      ? [
          { id: "", label: "None" },
          ...choices.map((choice) => ({ id: choice, label: choice })),
        ]
      : [];

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
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

  const onChoiceChange = (choice: SelectOption) => {
    const texture = textures.get(choice.id) ?? null;
    onChange(texture, null);
  };

  return (
    <fieldset className="mb-4 min-w-0">
      <legend className="font-bold mb-1" id={legendId}>
        {displayLabel}
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
              Select one or more {id} texture files
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
