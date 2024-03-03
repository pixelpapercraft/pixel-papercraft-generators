"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import {
  type Generator,
  type RegionLegacy,
} from "@genroot/builder/modules/generator";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundSprites from "./images/background-sprites.png";
import foldSprites from "./images/fold-sprites.png";
import labelSprites from "./images/label-sprites.png";
import titleSprites from "./images/title-sprites.png";
import pigTexture from "./textures/vanilla/pig2.png";
import saddleTexture from "./textures/vanilla/pig_saddle2.png";
import diamondArmorTexture from "./textures/vanilla/diamond-armor.png";
import goldArmorTexture from "./textures/vanilla/gold-armor.png";
import chainmailArmorTexture from "./textures/vanilla/chainmail-armor.png";
import ironArmorTexture from "./textures/vanilla/iron-armor.png";
import saddleVanillaTexture from "./textures/vanilla/pig_saddle2.png";
import saddleFaithfulTexture from "./textures/faithful/saddle.png";
import diamondArmorFaithfulTexture from "./textures/faithful/diamond-armor.png";
import goldArmorFaithfulTexture from "./textures/faithful/gold-armor.png";
import chainmailArmorFaithfulTexture from "./textures/faithful/chainmail-armor.png";
import ironArmorFaithfulTexture from "./textures/faithful/iron-armor.png";
import saddleSpacePigTexture from "./textures/space-pig/saddle.png";
import armorSpacePigTexture from "./textures/space-pig/armor.png";
import steveTexture from "./textures/Steve.png";

const id = "minecraft-pig-character";

const name = "Minecraft Pig Character";

const history: HistoryDef = [
  "Originally developed by aaronhawksley.",
  "06 Feb 2015 lostminer: Add user variables.",
  "13 Feb 2015 lostminer: Update to use new version of generator.",
  "13 Sep 2020 NinjolasNJM: Updated to use 1.8+ Skins.",
  "23 Jul 2021 NinjolasNJM: Replaced generator with one derived from Pig Generator by TepigMC.",
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
    url: pigTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Vanilla)",
    url: saddleTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Vanilla) (Programmer Art)",
    url: saddleVanillaTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Diamond Armor (Vanilla)",
    url: diamondArmorTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Gold Armor (Vanilla)",
    url: goldArmorTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chainmail Armor (Vanilla)",
    url: chainmailArmorTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Iron Armor (Vanilla)",
    url: ironArmorTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Faithful)",
    url: saddleFaithfulTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Diamond Armor (Faithful)",
    url: diamondArmorFaithfulTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Gold Armor (Faithful)",
    url: goldArmorFaithfulTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chainmail Armor (Faithful)",
    url: chainmailArmorFaithfulTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Iron Armor (Faithful)",
    url: ironArmorFaithfulTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Saddle (Space Pig)",
    url: saddleSpacePigTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Armor (Space Pig)",
    url: armorSpacePigTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Skin",
    url: steveTexture.src,
    standardWidth: 64,
    standardHeight: 64,
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

const script: ScriptDef = (generator: Generator) => {
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

  // Function to help with defining the inputs
  const makeTextureInput = (
    texture: string,
    width: number,
    height: number,
    choices: string[]
  ) => {
    generator.defineTextureInput(texture, {
      standardWidth: width,
      standardHeight: height,
      choices: choices,
    });
  };

  // Define user inputs

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);

  makeTextureInput(skinTexture, 64, 64, []);

  makeTextureInput(saddleTexture, 64, 32, [
    "Saddle (Vanilla)",
    "Saddle (Vanilla) (Programmer Art)",
    "Saddle (Faithful)",
    "Saddle (Space Pig)",
  ]);

  makeTextureInput(armorTexture, 64, 32, [
    "Diamond Armor (Vanilla)",
    "Gold Armor (Vanilla)",
    "Chainmail Armor (Vanilla)",
    "Iron Armor (Vanilla)",
    "Diamond Armor (Faithful)",
    "Gold Armor (Faithful)",
    "Chainmail Armor (Faithful)",
    "Iron Armor (Faithful)",
    "Armor (Space Pig)",
  ]);

  // Function to easily draw a section of a texture

  const drawSprite = (
    sprite: string,
    spriteJson: RegionLegacy,
    x: number,
    y: number
  ) => {
    generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
      sprite,
      { x: spriteJson.x, y: spriteJson.y, w: spriteJson.w, h: spriteJson.h },
      { x: x, y: y, w: width, h: height }
    );
  };

  // Define Layer variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Show Titles", true);
  generator.defineBooleanInput("Transparent Background", false);

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const showTitles = generator.getBooleanInputValue("Show Titles");
  const isTransparent = generator.getBooleanInputValue(
    "Transparent Background"
  );

  // Define Region Inputs

  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");
  const hideHelmetOverlay = generator.getBooleanInputValue(
    "Hide Helmet Overlay"
  );

  // Define Texture variables

  generator.defineSelectInput("Head Style", [
    "Simple",
    "Advanced",
    "Advanced (Standard)",
  ]);

  generator.defineBooleanInput("Separate Snout", true);

  const headStyle = generator.getSelectInputValue("Head Style");
  const noseStyle = generator.getBooleanInputValue("Separate Snout");

  generator.defineSelectInput("Saddle Style", ["Attached", "Separate"]);
  generator.defineSelectInput("Helmet Style", ["Attached", "Separate"]);
  generator.defineSelectInput("Boots Style", ["Attached", "Separate"]);

  const saddleStyle = generator.getSelectInputValue("Saddle Style");
  const helmetStyle = generator.getSelectInputValue("Helmet Style");
  const bootsStyle = generator.getSelectInputValue("Boots Style");

  generator.defineBooleanInput("Show Ultra Mini", true);

  const showUltraMini = generator.getBooleanInputValue("Show Ultra Mini");
  const useSaddle = saddleStyle !== "None";
  const useHelmet = helmetStyle !== "None";
  const useBoots = bootsStyle !== "None";
  const simpleHead = headStyle === "Simple";
  const flatNose = !noseStyle;
  const standardAdvancedHead = headStyle === "Advanced (Standard)";
  const separateSaddle = saddleStyle === "Separate";
  const separateHelmet = helmetStyle === "Separate";
  const separateBoots = bootsStyle === "Separate";

  // Head Functions

  const drawHeadAdvancedShape = (
    texture: string,
    x: number,
    y: number,
    tx: number,
    ty: number
  ) => {
    generator.drawTextureLegacy(
      texture,
      { x: tx, y: ty + 8, w: 8, h: 2 },
      { x: x, y: y + 64, w: 64, h: 16 }
    ); // Right 1
    generator.drawTextureLegacy(
      texture,
      { x: tx + 2, y: ty + 10, w: 6, h: 6 },
      { x: x + 16, y: y + 80, w: 48, h: 48 }
    ); // Right 2
    generator.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty + 8, w: 8, h: 8 },
      { x: x + 64, y: y + 64, w: 64, h: 64 }
    ); // Face
    generator.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 8, w: 8, h: 2 },
      { x: x + 128, y: y + 64, w: 64, h: 16 }
    ); // Left 1
    generator.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 10, w: 6, h: 6 },
      { x: x + 128, y: y + 80, w: 48, h: 48 }
    ); // Left 2
    generator.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty, w: 8, h: 8 },
      { x: x + 64, y: y, w: 64, h: 64 }
    ); // Top
    generator.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 2, w: 8, h: 6 },
      { x: x + 64, y: y + 128, w: 64, h: 48 },
      { flip: "Vertical" }
    ); // Bottom
    generator.drawTextureLegacy(
      texture,
      { x: tx + 24, y: ty + 8, w: 8, h: 2 },
      { x: x + 192, y: y + 64, w: 64, h: 16 }
    ); // Back 1
    if (!standardAdvancedHead) {
      generator.drawTextureLegacy(
        texture,
        { x: tx + 24, y: ty + 10, w: 8, h: 6 },
        { x: x + 176, y: y + 80, w: 64, h: 48 }
      ); // Back 2
      generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
      texture,
      { x: textureOffsetX, y: 8, w: 8, h: 8 },
      { x: x, y: y + 64, w: 64, h: 64 }
    ); // Right
    generator.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 8, y: 8, w: 8, h: 8 },
      { x: x + 64, y: y + 64, w: 64, h: 64 }
    ); // Face
    generator.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 16, y: 8, w: 8, h: 8 },
      { x: x + 128, y: y + 64, w: 64, h: 64 }
    ); // Left
    generator.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 24, y: 8, w: 8, h: 8 },
      { x: 256, y: y + 64, w: 64, h: 64 }
    ); // Back
    generator.drawTextureLegacy(
      texture,
      { x: textureOffsetX + 8, y: 0, w: 8, h: 8 },
      { x: x + 64, y: y, w: 64, h: 64 }
    ); // Top
    generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
      pig,
      { x: 16, y: 17, w: 1, h: 3 },
      { x: x + 16, y: y + 32, w: 8, h: 24 }
    ); // Right
    generator.drawTextureLegacy(
      pig,
      { x: 17, y: 17, w: 4, h: 3 },
      { x: x + 24, y: y + 32, w: 32, h: 24 }
    ); // Center
    generator.drawTextureLegacy(
      pig,
      { x: 21, y: 17, w: 1, h: 3 },
      { x: x + 56, y: y + 32, w: 8, h: 24 }
    ); // Left
    generator.drawTextureLegacy(
      pig,
      { x: 10, y: 12, w: 4, h: 3 },
      { x: x + 24, y: y, w: 32, h: 24 },
      { flip: "Vertical" }
    ); // Back
    generator.drawTextureLegacy(
      pig,
      { x: 17, y: 16, w: 4, h: 1 },
      { x: x + 24, y: y + 24, w: 32, h: 8 }
    ); // Top
    generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
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
        generator.drawTextureLegacy(
          texture,
          { x: sx, y: sy + 4, w: 4, h: 12 },
          { x: x, y: y + 88, w: 64, h: 128 }
        ); // Right
        generator.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy + 4, w: 8, h: 12 },
          { x: x + 64, y: y + 88, w: 80, h: 128 }
        ); // Bottom
        generator.drawTextureLegacy(
          texture,
          { x: sx + 12, y: sy + 4, w: 4, h: 12 },
          { x: x + 144, y: y + 88, w: 64, h: 128 }
        ); // Left
        generator.drawTextureLegacy(
          texture,
          { x: sx + 16, y: sy + 4, w: 8, h: 12 },
          { x: x + 208, y: y + 88, w: 80, h: 128 }
        ); // Top
        generator.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy, w: 8, h: 4 },
          { x: x + 64, y: y + 24, w: 80, h: 64 }
        ); // Front
        generator.drawTextureLegacy(
          texture,
          { x: sx + 12, y: sy, w: 8, h: 4 },
          { x: x + 64, y: y + 216, w: 80, h: 64 },
          { flip: "Vertical" }
        ); // Back
      } else {
        generator.drawTextureLegacy(
          texture,
          { x: 28, y: 16, w: 8, h: 16 },
          { x: x, y: y + 88, w: 64, h: 128 }
        ); // Right
        generator.drawTextureLegacy(
          texture,
          { x: 36, y: 16, w: 10, h: 16 },
          { x: x + 64, y: y + 88, w: 80, h: 128 }
        ); // Bottom
        generator.drawTextureLegacy(
          texture,
          { x: 46, y: 16, w: 8, h: 16 },
          { x: x + 144, y: y + 88, w: 64, h: 128 }
        ); // Left
        generator.drawTextureLegacy(
          texture,
          { x: 54, y: 16, w: 10, h: 16 },
          { x: x + 208, y: y + 88, w: 80, h: 128 }
        ); // Top
        generator.drawTextureLegacy(
          texture,
          { x: 36, y: 8, w: 10, h: 8 },
          { x: x + 64, y: y + 24, w: 80, h: 64 }
        ); // Front
        generator.drawTextureLegacy(
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
    alexModel: boolean
  ) => {
    drawSprite(bgSprite, bgSprites.leg, dx, dy);
    const drawLayer = (
      texture: string,
      sx: number,
      sy: number,
      dx: number,
      dy: number,
      alexModel: boolean
    ) => {
      if (alexModel) {
        generator.drawTextureLegacy(
          texture,
          { x: sx, y: sy + 4, w: 4, h: 12 },
          { x: dx, y: dy + 56, w: 32, h: 48 }
        ); // Right
        generator.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy + 4, w: 3, h: 12 },
          { x: dx + 32, y: dy + 56, w: 32, h: 48 }
        ); // Front
        generator.drawTextureLegacy(
          texture,
          { x: sx + 7, y: sy + 4, w: 4, h: 12 },
          { x: dx + 64, y: dy + 56, w: 32, h: 48 }
        ); // Left
        generator.drawTextureLegacy(
          texture,
          { x: sx + 11, y: sy + 4, w: 3, h: 12 },
          { x: dx + 96, y: dy + 56, w: 32, h: 48 }
        ); // Back
        generator.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy, w: 3, h: 4 },
          { x: dx + 32, y: dy + 24, w: 32, h: 32 }
        ); // Top
        generator.drawTextureLegacy(
          texture,
          { x: sx + 7, y: sy, w: 3, h: 4 },
          { x: dx + 32, y: dy + 104, w: 32, h: 32 },
          { flip: "Vertical" }
        ); // Bottom
      } else {
        generator.drawTextureLegacy(
          texture,
          { x: sx, y: sy + 4, w: 4, h: 12 },
          { x: dx, y: dy + 56, w: 32, h: 48 }
        ); // Right
        generator.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy + 4, w: 4, h: 12 },
          { x: dx + 32, y: dy + 56, w: 32, h: 48 }
        ); // Front
        generator.drawTextureLegacy(
          texture,
          { x: sx + 8, y: sy + 4, w: 4, h: 12 },
          { x: dx + 64, y: dy + 56, w: 32, h: 48 }
        ); // Left
        generator.drawTextureLegacy(
          texture,
          { x: sx + 12, y: sy + 4, w: 4, h: 12 },
          { x: dx + 96, y: dy + 56, w: 32, h: 48 }
        ); // Back
        generator.drawTextureLegacy(
          texture,
          { x: sx + 4, y: sy, w: 4, h: 4 },
          { x: dx + 32, y: dy + 24, w: 32, h: 32 }
        ); // Top
        generator.drawTextureLegacy(
          texture,
          { x: sx + 8, y: sy, w: 4, h: 4 },
          { x: dx + 32, y: dy + 104, w: 32, h: 32 },
          { flip: "Vertical" }
        ); // Bottom
      }
    };
    drawLayer(texture, sx, sy, dx, dy, alexModel); // First Layer
    if (showSecondLayer) {
      drawLayer(texture, ox, oy, dx, dy, alexModel); // Second Layer
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
    generator.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x, y: y, w: 40, h: 128 }
    ); // Bottom Left
    generator.drawTextureLegacy(
      texture,
      { x: 46, y: 16, w: 8, h: 16 },
      { x: x + 40, y: y, w: 64, h: 128 }
    ); // Left
    generator.drawTextureLegacy(
      texture,
      { x: 54, y: 16, w: 10, h: 16 },
      { x: x + 104, y: y, w: 80, h: 128 }
    ); // Top
    generator.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 16 },
      { x: x + 184, y: y, w: 64, h: 128 }
    ); // Right
    generator.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x + 248, y: y, w: 40, h: 128 }
    ); // Bottom Right
    // Bottom
    generator.drawTextureLegacy(
      texture,
      { x: 41, y: 16, w: 5, h: 16 },
      { x: x, y: y + 128, w: 40, h: 128 },
      { flip: "Vertical" }
    ); // Bottom Left
    generator.drawTextureLegacy(
      texture,
      { x: 46, y: 16, w: 8, h: 16 },
      { x: x + 40, y: y + 128, w: 64, h: 128 },
      { flip: "Vertical" }
    ); // Left
    generator.drawTextureLegacy(
      texture,
      { x: 54, y: 16, w: 10, h: 16 },
      { x: x + 104, y: y + 128, w: 80, h: 128 },
      { flip: "Vertical" }
    ); // Top
    generator.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 16 },
      { x: x + 184, y: y + 128, w: 64, h: 128 },
      { flip: "Vertical" }
    ); // Right
    generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
      texture,
      { x: tx, y: ty + 8, w: 8, h: 3 },
      { x: x, y: y + 64, w: 64, h: 24 }
    ); // Right 1
    generator.drawTextureLegacy(
      texture,
      { x: tx + 2, y: ty + 11, w: 6, h: 5 },
      { x: x + 16, y: y + 88, w: 48, h: 40 }
    ); // Right 2
    generator.drawTextureLegacy(
      texture,
      { x: tx + 8, y: ty + 8, w: 8, h: 8 },
      { x: x + 64, y: y + 64, w: 64, h: 64 }
    ); // Face
    generator.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 8, w: 8, h: 3 },
      { x: x + 128, y: y + 64, w: 64, h: 24 }
    ); // Left 1
    generator.drawTextureLegacy(
      texture,
      { x: tx + 16, y: ty + 11, w: 6, h: 5 },
      { x: x + 128, y: y + 88, w: 48, h: 40 }
    ); // Left 2
    generator.drawTextureLegacy(
      texture,
      { x: tx + 24, y: ty + 8, w: 8, h: 3 },
      { x: x + 192, y: y + 64, w: 64, h: 24 }
    ); // Back
    generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
      texture,
      { x: 0, y: 26, w: 4, h: 6 },
      { x: x, y: y + 0, w: 32, h: 48 }
    ); // Right
    generator.drawTextureLegacy(
      texture,
      { x: 4, y: 26, w: 4, h: 6 },
      { x: x + 32, y: y + 0, w: 32, h: 48 }
    ); // Front
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 26, w: 4, h: 6 },
      { x: x + 64, y: y + 0, w: 32, h: 48 }
    ); // Left
    generator.drawTextureLegacy(
      texture,
      { x: 12, y: 26, w: 4, h: 6 },
      { x: x + 96, y: y + 0, w: 32, h: 48 }
    ); // Back
    generator.drawTextureLegacy(
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
    generator.drawTextureLegacy(
      texture,
      { x: 16, y: 20, w: 4, h: 12 },
      { x: x + 8, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Right
    generator.drawTextureLegacy(
      texture,
      { x: 20, y: 20, w: 8, h: 12 },
      { x: x + 32, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Top
    generator.drawTextureLegacy(
      texture,
      { x: 28, y: 20, w: 4, h: 12 },
      { x: x + 24, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Left
    generator.drawTextureLegacy(
      texture,
      { x: 32, y: 20, w: 8, h: 12 },
      { x: x + 16, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Bottom
    if (!hideJacket) {
      generator.drawTextureLegacy(
        texture,
        { x: 16, y: 36, w: 4, h: 12 },
        { x: x + 8, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Right Overlay
      generator.drawTextureLegacy(
        texture,
        { x: 20, y: 36, w: 8, h: 12 },
        { x: x + 32, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Top Overlay
      generator.drawTextureLegacy(
        texture,
        { x: 28, y: 36, w: 4, h: 12 },
        { x: x + 24, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Left Overlay
      generator.drawTextureLegacy(
        texture,
        { x: 32, y: 36, w: 8, h: 12 },
        { x: x + 16, y: y + 20, w: 8, h: 12 },
        { rotateLegacy: 180.0 }
      ); // Bottom Overlay
    }
  };

  const drawUltraMiniSaddle = (texture: string, x: number, y: number) => {
    generator.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 16 },
      { x: x + 8, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Right
    generator.drawTextureLegacy(
      texture,
      { x: 36, y: 16, w: 10, h: 16 },
      { x: x + 32, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Top
    generator.drawTextureLegacy(
      texture,
      { x: 46, y: 16, w: 8, h: 16 },
      { x: x + 24, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Left
    generator.drawTextureLegacy(
      texture,
      { x: 54, y: 16, w: 10, h: 16 },
      { x: x + 16, y: y + 20, w: 8, h: 12 },
      { rotateLegacy: 180.0 }
    ); // Bottom
  };

  const drawUltraMiniLegs = (texture: string, x: number, y: number) => {
    generator.drawTextureLegacy(
      texture,
      { x: 24, y: 48, w: 4, h: 4 },
      { x: x + 24, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 4
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 3
    generator.drawTextureLegacy(
      texture,
      { x: 40, y: 48, w: 4, h: 4 },
      { x: x + 24, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 2
    generator.drawTextureLegacy(
      texture,
      { x: 48, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 1
    // Overlays
    if (!hideLeftPant) {
      generator.drawTextureLegacy(
        texture,
        { x: 8, y: 48, w: 4, h: 4 },
        { x: x + 24, y: y + 8, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 4 Overlay
    }
    if (!hideRightPant) {
      generator.drawTextureLegacy(
        texture,
        { x: 8, y: 32, w: 4, h: 4 },
        { x: x + 29, y: y + 8, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 3 Overlay
    }
    if (!hideLeftSleeve) {
      generator.drawTextureLegacy(
        texture,
        { x: 56, y: 48, w: 4, h: 4 },
        { x: x + 24, y: y + 17, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 2 Overlay
    }
    if (!hideRightSleeve) {
      generator.drawTextureLegacy(
        texture,
        { x: 48, y: 32, w: 4, h: 4 },
        { x: x + 29, y: y + 17, w: 3, h: 3 },
        { flip: "Vertical" }
      ); // Foot 1 Overlay
    }
  };

  const drawUltraMiniBoots = (texture: string, x: number, y: number) => {
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 24, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 4
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 8, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 3
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 24, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 2
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 16, w: 4, h: 4 },
      { x: x + 29, y: y + 17, w: 3, h: 3 },
      { flip: "Vertical" }
    ); // Foot 1
  };

  const drawUltraMiniEnds = (texture: string, x: number, y: number) => {
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 8, w: 8, h: 8 },
      { x: x + 8, y: y + 20, w: 8, h: 8 }
    ); // Face
    if (!hideHelmet) {
      generator.drawTextureLegacy(
        texture,
        { x: 40, y: 8, w: 8, h: 8 },
        { x: x + 8, y: y + 20, w: 8, h: 8 }
      ); // Face Overlay
    }
    generator.drawTextureLegacy(
      pigTexture,
      { x: 17, y: 17, w: 4, h: 3 },
      { x: x + 10, y: y + 25, w: 4, h: 3 }
    ); // Nose
    generator.drawTextureLegacy(
      texture,
      { x: 28, y: 16, w: 8, h: 4 },
      { x: x + 8, y: y, w: 8, h: 8 },
      { flip: "Vertical" }
    ); // Back
    if (!hideJacket) {
      generator.drawTextureLegacy(
        texture,
        { x: 28, y: 32, w: 8, h: 4 },
        { x: x + 8, y: y, w: 8, h: 8 },
        { flip: "Vertical" }
      ); // Back Overlay
    }
  };

  const drawUltraMiniHelmet = (texture: string, x: number, y: number) => {
    generator.drawTextureLegacy(
      texture,
      { x: 8, y: 8, w: 8, h: 8 },
      { x: x + 8, y: y + 20, w: 8, h: 8 }
    ); // Front
    if (!hideHelmetOverlay) {
      generator.drawTextureLegacy(
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

  generator.usePage("Pig");

  drawOpaque();
  drawCredits();

  // Define Region Inputs

  generator.defineRegionInput([64, 96, 256, 192], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([56, 328, 288, 256], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([392, 312, 128, 112], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([392, 128, 128, 112], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([240, 608, 128, 112], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([392, 496, 128, 112], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });

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
    alexModel
  ); // Right Arm
  drawLeg(skinTexture, 32, 48, 48, 48, 392, 288, 2, !hideLeftSleeve, alexModel); // Left Arm
  drawLeg(skinTexture, 0, 16, 0, 32, 392, 472, 3, !hideRightPant, false); // Right Leg
  drawLeg(skinTexture, 16, 48, 0, 48, 240, 584, 4, !hideLeftPant, false); // Left Leg

  if (flatNose) {
    drawNoseFlat(pigTexture, 64, 104);
  } else {
    drawNose3D(pigTexture, 248, 272);
  }

  // Draw the accessories on the pig

  if (useHelmet && !separateHelmet) {
    generator.defineRegionInput([128, 32, 64, 64], () => {
      generator.setBooleanInputValue("Hide Helmet Overlay", !hideHelmetOverlay);
    });
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
    generator.usePage("Accessories");

    drawOpaque();
    drawCredits();

    if (useSaddle && separateSaddle) {
      drawSaddleSeparate(saddleTexture, 56, 328);
    }

    if (useHelmet && separateHelmet) {
      generator.defineRegionInput([64, 96, 256, 192], () => {
        generator.setBooleanInputValue(
          "Hide Helmet Overlay",
          !hideHelmetOverlay
        );
      });
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
