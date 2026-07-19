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

import thumbnailImage from "./thumbnail/thumbnail.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";

const id = "minecraft-cat-character-v2";

const name = "Minecraft Cat Character";

const history: HistoryDef = [
  "Originally developed by dodecaphon.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "17 Sep 2020 NinjolasNJM - Updated to use 1.8+ skins.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker
// through `dynamicTextures`, same as minecraftCharacterV2. See the migration
// plan's correctness note on why "None" would otherwise be wrong.
const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// `MinecraftSkinControl` only reads this for `texture`-kind options; the
// default preset options are all presets, so a shared empty map is safe.
const noTextures: Map<string, Texture> = new Map();

type MinecraftCatCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideLeftSleeve: boolean;
  hideRightSleeve: boolean;
  hideLeftPant: boolean;
  hideRightPant: boolean;
  tailType: number;
};

// Ported from `minecraftCatCharacterGenerator.ts`'s `script` render body: same
// `drawTextureLegacy` calls, same offsets, same draw order. The only
// difference is every value that used to come from `generator.get*InputValue`
// now comes from an author-owned `props`.
const render = (
  ctx: RenderContext,
  props: MinecraftCatCharacterProps
): void => {
  // Script Variables
  const ox = 15; // ox means 'origin x'
  const oy = 8; // oy means 'origin y'
  const oa = 0;
  let ob = 0;
  const og = 15;
  const oh = 8;
  const ol = 0;
  const om = 0;
  const oi = 0;
  const oo = 0;

  ctx.defineRegion([40, 33, 160, 112], "helmet");
  ctx.defineRegion([40, 193, 160, 224], "jacket");
  ctx.defineRegion([340, 232, 64, 64], "leftSleeve");
  ctx.defineRegion([251, 232, 128 / 2, 64], "rightSleeve");
  ctx.defineRegion([340, 320, 64, 64], "leftPant");
  ctx.defineRegion([251, 320, 64, 64], "rightPant");
  ctx.defineRegion([469, 283, 104, 83], "tail");

  // Head
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: ox + 25, y: oy + 65, w: 40, h: 32 }
  ); // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 65, y: oy + 97, w: 40, h: 40 },
    { flip: "Vertical" }
  ); // bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: ox + 105, y: oy + 65, w: 40, h: 32 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: ox + 145, y: oy + 65, w: 40, h: 32 }
  ); // back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 65, y: oy + 25, w: 40, h: 40 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: ox + 65, y: oy + 65, w: 40, h: 32 }
  ); // face
  // nose
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 3 },
    { x: og + 241, y: oh + 76, w: 24, h: 12 }
  ); // front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 1 },
    { x: og + 241, y: oh + 68, w: 24, h: 8 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 13, y: 13, w: 1, h: 3 },
    { x: og + 265, y: oh + 76, w: 8, h: 12 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 15, w: 4, h: 1 },
    { x: og + 241, y: oh + 88, w: 24, h: 8 }
  ); // bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 1, h: 3 },
    { x: og + 233, y: oh + 76, w: 8, h: 12 }
  ); // left
  // Ears
  // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 9, y: 1, w: 1, h: 1 },
    { x: ol + 168, y: om + 168, w: 24, h: 16 }
  ); //front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 9, y: 0, w: 1, h: 1 },
    { x: ol + 168, y: om + 152, w: 24, h: 16 }
  ); //back
  // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 14, y: 1, w: 1, h: 1 },
    { x: ol + 245, y: om + 169, w: 24, h: 16 }
  ); //front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 14, y: 0, w: 1, h: 1 },
    { x: ol + 245, y: om + 153, w: 24, h: 16 }
  ); //back
  if (!props.hideHelmet) {
    // Hat
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 25, y: oy + 65, w: 40, h: 32 }
    ); // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16 + 32, y: 0, w: 8, h: 8 },
      { x: ox + 65, y: oy + 97, w: 40, h: 40 },
      { flip: "Vertical" }
    ); // bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 105, y: oy + 65, w: 40, h: 32 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 24 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 145, y: oy + 65, w: 40, h: 32 }
    ); // back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8 + 32, y: 0, w: 8, h: 8 },
      { x: ox + 65, y: oy + 25, w: 40, h: 40 }
    ); // Top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 65, y: oy + 65, w: 40, h: 32 }
    ); // face
    // nose Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 3 },
      { x: og + 241, y: oh + 76, w: 24, h: 12 }
    ); // front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 1 },
      { x: og + 241, y: oh + 68, w: 24, h: 8 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 45, y: 13, w: 1, h: 3 },
      { x: og + 265, y: oh + 76, w: 8, h: 12 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 15, w: 4, h: 1 },
      { x: og + 241, y: oh + 88, w: 24, h: 8 }
    ); // bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 1, h: 3 },
      { x: og + 233, y: oh + 76, w: 8, h: 12 }
    ); // left
    // left Helmet
    ctx.drawTextureLegacy(
      "Skin",
      { x: 41, y: 1, w: 1, h: 1 },
      { x: ol + 168, y: om + 168, w: 24, h: 16 }
    ); //front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 41, y: 0, w: 1, h: 1 },
      { x: ol + 168, y: om + 152, w: 24, h: 16 }
    ); //back
    // right Helmet
    ctx.drawTextureLegacy(
      "Skin",
      { x: 46, y: 1, w: 1, h: 1 },
      { x: ol + 245, y: om + 169, w: 24, h: 16 }
    ); //front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 46, y: 0, w: 1, h: 1 },
      { x: ol + 245, y: om + 153, w: 24, h: 16 }
    ); //back
  }
  // Legs
  if (props.isSlim) {
    // Front Right Leg
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 12 },
      { x: oa + 251, y: ob + 248, w: 16, h: 32 }
    ); // leg (right)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 12 },
      { x: oa + 267, y: ob + 248, w: 16, h: 32 }
    ); // leg (front)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 12 },
      { x: oa + 283, y: ob + 248, w: 16, h: 32 }
    ); // leg (left)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 12 },
      { x: oa + 299, y: ob + 248, w: 16, h: 32 }
    ); // leg (back)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: oa + 267, y: ob + 232, w: 16, h: 16 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: oa + 267, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  } else {
    // Front Right Leg
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 16, h: 12 },
      { x: oa + 251, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: oa + 267, y: ob + 232, w: 16, h: 16 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: oa + 267, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  if (!props.hideRightSleeve) {
    if (props.isSlim) {
      // Front Right Leg Pant
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: oa + 251, y: ob + 248, w: 16, h: 32 }
      ); // leg (right)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 12 },
        { x: oa + 267, y: ob + 248, w: 16, h: 32 }
      ); // leg (front)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 12 },
        { x: oa + 283, y: ob + 248, w: 16, h: 32 }
      ); // leg (left)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: oa + 299, y: ob + 248, w: 16, h: 32 }
      ); // leg (back)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: oa + 267, y: ob + 232, w: 16, h: 16 }
      ); // top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: oa + 267, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    } else {
      // Front Right Leg Pant
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 16, h: 12 },
        { x: oa + 251, y: ob + 248, w: 64, h: 32 }
      ); // leg (all sides)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: oa + 267, y: ob + 232, w: 16, h: 16 }
      ); // top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: oa + 267, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    }
  }
  if (props.isSlim) {
    // Front Left Leg
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 12 },
      { x: oa + 340, y: ob + 248, w: 16, h: 32 }
    ); // leg (right)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 12 },
      { x: oa + 356, y: ob + 248, w: 16, h: 32 }
    ); // leg (front)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 12 },
      { x: oa + 372, y: ob + 248, w: 16, h: 32 }
    ); // leg (left)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: oa + 388, y: ob + 248, w: 16, h: 32 }
    ); // leg (back)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: oa + 356, y: ob + 232, w: 16, h: 16 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: oa + 356, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  } else {
    // Front Left Leg
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 16, h: 12 },
      { x: oa + 340, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 232, w: 16, h: 16 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  if (!props.hideLeftSleeve) {
    if (props.isSlim) {
      // Front Left Leg Pant
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: oa + 340, y: ob + 248, w: 16, h: 32 }
      ); // leg (right)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 12 },
        { x: oa + 356, y: ob + 248, w: 16, h: 32 }
      ); // leg (front)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 12 },
        { x: oa + 372, y: ob + 248, w: 16, h: 32 }
      ); // leg (left)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: oa + 388, y: ob + 248, w: 16, h: 32 }
      ); // leg (back)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: oa + 356, y: ob + 232, w: 16, h: 16 }
      ); // top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: oa + 356, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    } else {
      // Front Left Leg Pant
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 16, h: 12 },
        { x: oa + 340, y: ob + 248, w: 64, h: 32 }
      ); // leg (all sides)
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: oa + 356, y: ob + 232, w: 16, h: 16 }
      ); // top
      ctx.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: oa + 356, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    }
  }
  ob = ob + 88;
  // Back Right Leg
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 16, h: 12 },
    { x: oa + 251, y: ob + 248, w: 64, h: 32 }
  ); // leg (all sides)
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: oa + 267, y: ob + 232, w: 16, h: 16 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: oa + 267, y: ob + 280, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // bottom
  if (!props.hideRightPant) {
    // Back Right Leg Pant
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 16, h: 12 },
      { x: oa + 251, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: oa + 267, y: ob + 232, w: 16, h: 16 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: oa + 267, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  // Back Left Leg
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 16, h: 12 },
    { x: oa + 340, y: ob + 248, w: 64, h: 32 }
  ); // leg (all sides)
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: oa + 356, y: ob + 232, w: 16, h: 16 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: oa + 356, y: ob + 280, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // bottom
  if (!props.hideLeftPant) {
    // Back Left Leg Pant
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 16, h: 12 },
      { x: oa + 340, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 232, w: 16, h: 16 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  const drawTail = (sx: number, sy: number, isArm: boolean) => {
    if (isArm && props.isSlim) {
      // Tail
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 4, w: 4, h: 6 },
        { x: oi + 469, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (right)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 4, y: sy + 4, w: 3, h: 6 },
        { x: oi + 477, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (front)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 7, y: sy + 4, w: 4, h: 6 },
        { x: oi + 485, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (left)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 11, y: sy + 4, w: 3, h: 6 },
        { x: oi + 493, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (back)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 10, w: 4, h: 6 },
        { x: oi + 541, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (right)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 4, y: sy + 10, w: 3, h: 6 },
        { x: oi + 549, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (front)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 7, y: sy + 10, w: 4, h: 6 },
        { x: oi + 557, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (left)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 11, y: sy + 10, w: 3, h: 6 },
        { x: oi + 565, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (back)
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 5, y: sy + 1, w: 1, h: 1 },
        { x: oi + 477, y: oo + 358, w: 8, h: 8 }
      ); // end1
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 9, y: sy + 1, w: 1, h: 1 },
        { x: oi + 549, y: oo + 358, w: 8, h: 8 }
      ); // end2
    } else {
      // Tail
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 4, w: 16, h: 6 },
        { x: oi + 469, y: oo + 294, w: 32, h: 64 }
      ); // leg1
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 10, w: 16, h: 6 },
        { x: oi + 541, y: oo + 294, w: 32, h: 64 }
      ); // leg2
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 5, y: sy + 1, w: 1, h: 1 },
        { x: oi + 477, y: oo + 358, w: 8, h: 8 }
      ); // end1
      ctx.drawTextureLegacy(
        "Skin",
        { x: sx + 9, y: sy + 1, w: 1, h: 1 },
        { x: oi + 549, y: oo + 358, w: 8, h: 8 }
      ); // end2
    }
  };
  switch (props.tailType) {
    case 1: {
      const sx = 0;
      const sy = 16;
      const sx2 = 0;
      const sy2 = 32;
      const isArm = false;
      drawTail(sx, sy, isArm);
      if (!props.hideRightPant) {
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
      if (!props.hideLeftPant) {
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
      if (!props.hideRightSleeve) {
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
      if (!props.hideLeftSleeve) {
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
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 40, y: 241, w: 48, h: 128 }
  ); // left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 88, y: 241, w: 32, h: 128 }
  ); // middle
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 120, y: 241, w: 48, h: 128 }
  ); // right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 168, y: 241, w: 32, h: 128 }
  ); // top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 88, y: 193, w: 32, h: 48 }
  ); // front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 88, y: 369, w: 32, h: 48 },
    { flip: "Vertical" }
  ); // back
  if (!props.hideJacket) {
    // Jacket
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 40, y: 241, w: 48, h: 128 }
    ); // left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 88, y: 241, w: 32, h: 128 }
    ); // middle
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 120, y: 241, w: 48, h: 128 }
    ); // right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 168, y: 241, w: 32, h: 128 }
    ); // top
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 88, y: 193, w: 32, h: 48 }
    ); // front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 88, y: 369, w: 32, h: 48 },
      { flip: "Vertical" }
    ); // back
  }
  // Background
  ctx.drawImage("Background", [0, 0]);
  //Fold Lines
  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }
  // Labels
  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftCatCharacterGeneratorV2: GeneratorV2<MinecraftCatCharacterProps> =
  { id, name, images, textures, render };

// Behaviourally identical to the v1 `minecraft-cat-character` generator: the
// same reused `MinecraftSkinControl` skin picker (with model type) plus Show
// Folds/Show Labels toggles and seven clickable overlay regions (helmet,
// jacket, left/right sleeve, left/right pant, tail), driving the same
// body-part render. The author owns the state here and feeds the picker's
// outputs back — the loaded `Texture` via `dynamicTextures`, everything else
// via `props`.
function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);
  const [tailType, setTailType] = React.useState(1);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftCatCharacterProps = {
    isSlim,
    showFolds,
    showLabels,
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

  // The tail region cycles 1 -> 2 -> 3 -> 4 -> 1 (V1's `cycleTailTypes`) and is
  // deliberately not backed by a visible control: V1 never defined the
  // "Tail Type" select, so it's only reachable by clicking the tail region.
  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "helmet":
        setHideHelmet((v) => !v);
        break;
      case "jacket":
        setHideJacket((v) => !v);
        break;
      case "leftSleeve":
        setHideLeftSleeve((v) => !v);
        break;
      case "rightSleeve":
        setHideRightSleeve((v) => !v);
        break;
      case "leftPant":
        setHideLeftPant((v) => !v);
        break;
      case "rightPant":
        setHideRightPant((v) => !v);
        break;
      case "tail":
        setTailType((t) => (t === 4 ? 1 : t + 1));
        break;
    }
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
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
            generator={minecraftCatCharacterGeneratorV2}
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
