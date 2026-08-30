"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type HistoryDef,
  type ImageDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
  type DynamicTextures,
} from "@genroot/builder";

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
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

// The "Golem" body input is a custom upload defaulting to the bundled iron
// golem, fed to the render through `dynamicTextures`.
const golemDefinitions: TextureDef[] = [
  {
    id: "Golem",
    url: ironGolemTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
];

// The Flower select's three presets. No `initialTextureId`, so the control
// starts at "None" and no flower is drawn until one is chosen.
const flowerDefinitions: TextureDef[] = [
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
];
const flowerChoices = ["Poppy Flower", "Rose Flower", "Cyan Flower"];

// The Damage select's three presets. No `initialTextureId`, so the control
// starts at "None" and no cracks are drawn until one is chosen.
const damageDefinitions: TextureDef[] = [
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
const damageChoices = ["Low Damage", "Medium Damage", "High Damage"];

type MinecraftGolemProps = {
  showFolds: boolean;
  showLabels: boolean;
};

// Ported 1:1 from `minecraftGolemGenerator.ts`'s `script` render body: the same
// `drawTextureLegacy`/`drawImage` calls, source/dest rects, flips and draw
// order. The flower and damage passes stay guarded by `ctx.hasTexture(...)`, and
// the two booleans that came from `generator.getBooleanInputValue` now come from
// author-owned `props`.
const render = (
  ctx: RenderContext,
  { showFolds, showLabels }: MinecraftGolemProps
): void => {
  let ox: number;
  let oy: number;

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Head

  ox = 39;
  oy = 19;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 0, y: 8, w: 8, h: 10 },
    { x: ox + 0, y: oy + 64, w: 64, h: 80 }
  ); // Right
  ctx.drawTextureLegacy(
    "Golem",
    { x: 8, y: 8, w: 8, h: 10 },
    { x: ox + 64, y: oy + 64, w: 64, h: 80 }
  ); // Face
  ctx.drawTextureLegacy(
    "Golem",
    { x: 16, y: 8, w: 8, h: 10 },
    { x: ox + 128, y: oy + 64, w: 64, h: 80 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 24, y: 8, w: 8, h: 10 },
    { x: ox + 192, y: oy + 64, w: 64, h: 80 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 0, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 144, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Waist

  ox = 325;
  oy = 77;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 6, y: 76, w: 9, h: 5 },
    { x: ox + 48, y: oy + 48, w: 72, h: 40 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 15, y: 76, w: 6, h: 5 },
    { x: ox + 120, y: oy + 48, w: 48, h: 40 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 0, y: 76, w: 6, h: 5 },
    { x: ox + 0, y: oy + 48, w: 48, h: 40 }
  ); // Right
  ctx.drawTextureLegacy(
    "Golem",
    { x: 21, y: 76, w: 9, h: 5 },
    { x: ox + 168, y: oy + 48, w: 72, h: 40 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 6, y: 70, w: 9, h: 6 },
    { x: ox + 48, y: oy + 0, w: 72, h: 48 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 15, y: 70, w: 9, h: 6 },
    { x: ox + 48, y: oy + 88, w: 72, h: 48 },
    { flip: "Vertical" }
  ); // Bottom

  // Torso

  ox = 120;
  oy = 198;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 11, y: 51, w: 18, h: 12 },
    { x: ox + 88, y: oy + 88, w: 144, h: 96 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 29, y: 51, w: 11, h: 12 },
    { x: ox + 232, y: oy + 88, w: 88, h: 96 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 40, y: 51, w: 18, h: 12 },
    { x: ox + 320, y: oy + 88, w: 144, h: 96 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 0, y: 51, w: 11, h: 12 },
    { x: ox + 0, y: oy + 88, w: 89, h: 96 }
  ); // Right
  ctx.drawTextureLegacy(
    "Golem",
    { x: 11, y: 40, w: 18, h: 11 },
    { x: ox + 88, y: oy + 0, w: 144, h: 88 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 29, y: 40, w: 18, h: 11 },
    { x: ox + 88, y: oy + 184, w: 144, h: 88 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Leg

  ox = 398;
  oy = 408;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 42, y: 5, w: 6, h: 16 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 48, y: 5, w: 6, h: 16 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 53, y: 5, w: 6, h: 16 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 37, y: 5, w: 5, h: 16 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Right
  ctx.drawTextureLegacy(
    "Golem",
    { x: 42, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 48, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: "Vertical" }
  ); //Bottom

  // Left Leg

  ox = 398;
  oy = 622;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 65, y: 5, w: 6, h: 16 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 71, y: 5, w: 5, h: 16 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 76, y: 5, w: 6, h: 16 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 60, y: 5, w: 5, h: 16 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 65, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 71, y: 0, w: 6, h: 5 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Arm

  ox = 29;
  oy = 493;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 66, y: 27, w: 4, h: 30 },
    { x: ox + 48, y: oy + 48, w: 32, h: 240 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 70, y: 27, w: 6, h: 30 },
    { x: ox + 80, y: oy + 48, w: 48, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 76, y: 27, w: 4, h: 30 },
    { x: ox + 128, y: oy + 48, w: 32, h: 240 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 60, y: 27, w: 6, h: 30 },
    { x: ox + 0, y: oy + 48, w: 48, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 66, y: 21, w: 4, h: 6 },
    { x: ox + 48, y: oy + 0, w: 32, h: 48 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 70, y: 21, w: 4, h: 6 },
    { x: ox + 48, y: oy + 288, w: 32, h: 48 },
    { flip: "Vertical" }
  ); //Bottom

  // Left Arm

  ox = 216;
  oy = 493;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 66, y: 64, w: 4, h: 30 },
    { x: ox + 48, y: oy + 48, w: 32, h: 240 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 70, y: 64, w: 6, h: 30 },
    { x: ox + 80, y: oy + 48, w: 48, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 76, y: 64, w: 4, h: 30 },
    { x: ox + 128, y: oy + 48, w: 32, h: 240 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 60, y: 64, w: 6, h: 30 },
    { x: ox + 0, y: oy + 48, w: 48, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 66, y: 58, w: 4, h: 6 },
    { x: ox + 48, y: oy + 0, w: 32, h: 48 }
  ); //Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 70, y: 21, w: 4, h: 6 },
    { x: ox + 48, y: oy + 288, w: 32, h: 48 },
    { flip: "Vertical" }
  ); //Bottom

  // Nose

  ox = 57;
  oy = 400;

  ctx.drawTextureLegacy(
    "Golem",
    { x: 28, y: 2, w: 2, h: 4 },
    { x: ox + 0, y: oy + 16, w: 16, h: 32 }
  ); // Right
  ctx.drawTextureLegacy(
    "Golem",
    { x: 26, y: 2, w: 2, h: 4 },
    { x: ox + 16, y: oy + 16, w: 16, h: 32 }
  ); // Front
  ctx.drawTextureLegacy(
    "Golem",
    { x: 24, y: 2, w: 2, h: 4 },
    { x: ox + 32, y: oy + 16, w: 16, h: 32 }
  ); // Left
  ctx.drawTextureLegacy(
    "Golem",
    { x: 30, y: 2, w: 2, h: 4 },
    { x: ox + 48, y: oy + 16, w: 16, h: 32 }
  ); // Back
  ctx.drawTextureLegacy(
    "Golem",
    { x: 26, y: 0, w: 2, h: 2 },
    { x: ox + 16, y: oy + 0, w: 16, h: 16 }
  ); // Top
  ctx.drawTextureLegacy(
    "Golem",
    { x: 28, y: 0, w: 2, h: 2 },
    { x: ox + 16, y: oy + 48, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Flower

  const showFlower = ctx.hasTexture("Flower");

  if (showFlower) {
    ox = 95;
    oy = 262;
    ctx.drawTextureLegacy(
      "Flower",
      { x: 5, y: 5, w: 8, h: 11 },
      { x: ox + 0, y: oy + 0, w: 64, h: 88 },
      { rotateLegacy: 90.0 }
    ); // Right Side
    ctx.drawTextureLegacy(
      "Flower",
      { x: 5, y: 5, w: 8, h: 11 },
      { x: ox + 0, y: oy - 64, w: 64, h: 88 },
      { flip: "Horizontal", rotateLegacy: 90.0 }
    ); // Right Side
  }

  // Damage

  const showDamage = ctx.hasTexture("Damage");

  if (showDamage) {
    // Head

    ox = 39;
    oy = 19;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 0, y: 8, w: 8, h: 10 },
      { x: ox + 0, y: oy + 64, w: 64, h: 80 }
    ); // Right
    ctx.drawTextureLegacy(
      "Damage",
      { x: 8, y: 8, w: 8, h: 10 },
      { x: ox + 64, y: oy + 64, w: 64, h: 80 }
    ); // Face
    ctx.drawTextureLegacy(
      "Damage",
      { x: 16, y: 8, w: 8, h: 10 },
      { x: ox + 128, y: oy + 64, w: 64, h: 80 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 24, y: 8, w: 8, h: 10 },
      { x: ox + 192, y: oy + 64, w: 64, h: 80 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 8, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 0, w: 64, h: 64 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 16, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 144, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom

    // Waist

    ox = 325;
    oy = 77;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 6, y: 76, w: 9, h: 5 },
      { x: ox + 48, y: oy + 48, w: 72, h: 40 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 15, y: 76, w: 6, h: 5 },
      { x: ox + 120, y: oy + 48, w: 48, h: 40 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 0, y: 76, w: 6, h: 5 },
      { x: ox + 0, y: oy + 48, w: 48, h: 40 }
    ); // Right
    ctx.drawTextureLegacy(
      "Damage",
      { x: 21, y: 76, w: 9, h: 5 },
      { x: ox + 168, y: oy + 48, w: 72, h: 40 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 6, y: 70, w: 9, h: 6 },
      { x: ox + 48, y: oy + 0, w: 72, h: 48 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 15, y: 70, w: 9, h: 6 },
      { x: ox + 48, y: oy + 88, w: 72, h: 48 },
      { flip: "Vertical" }
    ); // Bottom

    // Torso

    ox = 120;
    oy = 198;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 11, y: 51, w: 18, h: 12 },
      { x: ox + 88, y: oy + 88, w: 144, h: 96 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 29, y: 51, w: 11, h: 12 },
      { x: ox + 232, y: oy + 88, w: 88, h: 96 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 40, y: 51, w: 18, h: 12 },
      { x: ox + 320, y: oy + 88, w: 144, h: 96 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 0, y: 51, w: 11, h: 12 },
      { x: ox + 0, y: oy + 88, w: 89, h: 96 }
    ); // Right
    ctx.drawTextureLegacy(
      "Damage",
      { x: 11, y: 40, w: 18, h: 11 },
      { x: ox + 88, y: oy + 0, w: 144, h: 88 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 29, y: 40, w: 18, h: 11 },
      { x: ox + 88, y: oy + 184, w: 144, h: 88 },
      { flip: "Vertical" }
    ); // Bottom

    // Right Leg

    ox = 398;
    oy = 408;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 42, y: 5, w: 6, h: 16 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 48, y: 5, w: 6, h: 16 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 53, y: 5, w: 6, h: 16 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 37, y: 5, w: 5, h: 16 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Right
    ctx.drawTextureLegacy(
      "Damage",
      { x: 42, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 48, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); //Bottom

    // Left Leg

    ox = 398;
    oy = 622;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 65, y: 5, w: 6, h: 16 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 71, y: 5, w: 5, h: 16 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 76, y: 5, w: 6, h: 16 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 60, y: 5, w: 5, h: 16 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 65, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 71, y: 0, w: 6, h: 5 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); // Bottom

    // Right Arm

    ox = 29;
    oy = 493;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 66, y: 27, w: 4, h: 30 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 70, y: 27, w: 6, h: 30 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 76, y: 27, w: 4, h: 30 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 60, y: 27, w: 6, h: 30 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 66, y: 21, w: 4, h: 6 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 70, y: 21, w: 4, h: 6 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom

    // Left Arm

    ox = 216;
    oy = 493;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 66, y: 64, w: 4, h: 30 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 70, y: 64, w: 6, h: 30 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 76, y: 64, w: 4, h: 30 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 60, y: 64, w: 6, h: 30 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 66, y: 58, w: 4, h: 6 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); //Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 70, y: 21, w: 4, h: 6 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom

    // Nose

    ox = 57;
    oy = 400;

    ctx.drawTextureLegacy(
      "Damage",
      { x: 28, y: 2, w: 2, h: 4 },
      { x: ox + 0, y: oy + 16, w: 16, h: 32 }
    ); // Right
    ctx.drawTextureLegacy(
      "Damage",
      { x: 26, y: 2, w: 2, h: 4 },
      { x: ox + 16, y: oy + 16, w: 16, h: 32 }
    ); // Front
    ctx.drawTextureLegacy(
      "Damage",
      { x: 24, y: 2, w: 2, h: 4 },
      { x: ox + 32, y: oy + 16, w: 16, h: 32 }
    ); // Left
    ctx.drawTextureLegacy(
      "Damage",
      { x: 30, y: 2, w: 2, h: 4 },
      { x: ox + 48, y: oy + 16, w: 16, h: 32 }
    ); // Back
    ctx.drawTextureLegacy(
      "Damage",
      { x: 26, y: 0, w: 2, h: 2 },
      { x: ox + 16, y: oy + 0, w: 16, h: 16 }
    ); // Top
    ctx.drawTextureLegacy(
      "Damage",
      { x: 28, y: 0, w: 2, h: 2 },
      { x: ox + 16, y: oy + 48, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
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

const minecraftGolemGenerator: Generator<MinecraftGolemProps> = {
  id,
  name,
  images,
  textures: [],
  render,
};

function Component(): JSX.Element {
  const [golemTex, setGolemTex] = React.useState<Texture | null>(null);
  const [flowerTex, setFlowerTex] = React.useState<Texture | null>(null);
  const [damageTex, setDamageTex] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);

  const props: MinecraftGolemProps = { showFolds, showLabels };

  // Only set a texture key when its input has a value, so `ctx.hasTexture(...)`
  // stays false for Flower/Damage until one is chosen — matching v1.
  const dynamicTextures: DynamicTextures = {
    Golem: golemTex,
    Flower: flowerTex,
    Damage: damageTex,
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.LoadedTextureControl
              label="Golem"
              definitions={golemDefinitions}
              choices={[]}
              standardWidth={128}
              standardHeight={128}
              initialTextureId="Golem"
              onChange={setGolemTex}
            />
            <GeneratorUI.LoadedTextureControl
              label="Flower"
              definitions={flowerDefinitions}
              choices={flowerChoices}
              standardWidth={16}
              standardHeight={16}
              onChange={setFlowerTex}
            />
            <GeneratorUI.LoadedTextureControl
              label="Damage"
              definitions={damageDefinitions}
              choices={damageChoices}
              standardWidth={128}
              standardHeight={128}
              onChange={setDamageTex}
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
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftGolemGenerator}
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
