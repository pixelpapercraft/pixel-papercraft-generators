"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import foregroundImage from "./images/Foreground.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";

const id = "minecraft-cape-and-elytra";

const name = "Minecraft Cape And Elytra";

const history: HistoryDef = [
  "16 Mar 2021 NinjolasNJM - Initially completed both cape and elytra generation.",
  "06 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Foreground", url: foregroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [];

const script: ScriptDef = (generator: Generator) => {
  // Define the user inputs
  generator.defineTextureInput("Cape", {
    standardWidth: 64,
    standardHeight: 32,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);

  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  // Cape

  generator.drawTextureLegacy(
    "Cape",
    { x: 0, y: 1, w: 1, h: 16 },
    { x: 74, y: 116, w: 8, h: 128 }
  ); // Right
  generator.drawTextureLegacy(
    "Cape",
    { x: 1, y: 1, w: 10, h: 16 },
    { x: 82, y: 116, w: 80, h: 128 }
  ); // Face
  generator.drawTextureLegacy(
    "Cape",
    { x: 11, y: 1, w: 1, h: 16 },
    { x: 162, y: 116, w: 8, h: 128 }
  ); // Left
  generator.drawTextureLegacy(
    "Cape",
    { x: 12, y: 1, w: 10, h: 16 },
    { x: 170, y: 116, w: 80, h: 128 }
  ); // Back
  generator.drawTextureLegacy(
    "Cape",
    { x: 1, y: 0, w: 10, h: 1 },
    { x: 82, y: 108, w: 80, h: 8 }
  ); // Top
  generator.drawTextureLegacy(
    "Cape",
    { x: 11, y: 0, w: 10, h: 1 },
    { x: 82, y: 244, w: 80, h: 8 },
    { flip: "Vertical" }
  ); // Bottom

  // Elytra Harness

  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 6, h: 4 },
    { x: 402, y: 180, w: 48, h: 32 }
  ); // Left Harness Bottom
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 5 },
    { x: 418, y: 140, w: 32, h: 40 }
  ); // Left Harness Top
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 6, h: 4 },
    { x: 450, y: 180, w: 48, h: 32 },
    { flip: "Horizontal" }
  ); // Right Harness Bottom
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 5 },
    { x: 450, y: 140, w: 32, h: 40 },
    { flip: "Horizontal" }
  ); // Right Harness Top

  // Left Elytron

  // Left Wing

  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 81, y: 336, w: 80, h: 160 }
  ); // Left Wing Front (Back in game)
  generator.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 336, w: 80, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Left Wing Top (Top in game)
  generator.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 49, y: 336, w: 32, h: 160 }
  ); // Left Wing Side (Side in game)
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 161, y: 336, w: 80, h: 160 },
    { flip: "Horizontal" }
  ); // Left Wing Front (Back in game) Back
  generator.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 304, w: 80, h: 32 },
    { flip: "Vertical" }
  ); // Left Wing Top (Top in game) Back
  generator.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 241, y: 336, w: 32, h: 160 },
    { flip: "Horizontal" }
  ); // Left Wing Side (Side in game) Back
  // Left Wing Base
  generator.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 2 },
    { x: 353, y: 352, w: 32, h: 112 }
  ); // Left Wing Base

  // Left Wing Joint

  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 375, w: 32, h: 32 }
  ); // Left Wing Joint 1
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 409, w: 32, h: 32 }
  ); // Left Wing Joint 2

  // Right Elytron

  // Right Wing

  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 81, y: 592, w: 80, h: 160 }
  ); // Right Wing Front (Back in game)
  generator.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 592, w: 80, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Right Wing Top (Top in game)
  generator.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 49, y: 592, w: 32, h: 160 }
  ); // Right Wing Side (Side in game)
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 161, y: 592, w: 80, h: 160 },
    { flip: "Horizontal" }
  ); // Right Wing Front (Back in game) Back
  generator.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 560, w: 80, h: 32 },
    { flip: "Vertical" }
  ); // Right Wing Top (Top in game) Back
  generator.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 241, y: 592, w: 32, h: 160 },
    { flip: "Horizontal" }
  ); // Right Wing Side (Side in game) Back

  // Right Wing Base

  generator.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 2 },
    { x: 353, y: 608, w: 32, h: 112 },
    { flip: "Horizontal" }
  ); // Right Wing Base
  // Right Wing Joint
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 631, w: 32, h: 32 },
    { flip: "Horizontal" }
  ); // Right Wing Joint 1
  generator.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 665, w: 32, h: 32 },
    { flip: "Horizontal" }
  ); // Right Wing Joint 2

  // Draw the Foreground image

  generator.drawImage("Foreground", [0, 0]);

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
  instructions: null,
  images,
  textures,
  script,
};
