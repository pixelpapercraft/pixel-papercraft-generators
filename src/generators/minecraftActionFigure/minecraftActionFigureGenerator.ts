"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  ThumbnailDef,
  TextureDef,
  ScriptDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import backgroundAlexImage from "./images/Backgroundalex.png";
import backgroundSteveImage from "./images/Backgroundsteve.png";
import foldsAlexImage from "./images/Foldsalex.png";
import foldsSteveImage from "./images/Foldssteve.png";
import labelsImage from "./images/Labels.png";
import notchImage from "./images/Notch.png";
import skin64x64SteveImage from "./textures/Skin64x64Steve.png";

const id = "minecraft-action-figure";

const name = "Minecraft Action Figure";

const history: HistoryDef = [
  "16 Aug 2020 NinjolasNJM - Initial script finished.",
  "03 Oct 2020 NinjolasNJM - Added Alex support and Hand Notches.",
  "09 Oct 2020 NinjolasNJM - Tweaked pelvis, bottom of body and leg height.",
  "24 Feb 2021 NinjolasNJM - Moved pelvis so that the leg's pivot point is accurate to the game, changed leg height accordingly.",
  "06 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Backgroundalex", url: backgroundAlexImage.src },
  { id: "Backgroundsteve", url: backgroundSteveImage.src },
  { id: "Foldsalex", url: foldsAlexImage.src },
  { id: "Foldssteve", url: foldsSteveImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Notch", url: notchImage.src },
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

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Hand Notches", false);
  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const handNotches = generator.getBooleanInputValue("Hand Notches");
  const showFolds = generator.getBooleanInputValue("Show Folds");
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
  generator.defineRegionInput([35, 50, 192, 144], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([265, 211, 128, 160], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([425, 587, 128, 160], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([425, 162, 128, 208], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([265, 538, 128, 208], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });

  // Head

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 790, w: 64, h: 64 },
    { rotateLegacy: -90 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 74, y: 726, w: 64, h: 64 },
    { rotateLegacy: -90.0 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 74, y: 662, w: 64, h: 64 },
    { rotateLegacy: -90.0 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 74, y: 598, w: 64, h: 64 },
    { rotateLegacy: -90.0 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 10, y: 726, w: 64, h: 64 },
    { rotateLegacy: -90.0 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 726, w: 64, h: 64 },
    { rotateLegacy: -90.0, flip: { kind: "Vertical" } }
  ); // Bot

  // Neck

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 36, y: 414, w: 64, h: 96 }
  ); // Bot

  // Pelvis

  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 163, y: 380, w: 32, h: 130 }
  ); // Left Pelvis
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 131, y: 380, w: 32, h: 130 }
  ); // Right Pelvis

  // Body

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 16, w: 24, h: 16 },
    { x: 35, y: 50, w: 192, h: 128 }
  ); // Body
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 4 },
    { x: 35, y: 178, w: 32, h: 32 }
  ); // Right hip
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 4 },
    { x: 131, y: 178, w: 32, h: 32 }
  ); // Left hip
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 67, y: 178, w: 64, h: 32 },
    { flip: { kind: "Vertical" } }
  ); // Bot

  // Arms

  if (alexModel) {
    // Left Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: 329, y: 338, w: 24, h: 32 },
      { flip: { kind: "Vertical" } }
    ); //Left Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 48, w: 11, h: 16 },
      { x: 297, y: 211, w: 88, h: 128 }
    ); //Left arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 12 },
      { x: 273, y: 243, w: 24, h: 96 }
    ); //Back Left Arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 4 },
      { x: 297, y: 121, w: 32, h: 32 }
    ); //Left Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 4 },
      { x: 297, y: 86, w: 32, h: 32 }
    ); //Left Shoulder Inside

    // Right Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: 465, y: 714, w: 24, h: 32 },
      { flip: { kind: "Vertical" } }
    ); //Right Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 16, w: 14, h: 16 },
      { x: 433, y: 587, w: 112, h: 128 }
    ); //Right Arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 4 },
      { x: 489, y: 496, w: 32, h: 32 }
    ); //Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 4 },
      { x: 489, y: 462, w: 32, h: 32 }
    ); //Right Shoulder Inside
  } else {
    // Left Arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: 329, y: 338, w: 32, h: 32 },
      { flip: { kind: "Vertical" } }
    ); //Left Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 48, w: 12, h: 16 },
      { x: 297, y: 211, w: 96, h: 128 }
    ); //Left arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 12 },
      { x: 265, y: 243, w: 32, h: 96 }
    ); //Back Left Arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 4 },
      { x: 297, y: 121, w: 32, h: 32 }
    ); //Left Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 4 },
      { x: 297, y: 86, w: 32, h: 32 }
    ); //Left Shoulder Inside

    //Right Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: 457, y: 714, w: 32, h: 32 },
      { flip: { kind: "Vertical" } }
    ); //Right Hand
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 16, w: 16, h: 16 },
      { x: 425, y: 587, w: 128, h: 128 }
    ); //Right Arm
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 20, w: 4, h: 4 },
      { x: 489, y: 496, w: 32, h: 32 }
    ); //Right Shoulder
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 20, w: 4, h: 4 },
      { x: 489, y: 462, w: 32, h: 32 }
    ); //Right Shoulder Inside
  }

  // Legs

  // Left Leg

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 12, h: 16 },
    { x: 457, y: 210, w: 96, h: 128 }
  ); //Left Leg
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 8 },
    { x: 521, y: 210, w: 32, h: 64 },
    { rotateLegacy: 180.0 }
  ); //Left Buttock
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 12 },
    { x: 425, y: 242, w: 32, h: 96 }
  ); //Back Left Leg
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 489, y: 338, w: 32, h: 32 },
    { flip: { kind: "Vertical" } }
  ); //Left foot
  //Right Leg
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 16, w: 16, h: 16 },
    { x: 265, y: 586, w: 128, h: 128 }
  ); //Right Leg
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 8 },
    { x: 329, y: 586, w: 32, h: 64 },
    { rotateLegacy: 180.0 }
  ); //Right Buttock
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 297, y: 714, w: 32, h: 32 },
    { flip: { kind: "Vertical" } }
  ); //Right foot

  // Overlay

  if (!hideHelmet) {
    // Helmet

    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 8, w: 8, h: 8 },
      { x: 74, y: 790, w: 64, h: 64 },
      { rotateLegacy: -90.0 }
    ); // Right
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 8, w: 8, h: 8 },
      { x: 74, y: 726, w: 64, h: 64 },
      { rotateLegacy: -90.0 }
    ); // Face
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 8, w: 8, h: 8 },
      { x: 74, y: 662, w: 64, h: 64 },
      { rotateLegacy: -90.0 }
    ); // Left
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 8, w: 8, h: 8 },
      { x: 74, y: 598, w: 64, h: 64 },
      { rotateLegacy: -90.0 }
    ); // Back
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 0, w: 8, h: 8 },
      { x: 10, y: 726, w: 64, h: 64 },
      { rotateLegacy: -90.0 }
    ); // Top
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 138, y: 726, w: 64, h: 64 },
      { rotateLegacy: -90.0, flip: { kind: "Vertical" } }
    ); // Bot
    //Neck
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 0, w: 8, h: 8 },
      { x: 36, y: 414, w: 64, h: 96 }
    );
  } // Bot

  if (!hideJacket) {
    // Jacket
    generator.drawTextureLegacy(
      "Skin",
      { x: 16, y: 32, w: 24, h: 16 },
      { x: 35, y: 50, w: 192, h: 128 }
    ); // Jacket
    generator.drawTextureLegacy(
      "Skin",
      { x: 28, y: 32, w: 8, h: 4 },
      { x: 67, y: 178, w: 64, h: 32 },
      { flip: { kind: "Vertical" } }
    );
  } // Bot

  // Sleeves

  if (alexModel) {
    if (!hideLeftSleeve) {
      //Left Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 55, y: 48, w: 3, h: 4 },
        { x: 329, y: 338, w: 24, h: 32 },
        { flip: { kind: "Vertical" } }
      ); //Left Glove
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 48, w: 11, h: 16 },
        { x: 297, y: 211, w: 88, h: 128 }
      ); //Left Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 59, y: 52, w: 3, h: 12 },
        { x: 273, y: 243, w: 24, h: 96 }
      ); //Back Left Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 4 },
        { x: 297, y: 121, w: 32, h: 32 }
      ); //Left Shoulder Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 4 },
        { x: 297, y: 86, w: 32, h: 32 }
      );
    } //Left Shoulder Sleeve Inside

    if (!hideRightSleeve) {
      //Right Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 32, w: 3, h: 4 },
        { x: 465, y: 714, w: 24, h: 32 },
        { flip: { kind: "Vertical" } }
      ); //Right Glove
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 32, w: 14, h: 16 },
        { x: 433, y: 587, w: 112, h: 128 }
      ); //Right Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 4 },
        { x: 489, y: 496, w: 32, h: 32 }
      ); //Right Shoulder Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 47, y: 36, w: 4, h: 4 },
        { x: 489, y: 462, w: 32, h: 32 }
      ); //Right Shoulder Sleeve Inside
    }
  } else {
    if (!hideLeftSleeve) {
      //Left Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 56, y: 48, w: 4, h: 4 },
        { x: 329, y: 338, w: 32, h: 32 },
        { flip: { kind: "Vertical" } }
      ); //Left Glove
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 48, w: 12, h: 16 },
        { x: 297, y: 211, w: 96, h: 128 }
      ); //Left Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 60, y: 52, w: 4, h: 12 },
        { x: 265, y: 243, w: 32, h: 96 }
      ); //Back Left Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 4 },
        { x: 297, y: 121, w: 32, h: 32 }
      ); //Left Shoulder Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 52, w: 4, h: 4 },
        { x: 297, y: 86, w: 32, h: 32 }
      ); //Left Shoulder Sleeve Inside
    }

    if (!hideRightSleeve) {
      //Right Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 32, w: 4, h: 4 },
        { x: 457, y: 714, w: 32, h: 32 },
        { flip: { kind: "Vertical" } }
      ); //Right Glove
      generator.drawTextureLegacy(
        "Skin",
        { x: 40, y: 32, w: 16, h: 16 },
        { x: 425, y: 587, w: 128, h: 128 }
      ); //Right Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 36, w: 4, h: 4 },
        { x: 489, y: 496, w: 32, h: 32 }
      ); //Right Shoulder Sleeve
      generator.drawTextureLegacy(
        "Skin",
        { x: 48, y: 36, w: 4, h: 4 },
        { x: 489, y: 462, w: 32, h: 32 }
      );
    } // Right Shoulder Sleeve Inside
  }

  // Pants

  if (!hideLeftPant) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 48, w: 4, h: 4 },
      { x: 163, y: 380, w: 32, h: 130 }
    ); // Left Pelvis
    //Left Leg Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 48, w: 12, h: 16 },
      { x: 457, y: 210, w: 96, h: 128 }
    ); //Left Leg Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 8 },
      { x: 521, y: 210, w: 32, h: 64 },
      { rotateLegacy: 180.0 }
    ); //Left Buttock Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 52, w: 4, h: 12 },
      { x: 425, y: 242, w: 32, h: 96 }
    ); //Back Left Leg Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 48, w: 4, h: 4 },
      { x: 489, y: 338, w: 32, h: 32 },
      { flip: { kind: "Vertical" } }
    ); //Left foot Shoe
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 52, w: 4, h: 4 },
      { x: 131, y: 178, w: 32, h: 32 }
    ); // Left Hip Pant
  }

  if (!hideRightPant) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 4, y: 32, w: 4, h: 4 },
      { x: 131, y: 380, w: 32, h: 130 }
    ); // Right Pelvis
    //Right Leg Pant
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 32, w: 16, h: 16 },
      { x: 265, y: 586, w: 128, h: 128 }
    ); //Right Leg
    generator.drawTextureLegacy(
      "Skin",
      { x: 12, y: 36, w: 4, h: 8 },
      { x: 329, y: 586, w: 32, h: 64 },
      { rotateLegacy: 180.0 }
    ); //Right Buttock
    generator.drawTextureLegacy(
      "Skin",
      { x: 8, y: 32, w: 4, h: 4 },
      { x: 297, y: 714, w: 32, h: 32 },
      { flip: { kind: "Vertical" } }
    ); //Right foot
    generator.drawTextureLegacy(
      "Skin",
      { x: 0, y: 36, w: 4, h: 4 },
      { x: 35, y: 178, w: 32, h: 32 }
    ); // Right Hip Pant
  }

  // Background
  if (alexModel) {
    generator.drawImage("Backgroundalex", [0, 0]);
  } else {
    generator.drawImage("Backgroundsteve", [0, 0]);
  }

  // Folds
  if (showFolds) {
    if (alexModel) {
      generator.drawImage("Foldsalex", [0, 0]);
    } else {
      generator.drawImage("Foldssteve", [0, 0]);
    }
  }

  // Hand Notches

  if (handNotches) {
    if (alexModel) {
      generator.drawImage("Notch", [341, 307]); // Front Left Notch
      generator.drawImage("Notch", [285, 307]); // Back Left Notch
      generator.drawImage("Notch", [477, 683]); // Front Right Notch
      generator.drawImage("Notch", [533, 683]); // Back Right Notch
    } else {
      generator.drawImage("Notch", [345, 307]); // Front Left Notch
      generator.drawImage("Notch", [281, 307]); // Back Left Notch
      generator.drawImage("Notch", [473, 683]); // Front Right Notch
      generator.drawImage("Notch", [537, 683]); // Back Right Notch
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
  video: null,
  instructions: null,
  images,
  textures,
  script,
};
