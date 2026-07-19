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
  type VideoDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import backgroundSteveImage from "./images/Background-Steve.png";
import backgroundAlexImage from "./images/Background-Alex.png";
import colorsSteveImage from "./images/Colors-Steve.png";
import colorsAlexImage from "./images/Colors-Alex.png";
import foldsSteveImage from "./images/Folds-Steve.png";
import foldsAlexImage from "./images/Folds-Alex.png";
import labelsImage from "./images/Labels.png";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

const id = "minecraft-ultimate-bendable-v2";

const name = "Minecraft Bendable Character";

const history: HistoryDef = [
  "Originally Developed by rooterbuster.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "22 Nov 2018 NinjolasNJM - Fixed rotations of tops and bottoms and the placement of arm textures, and made compatible with 1.8+ skins.",
  "30 Aug 2020 NinjolasNJM - Fixed a few more things such as the rotation of the bottom of the head and the bottom of the waist using the wrong textures, changed the tubes and tabs to look better on more skins, and updated the code comments.",
  "06 Jun 2021 NinjolasNJM - Converted to ReScript generator, and fixed the lines on the head.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const video: VideoDef = {
  url: "https://www.youtube.com/embed/CyYn66Zm5n0?rel=0",
};

const images: ImageDef[] = [
  { id: "Background-Steve", url: backgroundSteveImage.src },
  { id: "Background-Alex", url: backgroundAlexImage.src },
  { id: "Colors-Steve", url: colorsSteveImage.src },
  { id: "Colors-Alex", url: colorsAlexImage.src },
  { id: "Folds-Steve", url: foldsSteveImage.src },
  { id: "Folds-Alex", url: foldsAlexImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();

type MinecraftUltimateBendableProps = {
  isSlim: boolean;
  showFolds: boolean;
  showColorCodes: boolean;
  showLabels: boolean;
  showHelmetOverlay: boolean;
  showJacketOverlay: boolean;
  showLeftSleeveOverlay: boolean;
  showRightSleeveOverlay: boolean;
  showLeftPantOverlay: boolean;
  showRightPantOverlay: boolean;
};

const render = (
  ctx: RenderContext,
  props: MinecraftUltimateBendableProps
): void => {
  ctx.defineRegion([10, 534, 192, 256], "helmet");
  ctx.defineRegion([35, 50, 192, 328], "jacket");
  ctx.defineRegion([265, 50, 128, 320], "leftSleeve");
  ctx.defineRegion([425, 426, 128, 320], "rightSleeve");
  ctx.defineRegion([425, 10, 128, 360], "leftPant");
  ctx.defineRegion([265, 386, 128, 360], "rightPant");

  // Head

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 790, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 74, y: 726, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 74, y: 662, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 74, y: 598, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 10, y: 726, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 726, w: 64, h: 64 },
    { flip: "Vertical", rotateLegacy: 270.0 }
  ); // Bot

  // neck

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 36, y: 414, w: 64, h: 96 }
  ); // Neck

  // Chest

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 16, w: 24, h: 14 },
    { x: 35, y: 50, w: 192, h: 112 }
  ); // Chest
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 24, w: 8, h: 6 },
    { x: 131, y: 204, w: 64, h: 48 },
    { rotateLegacy: 180.0 }
  ); // Vertebra

  // Spine

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 24, w: 8, h: 4 },
    { x: 163, y: 143, w: 64, h: 128 }
  ); // Spine

  // Waist

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 24, w: 16, h: 8 },
    { x: 99, y: 282, w: 128, h: 64 }
  ); // Waist
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 28, w: 8, h: 4 },
    { x: 35, y: 314, w: 64, h: 32 }
  ); // Back Waist
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 4 },
    { x: 99, y: 346, w: 32, h: 32 }
  ); // Right Hip
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 4 },
    { x: 195, y: 346, w: 32, h: 32 }
  ); // Left Hip

  // Pelvis

  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 131, y: 380, w: 64, h: 130 }
  ); //Pelvis

  // Left Arm

  if (props.isSlim) {
    // Left Shoulder

    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 14, h: 8 },
      { x: 273, y: 82, w: 112, h: 64 }
    ); //Left Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 361, y: 58, w: 24, h: 32 },
      { rotateLegacy: 90.0 }
    ); //Left Scapula
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 56, w: 3, h: 4 },
      { x: 328, y: 194, w: 24, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Elbow

    // Left Forearm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: 329, y: 338, w: 24, h: 32 },
      { flip: "Vertical" }
    ); //Left Hand
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 48, w: 11, h: 16 },
      { x: 297, y: 211, w: 88, h: 128 }
    ); //Left Forearm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: 273, y: 243, w: 24, h: 96 }
    ); //Back Left Forearm

    // Left Elbow
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 3, h: 4 },
      { x: 361, y: 138, w: 24, h: 128 }
    ); //Left Elbow
  } else {
    //Left Shoulder

    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 16, h: 8 },
      { x: 265, y: 82, w: 128, h: 64 }
    ); //Left Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 361, y: 50, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); //Left Scapula
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 56, w: 4, h: 4 },
      { x: 328, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Elbow

    // Left Forearm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: 329, y: 338, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Left Hand
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 48, w: 12, h: 16 },
      { x: 297, y: 211, w: 96, h: 128 }
    ); //Left Forearm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 12 },
      { x: 265, y: 243, w: 32, h: 96 }
    ); //Back Left Forearm

    // Left Elbow

    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 4 },
      { x: 361, y: 138, w: 32, h: 128 }
    ); //Left Elbow
  }
  // Right Arm

  if (props.isSlim) {
    // Right Shoulder

    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 11, h: 8 },
      { x: 457, y: 458, w: 88, h: 64 }
    ); //Right Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 12 },
      { x: 433, y: 458, w: 24, h: 96 }
    ); //Back Right Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 457, y: 458, w: 24, h: 32 },
      { rotateLegacy: 270.0 }
    ); //Right Scapula
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 24, w: 3, h: 4 },
      { x: 513, y: 570, w: 24, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Elbow

    // Right Forearm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: 465, y: 714, w: 24, h: 32 },
      { flip: "Vertical" }
    ); //Right Hand
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 16, w: 14, h: 16 },
      { x: 433, y: 587, w: 112, h: 128 }
    ); //Right Forearm

    // Right Elbow
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 3, h: 4 },
      { x: 433, y: 514, w: 24, h: 128 }
    ); //Right Elbow
  } else {
    // Right Shoulder

    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 12, h: 8 },
      { x: 457, y: 458, w: 96, h: 64 }
    ); //Right Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 20, w: 4, h: 12 },
      { x: 425, y: 458, w: 32, h: 96 }
    ); //Back Right Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 457, y: 458, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); //Right Scapula
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 24, w: 4, h: 4 },
      { x: 521, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Elbow

    // Right Forearm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: 457, y: 714, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Right Hand
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 16, w: 16, h: 16 },
      { x: 425, y: 587, w: 128, h: 128 }
    ); //Right Forearm

    // Right Elbow
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 4 },
      { x: 425, y: 514, w: 32, h: 128 }
    ); //Right Elbow
  }

  // Left Thigh

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 16, h: 16 },
    { x: 425, y: 41, w: 128, h: 128 }
  ); //Left Thigh
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 4 },
    { x: 489, y: 41, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); //Left Buttock
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 56, w: 4, h: 4 },
    { x: 489, y: 194, w: 32, h: 48 },
    { rotateLegacy: 180.0 }
  ); //Left Hamstring

  // Left Calf

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 12, h: 16 },
    { x: 457, y: 210, w: 96, h: 128 }
  ); //Left Calf
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 12 },
    { x: 425, y: 242, w: 32, h: 96 }
  ); //Back Left Calf
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 489, y: 338, w: 32, h: 32 },
    { flip: "Vertical" }
  ); //Left Foot

  // Left Knee

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 56, w: 4, h: 4 },
    { x: 521, y: 138, w: 32, h: 128 }
  ); //Left Knee

  // Right Thigh

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 16, w: 16, h: 16 },
    { x: 297, y: 418, w: 128, h: 128 }
  ); //Right Thigh
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 12 },
    { x: 265, y: 450, w: 32, h: 96 }
  ); //Right Back Thigh
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 4 },
    { x: 361, y: 418, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); //Right Buttock
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 24, w: 4, h: 4 },
    { x: 361, y: 570, w: 32, h: 48 },
    { rotateLegacy: 180.0 }
  ); //Right Hamstring

  // Right Calf

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 16, w: 16, h: 16 },
    { x: 265, y: 586, w: 128, h: 128 }
  ); //Right Calf
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 297, y: 714, w: 32, h: 32 },
    { flip: "Vertical" }
  ); //Right Foot

  // Right Knee

  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 24, w: 4, h: 4 },
    { x: 265, y: 514, w: 32, h: 128 }
  ); //Right Knee

  // Overlay

  if (props.showHelmetOverlay) {
    // Head
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: 74, y: 790, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: 74, y: 726, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Face
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: 74, y: 662, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: 74, y: 598, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 10, y: 726, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 138, y: 726, w: 64, h: 64 },
      { flip: "Vertical", rotateLegacy: 270.0 }
    ); // Bot
    //neck
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 36, y: 414, w: 64, h: 96 }
    );
  } // Neck
  if (props.showJacketOverlay) {
    // Chest

    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 32, w: 24, h: 14 },
      { x: 35, y: 50, w: 192, h: 112 }
    ); // Chest
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 40, w: 8, h: 6 },
      { x: 131, y: 204, w: 64, h: 48 },
      { rotateLegacy: 180.0 }
    ); // Vertebra

    // Spine

    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 40, w: 8, h: 4 },
      { x: 163, y: 143, w: 64, h: 128 }
    ); // Spine

    // Waist

    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 40, w: 16, h: 8 },
      { x: 99, y: 282, w: 128, h: 64 }
    ); // Waist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 44, w: 8, h: 4 },
      { x: 35, y: 314, w: 64, h: 32 }
    ); // Back Waist
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 4, h: 4 },
      { x: 99, y: 346, w: 32, h: 32 }
    ); // Right Hip
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 52, w: 4, h: 4 },
      { x: 195, y: 346, w: 32, h: 32 }
    ); // Left Hip

    // Pelvis

    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 131, y: 380, w: 64, h: 130 }
    );
  } //Pelvis

  // Left Arm

  if (props.isSlim) {
    if (props.showLeftSleeveOverlay) {
      //Left Shoulder

      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 14, h: 8 },
        { x: 273, y: 82, w: 112, h: 64 }
      ); //Left Shoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: 361, y: 58, w: 24, h: 32 },
        { rotateLegacy: 90.0 }
      ); //Left Scapula
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 56, w: 3, h: 4 },
        { x: 328, y: 194, w: 24, h: 48 },
        { rotateLegacy: 180.0 }
      ); //Left Elbow

      // Left Forearm

      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: 329, y: 338, w: 24, h: 32 },
        { flip: "Vertical" }
      ); //Left Hand
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 48, w: 11, h: 16 },
        { x: 297, y: 211, w: 88, h: 128 }
      ); //Left Forearm
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: 273, y: 243, w: 24, h: 96 }
      ); //Back Left Forearm

      // Left Elbow

      ctx.drawTextureLegacy(
        "Skin",
        { x: 36, y: 56, w: 3, h: 4 },
        { x: 361, y: 138, w: 24, h: 128 }
      ); //Left Elbow
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 3, h: 4 },
        { x: 361, y: 138, w: 24, h: 128 }
      ); //Left Elbow
    }
  } else if (props.showLeftSleeveOverlay) {
    // Left Shoulder

    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 52, w: 16, h: 8 },
      { x: 265, y: 82, w: 128, h: 64 }
    ); //Left Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 48, w: 4, h: 4 },
      { x: 361, y: 50, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); //Left Scapula
    ctx.drawTextureLegacy(
      "Skin",
      { x: 60, y: 56, w: 4, h: 4 },
      { x: 328, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Elbow

    // Left Forearm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 48, w: 4, h: 4 },
      { x: 329, y: 338, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Left Hand
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 48, w: 12, h: 16 },
      { x: 297, y: 211, w: 96, h: 128 }
    ); //Left Forearm
    ctx.drawTextureLegacy(
      "Skin",
      { x: 60, y: 52, w: 4, h: 12 },
      { x: 265, y: 243, w: 32, h: 96 }
    ); //Back Left Forearm

    // Left Elbow

    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 4 },
      { x: 361, y: 138, w: 32, h: 128 }
    ); //Left Elbow
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 56, w: 4, h: 4 },
      { x: 361, y: 138, w: 32, h: 128 }
    );
  }

  // Right Arm

  if (props.isSlim) {
    if (props.showRightSleeveOverlay) {
      // Right Shoulder

      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 11, h: 8 },
        { x: 457, y: 458, w: 88, h: 64 }
      ); //Right Shoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: 433, y: 458, w: 24, h: 96 }
      ); //Back Right Shoulder
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: 457, y: 458, w: 24, h: 32 },
        { rotateLegacy: 270.0 }
      ); //Right Scapula
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 40, w: 3, h: 4 },
        { x: 513, y: 570, w: 24, h: 48 },
        { rotateLegacy: 180.0 }
      ); //Right Elbow

      // Right Forearm

      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: 465, y: 714, w: 24, h: 32 },
        { flip: "Vertical" }
      ); //Right Hand
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 32, w: 14, h: 16 },
        { x: 433, y: 587, w: 112, h: 128 }
      ); //Right Forearm

      // Right Elbow

      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 24, w: 3, h: 4 },
        { x: 433, y: 514, w: 24, h: 128 }
      ); //Right Elbow
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 3, h: 4 },
        { x: 433, y: 514, w: 24, h: 128 }
      ); //Right Elbow
    }
  } else if (props.showRightSleeveOverlay) {
    // Right Shoulder

    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 36, w: 12, h: 8 },
      { x: 457, y: 458, w: 96, h: 64 }
    ); //Right Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 36, w: 4, h: 12 },
      { x: 425, y: 458, w: 32, h: 96 }
    ); //Back Right Shoulder
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 4, h: 4 },
      { x: 457, y: 458, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); //Right Scapula
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 40, w: 4, h: 4 },
      { x: 521, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Elbow

    // Right Forearm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 32, w: 4, h: 4 },
      { x: 457, y: 714, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Right Hand
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 32, w: 16, h: 16 },
      { x: 425, y: 587, w: 128, h: 128 }
    ); //Right Forearm

    // Right Elbow

    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 4 },
      { x: 425, y: 514, w: 32, h: 128 }
    ); //Right Elbow
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 40, w: 4, h: 4 },
      { x: 425, y: 514, w: 32, h: 128 }
    ); //Right Elbow
  }
  if (props.showLeftPantOverlay) {
    // Left Thigh

    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 48, w: 16, h: 16 },
      { x: 425, y: 41, w: 128, h: 128 }
    ); //Left Thigh
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 4 },
      { x: 489, y: 41, w: 32, h: 32 },
      { rotateLegacy: 180.0 }
    ); //Left Buttock
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 56, w: 4, h: 4 },
      { x: 489, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Hamstring
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 56, w: 4, h: 4 },
      { x: 489, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Hamstring

    // Left Calf
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 48, w: 12, h: 16 },
      { x: 457, y: 210, w: 96, h: 128 }
    ); //Left Calf
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: 425, y: 242, w: 32, h: 96 }
    ); //Back Left Calf
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: 489, y: 338, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Left Foot

    // Left Knee

    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 56, w: 4, h: 4 },
      { x: 521, y: 138, w: 32, h: 128 }
    ); //Left Knee
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 56, w: 4, h: 4 },
      { x: 521, y: 138, w: 32, h: 128 }
    );
  } //Left Knee
  if (props.showRightPantOverlay) {
    // Right Thigh

    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 32, w: 16, h: 16 },
      { x: 297, y: 418, w: 128, h: 128 }
    ); //Right Thigh
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 12 },
      { x: 265, y: 450, w: 32, h: 96 }
    ); //Right Back Thigh
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 4 },
      { x: 361, y: 418, w: 32, h: 32 },
      { rotateLegacy: 180.0 }
    ); //Right Buttock
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 24, w: 4, h: 4 },
      { x: 361, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Hamstring
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 40, w: 4, h: 4 },
      { x: 361, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Hamstring

    // Right Calf

    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 32, w: 16, h: 16 },
      { x: 265, y: 586, w: 128, h: 128 }
    ); //Right Calf
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: 297, y: 714, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Right Foot

    // Right Knee

    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 24, w: 4, h: 4 },
      { x: 265, y: 514, w: 32, h: 128 }
    ); //Right Knee
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 40, w: 4, h: 4 },
      { x: 265, y: 514, w: 32, h: 128 }
    ); //Right Knee
  }

  // Background

  if (props.isSlim) {
    ctx.drawImage("Background-Alex", [0, 0]);
  } else {
    ctx.drawImage("Background-Steve", [0, 0]);
  }

  // Folds

  if (props.showFolds) {
    if (props.isSlim) {
      ctx.drawImage("Folds-Alex", [0, 0]);
    } else {
      ctx.drawImage("Folds-Steve", [0, 0]);
    }
  }

  // Color Code

  if (props.showColorCodes) {
    if (props.isSlim) {
      ctx.drawImage("Colors-Alex", [0, 0]);
    } else {
      ctx.drawImage("Colors-Steve", [0, 0]);
    }
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftUltimateBendableGeneratorV2: GeneratorV2<MinecraftUltimateBendableProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showColorCodes, setShowColorCodes] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [showHelmetOverlay, setShowHelmetOverlay] = React.useState(true);
  const [showJacketOverlay, setShowJacketOverlay] = React.useState(true);
  const [showLeftSleeveOverlay, setShowLeftSleeveOverlay] =
    React.useState(true);
  const [showRightSleeveOverlay, setShowRightSleeveOverlay] =
    React.useState(true);
  const [showLeftPantOverlay, setShowLeftPantOverlay] = React.useState(true);
  const [showRightPantOverlay, setShowRightPantOverlay] = React.useState(true);

  const rendererProps: MinecraftUltimateBendableProps = {
    isSlim: skinValue.modelType === "Slim",
    showFolds,
    showColorCodes,
    showLabels,
    showHelmetOverlay,
    showJacketOverlay,
    showLeftSleeveOverlay,
    showRightSleeveOverlay,
    showLeftPantOverlay,
    showRightPantOverlay,
  };

  const dynamicTextures = React.useMemo(
    () =>
      skinTexture
        ? new Map<string, Texture>([["Skin", skinTexture]])
        : new Map<string, Texture>(),
    [skinTexture]
  );

  const handleRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "helmet":
        setShowHelmetOverlay((value) => !value);
        break;
      case "jacket":
        setShowJacketOverlay((value) => !value);
        break;
      case "leftSleeve":
        setShowLeftSleeveOverlay((value) => !value);
        break;
      case "rightSleeve":
        setShowRightSleeveOverlay((value) => !value);
        break;
      case "leftPant":
        setShowLeftPantOverlay((value) => !value);
        break;
      case "rightPant":
        setShowRightPantOverlay((value) => !value);
        break;
    }
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={video} thumbnail={thumbnail} />

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
              label="Show Color Codes"
              checked={showColorCodes}
              onCheckedChange={setShowColorCodes}
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
            generator={minecraftUltimateBendableGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={handleRegionClick}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
