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

const id = "minecraft-villager-character";

const name = "Minecraft Villager Character";

const history: HistoryDef = [
  "Originally developed by Boe6Eod7Nty.",
  "06 Feb 2015 lostminer: Add user variables.",
  "13 Feb 2015 lostminer: Update to use new version of generator.",
  "18 Sep 2020 NinjolasNJM: Updated to use 1.8+ skins.",
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
  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");

  generator.defineRegionInput([22, 10, 256, 208], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([325, 26, 224, 192], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([173, 419, 128, 128], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([21, 419, 128, 128], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([178, 240, 128, 160], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([22, 240, 128, 160], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });

  // Nose1

  generator.drawTextureLegacy(
    "Skin",
    { x: 11, y: 13, w: 1, h: 1 },
    { x: 381, y: 446, w: 16, h: 16 }
  ); //NoseTop
  generator.drawTextureLegacy(
    "Skin",
    { x: 11, y: 13, w: 1, h: 1 },
    { x: 365, y: 462, w: 16, h: 32 }
  ); //RightSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 11, y: 13, w: 1, h: 1 },
    { x: 397, y: 462, w: 16, h: 32 }
  ); //LeftSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: 381, y: 462, w: 16, h: 32 }
  ); //NoseFront
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: 413, y: 462, w: 16, h: 32 }
  ); //NoseBack
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 13, w: 1, h: 1 },
    { x: 381, y: 494, w: 16, h: 16 }
  ); //NoseBottom

  // Nose2

  generator.drawTextureLegacy(
    "Skin",
    { x: 11, y: 14, w: 1, h: 1 },
    { x: 483, y: 446, w: 16, h: 16 }
  ); //NoseTop
  generator.drawTextureLegacy(
    "Skin",
    { x: 11, y: 14, w: 1, h: 1 },
    { x: 467, y: 462, w: 16, h: 32 }
  ); //RightSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 11, y: 14, w: 1, h: 1 },
    { x: 499, y: 462, w: 16, h: 32 }
  ); //LeftSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 14, w: 1, h: 1 },
    { x: 483, y: 462, w: 16, h: 32 }
  ); //NoseFront
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 14, w: 1, h: 1 },
    { x: 515, y: 462, w: 16, h: 32 }
  ); //NoseBack
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 14, w: 1, h: 1 },
    { x: 483, y: 494, w: 16, h: 16 }
  ); //NoseBottom

  // Head

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 32, h: 8 },
    { x: 22, y: 74, w: 256, h: 80 }
  ); // HeadSides
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 86, y: 10, w: 64, h: 64 }
  ); // HeadRoof
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 86, y: 154, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // HeadNeck

  if (!hideHelmet) {
    // Nose1
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 13, w: 1, h: 1 },
      { x: 381, y: 446, w: 16, h: 16 }
    ); //NoseTop
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 13, w: 1, h: 1 },
      { x: 365, y: 462, w: 16, h: 32 }
    ); //RightSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 13, w: 1, h: 1 },
      { x: 397, y: 462, w: 16, h: 32 }
    ); //LeftSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: 381, y: 462, w: 16, h: 32 }
    ); //NoseFront
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: 413, y: 462, w: 16, h: 32 }
    ); //NoseBack
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 13, w: 1, h: 1 },
      { x: 381, y: 494, w: 16, h: 16 }
    ); //NoseBottom
    // Nose2
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 14, w: 1, h: 1 },
      { x: 483, y: 446, w: 16, h: 16 }
    ); //NoseTop
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 14, w: 1, h: 1 },
      { x: 467, y: 462, w: 16, h: 32 }
    ); //RightSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 14, w: 1, h: 1 },
      { x: 499, y: 462, w: 16, h: 32 }
    ); //LeftSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 14, w: 1, h: 1 },
      { x: 483, y: 462, w: 16, h: 32 }
    ); //NoseFront
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 14, w: 1, h: 1 },
      { x: 515, y: 462, w: 16, h: 32 }
    ); //NoseBack
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 14, w: 1, h: 1 },
      { x: 483, y: 494, w: 16, h: 16 }
    ); //NoseBottom
    //Helmet
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 32, h: 8 },
      { x: 22, y: 74, w: 256, h: 80 }
    ); // HeadSides
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 86, y: 10, w: 64, h: 64 }
    ); // HeadRoof
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 86, y: 154, w: 64, h: 64 }
    ); // HeadNeck
  }

  // Body

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 373, y: 26, w: 64, h: 48 }
  ); // Neck
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 373, y: 170, w: 64, h: 48 }
    // {flip: "waist"},
  ); // Waist
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 325, y: 74, w: 48, h: 96 }
  ); // RightSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 437, y: 74, w: 48, h: 96 }
  ); // LeftSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 373, y: 74, w: 64, h: 96 }
  ); // Chest
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 485, y: 74, w: 64, h: 96 }
  ); // Back

  if (!hideJacket) {
    // Jacket
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 32, w: 8, h: 4 },
      { x: 373, y: 26, w: 64, h: 48 }
    ); // Neck
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 373, y: 170, w: 64, h: 48 }
      // {flip: "waist"},
    ); // Waist
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 325, y: 74, w: 48, h: 96 }
    ); // RightSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 437, y: 74, w: 48, h: 96 }
    ); // LeftSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 373, y: 74, w: 64, h: 96 }
    ); // Chest
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 485, y: 74, w: 64, h: 96 }
    ); // Back
  }

  // RightLeg

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 12, h: 12 },
    { x: 54, y: 272, w: 96, h: 96 }
  ); // LegSides
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 12 },
    { x: 22, y: 272, w: 32, h: 96 }
  ); // LegBack
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 86, y: 240, w: 32, h: 32 }
  ); // LegTop
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 86, y: 368, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // LegBottom

  if (!hideRightPant) {
    // RightPant
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 12, h: 12 },
      { x: 54, y: 272, w: 96, h: 96 }
    ); // LegSides
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 12 },
      { x: 22, y: 272, w: 32, h: 96 }
    ); // LegBack
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: 86, y: 240, w: 32, h: 32 }
    ); // LegTop
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: 86, y: 368, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // LegBottom
  }

  // LeftLeg

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 16, h: 12 },
    { x: 178, y: 272, w: 128, h: 96 }
  ); // LegSides
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 210, y: 240, w: 32, h: 32 }
  ); // LegTop
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 210, y: 368, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // LegBottom
  if (!hideLeftPant) {
    // LeftPant
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 52, w: 16, h: 12 },
      { x: 178, y: 272, w: 128, h: 96 }
    ); // LegSides
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: 210, y: 240, w: 32, h: 32 }
    ); // LegTop
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: 210, y: 368, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // LegBottom
  }

  // Arms and Hands

  // RightArm

  if (alexModel) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 28, w: 3, h: 4 },
      { x: 373, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightFist
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 3, h: 4 },
      { x: 341, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightArmPit
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 28, w: 4, h: 4 },
      { x: 373, y: 300, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightThumb
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 28, w: 4, h: 4 },
      { x: 373, y: 364, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightPinkie
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 28, w: 3, h: 4 },
      { x: 533, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // RightPalm
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 6 },
      { x: 21, y: 451, w: 32, h: 64 }
    ); // ArmRight
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 6 },
      { x: 53, y: 451, w: 32, h: 64 }
    ); // ArmFront
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 6 },
      { x: 85, y: 451, w: 32, h: 64 }
    ); // ArmLeft
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 6 },
      { x: 117, y: 451, w: 32, h: 64 }
    ); // ArmBack
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 53, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 3, h: 3 },
      { x: 53, y: 547, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // ArmElbow

    if (!hideRightSleeve) {
      // RightSleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 44, w: 3, h: 4 },
        { x: 373, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightFist
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 3, h: 4 },
        { x: 341, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightArmPit
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 44, w: 4, h: 4 },
        { x: 373, y: 300, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightThumb
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 44, w: 4, h: 4 },
        { x: 373, y: 364, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightPinkie
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 44, w: 3, h: 4 },
        { x: 533, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // RightPalm
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 4, h: 6 },
        { x: 21, y: 451, w: 32, h: 64 }
      ); // ArmRight
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 36, w: 3, h: 6 },
        { x: 53, y: 451, w: 32, h: 64 }
      ); // ArmFront
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 6 },
        { x: 85, y: 451, w: 32, h: 64 }
      ); // ArmLeft
      generator.drawTextureLegacy(
        "Skin",
        { x: 51, y: 36, w: 3, h: 6 },
        { x: 117, y: 451, w: 32, h: 64 }
      ); // ArmBack
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 3, h: 4 },
        { x: 53, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 3, h: 3 },
        { x: 53, y: 547, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // ArmElbow
    }
  } else {
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 28, w: 4, h: 4 },
      { x: 373, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightFist
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 4 },
      { x: 341, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightArmPit
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 28, w: 4, h: 4 },
      { x: 373, y: 300, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightThumb
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 28, w: 4, h: 4 },
      { x: 373, y: 364, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // RightPinkie
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 28, w: 4, h: 4 },
      { x: 533, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // RightPalm
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 16, h: 6 },
      { x: 21, y: 451, w: 128, h: 64 }
    ); // ArmSides
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 53, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 24, w: 4, h: 3 },
      { x: 53, y: 547, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // ArmElbow

    if (!hideRightSleeve) {
      // RightSleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 36, w: 16, h: 6 },
        { x: 21, y: 451, w: 128, h: 64 }
      ); // ArmSides
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 32, w: 4, h: 4 },
        { x: 53, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 4, h: 3 },
        { x: 53, y: 547, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // ArmElbow
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 44, w: 4, h: 4 },
        { x: 373, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightFist
      generator.drawTextureLegacy(
        "Skin",
        { x: 44, y: 40, w: 4, h: 4 },
        { x: 341, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightArmPit
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 44, w: 4, h: 4 },
        { x: 373, y: 300, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightThumb
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 44, w: 4, h: 4 },
        { x: 373, y: 364, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // RightPinkie
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 44, w: 4, h: 4 },
        { x: 533, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // RightPalm
    }
  }

  // LeftArm
  if (alexModel) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 60, w: 3, h: 4 },
      { x: 437, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftFist
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 3, h: 4 },
      { x: 469, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftArmPit
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 60, w: 4, h: 4 },
      { x: 437, y: 268, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftThumb
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 60, w: 4, h: 4 },
      { x: 437, y: 332, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftPinkie
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 60, w: 3, h: 4 },
      { x: 469, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // LeftPalm
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 6 },
      { x: 205, y: 451, w: 32, h: 64 }
    ); // ArmRight
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 6 },
      { x: 237, y: 451, w: 32, h: 64 }
    ); // ArmFront
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 6 },
      { x: 269, y: 451, w: 32, h: 64 }
    ); // ArmLeft
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 6 },
      { x: 173, y: 451, w: 32, h: 64 }
    ); // ArmBack
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 237, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 3, h: 3 },
      { x: 269, y: 515, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // ArmElbow

    if (!hideLeftSleeve) {
      // LeftSleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 60, w: 3, h: 4 },
        { x: 437, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftFist
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 3, h: 4 },
        { x: 469, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftArmPit
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 60, w: 4, h: 4 },
        { x: 437, y: 268, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftThumb
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 60, w: 4, h: 4 },
        { x: 437, y: 332, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftPinkie
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 60, w: 3, h: 4 },
        { x: 469, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // LeftPalm
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 6 },
        { x: 205, y: 451, w: 32, h: 64 }
      ); // ArmRight
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 52, w: 3, h: 6 },
        { x: 237, y: 451, w: 32, h: 64 }
      ); // ArmFront
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 52, w: 4, h: 6 },
        { x: 269, y: 451, w: 32, h: 64 }
      ); // ArmLeft
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 6 },
        { x: 173, y: 451, w: 32, h: 64 }
      ); // ArmBack
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 3, h: 4 },
        { x: 237, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 3, h: 3 },
        { x: 269, y: 515, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // ArmElbow
    }
  } else {
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 60, w: 4, h: 4 },
      { x: 437, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftFist
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 4 },
      { x: 469, y: 300, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftArmPit
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 60, w: 4, h: 4 },
      { x: 437, y: 268, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftThumb
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 60, w: 4, h: 4 },
      { x: 437, y: 332, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // LeftPinkie
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 60, w: 4, h: 4 },
      { x: 469, y: 332, w: 32, h: 32 },
      { rotateLegacy: 270.0 }
    ); // LeftPalm
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 12, h: 6 },
      { x: 205, y: 451, w: 96, h: 64 }
    ); // ArmSides
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 6 },
      { x: 173, y: 451, w: 32, h: 64 }
    ); // ArmBack
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 237, y: 419, w: 32, h: 32 }
    ); // ArmShoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 56, w: 4, h: 3 },
      { x: 269, y: 515, w: 32, h: 32 },
      { rotateLegacy: 90.0 }
    ); // ArmElbow
    if (!hideLeftSleeve) {
      // LeftSleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 12, h: 6 },
        { x: 205, y: 451, w: 96, h: 64 }
      ); // ArmSides
      generator.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 6 },
        { x: 173, y: 451, w: 32, h: 64 }
      ); // ArmBack
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 48, w: 4, h: 4 },
        { x: 237, y: 419, w: 32, h: 32 }
      ); // ArmShoulder
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 4, h: 3 },
        { x: 269, y: 515, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // ArmElbow
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 60, w: 4, h: 4 },
        { x: 437, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftFist
      generator.drawTextureLegacy(
        "Skin",
        { x: 52, y: 56, w: 4, h: 4 },
        { x: 469, y: 300, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftArmPit
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 60, w: 4, h: 4 },
        { x: 437, y: 268, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftThumb
      generator.drawTextureLegacy(
        "Skin",
        { x: 56, y: 60, w: 4, h: 4 },
        { x: 437, y: 332, w: 32, h: 32 },
        { rotateLegacy: 90.0 }
      ); // LeftPinkie
      generator.drawTextureLegacy(
        "Skin",
        { x: 60, y: 60, w: 4, h: 4 },
        { x: 469, y: 332, w: 32, h: 32 },
        { rotateLegacy: 270.0 }
      ); // LeftPalm
    }
  }

  // Robe1

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 71, y: 583, w: 64, h: 160 }
  ); //RobeFront
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 135, y: 583, w: 48, h: 160 }
  ); //RobeLeftSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 23, y: 583, w: 48, h: 160 }
  ); //RobeRightSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 183, y: 583, w: 64, h: 160 }
  ); //RobeBack

  if (!hideJacket) {
    // Robe1 Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 71, y: 583, w: 64, h: 160 }
    ); //RobeFront
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 135, y: 583, w: 48, h: 160 }
    ); //RobeLeftSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 23, y: 583, w: 48, h: 160 }
    ); //RobeRightSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 183, y: 583, w: 64, h: 160 }
    ); //RobeBack
  }

  // Robe2

  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 12 },
    { x: 407, y: 583, w: 48, h: 160 }
  ); //RobeLeftSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 12 },
    { x: 295, y: 583, w: 48, h: 160 }
  ); //RobeRightSide
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 12 },
    { x: 343, y: 583, w: 64, h: 160 }
  ); //RobeFront
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 12 },
    { x: 455, y: 583, w: 64, h: 160 }
  ); //RobeBack

  if (!hideJacket) {
    // Robe2 Overlay
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 36, w: 4, h: 12 },
      { x: 407, y: 583, w: 48, h: 160 }
    ); //RobeLeftSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 36, w: 4, h: 12 },
      { x: 295, y: 583, w: 48, h: 160 }
    ); //RobeRightSide
    generator.drawTextureLegacy(
      "Skin",
      { x: 20, y: 36, w: 8, h: 12 },
      { x: 343, y: 583, w: 64, h: 160 }
    ); //RobeFront
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 36, w: 8, h: 12 },
      { x: 455, y: 583, w: 64, h: 160 }
    ); //RobeBack
  }

  // Background

  generator.drawImage("Background", [0, 0]);

  // Folds

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
