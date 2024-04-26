"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  VideoDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import backgroundSteveImage from "./images/Background-Steve.png";
import backgroundAlexImage from "./images/Background-Alex.png";
import colorsSteveImage from "./images/Colors-Steve.png";
import colorsAlexImage from "./images/Colors-Alex.png";
import foldsSteveImage from "./images/Folds-Steve.png";
import foldsAlexImage from "./images/Folds-Alex.png";
import labelsImage from "./images/Labels.png";
import skin64x64SteveImage from "./textures/Skin64x64Steve.png";

const id = "minecraft-ultimate-bendable";

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

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skin64x64SteveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  // Define user inputs

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
    enableMinecraftSkinInput: true,
  });

  // Define user variables

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);
  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Color Codes", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showColorCodes = generator.getBooleanInputValue("Show Color Codes");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");

  // Define regions

  generator.defineRegionInput([10, 534, 192, 256], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([35, 50, 192, 328], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([265, 50, 128, 320], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([425, 426, 128, 320], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([425, 10, 128, 360], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([265, 386, 128, 360], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });

  // Head

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 790, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 74, y: 726, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 74, y: 662, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 74, y: 598, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 10, y: 726, w: 64, h: 64 },
    { rotateLegacy: 270.0 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 726, w: 64, h: 64 },
    { flip: "Vertical", rotateLegacy: 270.0 }
  ); // Bot

  // neck

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 36, y: 414, w: 64, h: 96 }
  ); // Neck

  // Chest

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 16, w: 24, h: 14 },
    { x: 35, y: 50, w: 192, h: 112 }
  ); // Chest
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 24, w: 8, h: 6 },
    { x: 131, y: 204, w: 64, h: 48 },
    { rotateLegacy: 180.0 }
  ); // Vertebra

  // Spine

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 24, w: 8, h: 4 },
    { x: 163, y: 143, w: 64, h: 128 }
  ); // Spine

  // Waist

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 24, w: 16, h: 8 },
    { x: 99, y: 282, w: 128, h: 64 }
  ); // Waist
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 28, w: 8, h: 4 },
    { x: 35, y: 314, w: 64, h: 32 }
  ); // Back Waist
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 4 },
    { x: 99, y: 346, w: 32, h: 32 }
  ); // Right Hip
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 4 },
    { x: 195, y: 346, w: 32, h: 32 }
  ); // Left Hip

  // Pelvis

  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 131, y: 380, w: 64, h: 130 }
  ); //Pelvis

  // Left Arm

  if (alexModel) {
    // Left Shoulder

    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 14, h: 8 },
      { x: 273, y: 82, w: 112, h: 64 }
    ); //Left Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 361, y: 58, w: 24, h: 32 },
      { rotateLegacy: 90.0 }
    ); //Left Scapula
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 56, w: 3, h: 4 },
      { x: 328, y: 194, w: 24, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Elbow

    // Left Forearm

    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: 329, y: 338, w: 24, h: 32 },
      { flip: "Vertical" }
    ); //Left Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 48, w: 11, h: 16 },
      { x: 297, y: 211, w: 88, h: 128 }
    ); //Left Forearm
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: 273, y: 243, w: 24, h: 96 }
    ); //Back Left Forearm

    // Left Elbow
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 3, h: 4 },
      { x: 361, y: 138, w: 24, h: 128 }
    ); //Left Elbow
  } else {
    //Left Shoulder

    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 16, h: 8 },
      { x: 265, y: 82, w: 128, h: 64 }
    ); //Left Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 361, y: 50, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); //Left Scapula
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 56, w: 4, h: 4 },
      { x: 328, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Elbow

    // Left Forearm

    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: 329, y: 338, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Left Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 48, w: 12, h: 16 },
      { x: 297, y: 211, w: 96, h: 128 }
    ); //Left Forearm
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 12 },
      { x: 265, y: 243, w: 32, h: 96 }
    ); //Back Left Forearm

    // Left Elbow

    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 4 },
      { x: 361, y: 138, w: 32, h: 128 }
    ); //Left Elbow
  }
  // Right Arm

  if (alexModel) {
    // Right Shoulder

    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 11, h: 8 },
      { x: 457, y: 458, w: 88, h: 64 }
    ); //Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 12 },
      { x: 433, y: 458, w: 24, h: 96 }
    ); //Back Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 457, y: 458, w: 24, h: 32 },
      { rotateLegacy: 270.0 }
    ); //Right Scapula
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 24, w: 3, h: 4 },
      { x: 513, y: 570, w: 24, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Elbow

    // Right Forearm

    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: 465, y: 714, w: 24, h: 32 },
      { flip: "Vertical" }
    ); //Right Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 16, w: 14, h: 16 },
      { x: 433, y: 587, w: 112, h: 128 }
    ); //Right Forearm

    // Right Elbow
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 3, h: 4 },
      { x: 433, y: 514, w: 24, h: 128 }
    ); //Right Elbow
  } else {
    // Right Shoulder

    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 12, h: 8 },
      { x: 457, y: 458, w: 96, h: 64 }
    ); //Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 20, w: 4, h: 12 },
      { x: 425, y: 458, w: 32, h: 96 }
    ); //Back Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 457, y: 458, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); //Right Scapula
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 24, w: 4, h: 4 },
      { x: 521, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Elbow

    // Right Forearm

    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: 457, y: 714, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Right Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 16, w: 16, h: 16 },
      { x: 425, y: 587, w: 128, h: 128 }
    ); //Right Forearm

    // Right Elbow
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 4 },
      { x: 425, y: 514, w: 32, h: 128 }
    ); //Right Elbow
  }

  // Left Thigh

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 16, h: 16 },
    { x: 425, y: 41, w: 128, h: 128 }
  ); //Left Thigh
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 4 },
    { x: 489, y: 41, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); //Left Buttock
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 56, w: 4, h: 4 },
    { x: 489, y: 194, w: 32, h: 48 },
    { rotateLegacy: 180.0 }
  ); //Left Hamstring

  // Left Calf

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 12, h: 16 },
    { x: 457, y: 210, w: 96, h: 128 }
  ); //Left Calf
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 12 },
    { x: 425, y: 242, w: 32, h: 96 }
  ); //Back Left Calf
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 489, y: 338, w: 32, h: 32 },
    { flip: "Vertical" }
  ); //Left Foot

  // Left Knee

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 56, w: 4, h: 4 },
    { x: 521, y: 138, w: 32, h: 128 }
  ); //Left Knee

  // Right Thigh

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 16, w: 16, h: 16 },
    { x: 297, y: 418, w: 128, h: 128 }
  ); //Right Thigh
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 12 },
    { x: 265, y: 450, w: 32, h: 96 }
  ); //Right Back Thigh
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 4 },
    { x: 361, y: 418, w: 32, h: 32 },
    { rotateLegacy: 180.0 }
  ); //Right Buttock
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 24, w: 4, h: 4 },
    { x: 361, y: 570, w: 32, h: 48 },
    { rotateLegacy: 180.0 }
  ); //Right Hamstring

  // Right Calf

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 16, w: 16, h: 16 },
    { x: 265, y: 586, w: 128, h: 128 }
  ); //Right Calf
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 297, y: 714, w: 32, h: 32 },
    { flip: "Vertical" }
  ); //Right Foot

  // Right Knee

  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 24, w: 4, h: 4 },
    { x: 265, y: 514, w: 32, h: 128 }
  ); //Right Knee

  // Overlay

  if (!hideHelmet) {
    // Head
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: 74, y: 790, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: 74, y: 726, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Face
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: 74, y: 662, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: 74, y: 598, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 10, y: 726, w: 64, h: 64 },
      { rotateLegacy: 270.0 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 138, y: 726, w: 64, h: 64 },
      { flip: "Vertical", rotateLegacy: 270.0 }
    ); // Bot
    //neck
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 36, y: 414, w: 64, h: 96 }
    );
  } // Neck
  if (!hideJacket) {
    // Chest

    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 32, w: 24, h: 14 },
      { x: 35, y: 50, w: 192, h: 112 }
    ); // Chest
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 40, w: 8, h: 6 },
      { x: 131, y: 204, w: 64, h: 48 },
      { rotateLegacy: 180.0 }
    ); // Vertebra

    // Spine

    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 40, w: 8, h: 4 },
      { x: 163, y: 143, w: 64, h: 128 }
    ); // Spine

    // Waist

    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 40, w: 16, h: 8 },
      { x: 99, y: 282, w: 128, h: 64 }
    ); // Waist
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 44, w: 8, h: 4 },
      { x: 35, y: 314, w: 64, h: 32 }
    ); // Back Waist
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 4, h: 4 },
      { x: 99, y: 346, w: 32, h: 32 }
    ); // Right Hip
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 52, w: 4, h: 4 },
      { x: 195, y: 346, w: 32, h: 32 }
    ); // Left Hip

    // Pelvis

    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 131, y: 380, w: 64, h: 130 }
    );
  } //Pelvis

  // Left Arm

  if (alexModel) {
    if (!hideLeftSleeve) {
      //Left Shoulder

      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 14, h: 8 },
        { x: 273, y: 82, w: 112, h: 64 }
      ); //Left Shoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: 361, y: 58, w: 24, h: 32 },
        { rotateLegacy: 90.0 }
      ); //Left Scapula
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 56, w: 3, h: 4 },
        { x: 328, y: 194, w: 24, h: 48 },
        { rotateLegacy: 180.0 }
      ); //Left Elbow

      // Left Forearm

      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: 329, y: 338, w: 24, h: 32 },
        { flip: "Vertical" }
      ); //Left Hand
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 48, w: 11, h: 16 },
        { x: 297, y: 211, w: 88, h: 128 }
      ); //Left Forearm
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: 273, y: 243, w: 24, h: 96 }
      ); //Back Left Forearm

      // Left Elbow

      generator.drawTextureLegacy(
        "Skin",
        { x: 36, y: 56, w: 3, h: 4 },
        { x: 361, y: 138, w: 24, h: 128 }
      ); //Left Elbow
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 3, h: 4 },
        { x: 361, y: 138, w: 24, h: 128 }
      ); //Left Elbow
    }
  } else if (!hideLeftSleeve) {
    // Left Shoulder

    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 52, w: 16, h: 8 },
      { x: 265, y: 82, w: 128, h: 64 }
    ); //Left Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 48, w: 4, h: 4 },
      { x: 361, y: 50, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); //Left Scapula
    generator.drawTextureLegacy(
      "Skin",
      { x: 60, y: 56, w: 4, h: 4 },
      { x: 328, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Elbow

    // Left Forearm

    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 48, w: 4, h: 4 },
      { x: 329, y: 338, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Left Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 48, w: 12, h: 16 },
      { x: 297, y: 211, w: 96, h: 128 }
    ); //Left Forearm
    generator.drawTextureLegacy(
      "Skin",
      { x: 60, y: 52, w: 4, h: 12 },
      { x: 265, y: 243, w: 32, h: 96 }
    ); //Back Left Forearm

    // Left Elbow

    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 4 },
      { x: 361, y: 138, w: 32, h: 128 }
    ); //Left Elbow
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 56, w: 4, h: 4 },
      { x: 361, y: 138, w: 32, h: 128 }
    );
  }

  // Right Arm

  if (alexModel) {
    if (!hideRightSleeve) {
      // Right Shoulder

      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 11, h: 8 },
        { x: 457, y: 458, w: 88, h: 64 }
      ); //Right Shoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 12 },
        { x: 433, y: 458, w: 24, h: 96 }
      ); //Back Right Shoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: 457, y: 458, w: 24, h: 32 },
        { rotateLegacy: 270.0 }
      ); //Right Scapula
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 40, w: 3, h: 4 },
        { x: 513, y: 570, w: 24, h: 48 },
        { rotateLegacy: 180.0 }
      ); //Right Elbow

      // Right Forearm

      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: 465, y: 714, w: 24, h: 32 },
        { flip: "Vertical" }
      ); //Right Hand
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 32, w: 14, h: 16 },
        { x: 433, y: 587, w: 112, h: 128 }
      ); //Right Forearm

      // Right Elbow

      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 24, w: 3, h: 4 },
        { x: 433, y: 514, w: 24, h: 128 }
      ); //Right Elbow
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 3, h: 4 },
        { x: 433, y: 514, w: 24, h: 128 }
      ); //Right Elbow
    }
  } else if (!hideRightSleeve) {
    // Right Shoulder

    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 36, w: 12, h: 8 },
      { x: 457, y: 458, w: 96, h: 64 }
    ); //Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 36, w: 4, h: 12 },
      { x: 425, y: 458, w: 32, h: 96 }
    ); //Back Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 4, h: 4 },
      { x: 457, y: 458, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); //Right Scapula
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 40, w: 4, h: 4 },
      { x: 521, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Elbow

    // Right Forearm

    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 32, w: 4, h: 4 },
      { x: 457, y: 714, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Right Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 32, w: 16, h: 16 },
      { x: 425, y: 587, w: 128, h: 128 }
    ); //Right Forearm

    // Right Elbow

    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 4 },
      { x: 425, y: 514, w: 32, h: 128 }
    ); //Right Elbow
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 40, w: 4, h: 4 },
      { x: 425, y: 514, w: 32, h: 128 }
    ); //Right Elbow
  }
  if (!hideLeftPant) {
    // Left Thigh

    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 48, w: 16, h: 16 },
      { x: 425, y: 41, w: 128, h: 128 }
    ); //Left Thigh
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 4 },
      { x: 489, y: 41, w: 32, h: 32 },
      { rotateLegacy: 180.0 }
    ); //Left Buttock
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 56, w: 4, h: 4 },
      { x: 489, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Hamstring
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 56, w: 4, h: 4 },
      { x: 489, y: 194, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Left Hamstring

    // Left Calf
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 48, w: 12, h: 16 },
      { x: 457, y: 210, w: 96, h: 128 }
    ); //Left Calf
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: 425, y: 242, w: 32, h: 96 }
    ); //Back Left Calf
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: 489, y: 338, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Left Foot

    // Left Knee

    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 56, w: 4, h: 4 },
      { x: 521, y: 138, w: 32, h: 128 }
    ); //Left Knee
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 56, w: 4, h: 4 },
      { x: 521, y: 138, w: 32, h: 128 }
    );
  } //Left Knee
  if (!hideRightPant) {
    // Right Thigh

    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 32, w: 16, h: 16 },
      { x: 297, y: 418, w: 128, h: 128 }
    ); //Right Thigh
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 12 },
      { x: 265, y: 450, w: 32, h: 96 }
    ); //Right Back Thigh
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 4 },
      { x: 361, y: 418, w: 32, h: 32 },
      { rotateLegacy: 180.0 }
    ); //Right Buttock
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 24, w: 4, h: 4 },
      { x: 361, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Hamstring
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 40, w: 4, h: 4 },
      { x: 361, y: 570, w: 32, h: 48 },
      { rotateLegacy: 180.0 }
    ); //Right Hamstring

    // Right Calf

    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 32, w: 16, h: 16 },
      { x: 265, y: 586, w: 128, h: 128 }
    ); //Right Calf
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: 297, y: 714, w: 32, h: 32 },
      { flip: "Vertical" }
    ); //Right Foot

    // Right Knee

    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 24, w: 4, h: 4 },
      { x: 265, y: 514, w: 32, h: 128 }
    ); //Right Knee
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 40, w: 4, h: 4 },
      { x: 265, y: 514, w: 32, h: 128 }
    ); //Right Knee
  }

  // Background

  if (alexModel) {
    generator.drawImage("Background-Alex", [0, 0]);
  } else {
    generator.drawImage("Background-Steve", [0, 0]);
  }

  // Folds

  if (showFolds) {
    if (alexModel) {
      generator.drawImage("Folds-Alex", [0, 0]);
    } else {
      generator.drawImage("Folds-Steve", [0, 0]);
    }
  }

  // Color Code

  if (showColorCodes) {
    if (alexModel) {
      generator.drawImage("Colors-Alex", [0, 0]);
    } else {
      generator.drawImage("Colors-Steve", [0, 0]);
    }
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
  video,
  instructions: null,
  images,
  textures,
  script,
};
