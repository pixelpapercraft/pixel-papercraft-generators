"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import steveTexture from "./textures/Steve.png";

const id = "minecraft-cat-character";

const name = "Minecraft Cat Character";

const history: HistoryDef = [
  "Originally developed by dodecaphon.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "17 Sep 2020 NinjolasNJM - Updated to use 1.8+ skins.",
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
  });
  // Define user variables
  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  // Get user variable values
  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
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
  // Overlay region variables
  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");

  // const tailType =
  //   generator.getSelectInputValue("Tail Type")->Belt.Int.fromString->Belt.Option.getWithDefault(1)

  const tailType = getSelectInputAsNumberWithDefault("Tail Type", 1);

  // const cycleTailTypes = t => {
  //   const t = if t === 4 {
  //     1
  //   } else {
  //     t + 1
  //   }
  //   Belt.Int.toString(t)
  // }

  generator.defineRegionInput([40, 33, 160, 112], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([40, 193, 160, 224], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([340, 232, 64, 64], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([251, 232, 128 / 2, 64], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([340, 320, 64, 64], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([251, 320, 64, 64], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });
  generator.defineRegionInput([469, 283, 104, 83], () => {
    generator.setSelectInputValue("Tail Type", cycleTailTypes(tailType));
  });
  // Head
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: ox + 25, y: oy + 65, w: 40, h: 32 }
  ); // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: ox + 65, y: oy + 97, w: 40, h: 40 },
    { flip: "Vertical" }
  ); // bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: ox + 105, y: oy + 65, w: 40, h: 32 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: ox + 145, y: oy + 65, w: 40, h: 32 }
  ); // back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: ox + 65, y: oy + 25, w: 40, h: 40 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: ox + 65, y: oy + 65, w: 40, h: 32 }
  ); // face
  // nose
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 3 },
    { x: og + 241, y: oh + 76, w: 24, h: 12 }
  ); // front
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 4, h: 1 },
    { x: og + 241, y: oh + 68, w: 24, h: 8 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 13, y: 13, w: 1, h: 3 },
    { x: og + 265, y: oh + 76, w: 8, h: 12 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 15, w: 4, h: 1 },
    { x: og + 241, y: oh + 88, w: 24, h: 8 }
  ); // bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 10, y: 13, w: 1, h: 3 },
    { x: og + 233, y: oh + 76, w: 8, h: 12 }
  ); // left
  // Ears
  // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 9, y: 1, w: 1, h: 1 },
    { x: ol + 168, y: om + 168, w: 24, h: 16 }
  ); //front
  generator.drawTextureLegacy(
    "Skin",
    { x: 9, y: 0, w: 1, h: 1 },
    { x: ol + 168, y: om + 152, w: 24, h: 16 }
  ); //back
  // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 14, y: 1, w: 1, h: 1 },
    { x: ol + 245, y: om + 169, w: 24, h: 16 }
  ); //front
  generator.drawTextureLegacy(
    "Skin",
    { x: 14, y: 0, w: 1, h: 1 },
    { x: ol + 245, y: om + 153, w: 24, h: 16 }
  ); //back
  if (!hideHelmet) {
    // Hat
    generator.drawTextureLegacy(
      "Skin",
      { x: 0 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 25, y: oy + 65, w: 40, h: 32 }
    ); // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 16 + 32, y: 0, w: 8, h: 8 },
      { x: ox + 65, y: oy + 97, w: 40, h: 40 },
      { flip: "Vertical" }
    ); // bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 16 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 105, y: oy + 65, w: 40, h: 32 }
    ); // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 24 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 145, y: oy + 65, w: 40, h: 32 }
    ); // back
    generator.drawTextureLegacy(
      "Skin",
      { x: 8 + 32, y: 0, w: 8, h: 8 },
      { x: ox + 65, y: oy + 25, w: 40, h: 40 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 8 + 32, y: 8, w: 8, h: 8 },
      { x: ox + 65, y: oy + 65, w: 40, h: 32 }
    ); // face
    // nose Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 3 },
      { x: og + 241, y: oh + 76, w: 24, h: 12 }
    ); // front
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 4, h: 1 },
      { x: og + 241, y: oh + 68, w: 24, h: 8 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 45, y: 13, w: 1, h: 3 },
      { x: og + 265, y: oh + 76, w: 8, h: 12 }
    ); // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 15, w: 4, h: 1 },
      { x: og + 241, y: oh + 88, w: 24, h: 8 }
    ); // bottom
    generator.drawTextureLegacy(
      "Skin",
      { x: 42, y: 13, w: 1, h: 3 },
      { x: og + 233, y: oh + 76, w: 8, h: 12 }
    ); // left
    // left Helmet
    generator.drawTextureLegacy(
      "Skin",
      { x: 41, y: 1, w: 1, h: 1 },
      { x: ol + 168, y: om + 168, w: 24, h: 16 }
    ); //front
    generator.drawTextureLegacy(
      "Skin",
      { x: 41, y: 0, w: 1, h: 1 },
      { x: ol + 168, y: om + 152, w: 24, h: 16 }
    ); //back
    // right Helmet
    generator.drawTextureLegacy(
      "Skin",
      { x: 46, y: 1, w: 1, h: 1 },
      { x: ol + 245, y: om + 169, w: 24, h: 16 }
    ); //front
    generator.drawTextureLegacy(
      "Skin",
      { x: 46, y: 0, w: 1, h: 1 },
      { x: ol + 245, y: om + 153, w: 24, h: 16 }
    ); //back
  }
  // Legs
  if (alexModel) {
    // Front Right Leg
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 12 },
      { x: oa + 251, y: ob + 248, w: 16, h: 32 }
    ); // leg (right)
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 12 },
      { x: oa + 267, y: ob + 248, w: 16, h: 32 }
    ); // leg (front)
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 12 },
      { x: oa + 283, y: ob + 248, w: 16, h: 32 }
    ); // leg (left)
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 12 },
      { x: oa + 299, y: ob + 248, w: 16, h: 32 }
    ); // leg (back)
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: oa + 267, y: ob + 232, w: 16, h: 16 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: oa + 267, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  } else {
    // Front Right Leg
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 16, h: 12 },
      { x: oa + 251, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: oa + 267, y: ob + 232, w: 16, h: 16 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: oa + 267, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  if (!hideRightSleeve) {
    if (alexModel) {
      // Front Right Leg Pant
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 12 },
        { x: oa + 251, y: ob + 248, w: 16, h: 32 }
      ); // leg (right)
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 12 },
        { x: oa + 267, y: ob + 248, w: 16, h: 32 }
      ); // leg (front)
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 12 },
        { x: oa + 283, y: ob + 248, w: 16, h: 32 }
      ); // leg (left)
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: oa + 299, y: ob + 248, w: 16, h: 32 }
      ); // leg (back)
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: oa + 267, y: ob + 232, w: 16, h: 16 }
      ); // top
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: oa + 267, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    } else {
      // Front Right Leg Pant
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 16, h: 12 },
        { x: oa + 251, y: ob + 248, w: 64, h: 32 }
      ); // leg (all sides)
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: oa + 267, y: ob + 232, w: 16, h: 16 }
      ); // top
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: oa + 267, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    }
  }
  if (alexModel) {
    // Front Left Leg
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 12 },
      { x: oa + 340, y: ob + 248, w: 16, h: 32 }
    ); // leg (right)
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 12 },
      { x: oa + 356, y: ob + 248, w: 16, h: 32 }
    ); // leg (front)
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 12 },
      { x: oa + 372, y: ob + 248, w: 16, h: 32 }
    ); // leg (left)
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: oa + 388, y: ob + 248, w: 16, h: 32 }
    ); // leg (back)
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: oa + 356, y: ob + 232, w: 16, h: 16 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: oa + 356, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  } else {
    // Front Left Leg
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 16, h: 12 },
      { x: oa + 340, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 232, w: 16, h: 16 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  if (!hideLeftSleeve) {
    if (alexModel) {
      // Front Left Leg Pant
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 12 },
        { x: oa + 340, y: ob + 248, w: 16, h: 32 }
      ); // leg (right)
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 12 },
        { x: oa + 356, y: ob + 248, w: 16, h: 32 }
      ); // leg (front)
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 12 },
        { x: oa + 372, y: ob + 248, w: 16, h: 32 }
      ); // leg (left)
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: oa + 388, y: ob + 248, w: 16, h: 32 }
      ); // leg (back)
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: oa + 356, y: ob + 232, w: 16, h: 16 }
      ); // top
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: oa + 356, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    } else {
      // Front Left Leg Pant
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 16, h: 12 },
        { x: oa + 340, y: ob + 248, w: 64, h: 32 }
      ); // leg (all sides)
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: oa + 356, y: ob + 232, w: 16, h: 16 }
      ); // top
      generator.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: oa + 356, y: ob + 280, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // bottom
    }
  }
  ob = ob + 88;
  // Back Right Leg
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 16, h: 12 },
    { x: oa + 251, y: ob + 248, w: 64, h: 32 }
  ); // leg (all sides)
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: oa + 267, y: ob + 232, w: 16, h: 16 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: oa + 267, y: ob + 280, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // bottom
  if (!hideRightPant) {
    // Back Right Leg Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 16, h: 12 },
      { x: oa + 251, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: oa + 267, y: ob + 232, w: 16, h: 16 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: oa + 267, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  // Back Left Leg
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 16, h: 12 },
    { x: oa + 340, y: ob + 248, w: 64, h: 32 }
  ); // leg (all sides)
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: oa + 356, y: ob + 232, w: 16, h: 16 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: oa + 356, y: ob + 280, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // bottom
  if (!hideLeftPant) {
    // Back Left Leg Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 16, h: 12 },
      { x: oa + 340, y: ob + 248, w: 64, h: 32 }
    ); // leg (all sides)
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 232, w: 16, h: 16 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: oa + 356, y: ob + 280, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // bottom
  }
  const drawTail = (sx: number, sy: number, isArm: boolean) => {
    if (isArm && alexModel) {
      // Tail
      generator.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 4, w: 4, h: 6 },
        { x: oi + 469, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (right)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 4, y: sy + 4, w: 3, h: 6 },
        { x: oi + 477, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (front)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 7, y: sy + 4, w: 4, h: 6 },
        { x: oi + 485, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (left)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 11, y: sy + 4, w: 3, h: 6 },
        { x: oi + 493, y: oo + 294, w: 8, h: 64 }
      ); // leg1 (back)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 10, w: 4, h: 6 },
        { x: oi + 541, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (right)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 4, y: sy + 10, w: 3, h: 6 },
        { x: oi + 549, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (front)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 7, y: sy + 10, w: 4, h: 6 },
        { x: oi + 557, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (left)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 11, y: sy + 10, w: 3, h: 6 },
        { x: oi + 565, y: oo + 294, w: 8, h: 64 }
      ); // leg2 (back)
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 5, y: sy + 1, w: 1, h: 1 },
        { x: oi + 477, y: oo + 358, w: 8, h: 8 }
      ); // end1
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 9, y: sy + 1, w: 1, h: 1 },
        { x: oi + 549, y: oo + 358, w: 8, h: 8 }
      ); // end2
    } else {
      // Tail
      generator.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 4, w: 16, h: 6 },
        { x: oi + 469, y: oo + 294, w: 32, h: 64 }
      ); // leg1
      generator.drawTextureLegacy(
        "Skin",
        { x: sx, y: sy + 10, w: 16, h: 6 },
        { x: oi + 541, y: oo + 294, w: 32, h: 64 }
      ); // leg2
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 5, y: sy + 1, w: 1, h: 1 },
        { x: oi + 477, y: oo + 358, w: 8, h: 8 }
      ); // end1
      generator.drawTextureLegacy(
        "Skin",
        { x: sx + 9, y: sy + 1, w: 1, h: 1 },
        { x: oi + 549, y: oo + 358, w: 8, h: 8 }
      ); // end2
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
  /* // Tail Overlay
    generator.drawTextureLegacy(
      "Skin",
      {x: 0, y: 36, w: 16, h: 6},
      {x: oi + 469, y: oo + 294, w: 32, h: 64},
    ) // leg1
    generator.drawTextureLegacy(
      "Skin",
      {x: 0, y: 42, w: 16, h: 6},
      {x: oi + 541, y: oo + 294, w: 32, h: 64},
    ) // leg2
    generator.drawTextureLegacy(
      "Skin",
      {x: 5, y: 33, w: 1, h: 1},
      {x: oi + 477, y: oo + 358, w: 8, h: 8},
    ) // end1
    generator.drawTextureLegacy(
      "Skin",
      {x: 9, y: 33, w: 1, h: 1},
      {x: oi + 549, y: oo + 358, w: 8, h: 8},
    ) // end2 */
  // body
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 40, y: 241, w: 48, h: 128 }
  ); // left
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 88, y: 241, w: 32, h: 128 }
  ); // middle
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 120, y: 241, w: 48, h: 128 }
  ); // right
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 168, y: 241, w: 32, h: 128 }
  ); // top
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 88, y: 193, w: 32, h: 48 }
  ); // front
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 88, y: 369, w: 32, h: 48 },
    { flip: "Vertical" }
  ); // back
  if (!hideJacket) {
    // Jacket
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 40, y: 241, w: 48, h: 128 }
    ); // left
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 88, y: 241, w: 32, h: 128 }
    ); // middle
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 120, y: 241, w: 48, h: 128 }
    ); // right
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 168, y: 241, w: 32, h: 128 }
    ); // top
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 88, y: 193, w: 32, h: 48 }
    ); // front
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 88, y: 369, w: 32, h: 48 },
      { flip: "Vertical" }
    ); // back
  }
  // Background
  generator.drawImage("Background", [0, 0]);
  //Fold Lines
  if (showFolds) {
    generator.drawImage("Folds", [0, 0]);
  }
  // Labels
  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
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
