"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  InstructionsDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

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

const script: ScriptDef = (generator: Generator) => {
  let ox: number;
  let oy: number;

  // Define user inputs

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 32,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Action Figure", false);

  // Get user variables

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const actionFigure = generator.getBooleanInputValue("Action Figure");

  // Background

  generator.drawImage("Background", [0, 0]);

  // Head

  ox = 164;
  oy = 110;

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 0 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 64 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 128 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 192 + ox, y: 64 + oy, w: 64, h: 64 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 64 + ox, y: 0 + oy, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 64 + ox, y: 128 + oy, w: 64, h: 64 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Body

  ox = 196;
  oy = 340;

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 96 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 32 + ox, y: 32 + oy, w: 64, h: 96 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 96 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 128 + ox, y: 32 + oy, w: 64, h: 96 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 32 + ox, y: oy, w: 64, h: 32 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 96 + ox, y: 192 + oy, w: 64, h: 32 },
    { flip: { kind: "Vertical" }, rotateLegacy: 270.0 }
  ); // Bottom

  // Front Right Foot

  ox = 62;
  oy = 471;

  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 0 + oy, w: 32, h: 32 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 80 + oy, w: 32, h: 32 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Front Left Foot

  ox = 121;
  oy = 589;

  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 0 + oy, w: 32, h: 32 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 80 + oy, w: 32, h: 32 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Back Right Foot

  ox = 419;
  oy = 471;

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 112 + oy, w: 32, h: 32 },
    { flip: { kind: "Vertical" }, rotateLegacy: 180.0 }
  ); // Bottom

  // Back Left Foot

  ox = 367;
  oy = 589;

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 96 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 0 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 32 + ox, y: 32 + oy, w: 32, h: 48 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 32 + oy, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 64 + ox, y: 112 + oy, w: 32, h: 32 },
    { flip: { kind: "Vertical" }, rotateLegacy: 180.0 }
  ); // Bottom

  // Action Figure

  if (actionFigure) {
    // Neck

    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 0, w: 8, h: 8 },
      { x: 44, y: 254, w: 64, h: 96 }
    );

    // Foreground

    generator.drawImage("Action-Figure", [0, 0]);

    // Folds

    if (showFolds) {
      generator.drawImage("Action-Figure-Folds", [0, 0]);
    }

    // Labels

    if (showLabels) {
      generator.drawImage("Action-Figure-Labels", [0, 0]);
    }
  }

  // Folds

  if (showFolds) {
    generator.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
  }
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video: null,
  instructions,
  images,
  textures,
  script,
};
