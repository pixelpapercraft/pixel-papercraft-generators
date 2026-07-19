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

import thumbnailImage from "../minecraftSquidCharacter/thumbnail/v3-thumbnail-256.jpeg";
import backgroundImage from "../minecraftSquidCharacter/images/Background.png";
import foldsImage from "../minecraftSquidCharacter/images/Folds.png";
import squidTexture from "../minecraftSquidCharacter/textures/Squid.png";

const id = "minecraft-squid-character";

const name = "Minecraft Squid Character";

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const history: HistoryDef = [
  "Originally developed by frownieman.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "18 Mar 2015 frownieman - Added compatibility to 1.8 skins.",
  "29 Sep 2020 NinjolasNJM - Fixed bottom texture rotations, and added the ability to choose which tentacle has which textures.",
  "Jul 2026 lostminer - Layout refresh.",
];

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
    id: "Squid",
    url: squidTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

type MinecraftSquidCharacterProps = {
  isSlimModel: boolean;
  showFolds: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  tentacles: readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
};

const render = (
  ctx: RenderContext,
  props: MinecraftSquidCharacterProps
): void => {
  const { isSlimModel, showFolds, hideHelmet, hideJacket } = props;
  const [tent1, tent2, tent3, tent4, tent5, tent6, tent7, tent8] =
    props.tentacles;

  // Tentacle Types

  const rightArmBase = (ox: number, oy: number) => {
    if (isSlimModel) {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 16, w: 3, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 20, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Right
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 20, w: 3, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 20, w: 4, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Left
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 20, w: 3, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 16, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top
    } else {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 16, w: 4, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 20, w: 16, h: 12 },
        { x: ox + 0, y: oy + 16, w: 64, h: 144 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 16, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top
    }
  };

  const leftArmBase = (ox: number, oy: number) => {
    if (isSlimModel) {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 39, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
      ctx.drawTextureLegacy(
        "Skin",
        { x: 32, y: 52, w: 4, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Right
      ctx.drawTextureLegacy(
        "Skin",
        { x: 36, y: 52, w: 3, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 39, y: 52, w: 4, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Left
      ctx.drawTextureLegacy(
        "Skin",
        { x: 43, y: 52, w: 3, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 36, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top
    } else {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
      ctx.drawTextureLegacy(
        "Skin",
        { x: 32, y: 52, w: 12, h: 12 },
        { x: ox + 16, y: oy + 16, w: 48, h: 144 }
      ); // Front
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back
      ctx.drawTextureLegacy(
        "Skin",
        { x: 36, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top
    }
  };

  const rightLegBase = (ox: number, oy: number) => {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 16, w: 4, h: 4 },
      { x: ox + 32, y: oy + 176, w: 16, h: 16 },
      { flip: "Vertical", rotateLegacy: 270.0 }
    ); // Bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 20, w: 16, h: 12 },
      { x: ox + 0, y: oy + 16, w: 64, h: 144 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 16, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 16, h: 16 },
      { rotateLegacy: 90.0 }
    ); // Top
  };

  const leftLegBase = (ox: number, oy: number) => {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 24, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 160, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 52, w: 12, h: 12 },
      { x: ox + 16, y: oy + 16, w: 48, h: 144 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 16, w: 16, h: 144 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 0, w: 16, h: 16 }
    ); // Top
  };

  const rightArm = (ox: number, oy: number) => {
    rightArmBase(ox, oy); // Base
    if (isSlimModel) {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Right Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Front Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Left Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Back Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top Overlay
    } else {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: ox + 32, y: oy + 176, w: 16, h: 16 },
        { flip: "Vertical", rotateLegacy: 270.0 }
      ); // Bottom Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 16, h: 12 },
        { x: ox + 0, y: oy + 16, w: 64, h: 144 }
      ); // Front Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: ox + 48, y: oy + 0, w: 16, h: 16 },
        { rotateLegacy: 90.0 }
      ); // Top Overlay
    }
  };

  const leftArm = (ox: number, oy: number) => {
    leftArmBase(ox, oy); // Base
    if (isSlimModel) {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: ox + 16, y: oy + 16, w: 16, h: 144 }
      ); // Right Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 12 },
        { x: ox + 32, y: oy + 16, w: 16, h: 144 }
      ); // Front Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 12 },
        { x: ox + 48, y: oy + 16, w: 16, h: 144 }
      ); // Left Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top Overlay
    } else {
      ctx.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 160, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 12, h: 12 },
        { x: ox + 16, y: oy + 16, w: 48, h: 144 }
      ); // Front Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 12 },
        { x: ox + 0, y: oy + 16, w: 16, h: 144 }
      ); // Back Overlay
      ctx.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: ox + 32, y: oy + 0, w: 16, h: 16 }
      ); // Top Overlay
    }
  };

  const rightLeg = (ox: number, oy: number) => {
    rightLegBase(ox, oy); // Base
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: ox + 32, y: oy + 176, w: 16, h: 16 },
      { flip: "Vertical", rotateLegacy: 270.0 }
    ); // Bottom Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 16, h: 12 },
      { x: ox + 0, y: oy + 16, w: 64, h: 144 }
    ); // Front Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: ox + 48, y: oy + 0, w: 16, h: 16 },
      { rotateLegacy: 90.0 }
    ); // Top Overlay
  };

  const leftLeg = (ox: number, oy: number) => {
    leftLegBase(ox, oy); // Base
    ctx.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: ox + 32, y: oy + 160, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 12, h: 12 },
      { x: ox + 16, y: oy + 16, w: 48, h: 144 }
    ); // Front Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: ox + 0, y: oy + 16, w: 16, h: 144 }
    ); // Back Overlay
    ctx.drawTextureLegacy(
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

  ctx.drawImage("Background", [0, 0]);

  ctx.defineRegion([67, 49, 384, 192], "hideHelmet");
  ctx.defineRegion([67, 241, 384, 128], "hideJacket");

  // Head
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 67, y: 145, w: 96, h: 96 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 163, y: 145, w: 96, h: 96 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 259, y: 145, w: 96, h: 96 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 355, y: 145, w: 96, h: 96 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 163, y: 49, w: 96, h: 96 }
  ); // Top

  if (!hideHelmet) {
    // Hat
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: 67, y: 145, w: 96, h: 96 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: 163, y: 145, w: 96, h: 96 }
    ); // Face
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: 259, y: 145, w: 96, h: 96 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: 355, y: 145, w: 96, h: 96 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 163, y: 49, w: 96, h: 96 }
    ); // Top
  }

  // Body

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 67, y: 241, w: 96, h: 32 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 163, y: 241, w: 96, h: 32 }
  ); // Front
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 259, y: 241, w: 96, h: 32 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 355, y: 241, w: 96, h: 32 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 163, y: 273, w: 96, h: 96 },
    { flip: "Vertical" }
  ); // Bottom

  if (!hideJacket) {
    // Body Overlay
    ctx.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 67, y: 241, w: 96, h: 32 }
    ); // Right
    ctx.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 163, y: 241, w: 96, h: 32 }
    ); // Front
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 259, y: 241, w: 96, h: 32 }
    ); // Left
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 355, y: 241, w: 96, h: 32 }
    ); // Back
    ctx.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 163, y: 273, w: 96, h: 96 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Tentacles

  // Tentacle 1

  ctx.defineRegion([471, 16, 64, 176], "tentacle1");

  drawTentacle(471, 16, tent1);

  // Tentacle 2

  ctx.defineRegion([471, 215, 64, 176], "tentacle2");

  drawTentacle(471, 215, tent2);

  // Tentacle 3

  ctx.defineRegion([470, 416, 64, 176], "tentacle3");

  drawTentacle(470, 416, tent3);

  // Tentacle 4

  ctx.defineRegion([376, 416, 64, 176], "tentacle4");

  drawTentacle(376, 416, tent4);

  // Tentacle 5

  ctx.defineRegion([280, 416, 64, 176], "tentacle5");

  drawTentacle(280, 416, tent5);

  // Tentacle 6

  ctx.defineRegion([196, 416, 64, 176], "tentacle6");

  drawTentacle(196, 416, tent6);

  // Tentacle 7

  ctx.defineRegion([109, 416, 64, 176], "tentacle7");

  drawTentacle(109, 416, tent7);

  // Tentacle 8

  ctx.defineRegion([15, 416, 64, 176], "tentacle8");

  drawTentacle(15, 416, tent8);

  // Remember to add back the overlay here

  // Mouth

  ctx.drawTexture("Squid", [27, 2, 6, 8], [187, 289, 48, 64]); // Mouth 1
  ctx.drawTexture("Squid", [26, 3, 8, 6], [179, 297, 64, 48]); // Mouth 2

  // Folds

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }
};

const minecraftSquidCharacterGeneratorV2: GeneratorV2<MinecraftSquidCharacterProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();
const cycleTentacleType = (value: number): number => (value % 8) + 1;

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [tentacle1, setTentacle1] = React.useState(5);
  const [tentacle2, setTentacle2] = React.useState(7);
  const [tentacle3, setTentacle3] = React.useState(3);
  const [tentacle4, setTentacle4] = React.useState(3);
  const [tentacle5, setTentacle5] = React.useState(3);
  const [tentacle6, setTentacle6] = React.useState(1);
  const [tentacle7, setTentacle7] = React.useState(1);
  const [tentacle8, setTentacle8] = React.useState(1);

  const rendererProps: MinecraftSquidCharacterProps = {
    isSlimModel: skinValue.modelType === "Slim",
    showFolds,
    hideHelmet,
    hideJacket,
    tentacles: [
      tentacle1,
      tentacle2,
      tentacle3,
      tentacle4,
      tentacle5,
      tentacle6,
      tentacle7,
      tentacle8,
    ],
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
      case "hideHelmet":
        setHideHelmet((value) => !value);
        break;
      case "hideJacket":
        setHideJacket((value) => !value);
        break;
      case "tentacle1":
        setTentacle1(cycleTentacleType);
        break;
      case "tentacle2":
        setTentacle2(cycleTentacleType);
        break;
      case "tentacle3":
        setTentacle3(cycleTentacleType);
        break;
      case "tentacle4":
        setTentacle4(cycleTentacleType);
        break;
      case "tentacle5":
        setTentacle5(cycleTentacleType);
        break;
      case "tentacle6":
        setTentacle6(cycleTentacleType);
        break;
      case "tentacle7":
        setTentacle7(cycleTentacleType);
        break;
      case "tentacle8":
        setTentacle8(cycleTentacleType);
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
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftSquidCharacterGeneratorV2}
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

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
