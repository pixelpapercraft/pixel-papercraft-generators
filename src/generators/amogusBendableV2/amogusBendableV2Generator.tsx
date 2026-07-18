"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
  type VideoDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import amogusImage from "./instructions/amogus-100.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import colorsImage from "./textures/Colors.png";

const id = "amogus-bendable-v2";

const name = "Amogus Bendable (v2)";

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const video: VideoDef = {
  url: "https://www.youtube.com/embed/0v8_l7J4qWg?rel=0",
};

// Same copy as the v1 amogus-bendable generator's `instructions`.
const instructions: InstructionsDef = `
"Amogus" is a corrupted version of the Among Us game name. In January 2021,
the word gained popularity as a catchphrase used in ironic memes, often used
to replace dialogue in various cartoons. Additionally, Amogus refers to a even
more simplified like drawing of a crewmate from Among Us used in these type of memes.
![Amogus](${amogusImage.src})
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
];

// "Colors" is a fixed authoring asset (not user-controlled), so it stays a
// static texture. No static "Skin" texture: it's supplied at runtime by the
// skin picker through `dynamicTextures`, same as example-v2 and
// minecraft-character-v2 — see the migration plan's correctness note on why
// "None" would otherwise be wrong.
const textures: TextureDef[] = [
  {
    id: "Colors",
    url: colorsImage.src,
    standardWidth: 16,
    standardHeight: 2,
  },
];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// `MinecraftSkinControl` only reads this for `texture`-kind options; the
// default preset options are all presets, so a shared empty map is safe.
const noTextures: Map<string, Texture> = new Map();

// Same 18 colors as v1's `defineSelectInput("Color", [...])`, in the same
// order (so "Red" stays the default first option).
const colorNames = [
  "Red",
  "Black",
  "White",
  "Rose",
  "Blue",
  "Cyan",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Banana",
  "Coral",
  "Lime",
  "Green",
  "Gray",
  "Maroon",
  "Brown",
  "Tan",
] as const;

const colorOptions = colorNames.map((colorName) => ({
  id: colorName,
  label: colorName,
}));

// Where each color lives in the "Colors" texture's 16x2 grid. Coordinates
// match v1's per-color `drawTextureLegacy` calls exactly.
const colorTiles: Record<(typeof colorNames)[number], [number, number]> = {
  Red: [0, 0],
  Black: [1, 0],
  Rose: [2, 0],
  Blue: [3, 0],
  Cyan: [4, 0],
  Yellow: [5, 0],
  Pink: [6, 0],
  Purple: [7, 0],
  Orange: [8, 0],
  Banana: [9, 0],
  Coral: [10, 0],
  Lime: [11, 0],
  Green: [12, 0],
  Gray: [13, 0],
  Maroon: [14, 0],
  Brown: [15, 0],
  Tan: [0, 1],
  White: [1, 1],
};

type AmogusBendableProps = {
  color: (typeof colorNames)[number];
};

// Ported from `amogusBendableGenerator.ts`'s `script` render body: same
// background, color tile, and visor draws in the same order. The only
// differences are the color lookup (a table instead of an if-chain per
// color, same tile coordinates) and `props.color` standing in for
// `generator.getSelectInputValue("Color")`.
const render = (ctx: RenderContext, props: AmogusBendableProps): void => {
  ctx.drawImage("Background", [0, 0]);

  const [tileX, tileY] = colorTiles[props.color];
  ctx.drawTextureLegacy(
    "Colors",
    { x: tileX, y: tileY, w: 1, h: 1 },
    { x: 0, y: 0, w: 600, h: 660 }
  );

  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 47, y: 229, w: 87 - 47, h: 253 - 229 }
  );

  ctx.drawTextureLegacy(
    "Skin",
    { x: 8 + 32, y: 8, w: 8, h: 8 },
    { x: 47, y: 229, w: 87 - 47, h: 253 - 229 }
  );

  ctx.drawImage("Folds", [0, 0]);
};

const amogusBendableGeneratorV2: GeneratorV2<AmogusBendableProps> = {
  id,
  name,
  images,
  textures,
  render,
};

// Behaviourally identical to the v1 `amogus-bendable` generator: the same
// 18-option Color select and reused `MinecraftSkinControl` skin picker (10
// presets + None + upload, no model type), driving the same body/visor
// render. The author owns the state here and feeds the picker's output back
// via `dynamicTextures`.
function Component(): JSX.Element {
  const [color, setColor] =
    React.useState<(typeof colorNames)[number]>("Red");
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);

  const rendererProps: AmogusBendableProps = { color };

  const dynamicTextures = React.useMemo(
    () =>
      skinTexture
        ? new Map<string, Texture>([["Skin", skinTexture]])
        : new Map<string, Texture>(),
    [skinTexture]
  );

  return (
    <div>
      <div className="lg:flex gap-8 mb-8">
        <div className="flex-1 min-w-0">
          <GeneratorUI.MediaHero video={video} thumbnail={thumbnail} />
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorUI.Instructions markdown={instructions} collapsible={false} />
        </div>
      </div>

      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.SelectControl
              label="Color"
              options={colorOptions}
              value={color}
              onValueChange={(value) =>
                setColor(value as (typeof colorNames)[number])
              }
            />

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
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={amogusBendableGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
