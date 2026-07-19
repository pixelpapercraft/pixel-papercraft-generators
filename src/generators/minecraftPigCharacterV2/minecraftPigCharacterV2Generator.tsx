"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type ImageDef,
  type HistoryDef,
  type TextureDef,
  type ThumbnailDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type RegionLegacy,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "../minecraftPigCharacter/thumbnail/v2-thumbnail-256.jpeg";
import backgroundSprites from "../minecraftPigCharacter/images/background-sprites.png";
import foldSprites from "../minecraftPigCharacter/images/fold-sprites.png";
import labelSprites from "../minecraftPigCharacter/images/label-sprites.png";
import titleSprites from "../minecraftPigCharacter/images/title-sprites.png";
import pigVanilla from "../minecraftPigCharacter/textures/vanilla/pig2.png";
import saddleVanilla from "../minecraftPigCharacter/textures/vanilla/pig_saddle2.png";
import saddleFaithful from "../minecraftPigCharacter/textures/faithful/saddle.png";
import saddleSpacePig from "../minecraftPigCharacter/textures/space-pig/saddle.png";
import diamondArmorVanilla from "../minecraftPigCharacter/textures/vanilla/diamond-armor.png";
import goldArmorVanilla from "../minecraftPigCharacter/textures/vanilla/gold-armor.png";
import chainmailArmorVanilla from "../minecraftPigCharacter/textures/vanilla/chainmail-armor.png";
import ironArmorVanilla from "../minecraftPigCharacter/textures/vanilla/iron-armor.png";
import diamondArmorFaithful from "../minecraftPigCharacter/textures/faithful/diamond-armor.png";
import goldArmorFaithful from "../minecraftPigCharacter/textures/faithful/gold-armor.png";
import chainmailArmorFaithful from "../minecraftPigCharacter/textures/faithful/chainmail-armor.png";
import ironArmorFaithful from "../minecraftPigCharacter/textures/faithful/iron-armor.png";
import armorSpacePig from "../minecraftPigCharacter/textures/space-pig/armor.png";

const id = "minecraft-pig-character-v2";

const name = "Minecraft Pig Character";

const history: HistoryDef = [
  "Originally developed by aaronhawksley.",
  "06 Feb 2015 lostminer: Add user variables.",
  "13 Feb 2015 lostminer: Update to use new version of generator.",
  "13 Sep 2020 NinjolasNJM: Updated to use 1.8+ Skins.",
  "23 Jul 2021 NinjolasNJM: Replaced generator with one derived from Pig Generator by TepigMC.",
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [];

const textures: TextureDef[] = [
  {
    id: "Background Sprites",
    url: backgroundSprites.src,
    standardWidth: 592,
    standardHeight: 608,
  },
  {
    id: "Fold Sprites",
    url: foldSprites.src,
    standardWidth: 600,
    standardHeight: 808,
  },
  {
    id: "Label Sprites",
    url: labelSprites.src,
    standardWidth: 208,
    standardHeight: 80,
  },
  {
    id: "Title Sprites",
    url: titleSprites.src,
    standardWidth: 294,
    standardHeight: 48,
  },
  {
    id: "Pig Texture",
    url: pigVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Vanilla)",
    url: saddleVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Vanilla) (Programmer Art)",
    url: saddleVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Faithful)",
    url: saddleFaithful.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Space Pig)",
    url: saddleSpacePig.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Diamond Armor (Vanilla)",
    url: diamondArmorVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Gold Armor (Vanilla)",
    url: goldArmorVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chainmail Armor (Vanilla)",
    url: chainmailArmorVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Iron Armor (Vanilla)",
    url: ironArmorVanilla.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Diamond Armor (Faithful)",
    url: diamondArmorFaithful.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Gold Armor (Faithful)",
    url: goldArmorFaithful.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chainmail Armor (Faithful)",
    url: chainmailArmorFaithful.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Iron Armor (Faithful)",
    url: ironArmorFaithful.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Armor (Space Pig)",
    url: armorSpacePig.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

type BgSprites = {
  body: RegionLegacy;
  boot: RegionLegacy;
  headAdvanced: RegionLegacy;
  headSimple: RegionLegacy;
  headStandardAdvanced: RegionLegacy;
  helmet: RegionLegacy;
  leg: RegionLegacy;
  nose3D: RegionLegacy;
  opaque: RegionLegacy;
  ultraMini: RegionLegacy;
};

type FoldSprites = {
  body: RegionLegacy;
  boot: RegionLegacy;
  headAdvanced: RegionLegacy;
  headAdvancedCuts: RegionLegacy;
  headSimple: RegionLegacy;
  headStandardAdvanced: RegionLegacy;
  helmet: RegionLegacy;
  leg: RegionLegacy;
  nose3D: RegionLegacy;
  saddle: RegionLegacy;
};

type LabelSprites = {
  bodyHead: RegionLegacy;
  bodyLeg1: RegionLegacy;
  bodyLeg2: RegionLegacy;
  bodyLeg3: RegionLegacy;
  bodyLeg4: RegionLegacy;
  head: RegionLegacy;
  headNose3D: RegionLegacy;
  headStandardAdvanced: RegionLegacy;
  leg0: RegionLegacy;
  leg1: RegionLegacy;
  leg2: RegionLegacy;
  leg3: RegionLegacy;
  leg4: RegionLegacy;
  nose3D: RegionLegacy;
};

type TitleSprites = {
  body: RegionLegacy;
  boot: RegionLegacy;
  head: RegionLegacy;
  helmet: RegionLegacy;
  leg: RegionLegacy;
  nose3D: RegionLegacy;
  pixelPapercraft: RegionLegacy;
  saddle: RegionLegacy;
  tepigmc: RegionLegacy;
  ultraMini: RegionLegacy;
};

type MinecraftPigCharacterProps = {
  isSlimModel: boolean;
  showFolds: boolean;
  showLabels: boolean;
  showTitles: boolean;
  transparentBackground: boolean;
  hideHelmetOverlay: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideLeftSleeve: boolean;
  hideRightSleeve: boolean;
  hideLeftPant: boolean;
  hideRightPant: boolean;
  separateSnout: boolean;
  headStyle: string;
  saddleStyle: string;
  helmetStyle: string;
  bootsStyle: string;
  showUltraMini: boolean;
};

const render = (
  ctx: RenderContext,
  props: MinecraftPigCharacterProps
): void => {
  // Input names

  const skinTexture = "Skin";
  const pigTexture = "Pig Texture";
  const saddleTexture = "Saddle";
  const armorTexture = "Armor (Layer 1)";
  const bgSprite = "Background Sprites";
  const foldSprite = "Fold Sprites";
  const labelSprite = "Label Sprites";
  const titleSprite = "Title Sprites";

  const bgSprites: BgSprites = {
    body: { w: 312, h: 304, x: 0, y: 0 },
    boot: { w: 152, h: 104, x: 280, y: 504 },
    headAdvanced: { w: 296, h: 176, x: 0, y: 304 },
    headSimple: { w: 280, h: 192, x: 312, y: 200 },
    headStandardAdvanced: { w: 280, h: 200, x: 312, y: 0 },
    helmet: { w: 280, h: 128, x: 0, y: 480 },
    leg: { w: 152, h: 160, x: 440, y: 392 },
    nose3D: { w: 80, h: 80, x: 296, y: 392 },
    opaque: { w: 32, h: 32, x: 296, y: 472 },
    ultraMini: { w: 36, h: 28, x: 328, y: 472 },
  };

  const foldSprites: FoldSprites = {
    body: { w: 312, h: 304, x: 0, y: 0 },
    boot: { w: 152, h: 104, x: 448, y: 448 },
    headAdvanced: { w: 296, h: 176, x: 0, y: 632 },
    headAdvancedCuts: { w: 296, h: 176, x: 304, y: 632 },
    headSimple: { w: 280, h: 192, x: 320, y: 256 },
    headStandardAdvanced: { w: 280, h: 200, x: 0, y: 304 },
    helmet: { w: 280, h: 128, x: 0, y: 504 },
    leg: { w: 152, h: 160, x: 280, y: 448 },
    nose3D: { w: 80, h: 80, x: 432, y: 552 },
    saddle: { w: 288, h: 256, x: 312, y: 0 },
  };

  const labelSprites: LabelSprites = {
    bodyHead: { w: 64, h: 48, x: 0, y: 0 },
    bodyLeg1: { w: 32, h: 32, x: 128, y: 0 },
    bodyLeg2: { w: 32, h: 32, x: 160, y: 0 },
    bodyLeg3: { w: 32, h: 24, x: 128, y: 32 },
    bodyLeg4: { w: 32, h: 24, x: 160, y: 32 },
    head: { w: 64, h: 48, x: 64, y: 0 },
    headNose3D: { w: 32, h: 24, x: 128, y: 56 },
    headStandardAdvanced: { w: 16, h: 48, x: 192, y: 0 },
    leg0: { w: 0, h: 0, x: 0, y: 0 },
    leg1: { w: 32, h: 32, x: 0, y: 48 },
    leg2: { w: 32, h: 32, x: 32, y: 48 },
    leg3: { w: 32, h: 32, x: 64, y: 48 },
    leg4: { w: 32, h: 32, x: 96, y: 48 },
    nose3D: { w: 32, h: 24, x: 160, y: 56 },
  };

  const titleSprites: TitleSprites = {
    body: { w: 46, h: 16, x: 34, y: 30 },
    boot: { w: 42, h: 14, x: 44, y: 16 },
    head: { w: 46, h: 14, x: 138, y: 0 },
    helmet: { w: 60, h: 14, x: 184, y: 0 },
    leg: { w: 34, h: 16, x: 0, y: 23 },
    nose3D: { w: 46, h: 14, x: 244, y: 0 },
    pixelPapercraft: { w: 208, h: 34, x: 86, y: 14 },
    saddle: { w: 64, h: 14, x: 74, y: 0 },
    tepigmc: { w: 74, h: 16, x: 0, y: 0 },
    ultraMini: { w: 44, h: 7, x: 0, y: 16 },
  };

  const isSlimModel = props.isSlimModel;
  const showFolds = props.showFolds;
  const showLabels = props.showLabels;
  const showTitles = props.showTitles;
  const isTransparent = props.transparentBackground;
  const hideHelmet = props.hideHelmet;
  const hideJacket = props.hideJacket;
  const hideLeftSleeve = props.hideLeftSleeve;
  const hideRightSleeve = props.hideRightSleeve;
  const hideLeftPant = props.hideLeftPant;
  const hideRightPant = props.hideRightPant;
  const hideHelmetOverlay = props.hideHelmetOverlay;
  const headStyle = props.headStyle;
  const noseStyle = props.separateSnout;
  const saddleStyle = props.saddleStyle;
  const helmetStyle = props.helmetStyle;
  const bootsStyle = props.bootsStyle;
  const showUltraMini = props.showUltraMini;
  const useSaddle = saddleStyle !== "None";
  const useHelmet = helmetStyle !== "None";
  const useBoots = bootsStyle !== "None";
  const simpleHead = headStyle === "Simple";
  const flatNose = !noseStyle;
  const standardAdvancedHead = headStyle === "Advanced (Standard)";
  const separateSaddle = saddleStyle === "Separate";
  const separateHelmet = helmetStyle === "Separate";
  const separateBoots = bootsStyle === "Separate";

  // Function to easily draw a section of a texture

  const drawSprite = (
    sprite: string,
    spriteJson: RegionLegacy,
    x: number,
    y: number
  ) => {
    ctx.drawTextureLegacy(
      sprite,
      { x: spriteJson.x, y: spriteJson.y, w: spriteJson.w, h: spriteJson.h },
      { x: x, y: y, w: spriteJson.w, h: spriteJson.h }
    );
  };

  // Function to easily draw a section of an image and stretch it

  const drawSpriteSized = (
    sprite: string,
    spriteJson: RegionLegacy,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.drawTextureLegacy(
      sprite,
      { x: spriteJson.x, y: spriteJson.y, w: spriteJson.w, h: spriteJson.h },
      { x: x, y: y, w: width, h: height }
    );
  };

  // Head Functions

  const drawHeadAdvancedShape = (
    texture: string,
    x: number,
    y: number,
    tx: number,
    ty: number
  ) => {
    ctx.drawTextureLegacy(
      texture,
      { x: tx, y: ty + 8, w: 8, h: 2 },
      { x: x, y: y + 64, w: 64, h: 16 }
    ); // Right 1
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 2, y: ty + 10, w: 6, h: 6 },
      { x: x + 16, y: y + 80, w: 48, h: 48 }
    ); // Right 2
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty + 8, w: 8, h: 8 },
      { x: x + 64, y: y + 64, w: 64, h: 64 }
    ); // Face
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 8, w: 8, h: 2 },
      { x: x + 128, y: y + 64, w: 64, h: 16 }
    ); // Left 1
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 10, w: 6, h: 6 },
      { x: x + 128, y: y + 80, w: 48, h: 48 }
    ); // Left 2
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty, w: 8, h: 8 },
      { x: x + 64, y: y, w: 64, h: 64 }
    ); // Top
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 2, w: 8, h: 6 },
      { x: x + 64, y: y + 128, w: 64, h: 48 },
      { flip: "Vertical" }
    ); // Bottom
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 24, y: ty + 8, w: 8, h: 2 },
      { x: x + 192, y: y + 64, w: 64, h: 16 }
    ); // Back 1
    if (!standardAdvancedHead) {
      ctx.drawTextureLegacy(
        texture,
        { x: tx + 24, y: ty + 10, w: 8, h: 6 },
        { x: x + 176, y: y + 80, w: 64, h: 48 }
      ); // Back 2
      ctx.drawTextureLegacy(
        texture,
        { x: tx + 24, y: ty + 10, w: 8, h: 2 },
        { x: x, y: y + 144, w: 64, h: 16 },
        { rotateLegacy: 270.0 }
      );
    }
  };

  const drawHeadAdvanced = (
    texture: string,
    x: number,
    y: number,
    isHelmet: boolean,
    drawLabels: boolean,
    showSecondLayer: boolean
  ) => {
    if (!isHelmet) {
      if (!standardAdvancedHead) {
        drawSprite(bgSprite, bgSprites.headAdvanced, x, y);
      } else {
        drawSprite(bgSprite, bgSprites.headStandardAdvanced, x + 16, y);
      }
    }
    drawHeadAdvancedShape(texture, x + 16, y, 0, 0);
    if (showSecondLayer) {
      drawHeadAdvancedShape(texture, x + 16, y, 32, 0);
    }
    if (!standardAdvancedHead) {
      drawSprite(foldSprite, foldSprites.headAdvancedCuts, x, y);
      if (showFolds) {
        drawSprite(foldSprite, foldSprites.headAdvanced, x, y);
      }
    } else if (showFolds) {
      drawSprite(foldSprite, foldSprites.headStandardAdvanced, x + 16, y);
    }
    if (drawLabels && showLabels) {
      if (!standardAdvancedHead) {
        drawSprite(labelSprite, labelSprites.head, x + 192, y + 80);
      } else {
        drawSprite(
          labelSprite,
          labelSprites.headStandardAdvanced,
          x + 16,
          y + 80
        );
        drawSprite(
          labelSprite,
          labelSprites.headStandardAdvanced,
          x + 192,
          y + 80
        );
      }
      if (!flatNose) {
        drawSprite(labelSprite, labelSprites.headNose3D, x + 96, y + 104);
      }
      if (showTitles) {
        drawSprite(titleSprite, titleSprites.head, x + 22, y + 12);
      }
    }
  };

  const drawHeadSimpleShape = (
    texture: string,
    x: number,
    y: number,
    textureOffsetX: number
  ) => {
    ctx.drawTextureLegacy(
      texture,
      { x: textureOffsetX, y: 8, w: 8, h: 8 },
      { x: x, y: y + 64, w: 64, h: 64 }
    ); // Right
    ctx.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 8, y: 8, w: 8, h: 8 },
      { x: x + 64, y: y + 64, w: 64, h: 64 }
    ); // Face
    ctx.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 16, y: 8, w: 8, h: 8 },
      { x: x + 128, y: y + 64, w: 64, h: 64 }
    ); // Left
    ctx.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 24, y: 8, w: 8, h: 8 },
      { x: 256, y: y + 64, w: 64, h: 64 }
    ); // Back
    ctx.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 8, y: 0, w: 8, h: 8 },
      { x: x + 64, y: y, w: 64, h: 64 }
    ); // Top
    ctx.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 16, y: 0, w: 8, h: 8 },
      { x: x + 64, y: y + 128, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom
  };

  const drawHeadSimple = (
    texture: string,
    x: number,
    y: number,
    isHelmet: boolean,
    drawLabels: boolean,
    showSecondLayer: boolean
  ) => {
    if (!isHelmet) {
      drawSprite(bgSprite, bgSprites.headSimple, x, y);
    }
    drawHeadSimpleShape(texture, x, y, 0);
    if (showSecondLayer) {
      drawHeadSimpleShape(texture, x, y, 32);
    }
    if (showFolds) {
      drawSprite(foldSprite, foldSprites.headSimple, x, y);
    }
    if (drawLabels) {
      if (showLabels) {
        drawSprite(labelSprite, labelSprites.head, x + 192, y + 88);
        if (!flatNose) {
          drawSprite(labelSprite, labelSprites.headNose3D, x + 80, y + 104);
        }
      }
      if (showTitles) {
        drawSprite(titleSprite, titleSprites.head, x + 6, y + 12);
      }
    }
  };

  // Nose Functions

  const drawNose3D = (pig: string, x: number, y: number) => {
    drawSprite(bgSprite, bgSprites.nose3D, x, y);
    ctx.drawTextureLegacy(
      pig,
      { x: 16, y: 17, w: 1, h: 3 },
      { x: x + 16, y: y + 32, w: 8, h: 24 }
    ); // Right
    ctx.drawTextureLegacy(
      pig,
      { x: 17, y: 17, w: 4, h: 3 },
      { x: x + 24, y: y + 32, w: 32, h: 24 }
    ); // Center
    ctx.drawTextureLegacy(
      pig,
      { x: 21, y: 17, w: 1, h: 3 },
      { x: x + 56, y: y + 32, w: 8, h: 24 }
    ); // Left
    ctx.drawTextureLegacy(
      pig,
      { x: 10, y: 12, w: 4, h: 3 },
      { x: x + 24, y: y, w: 32, h: 24 },
      { flip: "Vertical" }
    ); // Back
    ctx.drawTextureLegacy(
      pig,
      { x: 17, y: 16, w: 4, h: 1 },
      { x: x + 24, y: y + 24, w: 32, h: 8 }
    ); // Top
    ctx.drawTextureLegacy(
      pig,
      { x: 21, y: 16, w: 4, h: 1 },
      { x: x + 24, y: y + 56, w: 32, h: 8 },
      { flip: "Vertical" }
    ); // Bottom
    if (showFolds) {
      drawSprite(foldSprite, foldSprites.nose3D, x, y);
    }
    if (showLabels) {
      drawSprite(labelSprite, labelSprites.nose3D, x + 24, y);
    }
    if (showTitles) {
      drawSprite(titleSprite, titleSprites.nose3D, x + 68, y + 6);
    }
  };

  const drawNoseFlat = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 17, y: 17, w: 4, h: 3 },
      { x: x + 80, y: y + 96, w: 32, h: 24 }
    );
  };

  // Body Function

  const drawBody = (
    texture: string,
    x: number,
    y: number,
    isSaddle: boolean,
    drawLabels: boolean,
    showSecondLayer: boolean
  ) => {
    const drawLayer = (
      texture: string,
      sx: number,
      sy: number,
      x: number,
      y: number,
      isSaddle: boolean,
      isFirstLayer: boolean
    ) => {
      if (!isSaddle) {
        if (isFirstLayer) {
          drawSprite(bgSprite, bgSprites.body, x, y);
        }
        ctx.drawTextureLegacy(
          texture,
          { x: sx, y: sy + 4, w: 4, h: 12 },
          { x: x, y: y + 88, w: 64, h: 128 }
        ); // Right
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy + 4, w: 8, h: 12 },
          { x: x + 64, y: y + 88, w: 80, h: 128 }
        ); // Bottom
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 12, y: sy + 4, w: 4, h: 12 },
          { x: x + 144, y: y + 88, w: 64, h: 128 }
        ); // Left
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 16, y: sy + 4, w: 8, h: 12 },
          { x: x + 208, y: y + 88, w: 80, h: 128 }
        ); // Top
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy, w: 8, h: 4 },
          { x: x + 64, y: y + 24, w: 80, h: 64 }
        ); // Front
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 12, y: sy, w: 8, h: 4 },
          { x: x + 64, y: y + 216, w: 80, h: 64 },
          { flip: "Vertical" }
        ); // Back
      } else {
        ctx.drawTextureLegacy(
          texture,
          { x: 28, y: 16, w: 8, h: 16 },
          { x: x, y: y + 88, w: 64, h: 128 }
        ); // Right
        ctx.drawTextureLegacy(
          texture,
          { x: 36, y: 16, w: 10, h: 16 },
          { x: x + 64, y: y + 88, w: 80, h: 128 }
        ); // Bottom
        ctx.drawTextureLegacy(
          texture,
          { x: 46, y: 16, w: 8, h: 16 },
          { x: x + 144, y: y + 88, w: 64, h: 128 }
        ); // Left
        ctx.drawTextureLegacy(
          texture,
          { x: 54, y: 16, w: 10, h: 16 },
          { x: x + 208, y: y + 88, w: 80, h: 128 }
        ); // Top
        ctx.drawTextureLegacy(
          texture,
          { x: 36, y: 8, w: 10, h: 8 },
          { x: x + 64, y: y + 24, w: 80, h: 64 }
        ); // Front
        ctx.drawTextureLegacy(
          texture,
          { x: 46, y: 8, w: 10, h: 8 },
          { x: x + 64, y: y + 216, w: 80, h: 64 },
          { flip: "Vertical" }
        ); // Back
      }
    };

    drawLayer(texture, 16, 16, x, y, isSaddle, true); // First Layer

    if (showSecondLayer) {
      drawLayer(texture, 16, 32, x, y, isSaddle, false); // Second Layer
    }

    if (showFolds) {
      drawSprite(foldSprite, foldSprites.body, x, y);
    }

    if (drawLabels) {
      if (showLabels) {
        drawSprite(labelSprite, labelSprites.bodyHead, x + 72, y + 24);
        drawSprite(labelSprite, labelSprites.bodyLeg1, x + 64, y + 96);
        drawSprite(labelSprite, labelSprites.bodyLeg2, x + 112, y + 96);
        drawSprite(labelSprite, labelSprites.bodyLeg3, x + 64, y + 192);
        drawSprite(labelSprite, labelSprites.bodyLeg4, x + 112, y + 192);
      }
      if (showTitles) {
        drawSprite(titleSprite, titleSprites.body, x + 6, y + 36);
      }
    }
  };

  // Leg Function

  const drawLeg = (
    texture: string,
    sx: number,
    sy: number,
    ox: number,
    oy: number,
    dx: number,
    dy: number,
    labelID: number,
    showSecondLayer: boolean,
    isSlimModel: boolean
  ) => {
    drawSprite(bgSprite, bgSprites.leg, dx, dy);
    const drawLayer = (
      texture: string,
      sx: number,
      sy: number,
      dx: number,
      dy: number,
      isSlimModel: boolean
    ) => {
      if (isSlimModel) {
        ctx.drawTextureLegacy(
          texture,
          { x: sx, y: sy + 4, w: 4, h: 12 },
          { x: dx, y: dy + 56, w: 32, h: 48 }
        ); // Right
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy + 4, w: 3, h: 12 },
          { x: dx + 32, y: dy + 56, w: 32, h: 48 }
        ); // Front
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 7, y: sy + 4, w: 4, h: 12 },
          { x: dx + 64, y: dy + 56, w: 32, h: 48 }
        ); // Left
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 11, y: sy + 4, w: 3, h: 12 },
          { x: dx + 96, y: dy + 56, w: 32, h: 48 }
        ); // Back
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy, w: 3, h: 4 },
          { x: dx + 32, y: dy + 24, w: 32, h: 32 }
        ); // Top
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 7, y: sy, w: 3, h: 4 },
          { x: dx + 32, y: dy + 104, w: 32, h: 32 },
          { flip: "Vertical" }
        ); // Bottom
      } else {
        ctx.drawTextureLegacy(
          texture,
          { x: sx, y: sy + 4, w: 4, h: 12 },
          { x: dx, y: dy + 56, w: 32, h: 48 }
        ); // Right
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy + 4, w: 4, h: 12 },
          { x: dx + 32, y: dy + 56, w: 32, h: 48 }
        ); // Front
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 8, y: sy + 4, w: 4, h: 12 },
          { x: dx + 64, y: dy + 56, w: 32, h: 48 }
        ); // Left
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 12, y: sy + 4, w: 4, h: 12 },
          { x: dx + 96, y: dy + 56, w: 32, h: 48 }
        ); // Back
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy, w: 4, h: 4 },
          { x: dx + 32, y: dy + 24, w: 32, h: 32 }
        ); // Top
        ctx.drawTextureLegacy(
          texture,
          { x: sx + 8, y: sy, w: 4, h: 4 },
          { x: dx + 32, y: dy + 104, w: 32, h: 32 },
          { flip: "Vertical" }
        ); // Bottom
      }
    };
    drawLayer(texture, sx, sy, dx, dy, isSlimModel); // First Layer
    if (showSecondLayer) {
      drawLayer(texture, ox, oy, dx, dy, isSlimModel); // Second Layer
    }
    if (showFolds) {
      drawSprite(foldSprite, foldSprites.leg, dx, dy);
    }
    const init: RegionLegacy = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    let sprite = init;

    if (labelID == 0) {
      sprite = labelSprites.leg0;
    }
    if (labelID == 1) {
      sprite = labelSprites.leg1;
    }
    if (labelID == 2) {
      sprite = labelSprites.leg2;
    }
    if (labelID == 3) {
      sprite = labelSprites.leg3;
    }
    if (labelID == 4) {
      sprite = labelSprites.leg4;
    }

    if (showLabels) {
      drawSprite(labelSprite, sprite, dx + 32, dy + 24);
    }
    if (showTitles) {
      drawSprite(titleSprite, titleSprites.leg, dx + 76, dy + 4);
    }
  };

  // Saddle Function (only for separate saddle)

  const drawSaddleSeparate = (texture: string, x: number, y: number) => {
    // Top
    ctx.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x, y: y, w: 40, h: 128 }
    ); // Bottom Left
    ctx.drawTextureLegacy(
      texture,
      { x: 46, y: 16, w: 8, h: 16 },
      { x: x + 40, y: y, w: 64, h: 128 }
    ); // Left
    ctx.drawTextureLegacy(
      texture,
      { x: 54, y: 16, w: 10, h: 16 },
      { x: x + 104, y: y, w: 80, h: 128 }
    ); // Top
    ctx.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 16 },
      { x: x + 184, y: y, w: 64, h: 128 }
    ); // Right
    ctx.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x + 248, y: y, w: 40, h: 128 }
    ); // Bottom Right
    // Bottom
    ctx.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x, y: y + 128, w: 40, h: 128 },
      { flip: "Vertical" }
    ); // Bottom Left
    ctx.drawTextureLegacy(
      texture,
      { x: 46, y: 16, w: 8, h: 16 },
      { x: x + 40, y: y + 128, w: 64, h: 128 },
      { flip: "Vertical" }
    ); // Left
    ctx.drawTextureLegacy(
      texture,
      { x: 54, y: 16, w: 10, h: 16 },
      { x: x + 104, y: y + 128, w: 80, h: 128 },
      { flip: "Vertical" }
    ); // Top
    ctx.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 16 },
      { x: x + 184, y: y + 128, w: 64, h: 128 },
      { flip: "Vertical" }
    ); // Right
    ctx.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x + 248, y: y + 128, w: 40, h: 128 },
      { flip: "Vertical" }
    ); // Bottom Right
    if (showFolds) {
      drawSprite(foldSprite, foldSprites.saddle, x, y);
    }
    if (showTitles) {
      drawSprite(titleSprite, titleSprites.saddle, x, y - 26);
    }
  };

  const drawHelmetSeparateShape = (
    texture: string,
    x: number,
    y: number,
    tx: number,
    ty: number
  ) => {
    ctx.drawTextureLegacy(
      texture,
      { x: tx, y: ty + 8, w: 8, h: 3 },
      { x: x, y: y + 64, w: 64, h: 24 }
    ); // Right 1
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 2, y: ty + 11, w: 6, h: 5 },
      { x: x + 16, y: y + 88, w: 48, h: 40 }
    ); // Right 2
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty + 8, w: 8, h: 8 },
      { x: x + 64, y: y + 64, w: 64, h: 64 }
    ); // Face
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 8, w: 8, h: 3 },
      { x: x + 128, y: y + 64, w: 64, h: 24 }
    ); // Left 1
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 11, w: 6, h: 5 },
      { x: x + 128, y: y + 88, w: 48, h: 40 }
    ); // Left 2
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 24, y: ty + 8, w: 8, h: 3 },
      { x: x + 192, y: y + 64, w: 64, h: 24 }
    ); // Back
    ctx.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty, w: 8, h: 8 },
      { x: x + 64, y: y, w: 64, h: 64 }
    ); // Top
  };

  // Helmet Functions (only for separate helmet)

  const drawHelmetSeparate = (texture: string, x: number, y: number) => {
    drawSprite(bgSprite, bgSprites.helmet, x, y);
    drawHelmetSeparateShape(texture, x, y, 0, 0);
    if (!hideHelmetOverlay) {
      drawHelmetSeparateShape(texture, x, y, 32, 0);
    }
    if (showFolds) {
      drawSprite(foldSprite, foldSprites.helmet, x, y);
    }
    if (showTitles) {
      drawSprite(titleSprite, titleSprites.helmet, x - 8, y + 12);
    }
  };

  // Boot Function

  const drawBoot = (
    texture: string,
    x: number,
    y: number,
    separate: boolean
  ) => {
    if (separate) {
      drawSprite(bgSprite, bgSprites.boot, x, y);
    }
    ctx.drawTextureLegacy(
      texture,
      { x: 0, y: 26, w: 4, h: 6 },
      { x: x, y: y + 0, w: 32, h: 48 }
    ); // Right
    ctx.drawTextureLegacy(
      texture,
      { x: 4, y: 26, w: 4, h: 6 },
      { x: x + 32, y: y + 0, w: 32, h: 48 }
    ); // Front
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 26, w: 4, h: 6 },
      { x: x + 64, y: y + 0, w: 32, h: 48 }
    ); // Left
    ctx.drawTextureLegacy(
      texture,
      { x: 12, y: 26, w: 4, h: 6 },
      { x: x + 96, y: y + 0, w: 32, h: 48 }
    ); // Back
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 32, y: y + 48, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
    if (showFolds) {
      drawSprite(foldSprite, foldSprites.boot, x, y);
    }
    if (separate && showTitles) {
      drawSprite(titleSprite, titleSprites.boot, x, y - 26);
    }
  };

  const drawUltraMiniBody = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 16, y: 20, w: 4, h: 12 },
      { x: x + 8, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Right
    ctx.drawTextureLegacy(
      texture,
      { x: 20, y: 20, w: 8, h: 12 },
      { x: x + 32, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Top
    ctx.drawTextureLegacy(
      texture,
      { x: 28, y: 20, w: 4, h: 12 },
      { x: x + 24, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Left
    ctx.drawTextureLegacy(
      texture,
      { x: 32, y: 20, w: 8, h: 12 },
      { x: x + 16, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Bottom
    if (!hideJacket) {
      ctx.drawTextureLegacy(
        texture,
        { x: 16, y: 36, w: 4, h: 12 },
        { x: x + 8, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Right Overlay
      ctx.drawTextureLegacy(
        texture,
        { x: 20, y: 36, w: 8, h: 12 },
        { x: x + 32, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Top Overlay
      ctx.drawTextureLegacy(
        texture,
        { x: 28, y: 36, w: 4, h: 12 },
        { x: x + 24, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Left Overlay
      ctx.drawTextureLegacy(
        texture,
        { x: 32, y: 36, w: 8, h: 12 },
        { x: x + 16, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Bottom Overlay
    }
  };

  const drawUltraMiniSaddle = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 16 },
      { x: x + 8, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Right
    ctx.drawTextureLegacy(
      texture,
      { x: 36, y: 16, w: 10, h: 16 },
      { x: x + 32, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Top
    ctx.drawTextureLegacy(
      texture,
      { x: 46, y: 16, w: 8, h: 16 },
      { x: x + 24, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Left
    ctx.drawTextureLegacy(
      texture,
      { x: 54, y: 16, w: 10, h: 16 },
      { x: x + 16, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Bottom
  };

  const drawUltraMiniLegs = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 24, y: 48, w: 4, h: 4 },
      { x: x + 24, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 4
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 3
    ctx.drawTextureLegacy(
      texture,
      { x: 40, y: 48, w: 4, h: 4 },
      { x: x + 24, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 2
    ctx.drawTextureLegacy(
      texture,
      { x: 48, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 1
    // Overlays
    if (!hideLeftPant) {
      ctx.drawTextureLegacy(
        texture,
        { x: 8, y: 48, w: 4, h: 4 },
        { x: x + 24, y: y + 8, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 4 Overlay
    }
    if (!hideRightPant) {
      ctx.drawTextureLegacy(
        texture,
        { x: 8, y: 32, w: 4, h: 4 },
        { x: x + 29, y: y + 8, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 3 Overlay
    }
    if (!hideLeftSleeve) {
      ctx.drawTextureLegacy(
        texture,
        { x: 56, y: 48, w: 4, h: 4 },
        { x: x + 24, y: y + 17, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 2 Overlay
    }
    if (!hideRightSleeve) {
      ctx.drawTextureLegacy(
        texture,
        { x: 48, y: 32, w: 4, h: 4 },
        { x: x + 29, y: y + 17, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 1 Overlay
    }
  };

  const drawUltraMiniBoots = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 24, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 4
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 3
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 24, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 2
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 1
  };

  const drawUltraMiniEnds = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 8, w: 8, h: 8 },
      { x: x + 8, y: y + 20, w: 8, h: 8 }
    ); // Face
    if (!hideHelmet) {
      ctx.drawTextureLegacy(
        texture,
        { x: 40, y: 8, w: 8, h: 8 },
        { x: x + 8, y: y + 20, w: 8, h: 8 }
      ); // Face Overlay
    }
    ctx.drawTextureLegacy(
      pigTexture,
      { x: 17, y: 17, w: 4, h: 3 },
      { x: x + 10, y: y + 25, w: 4, h: 3 }
    ); // Nose
    ctx.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 4 },
      { x: x + 8, y: y, w: 8, h: 8 },
      { flip: "Vertical" }
    ); // Back
    if (!hideJacket) {
      ctx.drawTextureLegacy(
        texture,
        { x: 28, y: 32, w: 8, h: 4 },
        { x: x + 8, y: y, w: 8, h: 8 },
        { flip: "Vertical" }
      ); // Back Overlay
    }
  };

  const drawUltraMiniHelmet = (texture: string, x: number, y: number) => {
    ctx.drawTextureLegacy(
      texture,
      { x: 8, y: 8, w: 8, h: 8 },
      { x: x + 8, y: y + 20, w: 8, h: 8 }
    ); // Front
    if (!hideHelmetOverlay) {
      ctx.drawTextureLegacy(
        texture,
        { x: 40, y: 8, w: 8, h: 8 },
        { x: x + 8, y: y + 20, w: 8, h: 8 }
      ); // Front Overlay
    }
  };

  // Ultra Mini Functions

  const drawUltraMini = (x: number, y: number) => {
    drawSprite(bgSprite, bgSprites.ultraMini, x, y);
    drawUltraMiniBody(skinTexture, x, y);
    drawUltraMiniLegs(skinTexture, x, y);
    drawUltraMiniEnds(skinTexture, x, y);
    if (useSaddle) {
      drawUltraMiniSaddle(saddleTexture, x, y);
    }
    if (useHelmet) {
      drawUltraMiniHelmet(armorTexture, x, y);
    }
    if (useBoots) {
      drawUltraMiniBoots(armorTexture, x, y);
    }
    if (showTitles) {
      drawSprite(titleSprite, titleSprites.ultraMini, x - 8, y - 15);
    }
  };

  // Function to draw TepigMC and Pixel Papercraft

  const drawCredits = () => {
    drawSprite(titleSprite, titleSprites.tepigmc, 19, 805); // TepigMC
    drawSprite(titleSprite, titleSprites.pixelPapercraft, 368, 788); // Pixel Papercraft
  };

  // Opaque Background Function

  const drawOpaque = () => {
    if (!isTransparent) {
      drawSpriteSized(bgSprite, bgSprites.opaque, 0, 0, 595, 842);
    }
  };

  ///// PAGE 1 - Pig /////

  ctx.usePage("Pig");

  drawOpaque();
  drawCredits();

  // Define Region Inputs

  ctx.defineRegion([64, 96, 256, 192], "hideHelmet");
  ctx.defineRegion([56, 328, 288, 256], "hideJacket");
  ctx.defineRegion([392, 312, 128, 112], "hideLeftSleeve");
  ctx.defineRegion([392, 128, 128, 112], "hideRightSleeve");
  ctx.defineRegion([240, 608, 128, 112], "hideLeftPant");
  ctx.defineRegion([392, 496, 128, 112], "hideRightPant");

  if (simpleHead) {
    drawHeadSimple(
      skinTexture,
      64,
      96,
      false,
      !useHelmet || separateHelmet,
      !hideHelmet
    ); // Head
  } else {
    drawHeadAdvanced(
      skinTexture,
      48,
      96,
      false,
      !useHelmet || separateHelmet,
      !hideHelmet
    ); // Head
  }

  drawBody(
    skinTexture,
    56,
    304,
    false,
    !useSaddle || separateSaddle,
    !hideJacket
  ); // Body
  drawLeg(
    skinTexture,
    40,
    16,
    40,
    32,
    392,
    104,
    1,
    !hideRightSleeve,
    isSlimModel
  ); // Right Arm
  drawLeg(
    skinTexture,
    32,
    48,
    48,
    48,
    392,
    288,
    2,
    !hideLeftSleeve,
    isSlimModel
  ); // Left Arm
  drawLeg(skinTexture, 0, 16, 0, 32, 392, 472, 3, !hideRightPant, false); // Right Leg
  drawLeg(skinTexture, 16, 48, 0, 48, 240, 584, 4, !hideLeftPant, false); // Left Leg

  if (flatNose) {
    drawNoseFlat(pigTexture, 64, 104);
  } else {
    drawNose3D(pigTexture, 248, 272);
  }

  // Draw the accessories on the pig

  if (useHelmet && !separateHelmet) {
    ctx.defineRegion([128, 32, 64, 64], "hideHelmetOverlay");
    if (simpleHead) {
      drawHeadSimple(armorTexture, 64, 96, true, true, !hideHelmetOverlay);
    } else {
      drawHeadAdvanced(armorTexture, 48, 96, true, true, !hideHelmetOverlay);
    }
  }

  if (useSaddle && !separateSaddle) {
    drawBody(saddleTexture, 56, 304, true, true, false);
  }

  if (useBoots && !separateBoots) {
    drawBoot(armorTexture, 392, 160, false);
    drawBoot(armorTexture, 392, 344, false);
    drawBoot(armorTexture, 392, 528, false);
    drawBoot(armorTexture, 240, 640, false);
  }

  if (showUltraMini) {
    drawUltraMini(120, 650);
  }

  ///// PAGE 2 - Accessories /////

  if (
    (useSaddle && separateSaddle) ||
    (useHelmet && separateHelmet) ||
    (useBoots && separateBoots)
  ) {
    // Only use if needed
    ctx.usePage("Accessories");

    drawOpaque();
    drawCredits();

    if (useSaddle && separateSaddle) {
      drawSaddleSeparate(saddleTexture, 56, 328);
    }

    if (useHelmet && separateHelmet) {
      ctx.defineRegion([64, 96, 256, 192], "hideHelmetOverlay");
      drawHelmetSeparate(armorTexture, 64, 96);
    }

    if (useBoots && separateBoots) {
      drawBoot(armorTexture, 392, 160, true);
      drawBoot(armorTexture, 392, 344, true);
      drawBoot(armorTexture, 392, 528, true);
      drawBoot(armorTexture, 240, 640, true);
    }
  }
};

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();
const saddleChoices = [
  "Saddle (Vanilla)",
  "Saddle (Vanilla) (Programmer Art)",
  "Saddle (Faithful)",
  "Saddle (Space Pig)",
];
const armorChoices = [
  "Diamond Armor (Vanilla)",
  "Gold Armor (Vanilla)",
  "Chainmail Armor (Vanilla)",
  "Iron Armor (Vanilla)",
  "Diamond Armor (Faithful)",
  "Gold Armor (Faithful)",
  "Chainmail Armor (Faithful)",
  "Iron Armor (Faithful)",
  "Armor (Space Pig)",
];
const options = (values: string[]) =>
  values.map((value) => ({ id: value, label: value }));

const minecraftPigGeneratorV2: GeneratorV2<MinecraftPigCharacterProps> = {
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
  const [skin, setSkin] = React.useState<Texture | null>(null);
  const [saddle, setSaddle] = React.useState<Texture | null>(null);
  const [armor, setArmor] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [showTitles, setShowTitles] = React.useState(true);
  const [transparentBackground, setTransparentBackground] =
    React.useState(false);
  const [showUltraMini, setShowUltraMini] = React.useState(true);
  const [hideHelmetOverlay, setHideHelmetOverlay] = React.useState(false);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);
  const [separateSnout, setSeparateSnout] = React.useState(true);
  const [headStyle, setHeadStyle] = React.useState("Simple");
  const [saddleStyle, setSaddleStyle] = React.useState("Attached");
  const [helmetStyle, setHelmetStyle] = React.useState("Attached");
  const [bootsStyle, setBootsStyle] = React.useState("Attached");

  const rendererProps: MinecraftPigCharacterProps = {
    isSlimModel: skinValue.modelType === "Slim",
    showFolds,
    showLabels,
    showTitles,
    transparentBackground,
    showUltraMini,
    hideHelmetOverlay,
    hideHelmet,
    hideJacket,
    hideLeftSleeve,
    hideRightSleeve,
    hideLeftPant,
    hideRightPant,
    separateSnout,
    headStyle,
    saddleStyle,
    helmetStyle,
    bootsStyle,
  };
  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (skin) map.set("Skin", skin);
    if (saddle) map.set("Saddle", saddle);
    if (armor) map.set("Armor (Layer 1)", armor);
    return map;
  }, [skin, saddle, armor]);
  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "hideHelmet":
        setHideHelmet((value) => !value);
        break;
      case "hideJacket":
        setHideJacket((value) => !value);
        break;
      case "hideLeftSleeve":
        setHideLeftSleeve((value) => !value);
        break;
      case "hideRightSleeve":
        setHideRightSleeve((value) => !value);
        break;
      case "hideLeftPant":
        setHideLeftPant((value) => !value);
        break;
      case "hideRightPant":
        setHideRightPant((value) => !value);
        break;
      case "hideHelmetOverlay":
        setHideHelmetOverlay((value) => !value);
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
              onChange={setSkin}
            />
            <GeneratorUI.LoadedTextureControl
              id="Saddle"
              definitions={textures}
              choices={saddleChoices}
              standardWidth={64}
              standardHeight={32}
              onChange={setSaddle}
            />
            <GeneratorUI.LoadedTextureControl
              id="Armor (Layer 1)"
              definitions={textures}
              choices={armorChoices}
              standardWidth={64}
              standardHeight={32}
              onChange={setArmor}
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
              label="Show Titles"
              checked={showTitles}
              onCheckedChange={setShowTitles}
            />
            <GeneratorUI.BooleanControl
              label="Transparent Background"
              checked={transparentBackground}
              onCheckedChange={setTransparentBackground}
            />
            <GeneratorUI.BooleanControl
              label="Separate Snout"
              checked={separateSnout}
              onCheckedChange={setSeparateSnout}
            />
            <GeneratorUI.SelectControl
              label="Head Style"
              options={options(["Simple", "Advanced", "Advanced (Standard)"])}
              value={headStyle}
              onValueChange={setHeadStyle}
            />
            <GeneratorUI.SelectControl
              label="Saddle Style"
              options={options(["Attached", "Separate"])}
              value={saddleStyle}
              onValueChange={setSaddleStyle}
            />
            <GeneratorUI.SelectControl
              label="Helmet Style"
              options={options(["Attached", "Separate"])}
              value={helmetStyle}
              onValueChange={setHelmetStyle}
            />
            <GeneratorUI.SelectControl
              label="Boots Style"
              options={options(["Attached", "Separate"])}
              value={bootsStyle}
              onValueChange={setBootsStyle}
            />
            <GeneratorUI.BooleanControl
              label="Show Ultra Mini"
              checked={showUltraMini}
              onCheckedChange={setShowUltraMini}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftPigGeneratorV2}
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
