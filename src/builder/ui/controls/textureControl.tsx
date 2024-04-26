import React from "react";

import {
  type Texture,
  makeTextureFromUrl,
  makeTextureFromImage,
} from "@genroot/builder/modules/texture";
import { fetchSkinImage } from "@genroot/builder/modules/minecraftSkin";
import { type SelectOption, Select } from "../form/select";
import { Button, type ButtonState } from "../button/button";
import { ArrowPathIconWithSpin } from "../icon";

type FetchState =
  | { kind: "Idle" }
  | { kind: "Fetching" }
  | { kind: "Error"; error: unknown }
  | { kind: "Success"; image: HTMLImageElement };

function MinecraftSkin({
  onChange,
}: {
  onChange: (image: HTMLImageElement) => void;
}) {
  const [value, setValue] = React.useState("");
  const [fetchState, setFetchState] = React.useState<FetchState>({
    kind: "Idle",
  });

  const username = value.trim();

  const onFetchSkin = async () => {
    setFetchState({ kind: "Fetching" });

    // If it's an empty string the do nothing
    if (!username) {
      return;
    }

    try {
      const image = await fetchSkinImage(value);
      onChange(image);
      setFetchState({ kind: "Success", image });
    } catch (error) {
      console.error(error);
      setFetchState({ kind: "Error", error });
    }
  };

  const buttonState: ButtonState =
    !username || fetchState.kind === "Fetching" ? "Disabled" : "Ready";

  const showSpinner = fetchState.kind === "Fetching";

  return (
    <div>
      <div className="flex">
        <div className="relative">
          <input
            className="border border-gray-300 p-2 mr-2 w-60"
            placeholder="Enter username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                onFetchSkin();
              }
            }}
          />
          {showSpinner ? (
            <span className="absolute top-2 right-4">
              <ArrowPathIconWithSpin />
            </span>
          ) : null}
        </div>

        <Button size="Small" state={buttonState} onClick={onFetchSkin}>
          Fetch skin
        </Button>
      </div>
      {fetchState.kind === "Error" ? (
        <div className="text-red-500 text-sm">
          There was a problem fetching the skin. Check the username and try
          again.
        </div>
      ) : null}
    </div>
  );
}

export function TextureControl({
  id,
  choices,
  standardWidth,
  standardHeight,
  enableMinecraftSkinInput,
  textures,
  onChange,
}: {
  id: string;
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  enableMinecraftSkinInput: boolean;
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
    <>
      <div className="font-bold mb-1">{id}</div>
      <div className="flex flex-wrap">
        <div className="flex mb-4 space-x-4 items-center mr-4">
          {selectChoices.length > 0 ? (
            <>
              <Select choices={selectChoices} onChange={onChoiceChange} />
              <div>or</div>
            </>
          ) : null}

          <input
            className="border border-gray-300 p-1 bg-white text-gray-400"
            type="file"
            onChange={onInputChange}
          />
        </div>
        {enableMinecraftSkinInput ? (
          <div className="flex mb-4 space-x-4 items-center">
            <div>or</div>
            <MinecraftSkin
              onChange={(image) => {
                const texture = makeTextureFromImage(image, 64, 64);
                onChange(texture);
              }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
