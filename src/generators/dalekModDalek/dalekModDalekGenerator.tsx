"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type HistoryDef,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
  type DynamicTextures,
} from "@genroot/builder";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import dalekSkinImage from "./instructions/60sDalek.png";
import background1Image from "./images/Background1.png";
import colors1Image from "./images/Colors1.png";
import background2Image from "./images/Background2.png";
import colors2Image from "./images/Colors2.png";

import texture60sDalek from "./textures/daleks/60sDalek.png";
import texture80sDalek from "./textures/daleks/80sDalek.png";
import textureRedDalek from "./textures/daleks/RedDalek.png";
import textureYellowDalek from "./textures/daleks/YellowDalek.png";
import textureMovieDalekGold from "./textures/daleks/MovieDalekGold.png";
import textureEntityGoldDalek from "./textures/daleks/EntityGoldDalek.png";
import textureEntityMDalekBlk from "./textures/daleks/EntityMDalekBlk.png";
import textureEntityMDalekBlu from "./textures/daleks/EntityMDalekBlu.png";
import textureEntityMDalekRed from "./textures/daleks/EntityMDalekRed.png";
import textureEnderDalek from "./textures/daleks/EnderDalek.png";
import textureClassicSupreme from "./textures/daleks/ClassicSupreme.png";
import textureImperialDalek from "./textures/daleks/ImperialDalek.png";
import textureInvasionDalek from "./textures/daleks/InvasionDalek.png";
import textureIronside from "./textures/daleks/Ironside.png";
import textureMarineDalek from "./textures/daleks/MarineDalek.png";
import texturePilotDalek from "./textures/daleks/PilotDalek.png";
import textureRenegadeDalek from "./textures/daleks/RenegadeDalek.png";
import textureScientistDalek from "./textures/daleks/ScientistDalek.png";
import textureStoneDalek from "./textures/daleks/StoneDalek.png";
import textureStrategist from "./textures/daleks/Strategist.png";
import textureSuicideDalek from "./textures/daleks/SuicideDalek.png";

const id = "dalek";

const name = "Doctor Who Dalek";

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

// Same copy as the v1 dalek generator's `history`, plus a V2 layout entry.
const history: HistoryDef = [
  "gootube2000 - First release.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "Jul 2026 lostminer - Layout refresh.",
];

// Same copy as the v1 dalek generator's `instructions`.
const instructions: InstructionsDef = `
Create your own Dalek papercraft, thanks to the team who make the [Dalek Mod](https://swdteam.com/p/dalek-mod).

## How to use the Dalek generator

### Option 1: Use an existing Dalek skin

* Select one of the Dalek skins from the generator.
* Download and print your Dalek papercraft.

### Option 2: Create your own texture

* Download a sample Dalek skin (Right click and save):
  ![Dalek](${dalekSkinImage.src})
* Edit this skin in your favourite graphics program.
* Choose this file in the generator.
* Download and print your Dalek papercraft.
`;

const images: ImageDef[] = [
  { id: "Background1", url: background1Image.src },
  { id: "Colors1", url: colors1Image.src },
  { id: "Background2", url: background2Image.src },
  { id: "Colors2", url: colors2Image.src },
];

// No static textures: "Skin" is supplied at runtime by the texture picker
// through `dynamicTextures`, same pattern as minecraftItem's glint texture.
// The "Colors" overlays are static `images`, drawn via `drawImage`.
const textures: TextureDef[] = [];

const dalekTextures: TextureDef[] = [
  {
    id: "60's Dalek",
    url: texture60sDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "80's Dalek",
    url: texture80sDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Red Dalek",
    url: textureRedDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Yellow Dalek",
    url: textureYellowDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Gold Dalek",
    url: textureMovieDalekGold.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Gold Entity Dalek",
    url: textureEntityGoldDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Black Entity Dalek",
    url: textureEntityMDalekBlk.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Blue Entity Dalek",
    url: textureEntityMDalekBlu.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Red Entity Dalek",
    url: textureEntityMDalekRed.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Ender Dalek",
    url: textureEnderDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Classic Supreme Dalek",
    url: textureClassicSupreme.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Imperial Dalek",
    url: textureImperialDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Invasion Dalek",
    url: textureInvasionDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Ironside Dalek",
    url: textureIronside.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Marine Dalek",
    url: textureMarineDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Pilot Dalek",
    url: texturePilotDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Renegade Dalek",
    url: textureRenegadeDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Scientist Dalek",
    url: textureScientistDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Stone Dalek",
    url: textureStoneDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Strategist Dalek",
    url: textureStrategist.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Suicide Dalek",
    url: textureSuicideDalek.src,
    standardWidth: 128,
    standardHeight: 128,
  },
];

const dalekChoiceIds = dalekTextures.map((dalekTexture) => dalekTexture.id);

type DalekProps = { showColors: boolean };

// Ported from `dalekModDalekGenerator.ts`'s `script` render body verbatim:
// same two pages, same draw-call order, same coordinates. The skin comes
// through `dynamicTextures` (key "Skin") instead of a v1 texture input, and
// `props.showColors` stands in for `generator.getBooleanInputValue("Show
// Colors")`.
const render = (ctx: RenderContext, props: DalekProps): void => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Page 1
  //
  ////////////////////////////////////////////////////////////////////////////////

  ctx.usePage("Head and Body");

  // Background

  ctx.drawImage("Background1", [0, 0]);

  // Left Lightbulb

  ctx.drawTextureLegacy(
    "Skin",
    { x: 5, y: 44, w: 1, h: 3 },
    { x: 27, y: 110, w: 5, h: 15 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 6, y: 44, w: 1, h: 3 },
    { x: 32, y: 110, w: 5, h: 15 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 7, y: 44, w: 1, h: 3 },
    { x: 37, y: 110, w: 5, h: 15 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 44, w: 1, h: 3 },
    { x: 22, y: 110, w: 5, h: 15 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 6, y: 45, w: 1, h: 1 },
    { x: 32, y: 105, w: 5, h: 5 }
  ); // Top

  // Right Lightbulb

  ctx.drawTextureLegacy(
    "Skin",
    { x: 5, y: 44, w: 1, h: 3 },
    { x: 55, y: 110, w: 5, h: 15 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 6, y: 44, w: 1, h: 3 },
    { x: 60, y: 110, w: 5, h: 15 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 7, y: 44, w: 1, h: 3 },
    { x: 65, y: 110, w: 5, h: 15 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 44, w: 1, h: 3 },
    { x: 70, y: 110, w: 5, h: 15 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 6, y: 45, w: 1, h: 1 },
    { x: 60, y: 105, w: 5, h: 5 }
  ); // Top

  // Top Head

  ctx.drawTextureLegacy(
    "Skin",
    { x: 58, y: 110, w: 30, h: 2 },
    { x: 95, y: 70, w: 150, h: 10 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 66, y: 102, w: 7, h: 8 },
    { x: 135, y: 30, w: 35, h: 40 }
  ); // Top

  // Bottom Head

  ctx.drawTextureLegacy(
    "Skin",
    { x: 58, y: 124, w: 38, h: 4 },
    { x: 95, y: 175, w: 190, h: 20 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 68, y: 114, w: 9, h: 10 },
    { x: 190, y: 125, w: 45, h: 50 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 77, y: 114, w: 9, h: 10 },
    { x: 190, y: 195, w: 45, h: 50 }
  ); // Bottom

  // "Neck" 1

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 28, h: 1 },
    { x: 211, y: 263, w: 140, h: 5 }
  ); // Right, Face, Left, Back

  // "Neck" 2

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 40, w: 38, h: 1 },
    { x: 34, y: 288, w: 190, h: 5 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 68, y: 114, w: 9, h: 10 },
    { x: 79, y: 243, w: 50, h: 45 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 77, y: 114, w: 9, h: 10 },
    { x: 79, y: 293, w: 50, h: 45 }
  ); // Bottom

  // "Neck" 3

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 28, h: 1 },
    { x: 176, y: 342, w: 140, h: 5 }
  ); // Right, Face, Left, Back

  // "Neck" 4

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 40, w: 38, h: 1 },
    { x: 100, y: 406, w: 190, h: 5 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 68, y: 114, w: 9, h: 10 },
    { x: 145, y: 361, w: 50, h: 45 }
  ); // Top

  // Body

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 109, w: 46, h: 5 },
    { x: 15, y: 483, w: 230, h: 25 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 68, y: 114, w: 9, h: 10 },
    { x: 70, y: 428, w: 60, h: 55 }
  ); // Top

  // Eye

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 1, w: 1, h: 3 },
    { x: 20, y: 180, w: 5, h: 15 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 1, y: 1, w: 3, h: 3 },
    { x: 25, y: 180, w: 15, h: 15 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 1, w: 1, h: 3 },
    { x: 40, y: 180, w: 5, h: 15 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 5, y: 1, w: 3, h: 3 },
    { x: 45, y: 180, w: 15, h: 15 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 1, y: 0, w: 3, h: 1 },
    { x: 25, y: 175, w: 15, h: 5 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 0, w: 3, h: 1 },
    { x: 25, y: 195, w: 15, h: 5 }
  ); // Bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 42, w: 1, h: 1 },
    { x: 30, y: 185, w: 5, h: 5 }
  ); // Center

  // Eyestalk

  ctx.drawTextureLegacy(
    "Skin",
    { x: 2, y: 56, w: 5, h: 4 },
    { x: 310, y: 433, w: 30, h: 20 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 1, y: 59, w: 1, h: 1 },
    { x: 305, y: 438, w: 5, h: 5 }
  ); // Top

  // Tazer

  ctx.drawTextureLegacy(
    "Skin",
    { x: 1, y: 48, w: 7, h: 1 },
    { x: 270, y: 483, w: 30, h: 20 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 48, w: 1, h: 1 },
    { x: 265, y: 488, w: 5, h: 5 }
  ); // Top

  // Color Identifiers

  if (props.showColors) {
    ctx.drawImage("Colors1", [0, 0]);
  }

  ////////////////////////////////////////////////////////////////
  //
  // Page 2
  //
  ////////////////////////////////////////////////////////////////

  ctx.usePage("Skirt");

  // Background

  ctx.drawImage("Background2", [0, 0]);

  // Top Skirt

  ctx.drawTextureLegacy(
    "Skin",
    { x: 1, y: 93, w: 47, h: 5 },
    { x: 120, y: 116, w: 235, h: 25 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 14, y: 60, w: 11, h: 14 },
    { x: 180, y: 56, w: 55, h: 60 }
  ); // Top

  // Middle Skirt

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 74, w: 50, h: 6 },
    { x: 5, y: 256, w: 250, h: 30 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 13, y: 80, w: 11, h: 14 },
    { x: 75, y: 186, w: 55, h: 70 }
  ); // Top

  // Bottom Skirt

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 16, w: 58, h: 4 },
    { x: 35, y: 460, w: 290, h: 15 }
  ); // Right, Face, Left, Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 13, h: 16 },
    { x: 115, y: 380, w: 65, h: 80 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 29, y: 0, w: 13, h: 16 },
    { x: 115, y: 380, w: 65, h: 80 }
  ); // Bottom

  // Color Identifiers

  if (props.showColors) {
    ctx.drawImage("Colors2", [0, 0]);
  }
};

const dalekGenerator: Generator<DalekProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [showColors, setShowColors] = React.useState(false);
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);

  const rendererProps: DalekProps = { showColors };

  const dynamicTextures: DynamicTextures = { Skin: skinTexture };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="mb-8">
        <GeneratorUI.Instructions markdown={instructions} collapsible={false} />
      </div>

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.LoadedTextureControl
              id="Skin"
              definitions={dalekTextures}
              standardWidth={128}
              standardHeight={128}
              choices={dalekChoiceIds}
              loadingMessage="Loading skin choices…"
              errorMessage="Skin choices could not be loaded."
              onChange={setSkinTexture}
            />

            <GeneratorUI.BooleanControl
              label="Show Colors"
              checked={showColors}
              onCheckedChange={setShowColors}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={dalekGenerator}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
