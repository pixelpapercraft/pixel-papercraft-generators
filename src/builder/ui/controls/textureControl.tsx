import React from "react";

import { type Texture } from "@/builder/modules/texture";
import { makeImageFromUrl } from "@/builder/modules/image";
import { type SelectChoice, Select } from "../form/select";

export function TextureControl({
  id,
  textures,
  choices,
  onChange,
}: {
  id: string;
  textures: Map<string, Texture>;
  choices: string[];
  onChange: (image: HTMLImageElement | null) => void;
}) {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          makeImageFromUrl(result).then((image) => onChange(image));
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const onChoiceChange = (choice: SelectChoice) => {
    const texture = textures.get(choice.id);
    const image = texture ? texture.imageWithCanvas.image : null;
    onChange(image);
  };

  const selectChoices: SelectChoice[] = [
    { id: "", label: "None" },
    ...choices.map((choice) => ({ id: choice, label: choice })),
  ];

  return (
    <div className="mb-4">
      <div className="font-bold mb-1">{id}</div>
      <div className="flex space-x-4 items-center">
        {choices.length > 0 ? (
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
