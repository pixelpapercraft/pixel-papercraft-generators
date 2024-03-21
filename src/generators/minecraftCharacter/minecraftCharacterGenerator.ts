"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  InstructionsDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import { steve, alex } from "../_common/minecraftCharacter";
import { type Dimensions, Minecraft } from "../_common/minecraft";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import alexFoldsImage from "./images/AlexFolds.png";
import alexTabsImage from "./images/AlexTabs.png";
import backgroundImage from "./images/Background.png";
import labelsImage from "./images/Labels.png";
import steveFoldsImage from "./images/SteveFolds.png";
import steveTabsImage from "./images/SteveTabs.png";
import skinAlex64Image from "./textures/SkinAlex64x64.png";
import skinSteve64Image from "./textures/SkinSteve64x64.png";

const id = "minecraft-character";

const name = "Minecraft Character";

const history: HistoryDef = [
  "01 Feb 2015 gootube2000 - First release.",
  "05 Feb 2015 gootube2000 - Fixed orientation of the hands, feet and under the head.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "20 Feb 2015 lostminer - Make background non-transparent.",
  "02 Oct 2020 NinjolasNJM - Combined Steve and Alex Generators into one.",
  "27 May 2021 lostminer - Convert to ReScript generator.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "27 May 2022 NinjolasNJM - Made folds drawn using drawFolds, and parts drawn using drawCuboid, and added title",
  "12 Jun 2022 NinjolasNJM - Updated to use new Minecraft module",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const instructions: InstructionsDef = `
## How to use the Minecraft Character Generator?

1. Select your Minecraft skin file.
2. Choose the your Minecraft skin file model type.
3. Download and print your character papercraft.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "SteveTabs", url: steveTabsImage.src },
  { id: "SteveFolds", url: steveFoldsImage.src },
  { id: "AlexTabs", url: alexTabsImage.src },
  { id: "AlexFolds", url: alexFoldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skinSteve64Image.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Steve",
    url: skinSteve64Image.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Alex",
    url: skinAlex64Image.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Steve", "Alex"],
  });

  generator.defineSelectInput("Skin Model", ["Steve", "Alex"]);

  generator.defineBooleanInput("Show Folds", true);

  generator.defineBooleanInput("Show Labels", true);

  generator.defineText(
    "Click in the papercraft template to turn on and off the overlay for each part."
  );

  // Draw

  const isAlexModel = generator.getSelectInputValue("Skin Model") === "Alex";

  const showFolds = generator.getBooleanInputValue("Show Folds");

  const showLabels = generator.getBooleanInputValue("Show Labels");

  const showHeadOverlay = generator.getBooleanInputValueWithDefault(
    "Show Head Overlay",
    true
  );

  const showBodyOverlay = generator.getBooleanInputValueWithDefault(
    "Show Body Overlay",
    true
  );

  const showLeftArmOverlay = generator.getBooleanInputValueWithDefault(
    "Show Left Arm Overlay",
    true
  );

  const showRightArmOverlay = generator.getBooleanInputValueWithDefault(
    "Show Right Arm Overlay",
    true
  );

  const showLeftLegOverlay = generator.getBooleanInputValueWithDefault(
    "Show Left Leg Overlay",
    true
  );

  const showRightLegOverlay = generator.getBooleanInputValueWithDefault(
    "Show Right Leg Overlay",
    true
  );

  const char = isAlexModel ? alex : steve;

  function drawHead([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid("Skin", char.base.head, [ox, oy], dimensions);
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.head,
        [ox, oy],
        dimensions
      );
    }
  }

  function drawBody([ox, oy]: [number, number]) {
    const scale: Dimensions = [64, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.body, [ox, oy], scale);
    if (showBodyOverlay) {
      minecraftGenerator.drawCuboid("Skin", char.overlay.body, [ox, oy], scale);
    }
  }

  function drawRightArm([ox, oy]: [number, number]) {
    const scale: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.rightArm, [ox, oy], scale);
    if (showRightArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightArm,
        [ox, oy],
        scale
      );
    }
  }

  function drawLeftArm([ox, oy]: [number, number]) {
    const scale: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftArm,
      [ox, oy],
      scale,
      "East"
    );
    if (showLeftArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftArm,
        [ox, oy],
        scale,
        "East"
      );
    }
  }

  function drawRightLeg([ox, oy]: [number, number]) {
    const scale: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.rightLeg, [ox, oy], scale);
    if (showRightLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightLeg,
        [ox, oy],
        scale
      );
    }
  }

  function drawLeftLeg([ox, oy]: [number, number]) {
    const scale: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftLeg,
      [ox, oy],
      scale,
      "East"
    );
    if (showLeftLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftLeg,
        [ox, oy],
        scale,
        "East"
      );
    }
  }

  function drawFolds() {
    if (isAlexModel) {
      generator.drawImage("AlexFolds", [0, 0]);
    } else {
      generator.drawImage("SteveFolds", [0, 0]);
    }
    // Later replace with drawLineFold functions
  }

  // Background

  generator.drawImage("Background", [0, 0]);

  if (isAlexModel) {
    generator.drawImage("AlexTabs", [0, 0]);
  } else {
    generator.drawImage("SteveTabs", [0, 0]);
  }

  // Head

  const [oxHead, oyHead] = [74, 25];

  drawHead([oxHead, oyHead]);

  generator.defineRegionInput([oxHead, oyHead, 256, 192], () => {
    generator.setBooleanInputValue("Show Head Overlay", !showHeadOverlay);
  });

  // Body

  const [oxBody, oyBody] = [268, 201];

  drawBody([oxBody, oyBody]);

  generator.defineRegionInput([oxBody, oyBody, 192, 160], () => {
    generator.setBooleanInputValue("Show Body Overlay", !showBodyOverlay);
  });

  // Arms

  // Right Arm

  const [oxRightArm, oyRightArm] = isAlexModel ? [107, 373] : [99, 373];

  drawRightArm([oxRightArm, oyRightArm]);

  generator.defineRegionInput(
    [oxRightArm, oyRightArm, isAlexModel ? 112 : 128, 160],
    () => {
      generator.setBooleanInputValue(
        "Show Right Arm Overlay",
        !showRightArmOverlay
      );
    }
  );

  // Left Arm

  const [oxLeftArm, oyLeftArm] = isAlexModel ? [391, 373] : [383, 373];

  drawLeftArm([oxLeftArm, oyLeftArm]);

  generator.defineRegionInput(
    [oxLeftArm, oyLeftArm, isAlexModel ? 112 : 128, 166],
    () => {
      generator.setBooleanInputValue(
        "Show Left Arm Overlay",
        !showLeftArmOverlay
      );
    }
  );

  // Right Leg

  const [oxRightLeg, oyRightLeg] = [99, 587];

  drawRightLeg([oxRightLeg, oyRightLeg]);

  generator.defineRegionInput([oxRightLeg, oyRightLeg, 128, 160], () => {
    generator.setBooleanInputValue(
      "Show Right Leg Overlay",
      !showRightLegOverlay
    );
  });

  // Left Leg

  const [oxLeftLeg, oyLeftLeg] = [383, 587];

  drawLeftLeg([oxLeftLeg, oyLeftLeg]);

  generator.defineRegionInput([oxLeftLeg, oyLeftLeg, 128, 160], () => {
    generator.setBooleanInputValue(
      "Show Left Leg Overlay",
      !showLeftLegOverlay
    );
  });

  // Folds

  if (showFolds) {
    drawFolds();
  }

  // Labels

  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
  }
};

export const generator: GeneratorDef = {
  id,
  name,
  thumbnail,
  video: null,
  instructions,
  history,
  images,
  textures,
  script,
};
