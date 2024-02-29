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

import ironGolemTexture from "./textures/iron_golem.png";
import flowerPoppyTexture from "./textures/flower_poppy.png";
import flowerRoseTexture from "./textures/flower_rose.png";
import flowerCyanTexture from "./textures/flower_cyan.png";
import damageLowTexture from "./textures/damage_low.png";
import damageMediumTexture from "./textures/damage_medium.png";
import damageHighTexture from "./textures/damage_high.png";

const id = "minecraft-golem";

const name = "Minecraft Golem";

const history: HistoryDef = [
  "Originally Developed by Wajy.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "20 Feb 2015 lostminer - Make the nose optional.",
  "19 Sep 2020 NinjolasNJM - Fixed bottom textures and allowed for multiple types of flowers and damage cracks.",
  "07 Jun 2021 NinjolasNJM - Converted to ReScript generator. The ability to select between several default flower and damage textures still needs to be implemented.",
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
    id: "Golem",
    url: ironGolemTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Poppy Flower",
    url: flowerPoppyTexture.src,
    standardWidth: 16,
    standardHeight: 16,
  },
  {
    id: "Rose Flower",
    url: flowerRoseTexture.src,
    standardWidth: 16,
    standardHeight: 16,
  },
  {
    id: "Cyan Flower",
    url: flowerCyanTexture.src,
    standardWidth: 16,
    standardHeight: 16,
  },
  {
    id: "Low Damage",
    url: damageLowTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "Medium Damage",
    url: damageMediumTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  {
    id: "High Damage",
    url: damageHighTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
];

const script: ScriptDef = (generator: Generator) => {
  let ox: number;
  let oy: number;

  // Define user inputs

  generator.defineTextureInput("Golem", {
    standardWidth: 128,
    standardHeight: 128,
    choices: [],
  });
  generator.defineTextureInput("Flower", {
    standardWidth: 16,
    standardHeight: 16,
    choices: ["Poppy Flower", "Rose Flower", "Cyan Flower"],
  });
  generator.defineTextureInput("Damage", {
    standardWidth: 128,
    standardHeight: 128,
    choices: ["Low Damage", "Medium Damage", "High Damage"],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variables

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  // Background

  generator.drawImage("Background", [0, 0]);

  // Head

  ox = 39;
  oy = 19;

  generator.drawTextureLegacy(
    "Golem",
    { x: 0, y: 8, w: 8, h: 10 },
    { x: ox + 0, y: oy + 64, w: 64, h: 80 }
  ); // Right
  generator.drawTextureLegacy(
    "Golem",
    { x: 8, y: 8, w: 8, h: 10 },
    { x: ox + 64, y: oy + 64, w: 64, h: 80 }
  ); // Face
  generator.drawTextureLegacy(
    "Golem",
    { x: 16, y: 8, w: 8, h: 10 },
    { x: ox + 128, y: oy + 64, w: 64, h: 80 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 24, y: 8, w: 8, h: 10 },
    { x: ox + 192, y: oy + 64, w: 64, h: 80 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 0, w: 64, h: 64 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 144, w: 64, h: 64 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Waist

  ox = 325;
  oy = 77;

  generator.drawTextureLegacy(
    "Golem",
    { x: 6, y: 76, w: 9, h: 5 },
    { x: ox + 48, y: oy + 48, w: 72, h: 40 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 15, y: 76, w: 6, h: 5 },
    { x: ox + 120, y: oy + 48, w: 48, h: 40 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 0, y: 76, w: 6, h: 5 },
    { x: ox + 0, y: oy + 48, w: 48, h: 40 }
  ); // Right
  generator.drawTextureLegacy(
    "Golem",
    { x: 21, y: 76, w: 9, h: 5 },
    { x: ox + 168, y: oy + 48, w: 72, h: 40 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 6, y: 70, w: 9, h: 6 },
    { x: ox + 48, y: oy + 0, w: 72, h: 48 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 15, y: 70, w: 9, h: 6 },
    { x: ox + 48, y: oy + 88, w: 72, h: 48 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Torso

  ox = 120;
  oy = 198;

  generator.drawTextureLegacy(
    "Golem",
    { x: 11, y: 51, w: 18, h: 12 },
    { x: ox + 88, y: oy + 88, w: 144, h: 96 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 29, y: 51, w: 11, h: 12 },
    { x: ox + 232, y: oy + 88, w: 88, h: 96 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 40, y: 51, w: 18, h: 12 },
    { x: ox + 320, y: oy + 88, w: 144, h: 96 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 0, y: 51, w: 11, h: 12 },
    { x: ox + 0, y: oy + 88, w: 89, h: 96 }
  ); // Right
  generator.drawTextureLegacy(
    "Golem",
    { x: 11, y: 40, w: 18, h: 11 },
    { x: ox + 88, y: oy + 0, w: 144, h: 88 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 29, y: 40, w: 18, h: 11 },
    { x: ox + 88, y: oy + 184, w: 144, h: 88 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Right Leg

  ox = 398;
  oy = 408;

  generator.drawTextureLegacy(
    "Golem",
    { x: 42, y: 5, w: 6, h: 16 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 48, y: 5, w: 6, h: 16 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 53, y: 5, w: 6, h: 16 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 37, y: 5, w: 5, h: 16 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Right
  generator.drawTextureLegacy(
    "Golem",
    { x: 42, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 48, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: { kind: "Vertical" } }
  ); //Bottom

  // Left Leg

  ox = 398;
  oy = 622;

  generator.drawTextureLegacy(
    "Golem",
    { x: 65, y: 5, w: 6, h: 16 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 71, y: 5, w: 5, h: 16 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 76, y: 5, w: 6, h: 16 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 60, y: 5, w: 5, h: 16 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 65, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 71, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Right Arm

  ox = 29;
  oy = 493;

  generator.drawTextureLegacy(
    "Golem",
    { x: 66, y: 27, w: 4, h: 30 },
    { x: ox + 48, y: oy + 48, w: 32, h: 240 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 70, y: 27, w: 6, h: 30 },
    { x: ox + 80, y: oy + 48, w: 48, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 76, y: 27, w: 4, h: 30 },
    { x: ox + 128, y: oy + 48, w: 32, h: 240 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 60, y: 27, w: 6, h: 30 },
    { x: ox + 0, y: oy + 48, w: 48, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 66, y: 21, w: 4, h: 6 },
    { x: ox + 48, y: oy + 0, w: 32, h: 48 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 70, y: 21, w: 4, h: 6 },
    { x: ox + 48, y: oy + 288, w: 32, h: 48 },
    { flip: { kind: "Vertical" } }
  ); //Bottom

  // Left Arm

  ox = 216;
  oy = 493;

  generator.drawTextureLegacy(
    "Golem",
    { x: 66, y: 64, w: 4, h: 30 },
    { x: ox + 48, y: oy + 48, w: 32, h: 240 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 70, y: 64, w: 6, h: 30 },
    { x: ox + 80, y: oy + 48, w: 48, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 76, y: 64, w: 4, h: 30 },
    { x: ox + 128, y: oy + 48, w: 32, h: 240 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 60, y: 64, w: 6, h: 30 },
    { x: ox + 0, y: oy + 48, w: 48, h: 240 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 66, y: 58, w: 4, h: 6 },
    { x: ox + 48, y: oy + 0, w: 32, h: 48 }
  ); //Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 70, y: 21, w: 4, h: 6 },
    { x: ox + 48, y: oy + 288, w: 32, h: 48 },
    { flip: { kind: "Vertical" } }
  ); //Bottom

  // Nose

  ox = 57;
  oy = 400;

  generator.drawTextureLegacy(
    "Golem",
    { x: 28, y: 2, w: 2, h: 4 },
    { x: ox + 0, y: oy + 16, w: 16, h: 32 }
  ); // Right
  generator.drawTextureLegacy(
    "Golem",
    { x: 26, y: 2, w: 2, h: 4 },
    { x: ox + 16, y: oy + 16, w: 16, h: 32 }
  ); // Front
  generator.drawTextureLegacy(
    "Golem",
    { x: 24, y: 2, w: 2, h: 4 },
    { x: ox + 32, y: oy + 16, w: 16, h: 32 }
  ); // Left
  generator.drawTextureLegacy(
    "Golem",
    { x: 30, y: 2, w: 2, h: 4 },
    { x: ox + 48, y: oy + 16, w: 16, h: 32 }
  ); // Back
  generator.drawTextureLegacy(
    "Golem",
    { x: 26, y: 0, w: 2, h: 2 },
    { x: ox + 16, y: oy + 0, w: 16, h: 16 }
  ); // Top
  generator.drawTextureLegacy(
    "Golem",
    { x: 28, y: 0, w: 2, h: 2 },
    { x: ox + 16, y: oy + 48, w: 16, h: 16 },
    { flip: { kind: "Vertical" } }
  ); // Bottom

  // Flower

  const showFlower = generator.hasTexture("Flower");

  if (showFlower) {
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
      { flip: { kind: "Horizontal" }, rotateLegacy: 90.0 }
    ); // Right Side
  }

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
      { flip: { kind: "Vertical" } }
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
      { x: 15, y: 76, w: 6, h: 5 },
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
      { flip: { kind: "Vertical" } }
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
      { flip: { kind: "Vertical" } }
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
      { flip: { kind: "Vertical" } }
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
      { flip: { kind: "Vertical" } }
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
      { flip: { kind: "Vertical" } }
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
      { flip: { kind: "Vertical" } }
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
      { flip: { kind: "Vertical" } }
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
