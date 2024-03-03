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
import { steve } from "../_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import tabsImage from "./images/Tabs.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import actionFigureImage from "./images/Action-Figure.png";
import actionFigureFoldsImage from "./images/Action-Figure-Folds.png";
import actionFigureLabelsImage from "./images/Action-Figure-Labels.png";
import steveImage from "./textures/Steve.png";

const id = "minecraft-creeper-character";

const name = "Minecraft Creeper Character";

const history: HistoryDef = [
  "Created by CanadaCraft, template by BrickyBoy99.",
  "13 Sep 2020 NinjolasNJM - Updated to work with 1.8+ Skins.",
  "17 Jul 2021 M16 - Updated generator photo.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Tabs", url: tabsImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Action-Figure", url: actionFigureImage.src },
  { id: "Action-Figure-Folds", url: actionFigureFoldsImage.src },
  { id: "Action-Figure-Labels", url: actionFigureLabelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: steveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  let ox: number;
  let oy: number;

  // Define input textures

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Action Figure", false);

  // Get user variables

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const actionFigure = generator.getBooleanInputValue("Action Figure");

  // Overlay Region variables

  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideFrontRightPant = generator.getBooleanInputValue(
    "Hide Front Right Pant"
  );
  const hideFrontLeftPant = generator.getBooleanInputValue(
    "Hide Front Left Pant"
  );
  const hideBackRightPant = generator.getBooleanInputValue(
    "Hide Back Right Pant"
  );
  const hideBackLeftPant = generator.getBooleanInputValue(
    "Hide Back Left Pant"
  );

  generator.defineRegionInput([164, 110, 260, 196], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([196, 340, 196, 196], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([62, 471, 134, 116], () => {
    generator.setBooleanInputValue(
      "Hide Front Right Pant",
      !hideFrontRightPant
    );
  });
  generator.defineRegionInput([121, 589, 134, 116], () => {
    generator.setBooleanInputValue("Hide Front Left Pant", !hideFrontLeftPant);
  });
  generator.defineRegionInput([419, 471, 134, 116], () => {
    generator.setBooleanInputValue("Hide Back Right Pant", !hideBackRightPant);
  });
  generator.defineRegionInput([367, 589, 134, 116], () => {
    generator.setBooleanInputValue("Hide Back Left Pant", !hideBackLeftPant);
  });

  // Background

  generator.drawImage("Background", [0, 0]);
  generator.drawImage("Tabs", [0, 0]);

  // Head

  ox = 164;
  oy = 110;

  generator.drawTexture("Skin", steve.base.head.right, [
    0 + ox,
    64 + oy,
    64,
    64,
  ]);
  generator.drawTexture("Skin", steve.base.head.front, [
    64 + ox,
    64 + oy,
    64,
    64,
  ]);
  generator.drawTexture("Skin", steve.base.head.left, [
    128 + ox,
    64 + oy,
    64,
    64,
  ]);
  generator.drawTexture("Skin", steve.base.head.back, [
    192 + ox,
    64 + oy,
    64,
    64,
  ]);
  generator.drawTexture("Skin", steve.base.head.top, [64 + ox, 0 + oy, 64, 64]);
  generator.drawTexture(
    "Skin",
    steve.base.head.bottom,
    [64 + ox, 128 + oy, 64, 64],
    { flip: "Vertical" }
  );

  // Body

  ox = 196;
  oy = 340;

  generator.drawTexture("Skin", steve.base.body.right, [
    0 + ox,
    32 + oy,
    32,
    96,
  ]);
  generator.drawTexture("Skin", steve.base.body.front, [
    32 + ox,
    32 + oy,
    64,
    96,
  ]);
  generator.drawTexture("Skin", steve.base.body.left, [
    96 + ox,
    32 + oy,
    32,
    96,
  ]);
  generator.drawTexture("Skin", steve.base.body.back, [
    128 + ox,
    32 + oy,
    64,
    96,
  ]);
  generator.drawTexture("Skin", steve.base.body.top, [32 + ox, oy, 64, 32]);
  generator.drawTexture(
    "Skin",
    steve.base.body.bottom,
    [80 + ox, 144 + oy, 64, 32],
    { flip: "Vertical", rotate: 90.0 }
  );

  // Front Right Foot

  ox = 62;
  oy = 471;

  generator.drawTexture("Skin", steve.base.rightLeg.back, [
    0 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.right, [
    32 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.front, [
    64 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.left, [
    96 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.top, [
    64 + ox,
    0 + oy,
    32,
    32,
  ]);
  generator.drawTexture(
    "Skin",
    steve.base.rightLeg.bottom,
    [64 + ox, 80 + oy, 32, 32],
    { flip: "Vertical" }
  );

  // Front Left Foot

  ox = 121;
  oy = 589;

  generator.drawTexture("Skin", steve.base.leftLeg.back, [
    0 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.right, [
    32 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.front, [
    64 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.left, [
    96 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.top, [
    64 + ox,
    0 + oy,
    32,
    32,
  ]);
  generator.drawTexture(
    "Skin",
    steve.base.leftLeg.bottom,
    [64 + ox, 80 + oy, 32, 32],
    { flip: "Vertical" }
  );

  // Back Right Foot

  ox = 419;
  oy = 471;

  generator.drawTexture("Skin", steve.base.rightLeg.right, [
    64 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.front, [
    96 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.left, [
    0 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.rightLeg.back, [
    32 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture(
    "Skin",
    steve.base.rightLeg.top,
    [32 + ox, oy, 32, 32],
    { rotate: 180.0 }
  );
  generator.drawTexture(
    "Skin",
    steve.base.rightLeg.bottom,
    [32 + ox, 80 + oy, 32, 32],
    { flip: "Vertical", rotate: 180.0 }
  );

  // Back Left Foot

  ox = 367;
  oy = 589;

  generator.drawTexture("Skin", steve.base.leftLeg.right, [
    64 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.front, [
    96 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.left, [
    0 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.back, [
    32 + ox,
    32 + oy,
    32,
    48,
  ]);
  generator.drawTexture("Skin", steve.base.leftLeg.top, [32 + ox, oy, 32, 32], {
    rotate: 180.0,
  });
  generator.drawTexture(
    "Skin",
    steve.base.leftLeg.bottom,
    [32 + ox, 80 + oy, 32, 32],
    { flip: "Vertical", rotate: 180.0 }
  );

  // Overlays

  if (!hideHelmet) {
    // Helmet

    ox = 164;
    oy = 110;

    generator.drawTexture("Skin", steve.overlay.head.right, [
      0 + ox,
      64 + oy,
      64,
      64,
    ]);
    generator.drawTexture("Skin", steve.overlay.head.front, [
      64 + ox,
      64 + oy,
      64,
      64,
    ]);
    generator.drawTexture("Skin", steve.overlay.head.left, [
      128 + ox,
      64 + oy,
      64,
      64,
    ]);
    generator.drawTexture("Skin", steve.overlay.head.back, [
      192 + ox,
      64 + oy,
      64,
      64,
    ]);
    generator.drawTexture("Skin", steve.overlay.head.top, [
      64 + ox,
      0 + oy,
      64,
      64,
    ]);
    generator.drawTexture(
      "Skin",
      steve.overlay.head.bottom,
      [64 + ox, 128 + oy, 64, 64],
      { flip: "Vertical" }
    );
  }

  if (!hideJacket) {
    // Jacket

    ox = 196;
    oy = 340;

    generator.drawTexture("Skin", steve.overlay.body.right, [
      0 + ox,
      32 + oy,
      32,
      96,
    ]);
    generator.drawTexture("Skin", steve.overlay.body.front, [
      32 + ox,
      32 + oy,
      64,
      96,
    ]);
    generator.drawTexture("Skin", steve.overlay.body.left, [
      96 + ox,
      32 + oy,
      32,
      96,
    ]);
    generator.drawTexture("Skin", steve.overlay.body.back, [
      128 + ox,
      32 + oy,
      64,
      96,
    ]);
    generator.drawTexture("Skin", steve.overlay.body.top, [
      32 + ox,
      oy,
      64,
      32,
    ]);
    generator.drawTexture(
      "Skin",
      steve.overlay.body.bottom,
      [80 + ox, 144 + oy, 64, 32],
      { flip: "Vertical", rotate: 90.0 }
    );
  }

  if (!hideFrontRightPant) {
    // Front Right Pant

    ox = 62;
    oy = 471;

    generator.drawTexture("Skin", steve.overlay.rightLeg.back, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.right, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.front, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.left, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.top, [
      64 + ox,
      0 + oy,
      32,
      32,
    ]);
    generator.drawTexture(
      "Skin",
      steve.overlay.rightLeg.bottom,
      [64 + ox, 80 + oy, 32, 32],
      { flip: "Vertical" }
    );
  }

  if (!hideFrontLeftPant) {
    // Front Left Pant

    ox = 121;
    oy = 589;

    generator.drawTexture("Skin", steve.overlay.leftLeg.back, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.right, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.front, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.left, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.top, [
      64 + ox,
      0 + oy,
      32,
      32,
    ]);
    generator.drawTexture(
      "Skin",
      steve.overlay.leftLeg.bottom,
      [64 + ox, 80 + oy, 32, 32],
      { flip: "Vertical" }
    );
  }

  if (!hideBackRightPant) {
    // Back Right Pant

    ox = 419;
    oy = 471;

    generator.drawTexture("Skin", steve.overlay.rightLeg.right, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.front, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.left, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.rightLeg.back, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture(
      "Skin",
      steve.overlay.rightLeg.top,
      [32 + ox, oy, 32, 32],
      { rotate: 180.0 }
    );
    generator.drawTexture(
      "Skin",
      steve.overlay.rightLeg.bottom,
      [32 + ox, 80 + oy, 32, 32],
      { flip: "Vertical", rotate: 180.0 }
    );
  }

  if (!hideBackLeftPant) {
    // Back Left Pant

    ox = 367;
    oy = 589;

    generator.drawTexture("Skin", steve.overlay.leftLeg.left, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.front, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.right, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture("Skin", steve.overlay.leftLeg.back, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    generator.drawTexture(
      "Skin",
      steve.overlay.leftLeg.top,
      [32 + ox, oy, 32, 32],
      { rotate: 180.0 }
    );
    generator.drawTexture(
      "Skin",
      steve.overlay.leftLeg.bottom,
      [32 + ox, 80 + oy, 32, 32],
      { flip: "Vertical", rotate: 180.0 }
    );
  }

  // Action Figure
  if (actionFigure) {
    // Neck

    generator.drawTexture("Skin", steve.base.head.bottom, [44, 254, 64, 96]);

    // Neck Overlay

    if (!hideHelmet) {
      generator.drawTexture(
        "Skin",
        steve.overlay.head.bottom,
        [44, 254, 64, 96]
      );
    }

    // Foreground

    generator.drawImage("Action-Figure", [0, 0]);

    // Folds

    if (showFolds) {
      generator.drawImage("Action-Figure-Folds", [0, 0]);
    }

    // Labels

    if (showLabels) {
      generator.drawImage("Action-Figure-Labels", [0, 0]);
    }
  }

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
