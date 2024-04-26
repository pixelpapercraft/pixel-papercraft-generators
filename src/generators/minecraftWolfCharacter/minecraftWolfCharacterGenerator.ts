"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";

import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import steveTexture from "./textures/Steve.png";
import wolfAngryTexture from "./textures/wolf_angry.png";

const id = "minecraft-wolf-character";

const name = "Minecraft Wolf Character";

const history: HistoryDef = [
  "Originally developed by dodecaphon.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "29 Sep 2020 NinjolasNJM - Various updates.",
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
    id: "Skin",
    url: steveTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Angry Wolf",
    url: wolfAngryTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const getSelectInputAsNumberWithDefault = (
    id: string,
    defaultValue: number
  ) => {
    const value = generator.getSelectInputValue(id);
    return value ? parseInt(value, 10) : defaultValue;
  };

  const cycleTailTypes = (t: number) => {
    return (t === 4 ? 1 : t + 1).toString();
  };

  // Define user inputs

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
    enableMinecraftSkinInput: true,
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Show Red Eyes", false);

  // Get user variables

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const showRedEyes = generator.getBooleanInputValue("Show Red Eyes");
  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");

  const tailType = getSelectInputAsNumberWithDefault("Tail Type", 1);

  generator.defineRegionInput([341, 312, 160, 112], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([85, 198, 240, 160], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([346, 575, 64, 88], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([259, 575, 64, 88], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([172, 575, 64, 88], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([85, 575, 64, 88], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });
  generator.defineRegionInput([407, 518, 88, 64], () => {
    generator.setSelectInputValue("Tail Type", cycleTailTypes(tailType));
  });

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
    if (isArm && alexModel) {
      generator.drawTexture("Skin", [sx + 4, sy, 3, 4], [dx + 16, dy, 16, 16]); // top
      generator.drawTexture("Skin", [sx, sy + 4, 4, 12], [dx, dy + 16, 16, 56]); // left
      generator.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 3, 12],
        [dx + 16, dy + 16, 16, 56]
      ); // front
      generator.drawTexture(
        "Skin",
        [sx + 7, sy + 4, 4, 12],
        [dx + 32, dy + 16, 16, 56]
      ); // right
      generator.drawTexture(
        "Skin",
        [sx + 11, sy + 4, 3, 12],
        [dx + 48, dy + 16, 16, 56]
      ); // back
      generator.drawTexture(
        "Skin",
        [sx + 7, sy, 3, 4],
        [dx + 16, dy + 72, 16, 16],
        { flip: "Vertical" }
      ); // bottom
    } else {
      generator.drawTexture("Skin", [sx + 4, sy, 4, 4], [dx + 16, dy, 16, 16]); // top
      generator.drawTexture("Skin", [sx, sy + 4, 4, 12], [dx, dy + 16, 16, 56]); // left
      generator.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 4, 12],
        [dx + 16, dy + 16, 16, 56]
      ); // front
      generator.drawTexture(
        "Skin",
        [sx + 8, sy + 4, 4, 12],
        [dx + 32, dy + 16, 16, 56]
      ); // right
      generator.drawTexture(
        "Skin",
        [sx + 12, sy + 4, 4, 12],
        [dx + 48, dy + 16, 16, 56]
      ); // back
      generator.drawTexture(
        "Skin",
        [sx + 8, sy, 4, 4],
        [dx + 16, dy + 72, 16, 16],
        { flip: "Vertical" }
      ); // bottom
    }
  };

  // Head

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: ox + 341, y: oy + 344, w: 32, h: 48 }
  ); // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 373, y: oy + 392, w: 48, h: 32 },
    { flip: "Vertical" }
  ); // bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: ox + 421, y: oy + 344, w: 32, h: 48 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: ox + 453, y: oy + 344, w: 48, h: 48 }
  ); // back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 373, y: oy + 312, w: 48, h: 32 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: ox + 373, y: oy + 344, w: 48, h: 48 }
  ); // face
  // nose
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 3 },
    { x: og + 416, y: oh + 232, w: 24, h: 24 }
  ); // front
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 1, h: 3 },
    { x: og + 392, y: oh + 232, w: 24, h: 24 }
  ); // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 1 },
    { x: og + 416, y: oh + 208, w: 24, h: 24 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 15, w: 4, h: 1 },
    { x: og + 416, y: oh + 256, w: 24, h: 24 }
  ); // bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 13, y: 13, w: 1, h: 3 },
    { x: og + 440, y: oh + 232, w: 24, h: 24 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 3 },
    { x: og + 464, y: oh + 232, w: 24, h: 24 },
    { flip: "Horizontal" }
  ); // back

  if (!hideHelmet) {
    // Head
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: ox + 341, y: oy + 344, w: 32, h: 48 }
    ); // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: ox + 373, y: oy + 392, w: 48, h: 32 },
      { flip: "Vertical" }
    ); // bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: ox + 421, y: oy + 344, w: 32, h: 48 }
    ); // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: ox + 453, y: oy + 344, w: 48, h: 48 }
    ); // back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: ox + 373, y: oy + 312, w: 48, h: 32 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: ox + 373, y: oy + 344, w: 48, h: 48 }
    ); // face
    // nose
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 3 },
      { x: og + 416, y: oh + 232, w: 24, h: 24 }
    ); // front
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 1, h: 3 },
      { x: og + 392, y: oh + 232, w: 24, h: 24 }
    ); // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 1 },
      { x: og + 416, y: oh + 208, w: 24, h: 24 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 15, w: 4, h: 1 },
      { x: og + 416, y: oh + 256, w: 24, h: 24 }
    ); // bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 45, y: 13, w: 1, h: 3 },
      { x: og + 440, y: oh + 232, w: 24, h: 24 }
    ); // right
    generator.drawTextureLegacy(
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
    if (isArm && alexModel) {
      // Tail
      generator.drawTexture(
        "Skin",
        [sx + 4, sy, 3, 4],
        [dx + 72, dy + 16, 16, 16],
        { rotate: 90.0 }
      ); // top
      generator.drawTexture(
        "Skin",
        [sx, sy + 4, 4, 12],
        [dx + 36, dy - 20, 16, 56],
        { rotate: 90.0 }
      ); // left
      generator.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 3, 12],
        [dx + 36, dy - 4, 16, 56],
        { rotate: 90.0 }
      ); // front
      generator.drawTexture(
        "Skin",
        [sx + 7, sy + 4, 4, 12],
        [dx + 36, dy + 12, 16, 56],
        { rotate: 90.0 }
      ); // right
      generator.drawTexture(
        "Skin",
        [sx + 11, sy + 4, 3, 12],
        [dx + 36, dy + 28, 16, 56],
        { rotate: 90.0 }
      ); // back
      generator.drawTexture("Skin", [sx + 7, sy, 3, 4], [dx, dy + 16, 16, 16], {
        flip: "Vertical",
        rotate: 90.0,
      }); // bottom
    } else {
      // Tail
      generator.drawTexture(
        "Skin",
        [sx + 4, sy, 4, 4],
        [dx + 72, dy + 16, 16, 16],
        { rotate: 90.0 }
      ); // top
      generator.drawTexture(
        "Skin",
        [sx, sy + 4, 4, 12],
        [dx + 36, dy - 20, 16, 56],
        { rotate: 90.0 }
      ); // left
      generator.drawTexture(
        "Skin",
        [sx + 4, sy + 4, 4, 12],
        [dx + 36, dy - 4, 16, 56],
        { rotate: 90.0 }
      ); // front
      generator.drawTexture(
        "Skin",
        [sx + 8, sy + 4, 4, 12],
        [dx + 36, dy + 12, 16, 56],
        { rotate: 90.0 }
      ); // right
      generator.drawTexture(
        "Skin",
        [sx + 12, sy + 4, 4, 12],
        [dx + 36, dy + 28, 16, 56],
        { rotate: 90.0 }
      ); // back
      generator.drawTexture("Skin", [sx + 8, sy, 4, 4], [dx, dy + 16, 16, 16], {
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

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 4 },
    { x: 141, y: 254, w: 64, h: 48 }
  ); // bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 4 },
    { x: 85, y: 254, w: 56, h: 48 }
  ); // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 4 },
    { x: 205, y: 254, w: 56, h: 48 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 4 },
    { x: 261, y: 254, w: 64, h: 48 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 141, y: 198, w: 64, h: 56 }
  ); // front
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 141, y: 302, w: 64, h: 56 },
    { flip: "Vertical" }
  ); // back

  // body2

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 24, w: 8, h: 8 },
    { x: 163, y: 427, w: 48, h: 72 }
  ); // bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 24, w: 4, h: 8 },
    { x: 115, y: 427, w: 48, h: 72 }
  ); // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 24, w: 4, h: 8 },
    { x: 211, y: 427, w: 48, h: 72 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 24, w: 8, h: 8 },
    { x: 259, y: 427, w: 48, h: 72 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 163, y: 379, w: 48, h: 48 }
  ); // front
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 163, y: 499, w: 48, h: 48 },
    { flip: "Vertical" }
  ); // back

  // Ears

  // left

  generator.drawTextureLegacy(
    "Skin",
    { x: 22, y: 17, w: 2, h: 2 },
    { x: ol + 371, y: om + 459, w: 16, h: 16 }
  ); //front
  generator.drawTextureLegacy(
    "Skin",
    { x: 25, y: 17, w: 2, h: 2 },
    { x: ol + 395, y: om + 459, w: 16, h: 16 }
  ); //back
  generator.drawTextureLegacy(
    "Skin",
    { x: 21, y: 17, w: 1, h: 2 },
    { x: ol + 363, y: om + 459, w: 8, h: 16 }
  ); //left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 17, w: 1, h: 2 },
    { x: ol + 387, y: om + 459, w: 8, h: 16 }
  ); //right
  generator.drawTextureLegacy(
    "Skin",
    { x: 22, y: 16, w: 2, h: 1 },
    { x: ol + 371, y: om + 451, w: 16, h: 8 }
  ); //top
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 16, w: 2, h: 1 },
    { x: ol + 371, y: om + 475, w: 16, h: 8 },
    { flip: "Vertical" }
  ); //bottom

  // right

  generator.drawTextureLegacy(
    "Skin",
    { x: 22, y: 17, w: 2, h: 2 },
    { x: ol + 444, y: om + 459, w: 16, h: 16 }
  ); //front
  generator.drawTextureLegacy(
    "Skin",
    { x: 25, y: 17, w: 2, h: 2 },
    { x: ol + 468, y: om + 459, w: 16, h: 16 }
  ); //back
  generator.drawTextureLegacy(
    "Skin",
    { x: 21, y: 17, w: 1, h: 2 },
    { x: ol + 436, y: om + 459, w: 8, h: 16 }
  ); //left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 17, w: 1, h: 2 },
    { x: ol + 460, y: om + 459, w: 8, h: 16 }
  ); //right
  generator.drawTextureLegacy(
    "Skin",
    { x: 22, y: 16, w: 2, h: 1 },
    { x: ol + 444, y: om + 451, w: 16, h: 8 }
  ); //top
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 16, w: 2, h: 1 },
    { x: ol + 444, y: om + 475, w: 16, h: 8 },
    { flip: "Vertical" }
  ); //bottom

  if (!hideJacket) {
    // body
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 4 },
      { x: 141, y: 254, w: 64, h: 48 }
    ); // bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 4 },
      { x: 85, y: 254, w: 56, h: 48 }
    ); // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 4 },
      { x: 205, y: 254, w: 56, h: 48 }
    ); // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 4 },
      { x: 261, y: 254, w: 64, h: 48 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 141, y: 198, w: 64, h: 56 }
    ); // front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 141, y: 302, w: 64, h: 56 },
      { flip: "Vertical" }
    ); // back
    // body2
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 40, w: 8, h: 8 },
      { x: 163, y: 427, w: 48, h: 72 }
    ); // bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 40, w: 4, h: 8 },
      { x: 115, y: 427, w: 48, h: 72 }
    ); // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 40, w: 4, h: 8 },
      { x: 211, y: 427, w: 48, h: 72 }
    ); // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 40, w: 8, h: 8 },
      { x: 259, y: 427, w: 48, h: 72 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 163, y: 379, w: 48, h: 48 }
    ); // front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 163, y: 499, w: 48, h: 48 },
      { flip: "Vertical" }
    ); // back
    // Ears
    // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 22, y: 33, w: 2, h: 2 },
      { x: ol + 371, y: om + 459, w: 16, h: 16 }
    ); //front
    generator.drawTextureLegacy(
      "Skin",
      { x: 25, y: 33, w: 2, h: 2 },
      { x: ol + 395, y: om + 459, w: 16, h: 16 }
    ); //back
    generator.drawTextureLegacy(
      "Skin",
      { x: 21, y: 33, w: 1, h: 2 },
      { x: ol + 363, y: om + 459, w: 8, h: 16 }
    ); //left
    generator.drawTextureLegacy(
      "Skin",
      { x: 24, y: 33, w: 1, h: 2 },
      { x: ol + 387, y: om + 459, w: 8, h: 16 }
    ); //right
    generator.drawTextureLegacy(
      "Skin",
      { x: 22, y: 32, w: 2, h: 1 },
      { x: ol + 371, y: om + 451, w: 16, h: 8 }
    ); //top
    generator.drawTextureLegacy(
      "Skin",
      { x: 24, y: 32, w: 2, h: 1 },
      { x: ol + 371, y: om + 475, w: 16, h: 8 },
      { flip: "Vertical" }
    ); //bottom
    // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 22, y: 33, w: 2, h: 2 },
      { x: ol + 444, y: om + 459, w: 16, h: 16 }
    ); //front
    generator.drawTextureLegacy(
      "Skin",
      { x: 25, y: 33, w: 2, h: 2 },
      { x: ol + 468, y: om + 459, w: 16, h: 16 }
    ); //back
    generator.drawTextureLegacy(
      "Skin",
      { x: 21, y: 33, w: 1, h: 2 },
      { x: ol + 436, y: om + 459, w: 8, h: 16 }
    ); //left
    generator.drawTextureLegacy(
      "Skin",
      { x: 24, y: 33, w: 1, h: 2 },
      { x: ol + 460, y: om + 459, w: 8, h: 16 }
    ); //right
    generator.drawTextureLegacy(
      "Skin",
      { x: 22, y: 32, w: 2, h: 1 },
      { x: ol + 444, y: om + 451, w: 16, h: 8 }
    ); //top
    generator.drawTextureLegacy(
      "Skin",
      { x: 24, y: 32, w: 2, h: 1 },
      { x: ol + 444, y: om + 475, w: 16, h: 8 },
      { flip: "Vertical" }
    ); //bottom
  }

  // Background

  generator.drawImage("Background", [0, 0]);

  // Fold Lines

  if (showFolds) {
    generator.drawImage("Folds", [0, 0]);
  }

  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
  }

  // Red Eye

  if (showRedEyes) {
    generator.drawTexture("Angry Wolf", [4, 5, 2, 2], [379, 362, 12, 12]); // Right Eye 1
    generator.drawTexture("Angry Wolf", [4, 4, 1, 1], [379, 356, 6, 6]); // Right Eye 2
    generator.drawTexture("Angry Wolf", [8, 5, 2, 2], [403, 362, 12, 12]); // Left Eye 1
    generator.drawTexture("Angry Wolf", [9, 4, 1, 1], [409, 356, 6, 6]); // Left Eye 2
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
