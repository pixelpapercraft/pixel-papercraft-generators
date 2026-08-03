import React from "react";
import { type Texture } from "@genroot/builder/engine/texture";
import { type SelectOption, Select } from "@genroot/builder/ui/form/select";
import {
  isSupportedTextureUploadFile,
  loadTextureUploadFile,
  textureUploadAccept,
} from "./textureUpload";

export type TextureControlV2Value =
  | { kind: "None" }
  | { kind: "Preset"; id: string }
  | { kind: "Custom" };

export type TextureControlV2Props = {
  id: string;
  label?: string;
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  value: TextureControlV2Value;
  onValueChange: (value: TextureControlV2Value) => void;
  onChange: (image: Texture | null) => void;
  disabled?: boolean;
  statusMessage?: string;
};

export function TextureControlV2({
  id,
  label,
  choices,
  standardWidth,
  standardHeight,
  value,
  onValueChange,
  onChange,
  disabled = false,
  statusMessage,
}: TextureControlV2Props): JSX.Element {
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
  const noneChoice = selectChoices.find((choice) => choice.id === "");
  const selectedChoice =
    value.kind === "Preset"
      ? selectChoices.find((choice) => choice.id === value.id) ?? noneChoice
      : noneChoice;

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] ?? null : null;
    if (!file || !isSupportedTextureUploadFile(file)) {
      return;
    }

    onValueChange({ kind: "Custom" });
    loadTextureUploadFile(file, standardWidth, standardHeight)
      .then(onChange)
      .catch((error) => console.error(error));
  };

  const onChoiceChange = (choice: SelectOption) => {
    onValueChange(
      choice.id === "" ? { kind: "None" } : { kind: "Preset", id: choice.id }
    );
  };

  return (
    <fieldset className="mb-4 min-w-0">
      <legend className="font-bold mb-1" id={legendId}>
        {label ?? id}
      </legend>
      <div className="flex flex-wrap">
        <div className="flex mb-4 space-x-4 items-center mr-4">
          {selectChoices.length > 0 ? (
            <>
              <Select
                id={selectId}
                ariaLabelledBy={legendId}
                choices={selectChoices}
                value={selectedChoice}
                onChange={onChoiceChange}
                disabled={disabled}
              />
              <div>or</div>
            </>
          ) : null}

          <div>
            <label className="sr-only" htmlFor={fileInputId}>
              Upload {id} texture file
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
