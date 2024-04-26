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

import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import steveTexture from "./textures/Steve.png";
import squidTexture from "./textures/Squid.png";

const id = "minecraft-squid-character";

const name = "Minecraft Squid Character";

const history: HistoryDef = [
  "Originally developed by frownieman.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "18 Mar 2015 frownieman - Added compatibility to 1.8 skins.",
  "29 Sep 2020 NinjolasNJM - Fixed bottom texture rotations, and added the ability to choose which tentacle has which textures.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  {
    id: "Background",
    url: backgroundImage.src,
  },
  {
    id: "Folds",
    url: foldsImage.src,
  },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: steveTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Squid",
    url: squidTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const script: ScriptDef = (generator: Generator) => {
  // Define user inputs

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
    enableMinecraftSkinInput: true,
  });

  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");

  const getSelectInputAsNumberWithDefault = (
    id: string,
    defaultValue: number
  ) => {
    const value = generator.getSelectInputValue(id);
    return value ? parseInt(value, 10) : defaultValue;
  };

  const tent1 = getSelectInputAsNumberWithDefault("Tentacle 1", 5);
  const tent2 = getSelectInputAsNumberWithDefault("Tentacle 2", 7);
  const tent3 = getSelectInputAsNumberWithDefault("Tentacle 3", 3);
  const tent4 = getSelectInputAsNumberWithDefault("Tentacle 4", 3);
  const tent5 = getSelectInputAsNumberWithDefault("Tentacle 5", 3);
  const tent6 = getSelectInputAsNumberWithDefault("Tentacle 6", 1);
  const tent7 = getSelectInputAsNumberWithDefault("Tentacle 7", 1);
  const tent8 = getSelectInputAsNumberWithDefault("Tentacle 8", 1);

  const cycleTentacleTypes = (t: number) => {
    return ((t % 8) + 1).toString();
  };

  generator.defineRegionInput([67, 49, 384, 192], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([67, 241, 384, 128], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);

  // Get user variable values

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");

  // Tentacle Types

  const rightArmBase = (ox: number, oy: number) => {
    if (alexModel) {
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 16, w: 3, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 20, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Right
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 20, w: 3, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 20, w: 4, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Left
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 20, w: 3, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 16, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top
    } else {
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 16, w: 4, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 20, w: 16, h: 12 },
        { x: ox + 0, y: oy + 16, w: 64, h: 144 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 16, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top
    }
  };

  const leftArmBase = (ox: number, oy: number) => {
    if (alexModel) {
      generator.drawTextureLegacy(
        "Skin",
        { x: 39, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
      generator.drawTextureLegacy(
        "Skin",
        { x: 32, y: 52, w: 4, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Right
      generator.drawTextureLegacy(
        "Skin",
        { x: 36, y: 52, w: 3, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 39, y: 52, w: 4, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Left
      generator.drawTextureLegacy(
        "Skin",
        { x: 43, y: 52, w: 3, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 36, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top
    } else {
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
      generator.drawTextureLegacy(
        "Skin",
        { x: 32, y: 52, w: 12, h: 12 },
        { x: ox + 16, y: oy + 16, w: 48, h: 144 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 36, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top
    }
  };

  const rightLegBase = (ox: number, oy: number) => {
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 16, w: 4, h: 4 },
      { x: ox + 32, y: oy + 176, w: 16, h: 16 },
      { flip: "Vertical", rotateLegacy: 270.0 }
    ); // Bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 20, w: 16, h: 12 },
      { x: ox + 0, y: oy + 16, w: 64, h: 144 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 16, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 16, h: 16 },
      { rotateLegacy: 90.0 }
    ); // Top
  };

  const leftLegBase = (ox: number, oy: number) => {
    generator.drawTextureLegacy(
      "Skin",
      { x: 24, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 160, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 52, w: 12, h: 12 },
      { x: ox + 16, y: oy + 16, w: 48, h: 144 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 16, w: 16, h: 144 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 0, w: 16, h: 16 }
    ); // Top
  };

  const rightArm = (ox: number, oy: number) => {
    rightArmBase(ox, oy); // Base
    if (alexModel) {
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Right Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Front Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Left Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Back Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top Overlay
    } else {
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 16, h: 12 },
        { x: ox + 0, y: oy + 16, w: 64, h: 144 }
      ); // Front Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top Overlay
    }
  };

  const leftArm = (ox: number, oy: number) => {
    leftArmBase(ox, oy); // Base
    if (alexModel) {
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Right Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Front Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Left Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top Overlay
    } else {
      generator.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 12, h: 12 },
        { x: ox + 16, y: oy + 16, w: 48, h: 144 }
      ); // Front Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back Overlay
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top Overlay
    }
  };

  const rightLeg = (ox: number, oy: number) => {
    rightLegBase(ox, oy); // Base
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: ox + 32, y: oy + 176, w: 16, h: 16 },
      { flip: "Vertical", rotateLegacy: 270.0 }
    ); // Bottom Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 16, h: 12 },
      { x: ox + 0, y: oy + 16, w: 64, h: 144 }
    ); // Front Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 16, h: 16 },
      { rotateLegacy: 90.0 }
    ); // Top Overlay
  };

  const leftLeg = (ox: number, oy: number) => {
    leftLegBase(ox, oy); // Base
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 160, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 12, h: 12 },
      { x: ox + 16, y: oy + 16, w: 48, h: 144 }
    ); // Front Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 16, w: 16, h: 144 }
    ); // Back Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 0, w: 16, h: 16 }
    ); // Top Overlay
  };

  // Tentacle Function

  const drawTentacle = (nx: number, ny: number, tentType: number) => {
    switch (tentType) {
      case 1:
        return rightLeg(nx, ny);
      case 2:
        return rightLegBase(nx, ny);
      case 3:
        return leftLeg(nx, ny);
      case 4:
        return leftLegBase(nx, ny);
      case 5:
        return rightArm(nx, ny);
      case 6:
        return rightArmBase(nx, ny);
      case 7:
        return leftArm(nx, ny);
      case 8:
        return leftArmBase(nx, ny);
      default:
        return;
    }
  };

  // Background

  generator.drawImage("Background", [0, 0]);

  // Head
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 67, y: 145, w: 96, h: 96 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 163, y: 145, w: 96, h: 96 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 259, y: 145, w: 96, h: 96 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 355, y: 145, w: 96, h: 96 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 163, y: 49, w: 96, h: 96 }
  ); // Top

  if (!hideHelmet) {
    // Hat
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: 67, y: 145, w: 96, h: 96 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: 163, y: 145, w: 96, h: 96 }
    ); // Face
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: 259, y: 145, w: 96, h: 96 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: 355, y: 145, w: 96, h: 96 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 163, y: 49, w: 96, h: 96 }
    ); // Top
  }

  // Body

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 67, y: 241, w: 96, h: 32 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 163, y: 241, w: 96, h: 32 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 259, y: 241, w: 96, h: 32 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 355, y: 241, w: 96, h: 32 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 163, y: 273, w: 96, h: 96 },
    { flip: "Vertical" }
  ); // Bottom

  if (!hideJacket) {
    // Body Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 67, y: 241, w: 96, h: 32 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 163, y: 241, w: 96, h: 32 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 259, y: 241, w: 96, h: 32 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 355, y: 241, w: 96, h: 32 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 163, y: 273, w: 96, h: 96 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Tentacles

  // Tentacle 1

  generator.defineRegionInput([471, 16, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 1", cycleTentacleTypes(tent1));
  });

  drawTentacle(471, 16, tent1);

  // Tentacle 2

  generator.defineRegionInput([471, 215, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 2", cycleTentacleTypes(tent2));
  });

  drawTentacle(471, 215, tent2);

  // Tentacle 3

  generator.defineRegionInput([470, 416, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 3", cycleTentacleTypes(tent3));
  });

  drawTentacle(470, 416, tent3);

  // Tentacle 4

  generator.defineRegionInput([376, 416, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 4", cycleTentacleTypes(tent4));
  });

  drawTentacle(376, 416, tent4);

  // Tentacle 5

  generator.defineRegionInput([280, 416, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 5", cycleTentacleTypes(tent5));
  });

  drawTentacle(280, 416, tent5);

  // Tentacle 6

  generator.defineRegionInput([196, 416, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 6", cycleTentacleTypes(tent6));
  });

  drawTentacle(196, 416, tent6);

  // Tentacle 7

  generator.defineRegionInput([109, 416, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 7", cycleTentacleTypes(tent7));
  });

  drawTentacle(109, 416, tent7);

  // Tentacle 8

  generator.defineRegionInput([15, 416, 64, 176], () => {
    generator.setSelectInputValue("Tentacle 8", cycleTentacleTypes(tent8));
  });

  drawTentacle(15, 416, tent8);

  // Remember to add back the overlay here

  // Mouth

  generator.drawTexture("Squid", [27, 2, 6, 8], [187, 289, 48, 64]); // Mouth 1
  generator.drawTexture("Squid", [26, 3, 8, 6], [179, 297, 64, 48]); // Mouth 2

  // Folds

  if (showFolds) {
    generator.drawImage("Folds", [0, 0]);
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
