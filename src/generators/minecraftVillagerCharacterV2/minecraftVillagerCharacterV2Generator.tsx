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

import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";

const id = "minecraft-villager-character-v2";

const name = "Minecraft Villager Character";

const history: HistoryDef = [
  "Originally developed by Boe6Eod7Nty.",
  "06 Feb 2015 lostminer: Add user variables.",
  "13 Feb 2015 lostminer: Update to use new version of generator.",
  "18 Sep 2020 NinjolasNJM: Updated to use 1.8+ skins.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker through
// `dynamicTextures`, same as minecraftCatCharacterV2. Selecting "None" then
// renders nothing rather than a stale default.
const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

const noTextures: Map<string, Texture> = new Map();

type MinecraftVillagerCharacterProps = {
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

// Ported 1:1 from `minecraftVillagerCharacterGenerator.ts`'s `script` render
// body: same `drawTextureLegacy` calls, raw offsets and draw order. Values
// that used to come from `generator.get*InputValue` now come from `props`.
const render = (
  ctx: RenderContext,
  props: MinecraftVillagerCharacterProps
): void => {
  ctx.defineRegion([22, 10, 256, 208], "helmet");
  ctx.defineRegion([325, 26, 224, 192], "jacket");
  ctx.defineRegion([173, 419, 128, 128], "leftSleeve");
  ctx.defineRegion([21, 419, 128, 128], "rightSleeve");
  ctx.defineRegion([178, 240, 128, 160], "leftPant");
  ctx.defineRegion([22, 240, 128, 160], "rightPant");

  // Nose1

  ctx.drawTextureLegacy(
    "Skin",
    { x: 11, y: 13, w: 1, h: 1 },
    { x: 381, y: 446, w: 16, h: 16 }
  ); //NoseTop
  ctx.drawTextureLegacy(
    "Skin",
    { x: 11, y: 13, w: 1, h: 1 },
    { x: 365, y: 462, w: 16, h: 32 }
  ); //RightSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 11, y: 13, w: 1, h: 1 },
    { x: 397, y: 462, w: 16, h: 32 }
  ); //LeftSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: 381, y: 462, w: 16, h: 32 }
  ); //NoseFront
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: 413, y: 462, w: 16, h: 32 }
  ); //NoseBack
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: 381, y: 494, w: 16, h: 16 }
  ); //NoseBottom

  // Nose2

  ctx.drawTextureLegacy(
    "Skin",
    { x: 11, y: 14, w: 1, h: 1 },
    { x: 483, y: 446, w: 16, h: 16 }
  ); //NoseTop
  ctx.drawTextureLegacy(
    "Skin",
    { x: 11, y: 14, w: 1, h: 1 },
    { x: 467, y: 462, w: 16, h: 32 }
  ); //RightSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 11, y: 14, w: 1, h: 1 },
    { x: 499, y: 462, w: 16, h: 32 }
  ); //LeftSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 14, w: 1, h: 1 },
    { x: 483, y: 462, w: 16, h: 32 }
  ); //NoseFront
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 14, w: 1, h: 1 },
    { x: 515, y: 462, w: 16, h: 32 }
  ); //NoseBack
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 14, w: 1, h: 1 },
    { x: 483, y: 494, w: 16, h: 16 }
  ); //NoseBottom

  // Head

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 32, h: 8 },
    { x: 22, y: 74, w: 256, h: 80 }
  ); // HeadSides
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 86, y: 10, w: 64, h: 64 }
  ); // HeadRoof
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 86, y: 154, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // HeadNeck

  if (!props.hideHelmet) {
    // Nose1
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 13, w: 1, h: 1 },
      { x: 381, y: 446, w: 16, h: 16 }
    ); //NoseTop
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 13, w: 1, h: 1 },
      { x: 365, y: 462, w: 16, h: 32 }
    ); //RightSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 13, w: 1, h: 1 },
      { x: 397, y: 462, w: 16, h: 32 }
    ); //LeftSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: 381, y: 462, w: 16, h: 32 }
    ); //NoseFront
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: 413, y: 462, w: 16, h: 32 }
    ); //NoseBack
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: 381, y: 494, w: 16, h: 16 }
    ); //NoseBottom
    // Nose2
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 14, w: 1, h: 1 },
      { x: 483, y: 446, w: 16, h: 16 }
    ); //NoseTop
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 14, w: 1, h: 1 },
      { x: 467, y: 462, w: 16, h: 32 }
    ); //RightSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 14, w: 1, h: 1 },
      { x: 499, y: 462, w: 16, h: 32 }
    ); //LeftSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 14, w: 1, h: 1 },
      { x: 483, y: 462, w: 16, h: 32 }
    ); //NoseFront
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 14, w: 1, h: 1 },
      { x: 515, y: 462, w: 16, h: 32 }
    ); //NoseBack
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 14, w: 1, h: 1 },
      { x: 483, y: 494, w: 16, h: 16 }
    ); //NoseBottom
    //Helmet
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 32, h: 8 },
      { x: 22, y: 74, w: 256, h: 80 }
    ); // HeadSides
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 86, y: 10, w: 64, h: 64 }
    ); // HeadRoof
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 86, y: 154, w: 64, h: 64 }
    ); // HeadNeck
  }

  // Body

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 373, y: 26, w: 64, h: 48 }
  ); // Neck
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 373, y: 170, w: 64, h: 48 }
    // {flip: "waist"},
  ); // Waist
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 325, y: 74, w: 48, h: 96 }
  ); // RightSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 437, y: 74, w: 48, h: 96 }
  ); // LeftSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 373, y: 74, w: 64, h: 96 }
  ); // Chest
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 485, y: 74, w: 64, h: 96 }
  ); // Back

  if (!props.hideJacket) {
    // Jacket
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 373, y: 26, w: 64, h: 48 }
    ); // Neck
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 373, y: 170, w: 64, h: 48 }
      // {flip: "waist"},
    ); // Waist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 325, y: 74, w: 48, h: 96 }
    ); // RightSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 437, y: 74, w: 48, h: 96 }
    ); // LeftSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 373, y: 74, w: 64, h: 96 }
    ); // Chest
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 485, y: 74, w: 64, h: 96 }
    ); // Back
  }

  // RightLeg

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 12, h: 12 },
    { x: 54, y: 272, w: 96, h: 96 }
  ); // LegSides
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 12 },
    { x: 22, y: 272, w: 32, h: 96 }
  ); // LegBack
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 86, y: 240, w: 32, h: 32 }
  ); // LegTop
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 86, y: 368, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // LegBottom

  if (!props.hideRightPant) {
    // RightPant
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 12, h: 12 },
      { x: 54, y: 272, w: 96, h: 96 }
    ); // LegSides
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 12 },
      { x: 22, y: 272, w: 32, h: 96 }
    ); // LegBack
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: 86, y: 240, w: 32, h: 32 }
    ); // LegTop
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: 86, y: 368, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // LegBottom
  }

  // LeftLeg

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 16, h: 12 },
    { x: 178, y: 272, w: 128, h: 96 }
  ); // LegSides
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 210, y: 240, w: 32, h: 32 }
  ); // LegTop
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 210, y: 368, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // LegBottom
  if (!props.hideLeftPant) {
    // LeftPant
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 16, h: 12 },
      { x: 178, y: 272, w: 128, h: 96 }
    ); // LegSides
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: 210, y: 240, w: 32, h: 32 }
    ); // LegTop
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: 210, y: 368, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // LegBottom
  }

  // Arms and Hands

  // RightArm

  if (props.isSlim) {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 28, w: 3, h: 4 },
      { x: 373, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightFist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 3, h: 4 },
      { x: 341, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightArmPit
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 28, w: 4, h: 4 },
      { x: 373, y: 300, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightThumb
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 28, w: 4, h: 4 },
      { x: 373, y: 364, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightPinkie
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 28, w: 3, h: 4 },
      { x: 533, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // RightPalm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 6 },
      { x: 21, y: 451, w: 32, h: 64 }
    ); // ArmRight
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 6 },
      { x: 53, y: 451, w: 32, h: 64 }
    ); // ArmFront
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 6 },
      { x: 85, y: 451, w: 32, h: 64 }
    ); // ArmLeft
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 6 },
      { x: 117, y: 451, w: 32, h: 64 }
    ); // ArmBack
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 53, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 3, h: 3 },
      { x: 53, y: 547, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // ArmElbow

    if (!props.hideRightSleeve) {
      // RightSleeve
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 44, w: 3, h: 4 },
        { x: 373, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightFist
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 3, h: 4 },
        { x: 341, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightArmPit
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 44, w: 4, h: 4 },
        { x: 373, y: 300, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightThumb
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 44, w: 4, h: 4 },
        { x: 373, y: 364, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightPinkie
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 44, w: 3, h: 4 },
        { x: 533, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // RightPalm
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 6 },
        { x: 21, y: 451, w: 32, h: 64 }
      ); // ArmRight
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 6 },
        { x: 53, y: 451, w: 32, h: 64 }
      ); // ArmFront
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 6 },
        { x: 85, y: 451, w: 32, h: 64 }
      ); // ArmLeft
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 6 },
        { x: 117, y: 451, w: 32, h: 64 }
      ); // ArmBack
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: 53, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 3, h: 3 },
        { x: 53, y: 547, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // ArmElbow
    }
  } else {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 28, w: 4, h: 4 },
      { x: 373, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightFist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 4 },
      { x: 341, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightArmPit
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 28, w: 4, h: 4 },
      { x: 373, y: 300, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightThumb
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 28, w: 4, h: 4 },
      { x: 373, y: 364, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightPinkie
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 28, w: 4, h: 4 },
      { x: 533, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // RightPalm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 16, h: 6 },
      { x: 21, y: 451, w: 128, h: 64 }
    ); // ArmSides
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 53, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 3 },
      { x: 53, y: 547, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // ArmElbow

    if (!props.hideRightSleeve) {
      // RightSleeve
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 16, h: 6 },
        { x: 21, y: 451, w: 128, h: 64 }
      ); // ArmSides
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: 53, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 4, h: 3 },
        { x: 53, y: 547, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // ArmElbow
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 44, w: 4, h: 4 },
        { x: 373, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightFist
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 4, h: 4 },
        { x: 341, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightArmPit
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 44, w: 4, h: 4 },
        { x: 373, y: 300, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightThumb
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 44, w: 4, h: 4 },
        { x: 373, y: 364, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightPinkie
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 44, w: 4, h: 4 },
        { x: 533, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // RightPalm
    }
  }

  // LeftArm
  if (props.isSlim) {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 60, w: 3, h: 4 },
      { x: 437, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftFist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 3, h: 4 },
      { x: 469, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftArmPit
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 60, w: 4, h: 4 },
      { x: 437, y: 268, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftThumb
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 60, w: 4, h: 4 },
      { x: 437, y: 332, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftPinkie
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 60, w: 3, h: 4 },
      { x: 469, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // LeftPalm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 6 },
      { x: 205, y: 451, w: 32, h: 64 }
    ); // ArmRight
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 6 },
      { x: 237, y: 451, w: 32, h: 64 }
    ); // ArmFront
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 6 },
      { x: 269, y: 451, w: 32, h: 64 }
    ); // ArmLeft
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 6 },
      { x: 173, y: 451, w: 32, h: 64 }
    ); // ArmBack
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 237, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 3, h: 3 },
      { x: 269, y: 515, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // ArmElbow

    if (!props.hideLeftSleeve) {
      // LeftSleeve
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 60, w: 3, h: 4 },
        { x: 437, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftFist
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 3, h: 4 },
        { x: 469, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftArmPit
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 60, w: 4, h: 4 },
        { x: 437, y: 268, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftThumb
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 60, w: 4, h: 4 },
        { x: 437, y: 332, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftPinkie
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 60, w: 3, h: 4 },
        { x: 469, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // LeftPalm
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 6 },
        { x: 205, y: 451, w: 32, h: 64 }
      ); // ArmRight
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 6 },
        { x: 237, y: 451, w: 32, h: 64 }
      ); // ArmFront
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 6 },
        { x: 269, y: 451, w: 32, h: 64 }
      ); // ArmLeft
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 6 },
        { x: 173, y: 451, w: 32, h: 64 }
      ); // ArmBack
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: 237, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 3, h: 3 },
        { x: 269, y: 515, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // ArmElbow
    }
  } else {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 60, w: 4, h: 4 },
      { x: 437, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftFist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 4 },
      { x: 469, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftArmPit
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 60, w: 4, h: 4 },
      { x: 437, y: 268, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftThumb
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 60, w: 4, h: 4 },
      { x: 437, y: 332, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftPinkie
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 60, w: 4, h: 4 },
      { x: 469, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // LeftPalm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 12, h: 6 },
      { x: 205, y: 451, w: 96, h: 64 }
    ); // ArmSides
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 6 },
      { x: 173, y: 451, w: 32, h: 64 }
    ); // ArmBack
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 237, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 3 },
      { x: 269, y: 515, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // ArmElbow
    if (!props.hideLeftSleeve) {
      // LeftSleeve
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 12, h: 6 },
        { x: 205, y: 451, w: 96, h: 64 }
      ); // ArmSides
      ctx.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 6 },
        { x: 173, y: 451, w: 32, h: 64 }
      ); // ArmBack
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: 237, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 4, h: 3 },
        { x: 269, y: 515, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // ArmElbow
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 60, w: 4, h: 4 },
        { x: 437, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftFist
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 4, h: 4 },
        { x: 469, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftArmPit
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 60, w: 4, h: 4 },
        { x: 437, y: 268, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftThumb
      ctx.drawTextureLegacy(
        "Skin",
        { x: 56, y: 60, w: 4, h: 4 },
        { x: 437, y: 332, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftPinkie
      ctx.drawTextureLegacy(
        "Skin",
        { x: 60, y: 60, w: 4, h: 4 },
        { x: 469, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // LeftPalm
    }
  }

  // Robe1

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 71, y: 583, w: 64, h: 160 }
  ); //RobeFront
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 135, y: 583, w: 48, h: 160 }
  ); //RobeLeftSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 23, y: 583, w: 48, h: 160 }
  ); //RobeRightSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 183, y: 583, w: 64, h: 160 }
  ); //RobeBack

  if (!props.hideJacket) {
    // Robe1 Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 71, y: 583, w: 64, h: 160 }
    ); //RobeFront
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 135, y: 583, w: 48, h: 160 }
    ); //RobeLeftSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 23, y: 583, w: 48, h: 160 }
    ); //RobeRightSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 183, y: 583, w: 64, h: 160 }
    ); //RobeBack
  }

  // Robe2

  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 407, y: 583, w: 48, h: 160 }
  ); //RobeLeftSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 295, y: 583, w: 48, h: 160 }
  ); //RobeRightSide
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 343, y: 583, w: 64, h: 160 }
  ); //RobeFront
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 455, y: 583, w: 64, h: 160 }
  ); //RobeBack

  if (!props.hideJacket) {
    // Robe2 Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 407, y: 583, w: 48, h: 160 }
    ); //RobeLeftSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 295, y: 583, w: 48, h: 160 }
    ); //RobeRightSide
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 343, y: 583, w: 64, h: 160 }
    ); //RobeFront
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 455, y: 583, w: 64, h: 160 }
    ); //RobeBack
  }

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Folds

  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftVillagerCharacterGeneratorV2: GeneratorV2<MinecraftVillagerCharacterProps> =
  { id, name, images, textures, render };

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftVillagerCharacterProps = {
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

  const dynamicTextures = React.useMemo(
    () =>
      skinTexture
        ? new Map<string, Texture>([["Skin", skinTexture]])
        : new Map<string, Texture>(),
    [skinTexture]
  );

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "helmet":
        setHideHelmet((value) => !value);
        break;
      case "jacket":
        setHideJacket((value) => !value);
        break;
      case "leftSleeve":
        setHideLeftSleeve((value) => !value);
        break;
      case "rightSleeve":
        setHideRightSleeve((value) => !value);
        break;
      case "leftPant":
        setHideLeftPant((value) => !value);
        break;
      case "rightPant":
        setHideRightPant((value) => !value);
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
            generator={minecraftVillagerCharacterGeneratorV2}
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
