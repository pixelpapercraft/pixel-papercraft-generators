"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type DynamicTextures,
} from "@genroot/builder";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";

const id = "example";

const name = "Example";

// Same copy as the v1 example generator's `instructions`.
const instructions: InstructionsDef = `
An example generator to demonstrate how to write a generator script.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
];

// No static textures: the "Skin" texture is supplied at runtime by the skin
// picker through `dynamicTextures` (the v2 counterpart to v1's
// `defineMinecraftSkinInput`). Declaring "Skin" statically would make "None"
// fall back to a default skin instead of drawing nothing — see the migration
// plan's correctness note.
const textures: TextureDef[] = [];

// The same preset list v1's example feeds `defineMinecraftSkinInput`.
const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// `MinecraftSkinControl` reads this only for `texture`-kind options; the
// default preset options are all presets, so a shared empty map is safe and
// keeps a stable identity across renders.
const noTextures: Map<string, Texture> = new Map();

type ExampleProps = {
  showFolds: boolean;
};

// Ported verbatim from `exampleGenerator.ts`'s `script` render body: same
// `drawHead` helper, same `drawImage("Background")`/folds calls. The only
// difference is where `showFolds` comes from — an author-owned prop instead of
// `generator.getBooleanInputValue("Show Folds")`.
const render = (ctx: RenderContext, props: ExampleProps): void => {
  // Helper Function to draw heads
  const drawHead = (name: string, x: number, y: number) => {
    // Head Base
    ctx.drawTexture(name, [0, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    ctx.drawTexture(name, [8, 8, 8, 8], [x, y, 64, 64]); // Face
    ctx.drawTexture(name, [16, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    ctx.drawTexture(name, [24, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    ctx.drawTexture(name, [8, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    ctx.drawTexture(name, [16, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: "Vertical",
    }); // Bottom

    // Head Overlay
    ctx.drawTexture(name, [32, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    ctx.drawTexture(name, [40, 8, 8, 8], [x, y, 64, 64]); // Face
    ctx.drawTexture(name, [48, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    ctx.drawTexture(name, [56, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    ctx.drawTexture(name, [40, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    ctx.drawTexture(name, [48, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: "Vertical",
    }); // Bottom
  };

  ctx.drawImage("Background", [0, 0]);

  drawHead("Skin", 185, 117);

  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }
};

const exampleGenerator: Generator<ExampleProps> = {
  id,
  name,
  images,
  textures,
  render,
};

// Behaviourally identical to the v1 `example` generator: the same reused
// `MinecraftSkinControl` skin picker (10 presets + None + upload, no model
// type) and "Show Folds" toggle, driving the same head render. Here the author
// owns the state and feeds the picker's outputs back — the loaded `Texture`
// via `dynamicTextures`, the folds boolean via `props`.
function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);

  const rendererProps: ExampleProps = { showFolds };

  const dynamicTextures: DynamicTextures = { Skin: skinTexture };

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="mb-8">
          <GeneratorUI.Instructions markdown={instructions} />
        </div>

        <div className="w-full bg-gray-100 p-8 space-y-4">
          <MinecraftSkinControl
            id="Skin"
            options={skinOptions}
            standardWidth={64}
            standardHeight={64}
            showModelType={false}
            value={skinValue}
            textures={noTextures}
            onValueChange={setSkinValue}
            onChange={setSkinTexture}
          />

          <GeneratorUI.BooleanControl
            label="Show Folds"
            checked={showFolds}
            onCheckedChange={setShowFolds}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={exampleGenerator}
          props={rendererProps}
          dynamicTextures={dynamicTextures}
        />
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail: null,
  Component,
};
