"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import creeperImage from "./textures/creeper.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import actionFigureImage from "./images/Action-Figure.png";
import actionFigureFoldsImage from "./images/Action-Figure-Folds.png";
import actionFigureLabelsImage from "./images/Action-Figure-Labels.png";

const id = "minecraft-creeper";

const name = "Minecraft Creeper";

const history: HistoryDef = [
  "Originally developed by gootube2000.",
  "19 Jun 2014 lostminer - Fix glitch in body, Make back legs face forward rather than backward.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "29 Sep 2020 NinjolasNJM - Fixed bottom textures.",
  "06 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const instructions: InstructionsDef = `
## How to use the Minecraft Creeper Generator?

### Option 1: Use a texture pack or mod Creeper skin

* Download your favourite texture pack or mod.
* Find the **creeper.png** texture file.
* Select this file in the generator.
* "Download and print your new Creeper papercraft.

## Option 2: Create your own Creeper skin

* Download a sample Creeper texture (right click and save):
  ![Creeper Texture](${creeperImage.src})
* Edit this texture in your favourite graphics program.
* Select this file in the generator.
* Download and print your new Creeper papercraft.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Action-Figure", url: actionFigureImage.src },
  { id: "Action-Figure-Folds", url: actionFigureFoldsImage.src },
  { id: "Action-Figure-Labels", url: actionFigureLabelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: creeperImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

type MinecraftCreeperProps = {
  showFolds: boolean;
  showLabels: boolean;
  actionFigure: boolean;
};

const render = (
  ctx: RenderContext,
  { showFolds, showLabels, actionFigure }: MinecraftCreeperProps
): void => {
  let ox: number;
  let oy: number;

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Head

  ox = 164;
  oy = 110;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 0 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 64 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 128 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 192 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 64 + ox, y: 0 + oy, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 64 + ox, y: 128 + oy, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Body

  ox = 196;
  oy = 340;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 96 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 32 + ox, y: 32 + oy, w: 64, h: 96 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 96 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 128 + ox, y: 32 + oy, w: 64, h: 96 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 32 + ox, y: oy, w: 64, h: 32 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 96 + ox, y: 192 + oy, w: 64, h: 32 },
    { flip: "Vertical", rotateLegacy: 270.0 }
  ); // Bottom

  // Front Right Foot

  ox = 62;
  oy = 471;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 0 + oy, w: 32, h: 32 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 80 + oy, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Front Left Foot

  ox = 121;
  oy = 589;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 0 + oy, w: 32, h: 32 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 80 + oy, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Back Right Foot

  ox = 419;
  oy = 471;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 112 + oy, w: 32, h: 32 },
    { flip: "Vertical", rotateLegacy: 180.0 }
  ); // Bottom

  // Back Left Foot

  ox = 367;
  oy = 589;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 112 + oy, w: 32, h: 32 },
    { flip: "Vertical", rotateLegacy: 180.0 }
  ); // Bottom

  // Action Figure

  if (actionFigure) {
    // Neck

    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 0, w: 8, h: 8 },
      { x: 44, y: 254, w: 64, h: 96 }
    );

    // Foreground

    ctx.drawImage("Action-Figure", [0, 0]);

    // Folds

    if (showFolds) {
      ctx.drawImage("Action-Figure-Folds", [0, 0]);
    }

    // Labels

    if (showLabels) {
      ctx.drawImage("Action-Figure-Labels", [0, 0]);
    }
  }

  // Folds

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const generatorV2: GeneratorV2<MinecraftCreeperProps> = {
  id,
  name,
  images,
  textures: [],
  render,
};

function Component(): JSX.Element {
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [actionFigure, setActionFigure] = React.useState(false);
  const props: MinecraftCreeperProps = {
    showFolds,
    showLabels,
    actionFigure,
  };
  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (skinTexture) {
      map.set("Skin", skinTexture);
    }
    return map;
  }, [skinTexture]);

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />
      <div className="mb-8">
        <GeneratorUI.Instructions markdown={instructions} />
      </div>
      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.LoadedTextureControl
              id="Skin"
              definitions={textures}
              choices={[]}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Skin"
              onChange={setSkinTexture}
            />
            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />
            <GeneratorUI.BooleanControl
              label="Show Labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
            <GeneratorUI.BooleanControl
              label="Action Figure"
              checked={actionFigure}
              onCheckedChange={setActionFigure}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={generatorV2}
            props={props}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>
      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
