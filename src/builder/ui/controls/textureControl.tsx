import React from "react";

import { type Texture, makeTextureFromUrl } from "@/builder/modules/texture";
import { type SelectOption, Select } from "../form/select";

export function TextureControl({
  id,
  choices,
  standardWidth,
  standardHeight,
  textures,
  onChange,
}: {
  id: string;
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  textures: Map<string, Texture>;
  onChange: (image: Texture | null) => void;
}) {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] ?? null : null;
    if (!file) {
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const result = e.target ? e.target.result : null;

      if (typeof result !== "string") {
        return;
      }

      makeTextureFromUrl(result, standardWidth, standardHeight).then(onChange);
    };

    fileReader.readAsDataURL(file);
  };

  const onChoiceChange = (choice: SelectOption) => {
    const texture = textures.get(choice.id) ?? null;
    onChange(texture);
  };

  const selectChoices: SelectOption[] =
    choices.length > 0
      ? [
          { id: "", label: "None" },
          ...choices.map((choice) => ({ id: choice, label: choice })),
        ]
      : [];

  return (
    <div className="mb-4">
      <div className="font-bold mb-1">{id}</div>
      <div className="flex space-x-4 items-center">
        {selectChoices.length > 0 ? (
          <>
            <Select choices={selectChoices} onChange={onChoiceChange} />
            <div>or</div>
          </>
        ) : null}

        <input type="file" onChange={onInputChange} />
      </div>
    </div>
  );
}
