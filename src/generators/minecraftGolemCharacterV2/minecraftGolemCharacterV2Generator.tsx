"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import poppyTexture from "./textures/Flower-Poppy.png";
import roseTexture from "./textures/Flower-Rose.png";
import cyanTexture from "./textures/Flower-Cyan.png";
import highTexture from "./textures/Damage-High.png";
import mediumTexture from "./textures/Damage-Medium.png";
import lowTexture from "./textures/Damage-Low.png";

const id = "minecraft-golem-character-v2";

const name = "Minecraft Golem Character";

const history: HistoryDef = [
  "Originally developed by Wajy.",
  "06 Feb 2015 lostminer: Add user variables.",
  "13 Feb 2015 lostminer: Update to use new version of generator.",
  "19 Sep 2020 NinjolasNJM: Updated to use 1.8+ Skins, fixed bottom textures, and added the ability to choose from multiple flowers and damage cracks.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker through
// `dynamicTextures`, same as minecraftEndermanCharacterV2. Selecting "None" then
// renders nothing rather than a stale default.
const noTextures: Map<string, Texture> = new Map();

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// The Flower select's three presets. No `initialTextureId`, so the control
// starts at "None" and no flower is drawn until one is chosen. Ids match V1's
// texture ids exactly ("Poppy", "Rose", "Cyan Flower").
const flowerDefinitions: TextureDef[] = [
  { id: "Poppy", url: poppyTexture.src, standardWidth: 16, standardHeight: 16 },
  { id: "Rose", url: roseTexture.src, standardWidth: 16, standardHeight: 16 },
  {
    id: "Cyan Flower",
    url: cyanTexture.src,
    standardWidth: 16,
    standardHeight: 16,
  },
];
const flowerChoices = ["Poppy", "Rose", "Cyan Flower"];

// The Damage select's three presets. No `initialTextureId`, so the control
// starts at "None" and no cracks are drawn until one is chosen. Ids match V1's
// texture ids exactly ("Low", "Medium", "High").
const damageDefinitions: TextureDef[] = [
  { id: "Low", url: lowTexture.src, standardWidth: 128, standardHeight: 128 },
  {
    id: "Medium",
    url: mediumTexture.src,
    standardWidth: 128,
    standardHeight: 128,
  },
  { id: "High", url: highTexture.src, standardWidth: 128, standardHeight: 128 },
];
const damageChoices = ["Low", "Medium", "High"];

type MinecraftGolemCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideRightPant: boolean;
  hideLeftPant: boolean;
  hideRightSleeve: boolean;
  hideLeftSleeve: boolean;
};

// Ported 1:1 from `minecraftGolemCharacterGenerator.ts`'s `script` render body:
// the same `drawTextureLegacy`/`drawImage` calls, source/dest rects, flips and
// draw order. The golem-character body proportions are custom (not Steve/Alex
// cuboid geometry), so this uses raw source rects rather than the
// `steve`/`alex` cuboid-face helpers. Values that used to come from
// `generator.get*InputValue` now come from author-owned `props`. The Flower
// pass — unguarded in V1, but V1's `drawTextureLegacy` silently no-ops when the
// "Flower" texture isn't loaded — is guarded here with `ctx.hasTexture("Flower")`
// so "None" renders nothing; the Damage pass was already guarded in V1 and is
// ported the same way.
const render = (
  ctx: RenderContext,
  props: MinecraftGolemCharacterProps
): void => {
  let ox: number;
  let oy: number;

  ctx.defineRegion([39, 19, 256, 208], "helmet");
  ctx.defineRegion([120, 198, 464, 272], "jacket");
  ctx.defineRegion([398, 408, 176, 208], "rightPant");
  ctx.defineRegion([398, 622, 176, 208], "leftPant");
  ctx.defineRegion([29, 493, 160, 336], "rightSleeve");
  ctx.defineRegion([216, 493, 160, 336], "leftSleeve");

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Head

  ox = 39;
  oy = 19;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: ox + 0, y: oy + 64, w: 64, h: 80 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: ox + 64, y: oy + 64, w: 64, h: 80 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: ox + 128, y: oy + 64, w: 64, h: 80 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: ox + 192, y: oy + 64, w: 64, h: 80 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 0, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 64, y: oy + 144, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Nose

  ox = 57;
  oy = 400;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 0, y: oy + 16, w: 16, h: 32 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 16, y: oy + 16, w: 16, h: 32 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 32, y: oy + 16, w: 16, h: 32 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 48, y: oy + 16, w: 16, h: 32 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 16, y: oy + 0, w: 16, h: 16 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: ox + 16, y: oy + 48, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Waist

  ox = 325;
  oy = 77;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 28, w: 8, h: 4 },
    { x: ox + 48, y: oy + 48, w: 72, h: 40 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 28, w: 4, h: 4 },
    { x: ox + 120, y: oy + 48, w: 48, h: 40 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 28, w: 4, h: 4 },
    { x: ox + 0, y: oy + 48, w: 48, h: 40 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 28, w: 8, h: 4 },
    { x: ox + 168, y: oy + 48, w: 72, h: 40 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: ox + 48, y: oy + 0, w: 72, h: 48 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 4, h: 4 },
    { x: ox + 48, y: oy + 88, w: 72, h: 48 },
    { flip: "Vertical" }
  ); // Bottom

  // Torso

  ox = 120;
  oy = 198;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 8 },
    { x: ox + 88, y: oy + 88, w: 144, h: 96 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 8 },
    { x: ox + 232, y: oy + 88, w: 88, h: 96 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 8 },
    { x: ox + 320, y: oy + 88, w: 144, h: 96 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 8 },
    { x: ox + 0, y: oy + 88, w: 88, h: 96 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: ox + 88, y: oy + 0, w: 144, h: 88 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: ox + 88, y: oy + 184, w: 144, h: 88 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Leg

  ox = 398;
  oy = 408;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 12 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 12 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 12 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 12 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: "Vertical" }
  ); //Bottom

  // Left Leg

  ox = 398;
  oy = 622;

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 52, w: 4, h: 12 },
    { x: ox + 40, y: oy + 40, w: 48, h: 128 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 12 },
    { x: ox + 88, y: oy + 40, w: 40, h: 128 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 12 },
    { x: ox + 128, y: oy + 40, w: 48, h: 128 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 4, h: 12 },
    { x: ox + 0, y: oy + 40, w: 40, h: 128 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: ox + 40, y: oy + 0, w: 48, h: 40 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: ox + 40, y: oy + 168, w: 48, h: 40 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Arm

  ox = 29;
  oy = 493;

  if (props.isSlim) {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  } else {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 4, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 20, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 20, w: 4, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  }

  // Left Arm

  ox = 216;
  oy = 493;

  if (props.isSlim) {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); //Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  } else {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 4, h: 12 },
      { x: ox + 48, y: oy + 48, w: 32, h: 240 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 52, w: 4, h: 12 },
      { x: ox + 80, y: oy + 48, w: 48, h: 240 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 12 },
      { x: ox + 128, y: oy + 48, w: 32, h: 240 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 48, w: 48, h: 240 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 32, h: 48 }
    ); //Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: ox + 48, y: oy + 288, w: 32, h: 48 },
      { flip: "Vertical" }
    ); //Bottom
  }

  // Overlays

  if (!props.hideHelmet) {
    // Helmet
    ox = 39;
    oy = 19;
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: ox + 0, y: oy + 64, w: 64, h: 80 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: ox + 64, y: oy + 64, w: 64, h: 80 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: ox + 128, y: oy + 64, w: 64, h: 80 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: ox + 192, y: oy + 64, w: 64, h: 80 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 0, w: 64, h: 64 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: ox + 64, y: oy + 144, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom

    // Nose Overlay

    ox = 57;
    oy = 400;

    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 0, y: oy + 16, w: 16, h: 32 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 16, y: oy + 16, w: 16, h: 32 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 32, y: oy + 16, w: 16, h: 32 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 48, y: oy + 16, w: 16, h: 32 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 16, y: oy + 0, w: 16, h: 16 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: ox + 16, y: oy + 48, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!props.hideJacket) {
    //Belt
    ox = 325;
    oy = 77;
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 44, w: 8, h: 4 },
      { x: ox + 48, y: oy + 48, w: 72, h: 40 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 44, w: 4, h: 4 },
      { x: ox + 120, y: oy + 48, w: 48, h: 40 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 44, w: 4, h: 4 },
      { x: ox + 0, y: oy + 48, w: 48, h: 40 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 44, w: 8, h: 4 },
      { x: ox + 168, y: oy + 48, w: 72, h: 40 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: ox + 48, y: oy + 0, w: 72, h: 48 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 4, h: 4 },
      { x: ox + 48, y: oy + 88, w: 72, h: 48 },
      { flip: "Vertical" }
    ); // Bottom

    // Jacket

    ox = 120;
    oy = 198;

    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 8 },
      { x: ox + 88, y: oy + 88, w: 144, h: 96 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 8 },
      { x: ox + 232, y: oy + 88, w: 88, h: 96 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 8 },
      { x: ox + 320, y: oy + 88, w: 144, h: 96 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 8 },
      { x: ox + 0, y: oy + 88, w: 88, h: 96 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: ox + 88, y: oy + 0, w: 144, h: 88 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: ox + 88, y: oy + 184, w: 144, h: 88 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!props.hideRightPant) {
    // Right Pant

    ox = 398;
    oy = 408;

    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 36, w: 4, h: 12 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 36, w: 4, h: 12 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 12 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 4, h: 12 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); //Bottom
  }

  if (!props.hideLeftPant) {
    // Left Pant

    ox = 398;
    oy = 622;

    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 52, w: 4, h: 12 },
      { x: ox + 40, y: oy + 40, w: 48, h: 128 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 52, w: 4, h: 12 },
      { x: ox + 88, y: oy + 40, w: 40, h: 128 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: ox + 128, y: oy + 40, w: 48, h: 128 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 40, w: 40, h: 128 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: ox + 40, y: oy + 0, w: 48, h: 40 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: ox + 40, y: oy + 168, w: 48, h: 40 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!props.hideRightSleeve) {
    // Right Sleeve

    ox = 29;
    oy = 493;

    if (props.isSlim) {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); // Top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    } else {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 4, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 36, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 36, w: 4, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); // Top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    }
  }

  if (!props.hideLeftSleeve) {
    // Left Sleeve

    ox = 216;
    oy = 493;

    if (props.isSlim) {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); //Top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    } else {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 4, h: 12 },
        { x: ox + 48, y: oy + 48, w: 32, h: 240 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 56, y: 52, w: 4, h: 12 },
        { x: ox + 80, y: oy + 48, w: 48, h: 240 }
      ); // Left
      ctx.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 12 },
        { x: ox + 128, y: oy + 48, w: 32, h: 240 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 48, w: 48, h: 240 }
      ); // Right
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 32, h: 48 }
      ); //Top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: ox + 48, y: oy + 288, w: 32, h: 48 },
        { flip: "Vertical" }
      ); //Bottom
    }
  }

  // Flower

  if (ctx.hasTexture("Flower")) {
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

  if (ctx.hasTexture("Damage")) {
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
      { x: 15, y: 76, w: 9, h: 5 },
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

  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftGolemCharacterGeneratorV2: GeneratorV2<MinecraftGolemCharacterProps> =
  { id, name, images, textures: [], render };

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [flowerTex, setFlowerTex] = React.useState<Texture | null>(null);
  const [damageTex, setDamageTex] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftGolemCharacterProps = {
    isSlim,
    showFolds,
    showLabels,
    hideHelmet,
    hideJacket,
    hideRightPant,
    hideLeftPant,
    hideRightSleeve,
    hideLeftSleeve,
  };

  // Only set a texture key when its input has a value, so `ctx.hasTexture(...)`
  // stays false for Flower/Damage until one is chosen — matching v1. The Skin
  // key is likewise only set once a skin texture is loaded, so "None" renders
  // nothing rather than a stale default.
  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (skinTexture) {
      map.set("Skin", skinTexture);
    }
    if (flowerTex) {
      map.set("Flower", flowerTex);
    }
    if (damageTex) {
      map.set("Damage", damageTex);
    }
    return map;
  }, [skinTexture, flowerTex, damageTex]);

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "helmet":
        setHideHelmet((value) => !value);
        break;
      case "jacket":
        setHideJacket((value) => !value);
        break;
      case "rightPant":
        setHideRightPant((value) => !value);
        break;
      case "leftPant":
        setHideLeftPant((value) => !value);
        break;
      case "rightSleeve":
        setHideRightSleeve((value) => !value);
        break;
      case "leftSleeve":
        setHideLeftSleeve((value) => !value);
        break;
    }
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
            <MinecraftSkinControl
              id="Skin"
              options={skinOptions}
              standardWidth={64}
              standardHeight={64}
              showModelType={true}
              value={skinValue}
              textures={noTextures}
              onValueChange={setSkinValue}
              onChange={setSkinTexture}
            />

            <GeneratorUI.LoadedTextureControl
              id="Flower"
              definitions={flowerDefinitions}
              choices={flowerChoices}
              standardWidth={16}
              standardHeight={16}
              onChange={setFlowerTex}
            />

            <GeneratorUI.LoadedTextureControl
              id="Damage"
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
            generator={minecraftGolemCharacterGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
