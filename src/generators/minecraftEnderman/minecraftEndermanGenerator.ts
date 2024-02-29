"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import endermanTexture from "./textures/enderman.png";
import endermanEyesTexture from "./textures/enderman_eyes.png";

const id = "minecraft-enderman";

const name = "Minecraft Enderman";

const history: HistoryDef = [
  "Originally developed by ODF.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "19 Sep 2020 NinjolasNJM - Fixed orientations of limbs.",
  "07 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
  "17 Jul 2021 M16 - Updated generator photo.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Enderman",
    url: endermanTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Enderman Eyes",
    url: endermanEyesTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const script: ScriptDef = (generator: Generator) => {
  // Define user inputs

  generator.defineTextureInput("Enderman", {
    standardWidth: 64,
    standardHeight: 32,
    choices: [],
  });
  generator.defineTextureInput("Enderman Eyes", {
    standardWidth: 64,
    standardHeight: 32,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const showLabels = generator.getBooleanInputValue("Show Labels");
  const showFolds = generator.getBooleanInputValue("Show Folds");

  // Background

  generator.drawImage("Background", [0, 0]);

  // Mouth

  generator.drawTextureLegacy(
    "Enderman",
    { x: 0, y: 24, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 24, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 24, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 24, y: 24, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 16, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 16, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Head

  generator.drawTextureLegacy(
    "Enderman",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Body

  generator.drawTextureLegacy(
    "Enderman",
    { x: 32, y: 20, w: 4, h: 12 },
    { x: 268, y: 233, w: 32, h: 96 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 36, y: 20, w: 8, h: 12 },
    { x: 300, y: 233, w: 64, h: 96 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 44, y: 20, w: 4, h: 12 },
    { x: 364, y: 233, w: 32, h: 96 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 48, y: 20, w: 8, h: 12 },
    { x: 396, y: 233, w: 64, h: 96 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 36, y: 16, w: 8, h: 4 },
    { x: 300, y: 201, w: 64, h: 32 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 44, y: 16, w: 8, h: 4 },
    { x: 300, y: 329, w: 64, h: 32 },
    { flip: { kind: "Vertical" } }
  ); // Bottom
  // Right arm
  generator.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 96, y: 399, w: 16, h: 240 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 112, y: 399, w: 16, h: 240 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 128, y: 399, w: 16, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 144, y: 399, w: 16, h: 240 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 112, y: 383, w: 16, h: 16 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 112, y: 639, w: 16, h: 16 },
    { flip: { kind: "Vertical" } }
  ); // Bottom
  // Left arm
  generator.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 222, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 206, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 190, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 174, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 206, y: 383, w: 16, h: 16 },
    { flip: { kind: "Horizontal" } }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 222, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  // Right leg

  generator.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 276, y: 399, w: 16, h: 240 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 292, y: 399, w: 16, h: 240 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 308, y: 399, w: 16, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 324, y: 399, w: 16, h: 240 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 292, y: 383, w: 16, h: 16 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 292, y: 639, w: 16, h: 16 },
    { flip: { kind: "Vertical" } }
  ); // Bottom
  // Left Leg
  generator.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 401, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 385, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 369, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 353, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 385, y: 383, w: 16, h: 16 },
    { flip: { kind: "Horizontal" } }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 401, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  //-------------------------------------------------------------//
  // FROM NOW ALL THE TEXTURES ARE FROM THE FILE "enderman_eyes" //
  //-------------------------------------------------------------//

  // Mouth

  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 0, y: 24, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 24, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 24, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 24, y: 24, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 16, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 16, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: { kind: "Vertical" } }
  ); // Bottom
  // Head
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Body

  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 32, y: 20, w: 4, h: 12 },
    { x: 268, y: 233, w: 32, h: 96 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 36, y: 20, w: 8, h: 12 },
    { x: 300, y: 233, w: 64, h: 96 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 44, y: 20, w: 4, h: 12 },
    { x: 364, y: 233, w: 32, h: 96 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 48, y: 20, w: 8, h: 12 },
    { x: 396, y: 233, w: 64, h: 96 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 36, y: 16, w: 8, h: 4 },
    { x: 300, y: 201, w: 64, h: 32 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 44, y: 16, w: 8, h: 4 },
    { x: 300, y: 329, w: 64, h: 32 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Right arm

  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 96, y: 399, w: 16, h: 240 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 112, y: 399, w: 16, h: 240 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 128, y: 399, w: 16, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 144, y: 399, w: 16, h: 240 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 112, y: 383, w: 16, h: 16 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 112, y: 639, w: 16, h: 16 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Left arm

  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 222, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 206, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 190, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 174, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 206, y: 383, w: 16, h: 16 },
    { flip: { kind: "Horizontal" } }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 222, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  // Right leg

  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 276, y: 399, w: 16, h: 240 }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 292, y: 399, w: 16, h: 240 }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 308, y: 399, w: 16, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 324, y: 399, w: 16, h: 240 }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 292, y: 383, w: 16, h: 16 }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 292, y: 639, w: 16, h: 16 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Left Leg

  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 401, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Right
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 385, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Face
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 369, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Left
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 353, y: 399, w: 16, h: 240 },
    { flip: { kind: "Horizontal" } }
  ); // Back
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 385, y: 383, w: 16, h: 16 },
    { flip: { kind: "Horizontal" } }
  ); // Top
  generator.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 401, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  // Fold Lines

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
