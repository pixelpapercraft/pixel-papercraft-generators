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

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import steveTexture from "./textures/Steve.png";
import poppyTexture from "./textures/Flower-Poppy.png";
import roseTexture from "./textures/Flower-Rose.png";
import cyanTexture from "./textures/Flower-Cyan.png";
import highTexture from "./textures/Damage-High.png";
import mediumTexture from "./textures/Damage-Medium.png";
import lowTexture from "./textures/Damage-Low.png";

const id = "minecraft-golem-character";

const name = "Minecraft Golem Character";

const history: HistoryDef = [
  "Originally developed by Wajy.",
  "06 Feb 2015 lostminer: Add user variables.",
  "13 Feb 2015 lostminer: Update to use new version of generator.",
  "19 Sep 2020 NinjolasNJM: Updated to use 1.8+ Skins, fixed bottom textures, and added the ability to choose from multiple flowers and damage cracks.",
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
  { id: "Skin", url: steveTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Poppy", url: poppyTexture.src, standardWidth: 16, standardHeight: 16 },
  { id: "Rose", url: roseTexture.src, standardWidth: 16, standardHeight: 16 },
  {
    id: "Cyan Flower",
    url: cyanTexture.src,
    standardWidth: 16,
    standardHeight: 16,
  },
  { id: "High", url: highTexture.src, standardWidth: 128, standardHeight: 128 },
  {
    id: "Medium",
    url: mediumTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  { id: "Low", url: lowTexture.src, standardWidth: 128, standardHeight: 128 },
];

const script: ScriptDef = (generator: Generator) => {
  let ox: number;
  let oy: number;

  // Define input textures

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);
  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });
  generator.defineTextureInput("Flower", {
    standardWidth: 16,
    standardHeight: 16,
    choices: ["Poppy", "Rose", "Cyan Flower"],
  });
  generator.defineTextureInput("Damage", {
    standardWidth: 128,
    standardHeight: 128,
    choices: ["Low", "Medium", "High"],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  // Overlay Region variables

  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");

  generator.defineRegionInput([39, 19, 256, 208], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([120, 198, 464, 272], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([398, 408, 176, 208], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });
  generator.defineRegionInput([398, 622, 176, 208], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([29, 493, 160, 336], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([216, 493, 160, 336], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });

  // Background

  generator.drawImage("Background", [0, 0]);

  // Head

  ox = 39;
  oy = 19;

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: ox + 0, y: oy + 64, w: 64, h: 80 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: ox + 64, y: oy + 64, w: 64, h: 80 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: ox + 128, y: oy + 64, w: 64, h: 80 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: ox + 192, y: oy + 64, w: 64, h: 80 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 0, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 144, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Nose

  ox = 57;
  oy = 400;

  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 0, y: oy + 16, w: 16, h: 32 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 16, y: oy + 16, w: 16, h: 32 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 32, y: oy + 16, w: 16, h: 32 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 48, y: oy + 16, w: 16, h: 32 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 16, y: oy + 0, w: 16, h: 16 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 16, y: oy + 48, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Waist

  ox = 325;
  oy = 77;

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 28, w: 8, h: 4 },
    { x: ox + 48, y: oy + 48, w: 72, h: 40 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 28, w: 4, h: 4 },
    { x: ox + 120, y: oy + 48, w: 48, h: 40 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 28, w: 4, h: 4 },
    { x: ox + 0, y: oy + 48, w: 48, h: 40 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 28, w: 8, h: 4 },
    { x: ox + 168, y: oy + 48, w: 72, h: 40 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: ox + 48, y: oy + 0, w: 72, h: 48 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 4, h: 4 },
    { x: ox + 48, y: oy + 88, w: 72, h: 48 },
    { flip: "Vertical" }
  ); // Bottom

  // Torso

  ox = 120;
  oy = 198;

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 8 },
    { x: ox + 88, y: oy + 88, w: 144, h: 96 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 8 },
    { x: ox + 232, y: oy + 88, w: 88, h: 96 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 8 },
    { x: ox + 320, y: oy + 88, w: 144, h: 96 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 8 },
    { x: ox + 0, y: oy + 88, w: 88, h: 96 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: ox + 88, y: oy + 0, w: 144, h: 88 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: ox + 88, y: oy + 184, w: 144, h: 88 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Leg

  ox = 398;
  oy = 408;

  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 12 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 12 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 12 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 12 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: "Vertical" }
  ); //Bottom

  // Left Leg

  ox = 398;
  oy = 622;

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 52, w: 4, h: 12 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 12 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 12 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 4, h: 12 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Arm

  ox = 29;
  oy = 493;

  if (alexModel) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  } else {
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 4, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 20, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 20, w: 4, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  }

  // Left Arm

  ox = 216;
  oy = 493;

  if (alexModel) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); //Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  } else {
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 4, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 52, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); //Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  }

  // Overlays

  if (!hideHelmet) {
    // Helmet
    ox = 39;
    oy = 19;
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: ox + 0, y: oy + 64, w: 64, h: 80 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: ox + 64, y: oy + 64, w: 64, h: 80 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: ox + 128, y: oy + 64, w: 64, h: 80 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: ox + 192, y: oy + 64, w: 64, h: 80 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 0, w: 64, h: 64 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 144, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom

    // Nose Overlay

    ox = 57;
    oy = 400;

    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 0, y: oy + 16, w: 16, h: 32 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 16, y: oy + 16, w: 16, h: 32 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 32, y: oy + 16, w: 16, h: 32 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 48, y: oy + 16, w: 16, h: 32 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 16, y: oy + 0, w: 16, h: 16 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 16, y: oy + 48, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!hideJacket) {
    //Belt
    ox = 325;
    oy = 77;
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 44, w: 8, h: 4 },
      { x: ox + 48, y: oy + 48, w: 72, h: 40 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 44, w: 4, h: 4 },
      { x: ox + 120, y: oy + 48, w: 48, h: 40 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 44, w: 4, h: 4 },
      { x: ox + 0, y: oy + 48, w: 48, h: 40 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 44, w: 8, h: 4 },
      { x: ox + 168, y: oy + 48, w: 72, h: 40 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: ox + 48, y: oy + 0, w: 72, h: 48 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 4, h: 4 },
      { x: ox + 48, y: oy + 88, w: 72, h: 48 },
      { flip: "Vertical" }
    ); // Bottom

    // Jacket

    ox = 120;
    oy = 198;

    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 8 },
      { x: ox + 88, y: oy + 88, w: 144, h: 96 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 8 },
      { x: ox + 232, y: oy + 88, w: 88, h: 96 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 8 },
      { x: ox + 320, y: oy + 88, w: 144, h: 96 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 8 },
      { x: ox + 0, y: oy + 88, w: 88, h: 96 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: ox + 88, y: oy + 0, w: 144, h: 88 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: ox + 88, y: oy + 184, w: 144, h: 88 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!hideRightPant) {
    // Right Pant

    ox = 398;
    oy = 408;

    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 36, w: 4, h: 12 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 36, w: 4, h: 12 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 12 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 4, h: 12 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); //Bottom
  }

  if (!hideLeftPant) {
    // Left Pant

    ox = 398;
    oy = 622;

    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 52, w: 4, h: 12 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 52, w: 4, h: 12 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!hideRightSleeve) {
    // Right Sleeve

    ox = 29;
    oy = 493;

    if (alexModel) {
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); // Top
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    } else {
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 4, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 36, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 36, w: 4, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); // Top
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    }
  }

  if (!hideLeftSleeve) {
    // Left Sleeve

    ox = 216;
    oy = 493;

    if (alexModel) {
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); //Top
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    } else {
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 4, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      generator.drawTextureLegacy(
        "Skin",
        { x: 56, y: 52, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      generator.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); //Top
      generator.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    }
  }

  // Flower

  ox = 95;
  oy = 262;

  generator.drawTextureLegacy(
    "Flower",
    { x: 5, y: 5, w: 8, h: 11 },
    { x: ox + 0, y: oy + 0, w: 64, h: 88 },
    { rotateLegacy: 90.0 }
  ); // Right Side
  generator.drawTextureLegacy(
    "Flower",
    { x: 5, y: 5, w: 8, h: 11 },
    { x: ox + 0, y: oy - 64, w: 64, h: 88 },
    { flip: "Horizontal", rotateLegacy: 90.0 }
  ); // Right Side

  // Damage

  const showDamage = generator.hasTexture("Damage");

  if (showDamage) {
    // Head
    ox = 39;
    oy = 19;
    generator.drawTextureLegacy(
      "Damage",
      { x: 0, y: 8, w: 8, h: 10 },
      { x: ox + 0, y: oy + 64, w: 64, h: 80 }
    ); // Right
    generator.drawTextureLegacy(
      "Damage",
      { x: 8, y: 8, w: 8, h: 10 },
      { x: ox + 64, y: oy + 64, w: 64, h: 80 }
    ); // Face
    generator.drawTextureLegacy(
      "Damage",
      { x: 16, y: 8, w: 8, h: 10 },
      { x: ox + 128, y: oy + 64, w: 64, h: 80 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 24, y: 8, w: 8, h: 10 },
      { x: ox + 192, y: oy + 64, w: 64, h: 80 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 8, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 0, w: 64, h: 64 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 16, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 144, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom

    // Waist

    ox = 325;
    oy = 77;

    generator.drawTextureLegacy(
      "Damage",
      { x: 6, y: 76, w: 9, h: 5 },
      { x: ox + 48, y: oy + 48, w: 72, h: 40 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 15, y: 76, w: 9, h: 5 },
      { x: ox + 120, y: oy + 48, w: 48, h: 40 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 0, y: 76, w: 6, h: 5 },
      { x: ox + 0, y: oy + 48, w: 48, h: 40 }
    ); // Right
    generator.drawTextureLegacy(
      "Damage",
      { x: 21, y: 76, w: 9, h: 5 },
      { x: ox + 168, y: oy + 48, w: 72, h: 40 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 6, y: 70, w: 9, h: 6 },
      { x: ox + 48, y: oy + 0, w: 72, h: 48 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 15, y: 70, w: 9, h: 6 },
      { x: ox + 48, y: oy + 88, w: 72, h: 48 },
      { flip: "Vertical" }
    ); // Bottom

    // Torso

    ox = 120;
    oy = 198;

    generator.drawTextureLegacy(
      "Damage",
      { x: 11, y: 51, w: 18, h: 12 },
      { x: ox + 88, y: oy + 88, w: 144, h: 96 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 29, y: 51, w: 11, h: 12 },
      { x: ox + 232, y: oy + 88, w: 88, h: 96 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 40, y: 51, w: 18, h: 12 },
      { x: ox + 320, y: oy + 88, w: 144, h: 96 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 0, y: 51, w: 11, h: 12 },
      { x: ox + 0, y: oy + 88, w: 89, h: 96 }
    ); // Right
    generator.drawTextureLegacy(
      "Damage",
      { x: 11, y: 40, w: 18, h: 11 },
      { x: ox + 88, y: oy + 0, w: 144, h: 88 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 29, y: 40, w: 18, h: 11 },
      { x: ox + 88, y: oy + 184, w: 144, h: 88 },
      { flip: "Vertical" }
    ); // Bottom

    // Right Leg

    ox = 398;
    oy = 408;

    generator.drawTextureLegacy(
      "Damage",
      { x: 42, y: 5, w: 6, h: 16 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 48, y: 5, w: 6, h: 16 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 53, y: 5, w: 6, h: 16 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 37, y: 5, w: 5, h: 16 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Right
    generator.drawTextureLegacy(
      "Damage",
      { x: 42, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 48, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); //Bottom

    // Left Leg

    ox = 398;
    oy = 622;

    generator.drawTextureLegacy(
      "Damage",
      { x: 65, y: 5, w: 6, h: 16 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 71, y: 5, w: 5, h: 16 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 76, y: 5, w: 6, h: 16 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 60, y: 5, w: 5, h: 16 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 65, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 71, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); // Bottom

    // Right Arm

    ox = 29;
    oy = 493;

    generator.drawTextureLegacy(
      "Damage",
      { x: 66, y: 27, w: 4, h: 30 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 70, y: 27, w: 6, h: 30 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 76, y: 27, w: 4, h: 30 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 60, y: 27, w: 6, h: 30 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 66, y: 21, w: 4, h: 6 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 70, y: 21, w: 4, h: 6 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom

    // Left Arm

    ox = 216;
    oy = 493;

    generator.drawTextureLegacy(
      "Damage",
      { x: 66, y: 64, w: 4, h: 30 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 70, y: 64, w: 6, h: 30 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 76, y: 64, w: 4, h: 30 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 60, y: 64, w: 6, h: 30 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 66, y: 58, w: 4, h: 6 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); //Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 70, y: 21, w: 4, h: 6 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom

    // Nose

    ox = 57;
    oy = 400;

    generator.drawTextureLegacy(
      "Damage",
      { x: 28, y: 2, w: 2, h: 4 },
      { x: ox + 0, y: oy + 16, w: 16, h: 32 }
    ); // Right
    generator.drawTextureLegacy(
      "Damage",
      { x: 26, y: 2, w: 2, h: 4 },
      { x: ox + 16, y: oy + 16, w: 16, h: 32 }
    ); // Front
    generator.drawTextureLegacy(
      "Damage",
      { x: 24, y: 2, w: 2, h: 4 },
      { x: ox + 32, y: oy + 16, w: 16, h: 32 }
    ); // Left
    generator.drawTextureLegacy(
      "Damage",
      { x: 30, y: 2, w: 2, h: 4 },
      { x: ox + 48, y: oy + 16, w: 16, h: 32 }
    ); // Back
    generator.drawTextureLegacy(
      "Damage",
      { x: 26, y: 0, w: 2, h: 2 },
      { x: ox + 16, y: oy + 0, w: 16, h: 16 }
    ); // Top
    generator.drawTextureLegacy(
      "Damage",
      { x: 28, y: 0, w: 2, h: 2 },
      { x: ox + 16, y: oy + 48, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
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
  instructions: null,
  images,
  textures,
  script,
};
