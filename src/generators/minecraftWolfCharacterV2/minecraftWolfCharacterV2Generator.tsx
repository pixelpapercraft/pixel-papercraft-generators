"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type ImageDef,
  type HistoryDef,
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

import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";
import wolfAngryTexture from "./textures/wolf_angry.png";

const id = "minecraft-wolf-character-v2";

const name = "Minecraft Wolf Character";

const history: HistoryDef = [
  "Originally developed by dodecaphon.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "29 Sep 2020 NinjolasNJM - Various updates.",
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

const textures: TextureDef[] = [
  {
    id: "Angry Wolf",
    url: wolfAngryTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();

type MinecraftWolfCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  showRedEyes: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideLeftSleeve: boolean;
  hideRightSleeve: boolean;
  hideLeftPant: boolean;
  hideRightPant: boolean;
  tailType: number;
};

const render = (
  ctx: RenderContext,
  props: MinecraftWolfCharacterProps
): void => {
  const isSlimModel = props.isSlim;
  const {
    showFolds,
    showLabels,
    showRedEyes,
    hideHelmet,
    hideJacket,
    hideLeftSleeve,
    hideRightSleeve,
    hideLeftPant,
    hideRightPant,
    tailType,
  } = props;

  ctx.defineRegion([341, 312, 160, 112], "helmet");
  ctx.defineRegion([85, 198, 240, 160], "jacket");
  ctx.defineRegion([346, 575, 64, 88], "leftSleeve");
  ctx.defineRegion([259, 575, 64, 88], "rightSleeve");
  ctx.defineRegion([172, 575, 64, 88], "leftPant");
  ctx.defineRegion([85, 575, 64, 88], "rightPant");
  ctx.defineRegion([407, 518, 88, 64], "tail");

  // Script Variables

  const ox = 0; // ox means 'origin x'
  const oy = 0; // oy means 'origin y'
  const og = 0;
  const oh = 0;
  const ol = 0;
  const om = 0;
  const dx = 407;
  const dy = 518;

  const drawLimb = (
    sx: number,
    sy: number,
    dx: number,
    dy: number,
    isArm: boolean
  ) => {
    if (isArm && isSlimModel) {
      ctx.drawTexture("Skin", [sx + 4, sy, 3, 4], [dx + 16, dy, 16, 16]); // top
      ctx.drawTexture("Skin", [sx, sy + 4, 4, 12], [dx, dy + 16, 16, 56]); // left
      ctx.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 3, 12],
        [dx + 16, dy + 16, 16, 56]
      ); // front
      ctx.drawTexture(
        "Skin",
        [sx + 7, sy + 4, 4, 12],
        [dx + 32, dy + 16, 16, 56]
      ); // right
      ctx.drawTexture(
        "Skin",
        [sx + 11, sy + 4, 3, 12],
        [dx + 48, dy + 16, 16, 56]
      ); // back
      ctx.drawTexture("Skin", [sx + 7, sy, 3, 4], [dx + 16, dy + 72, 16, 16], {
        flip: "Vertical",
      }); // bottom
    } else {
      ctx.drawTexture("Skin", [sx + 4, sy, 4, 4], [dx + 16, dy, 16, 16]); // top
      ctx.drawTexture("Skin", [sx, sy + 4, 4, 12], [dx, dy + 16, 16, 56]); // left
      ctx.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 4, 12],
        [dx + 16, dy + 16, 16, 56]
      ); // front
      ctx.drawTexture(
        "Skin",
        [sx + 8, sy + 4, 4, 12],
        [dx + 32, dy + 16, 16, 56]
      ); // right
      ctx.drawTexture(
        "Skin",
        [sx + 12, sy + 4, 4, 12],
        [dx + 48, dy + 16, 16, 56]
      ); // back
      ctx.drawTexture("Skin", [sx + 8, sy, 4, 4], [dx + 16, dy + 72, 16, 16], {
        flip: "Vertical",
      }); // bottom
    }
  };

  // Head

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: ox + 341, y: oy + 344, w: 32, h: 48 }
  ); // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 373, y: oy + 392, w: 48, h: 32 },
    { flip: "Vertical" }
  ); // bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: ox + 421, y: oy + 344, w: 32, h: 48 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: ox + 453, y: oy + 344, w: 48, h: 48 }
  ); // back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 373, y: oy + 312, w: 48, h: 32 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: ox + 373, y: oy + 344, w: 48, h: 48 }
  ); // face
  // nose
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 3 },
    { x: og + 416, y: oh + 232, w: 24, h: 24 }
  ); // front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 1, h: 3 },
    { x: og + 392, y: oh + 232, w: 24, h: 24 }
  ); // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 1 },
    { x: og + 416, y: oh + 208, w: 24, h: 24 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 15, w: 4, h: 1 },
    { x: og + 416, y: oh + 256, w: 24, h: 24 }
  ); // bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 13, y: 13, w: 1, h: 3 },
    { x: og + 440, y: oh + 232, w: 24, h: 24 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 3 },
    { x: og + 464, y: oh + 232, w: 24, h: 24 },
    { flip: "Horizontal" }
  ); // back

  if (!hideHelmet) {
    // Head
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: ox + 341, y: oy + 344, w: 32, h: 48 }
    ); // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: ox + 373, y: oy + 392, w: 48, h: 32 },
      { flip: "Vertical" }
    ); // bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: ox + 421, y: oy + 344, w: 32, h: 48 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: ox + 453, y: oy + 344, w: 48, h: 48 }
    ); // back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: ox + 373, y: oy + 312, w: 48, h: 32 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: ox + 373, y: oy + 344, w: 48, h: 48 }
    ); // face
    // nose
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 3 },
      { x: og + 416, y: oh + 232, w: 24, h: 24 }
    ); // front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 1, h: 3 },
      { x: og + 392, y: oh + 232, w: 24, h: 24 }
    ); // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 1 },
      { x: og + 416, y: oh + 208, w: 24, h: 24 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 15, w: 4, h: 1 },
      { x: og + 416, y: oh + 256, w: 24, h: 24 }
    ); // bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 45, y: 13, w: 1, h: 3 },
      { x: og + 440, y: oh + 232, w: 24, h: 24 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 3 },
      { x: og + 464, y: oh + 232, w: 24, h: 24 },
      { flip: "Horizontal" }
    ); // back
  }

  // Legs

  drawLimb(0, 16, 85, 575, false); // right leg

  if (!hideRightPant) {
    drawLimb(0, 32, 85, 575, false); // right leg
  }

  drawLimb(16, 48, 172, 575, false); // left leg

  if (!hideLeftPant) {
    drawLimb(0, 48, 172, 575, false); // left leg
  }

  // Arms

  drawLimb(40, 16, 259, 575, true); // right arm

  if (!hideRightSleeve) {
    drawLimb(40, 32, 259, 575, true); // right arm
  }

  drawLimb(32, 48, 346, 575, true); // left arm

  if (!hideLeftSleeve) {
    drawLimb(48, 48, 346, 575, true); // left arm
  }

  // Tail

  const drawTail = (sx: number, sy: number, isArm: boolean) => {
    if (isArm && isSlimModel) {
      // Tail
      ctx.drawTexture("Skin", [sx + 4, sy, 3, 4], [dx + 72, dy + 16, 16, 16], {
        rotate: 90.0,
      }); // top
      ctx.drawTexture("Skin", [sx, sy + 4, 4, 12], [dx + 36, dy - 20, 16, 56], {
        rotate: 90.0,
      }); // left
      ctx.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 3, 12],
        [dx + 36, dy - 4, 16, 56],
        { rotate: 90.0 }
      ); // front
      ctx.drawTexture(
        "Skin",
        [sx + 7, sy + 4, 4, 12],
        [dx + 36, dy + 12, 16, 56],
        { rotate: 90.0 }
      ); // right
      ctx.drawTexture(
        "Skin",
        [sx + 11, sy + 4, 3, 12],
        [dx + 36, dy + 28, 16, 56],
        { rotate: 90.0 }
      ); // back
      ctx.drawTexture("Skin", [sx + 7, sy, 3, 4], [dx, dy + 16, 16, 16], {
        flip: "Vertical",
        rotate: 90.0,
      }); // bottom
    } else {
      // Tail
      ctx.drawTexture("Skin", [sx + 4, sy, 4, 4], [dx + 72, dy + 16, 16, 16], {
        rotate: 90.0,
      }); // top
      ctx.drawTexture("Skin", [sx, sy + 4, 4, 12], [dx + 36, dy - 20, 16, 56], {
        rotate: 90.0,
      }); // left
      ctx.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 4, 12],
        [dx + 36, dy - 4, 16, 56],
        { rotate: 90.0 }
      ); // front
      ctx.drawTexture(
        "Skin",
        [sx + 8, sy + 4, 4, 12],
        [dx + 36, dy + 12, 16, 56],
        { rotate: 90.0 }
      ); // right
      ctx.drawTexture(
        "Skin",
        [sx + 12, sy + 4, 4, 12],
        [dx + 36, dy + 28, 16, 56],
        { rotate: 90.0 }
      ); // back
      ctx.drawTexture("Skin", [sx + 8, sy, 4, 4], [dx, dy + 16, 16, 16], {
        flip: "Vertical",
        rotate: 90.0,
      }); // bottom
    }
  };
  switch (tailType) {
    case 1: {
      const sx = 0;
      const sy = 16;
      const sx2 = 0;
      const sy2 = 32;
      const isArm = false;
      drawTail(sx, sy, isArm);
      if (!hideRightPant) {
        drawTail(sx2, sy2, isArm);
      }
      break;
    }
    case 2: {
      const sx = 16;
      const sy = 48;
      const sx2 = 0;
      const sy2 = 48;
      const isArm = false;
      drawTail(sx, sy, isArm);
      if (!hideLeftPant) {
        drawTail(sx2, sy2, isArm);
      }
      break;
    }
    case 3: {
      const sx = 40;
      const sy = 16;
      const sx2 = 40;
      const sy2 = 32;
      const isArm = true;
      drawTail(sx, sy, isArm);
      if (!hideRightSleeve) {
        drawTail(sx2, sy2, isArm);
      }
      break;
    }
    case 4: {
      const sx = 32;
      const sy = 48;
      const sx2 = 48;
      const sy2 = 48;
      const isArm = true;
      drawTail(sx, sy, isArm);
      if (!hideLeftSleeve) {
        drawTail(sx2, sy2, isArm);
      }
      break;
    }
    default: {
      // Do nothing
    }
  }

  // body

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 4 },
    { x: 141, y: 254, w: 64, h: 48 }
  ); // bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 4 },
    { x: 85, y: 254, w: 56, h: 48 }
  ); // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 4 },
    { x: 205, y: 254, w: 56, h: 48 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 4 },
    { x: 261, y: 254, w: 64, h: 48 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 141, y: 198, w: 64, h: 56 }
  ); // front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 141, y: 302, w: 64, h: 56 },
    { flip: "Vertical" }
  ); // back

  // body2

  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 24, w: 8, h: 8 },
    { x: 163, y: 427, w: 48, h: 72 }
  ); // bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 24, w: 4, h: 8 },
    { x: 115, y: 427, w: 48, h: 72 }
  ); // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 24, w: 4, h: 8 },
    { x: 211, y: 427, w: 48, h: 72 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 24, w: 8, h: 8 },
    { x: 259, y: 427, w: 48, h: 72 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 163, y: 379, w: 48, h: 48 }
  ); // front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 163, y: 499, w: 48, h: 48 },
    { flip: "Vertical" }
  ); // back

  // Ears

  // left

  ctx.drawTextureLegacy(
    "Skin",
    { x: 22, y: 17, w: 2, h: 2 },
    { x: ol + 371, y: om + 459, w: 16, h: 16 }
  ); //front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 25, y: 17, w: 2, h: 2 },
    { x: ol + 395, y: om + 459, w: 16, h: 16 }
  ); //back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 21, y: 17, w: 1, h: 2 },
    { x: ol + 363, y: om + 459, w: 8, h: 16 }
  ); //left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 17, w: 1, h: 2 },
    { x: ol + 387, y: om + 459, w: 8, h: 16 }
  ); //right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 22, y: 16, w: 2, h: 1 },
    { x: ol + 371, y: om + 451, w: 16, h: 8 }
  ); //top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 16, w: 2, h: 1 },
    { x: ol + 371, y: om + 475, w: 16, h: 8 },
    { flip: "Vertical" }
  ); //bottom

  // right

  ctx.drawTextureLegacy(
    "Skin",
    { x: 22, y: 17, w: 2, h: 2 },
    { x: ol + 444, y: om + 459, w: 16, h: 16 }
  ); //front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 25, y: 17, w: 2, h: 2 },
    { x: ol + 468, y: om + 459, w: 16, h: 16 }
  ); //back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 21, y: 17, w: 1, h: 2 },
    { x: ol + 436, y: om + 459, w: 8, h: 16 }
  ); //left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 17, w: 1, h: 2 },
    { x: ol + 460, y: om + 459, w: 8, h: 16 }
  ); //right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 22, y: 16, w: 2, h: 1 },
    { x: ol + 444, y: om + 451, w: 16, h: 8 }
  ); //top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 16, w: 2, h: 1 },
    { x: ol + 444, y: om + 475, w: 16, h: 8 },
    { flip: "Vertical" }
  ); //bottom

  if (!hideJacket) {
    // body
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 4 },
      { x: 141, y: 254, w: 64, h: 48 }
    ); // bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 4 },
      { x: 85, y: 254, w: 56, h: 48 }
    ); // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 4 },
      { x: 205, y: 254, w: 56, h: 48 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 4 },
      { x: 261, y: 254, w: 64, h: 48 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 141, y: 198, w: 64, h: 56 }
    ); // front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 141, y: 302, w: 64, h: 56 },
      { flip: "Vertical" }
    ); // back
    // body2
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 40, w: 8, h: 8 },
      { x: 163, y: 427, w: 48, h: 72 }
    ); // bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 40, w: 4, h: 8 },
      { x: 115, y: 427, w: 48, h: 72 }
    ); // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 40, w: 4, h: 8 },
      { x: 211, y: 427, w: 48, h: 72 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 40, w: 8, h: 8 },
      { x: 259, y: 427, w: 48, h: 72 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 163, y: 379, w: 48, h: 48 }
    ); // front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 163, y: 499, w: 48, h: 48 },
      { flip: "Vertical" }
    ); // back
    // Ears
    // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 22, y: 33, w: 2, h: 2 },
      { x: ol + 371, y: om + 459, w: 16, h: 16 }
    ); //front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 25, y: 33, w: 2, h: 2 },
      { x: ol + 395, y: om + 459, w: 16, h: 16 }
    ); //back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 21, y: 33, w: 1, h: 2 },
      { x: ol + 363, y: om + 459, w: 8, h: 16 }
    ); //left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 24, y: 33, w: 1, h: 2 },
      { x: ol + 387, y: om + 459, w: 8, h: 16 }
    ); //right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 22, y: 32, w: 2, h: 1 },
      { x: ol + 371, y: om + 451, w: 16, h: 8 }
    ); //top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 24, y: 32, w: 2, h: 1 },
      { x: ol + 371, y: om + 475, w: 16, h: 8 },
      { flip: "Vertical" }
    ); //bottom
    // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 22, y: 33, w: 2, h: 2 },
      { x: ol + 444, y: om + 459, w: 16, h: 16 }
    ); //front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 25, y: 33, w: 2, h: 2 },
      { x: ol + 468, y: om + 459, w: 16, h: 16 }
    ); //back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 21, y: 33, w: 1, h: 2 },
      { x: ol + 436, y: om + 459, w: 8, h: 16 }
    ); //left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 24, y: 33, w: 1, h: 2 },
      { x: ol + 460, y: om + 459, w: 8, h: 16 }
    ); //right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 22, y: 32, w: 2, h: 1 },
      { x: ol + 444, y: om + 451, w: 16, h: 8 }
    ); //top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 24, y: 32, w: 2, h: 1 },
      { x: ol + 444, y: om + 475, w: 16, h: 8 },
      { flip: "Vertical" }
    ); //bottom
  }

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Fold Lines

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }

  // Red Eye

  if (showRedEyes) {
    ctx.drawTexture("Angry Wolf", [4, 5, 2, 2], [379, 362, 12, 12]); // Right Eye 1
    ctx.drawTexture("Angry Wolf", [4, 4, 1, 1], [379, 356, 6, 6]); // Right Eye 2
    ctx.drawTexture("Angry Wolf", [8, 5, 2, 2], [403, 362, 12, 12]); // Left Eye 1
    ctx.drawTexture("Angry Wolf", [9, 4, 1, 1], [409, 356, 6, 6]); // Left Eye 2
  }
};

const minecraftWolfCharacterGeneratorV2: GeneratorV2<MinecraftWolfCharacterProps> =
  { id, name, images, textures, render };

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [showRedEyes, setShowRedEyes] = React.useState(false);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);
  const [tailType, setTailType] = React.useState(1);

  const rendererProps: MinecraftWolfCharacterProps = {
    isSlim: skinValue.modelType === "Slim",
    showFolds,
    showLabels,
    showRedEyes,
    hideHelmet,
    hideJacket,
    hideLeftSleeve,
    hideRightSleeve,
    hideLeftPant,
    hideRightPant,
    tailType,
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
      case "tail":
        setTailType((value) => (value === 4 ? 1 : value + 1));
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
            <GeneratorUI.BooleanControl
              label="Show Red Eyes"
              checked={showRedEyes}
              onCheckedChange={setShowRedEyes}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftWolfCharacterGeneratorV2}
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
