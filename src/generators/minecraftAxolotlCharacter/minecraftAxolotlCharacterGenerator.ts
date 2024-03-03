"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  ThumbnailDef,
  TextureDef,
  ScriptDef,
  VideoDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import {
  type Cuboid,
  type Layer,
  steve,
  alex,
  Rectangle,
} from "@genroot/generators/_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import steveImage from "./textures/Steve.png";
import axolotlBlueImage from "./textures/axolotl_blue.png";
import axolotlCyanImage from "./textures/axolotl_cyan.png";
import axolotlLucyImage from "./textures/axolotl_lucy.png";
import axolotlGoldImage from "./textures/axolotl_gold.png";
import axolotlWildImage from "./textures/axolotl_wild.png";

const id = "minecraft-axolotl-character";

const name = "Minecraft Axolotl Character";

const history: HistoryDef = [
  "Feb 2022 M16 - Initial script developed.",
  "6 Feb 2022 lostminer - Refactoring.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const video: VideoDef = {
  url: "https://www.youtube.com/embed/QVRD8Bl_hjA?rel=0",
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: steveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Blue",
    url: axolotlBlueImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Cyan",
    url: axolotlCyanImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Pink",
    url: axolotlLucyImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Gold",
    url: axolotlGoldImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Brown",
    url: axolotlWildImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

// Provides the parts of a rectangle

const xOf = (rectangle: Rectangle) => rectangle[0];
const yOf = (rectangle: Rectangle) => rectangle[1];
const heightOf = (rectangle: Rectangle) => rectangle[3];

// Calculates the top "n" pixels of a rectangle

const topOf = ([x, y, w]: Rectangle, n: number): Rectangle => [x, y, w, n];

// Calculates the bottom "n" pixels of a rectangle

const bottomOf = ([x, y, w, h]: Rectangle, n: number): Rectangle => [
  x,
  y + h - n,
  w,
  n,
];

// Arms, Legs, Hands, Feet

const armOrLegPart = (rectangle: Rectangle): Rectangle =>
  topOf(rectangle, heightOf(rectangle) - 1);

const handOrFootPart = (rectangle: Rectangle): Rectangle =>
  bottomOf(rectangle, 1);

const script: ScriptDef = (generator: Generator) => {
  const drawHead = (layer: Layer, faceStretch: number) => {
    const { head } = layer;

    const offset = ((): number => {
      switch (faceStretch) {
        case 0:
          return 0;
        case 1:
          return 6;
        case 2:
          return 12;
        case 3:
          return 20;
        case 4:
          return 32;
        default:
          return 40;
      }
    })();

    const ox = 229;
    const oy = 214;
    const pixelate = offset > 0;
    generator.drawTexture("Skin", head.right, [ox - 40, oy, 40 - offset, 40], {
      pixelate,
    });
    generator.drawTexture("Skin", head.front, [
      ox - offset,
      oy,
      64 + offset * 2,
      40,
    ]);
    generator.drawTexture(
      "Skin",
      head.left,
      [ox + 64 + offset, oy, 40 - offset, 40],
      { pixelate }
    );
    generator.drawTexture("Skin", head.back, [ox + 64 + 40, oy, 64, 40]);
    generator.drawTexture("Skin", head.top, [ox, oy - 40, 64, 40]);
    generator.drawTexture("Skin", head.bottom, [ox, oy + 40, 64, 40], {
      flip: "Vertical",
    });
  };

  const drawBody = (layer: Layer) => {
    const { body } = layer;
    const ox = 234;
    const oy = 405;
    generator.drawTexture("Skin", body.top, [ox, oy, 64, 32]);
    generator.drawTexture("Skin", body.back, [ox, oy - 80, 64, 80], {
      flip: "Vertical",
    });
    generator.drawTexture("Skin", body.bottom, [ox + 80 + 64, oy, 64, 32], {
      flip: "Vertical",
    });
    generator.drawTexture("Skin", body.front, [ox, oy + 32, 64, 80]);
    generator.drawTexture("Skin", body.left, [ox + 64, oy + 32, 32, 80], {
      rotateLegacy: -90.0,
    });
    generator.drawTexture("Skin", body.right, [ox, oy, 32, 80], {
      rotateLegacy: 90.0,
    });
  };

  const drawLimb = (leg: Cuboid, ox: number, oy: number) => {
    generator.drawTexture("Skin", armOrLegPart(leg.left), [
      ox + 8,
      oy - 24,
      8,
      24,
    ]);
    generator.drawTexture("Skin", handOrFootPart(leg.left), [ox, oy, 24, 16]);
    generator.drawTexture("Skin", armOrLegPart(leg.right), [
      ox - 16,
      oy - 24,
      8,
      24,
    ]);
    generator.drawTexture("Skin", handOrFootPart(leg.right), [
      ox - 24,
      oy,
      24,
      16,
    ]);
  };

  const drawArms = (layer: Layer) => {
    drawLimb(layer.leftArm, 461, 495);
    drawLimb(layer.rightArm, 403, 495);
  };

  const drawLegs = (layer: Layer) => {
    drawLimb(layer.rightLeg, 403, 548);
    drawLimb(layer.leftLeg, 461, 548);
  };

  const headFins = {
    topLeftBack: [249, 7, 24, 24] satisfies Rectangle,
    topLeftFront: [273, 7, 24, 24] satisfies Rectangle,
    topRightBack: [323, 7, 24, 24] satisfies Rectangle,
    topRightFront: [299, 7, 24, 24] satisfies Rectangle,

    middleLeftBack: [268, 41, 24, 32] satisfies Rectangle,
    middleLeftFront: [268, 73, 24, 32] satisfies Rectangle,
    middleRightBack: [304, 41, 24, 32] satisfies Rectangle,
    middleRightFront: [304, 73, 24, 32] satisfies Rectangle,

    bottomLeftBack: [268, 110, 24, 24] satisfies Rectangle,
    bottomLeftFront: [268, 134, 24, 24] satisfies Rectangle,
    bottomRightBack: [304, 110, 24, 24] satisfies Rectangle,
    bottomRightFront: [304, 134, 24, 24] satisfies Rectangle,
  };

  const drawHeadFins = (layer: Layer) => {
    const { top, right, left } = layer.head;

    const topX = xOf(top);
    const topY = yOf(top);

    const rightX = xOf(right);
    const rightY = yOf(right);

    const leftX = xOf(left);
    const leftY = yOf(left);

    generator.drawTexture(
      "Skin",
      [topX + 1, topY + 2, 2, 1],
      headFins.topLeftBack
    );

    generator.drawTexture(
      "Skin",
      [topX + 1, topY + 1, 2, 1],
      headFins.topLeftFront,
      {
        flip: "Horizontal",
      }
    );

    generator.drawTexture(
      "Skin",
      [topX + 5, topY + 1, 2, 1],
      headFins.topRightFront,
      {
        flip: "Horizontal",
      }
    );

    generator.drawTexture(
      "Skin",
      [topX + 5, topY + 2, 2, 1],
      headFins.topRightBack
    );

    generator.drawTexture(
      "Skin",
      [rightX + 1, rightY, 1, 3],
      headFins.middleLeftBack
    );

    generator.drawTexture(
      "Skin",
      [rightX + 2, rightY, 1, 3],
      headFins.middleLeftFront
    );

    generator.drawTexture(
      "Skin",
      [leftX + 6, leftY, 1, 3],
      headFins.middleRightBack
    );

    generator.drawTexture(
      "Skin",
      [leftX + 5, leftY, 1, 3],
      headFins.middleRightFront
    );

    generator.drawTexture(
      "Skin",
      [rightX + 2, rightY + 6, 1, 2],
      headFins.bottomLeftBack
    );

    generator.drawTexture(
      "Skin",
      [rightX + 1, rightY + 6, 1, 2],
      headFins.bottomLeftFront
    );

    generator.drawTexture(
      "Skin",
      [leftX + 5, leftY + 6, 1, 2],
      headFins.bottomRightBack
    );

    generator.drawTexture(
      "Skin",
      [leftX + 6, leftY + 6, 1, 2],
      headFins.bottomRightFront
    );
  };

  const drawHeadFinsTexture = () => {
    generator.drawTexture(
      "Head Fins Texture",
      [3, 37, 3, 3],
      headFins.topLeftBack
    );
    generator.drawTexture(
      "Head Fins Texture",
      [8, 37, 3, 3],
      headFins.topLeftFront
    );
    generator.drawTexture(
      "Head Fins Texture",
      [3, 37, 3, 3],
      headFins.topRightFront
    );
    generator.drawTexture(
      "Head Fins Texture",
      [8, 37, 3, 3],
      headFins.topRightBack
    );
    generator.drawTexture(
      "Head Fins Texture",
      [0, 40, 3, 4],
      headFins.middleLeftBack
    );
    generator.drawTexture(
      "Head Fins Texture",
      [0, 40, 3, 4],
      headFins.middleLeftFront,
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      "Head Fins Texture",
      [11, 40, 3, 4],
      headFins.middleRightBack
    );
    generator.drawTexture(
      "Head Fins Texture",
      [11, 40, 3, 4],
      headFins.middleRightFront,
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      "Head Fins Texture",
      [0, 44, 3, 3],
      headFins.bottomLeftBack
    );
    generator.drawTexture(
      "Head Fins Texture",
      [0, 44, 3, 3],
      headFins.bottomLeftFront,
      { flip: "Vertical" }
    );
    generator.drawTexture(
      "Head Fins Texture",
      [11, 44, 3, 3],
      headFins.bottomRightBack
    );
    generator.drawTexture(
      "Head Fins Texture",
      [11, 44, 3, 3],
      headFins.bottomRightFront,
      { flip: "Vertical" }
    );
  };

  const drawTailFins = (layer: Layer) => {
    const { back } = layer.body;

    const backX = xOf(back);
    const backY = yOf(back);
    const backHeight = heightOf(back);

    generator.drawTexture(
      "Skin",
      [backX + 3, backY, 1, backHeight],
      [258, 533, 40, 168]
    );

    generator.drawTexture(
      "Skin",
      [backX + 4, backY, 1, backHeight],
      [298, 533, 40, 168]
    );
  };

  const drawTailFinsTexture = () => {
    generator.drawTexture(
      // Left Side upper
      "Tail Fins Texture",
      [2, 26, 9, 1],
      [258 - 32, 533 + 32, 72, 8],
      { rotate: -90.0 }
    );
    generator.drawTexture(
      // Right Side upper
      "Tail Fins Texture",
      [2, 26, 9, 1],
      [330 - 32, 533 + 32, 72, 8],
      { rotate: -90.0, flip: "Vertical" }
    );
    generator.drawTexture(
      // Left Side lower
      "Tail Fins Texture",
      [2, 31, 12, 5],
      [258 - 28, 605 + 28, 96, 40],
      { rotate: -90.0 }
    );
    generator.drawTexture(
      // Right Side lower
      "Tail Fins Texture",
      [2, 31, 12, 5],
      [298 - 28, 605 + 28, 96, 40],
      { rotate: -90.0, flip: "Vertical" }
    );
  };

  // Define input textures

  generator.defineSelectInput("Skin Model Type", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  generator.defineTextureInput("Head Fins Texture", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Blue", "Cyan", "Pink", "Gold", "Brown"],
  });

  generator.defineTextureInput("Tail Fins Texture", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Blue", "Cyan", "Pink", "Gold", "Brown"],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Show Overlay", true);
  generator.defineRangeInput("Axolotl Face", {
    min: 0,
    max: 5,
    step: 1,
    value: 0,
  });

  // Get user variable values

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const showOverlay = generator.getBooleanInputValue("Show Overlay");
  const faceStretch = generator.getRangeInputValue("Axolotl Face") ?? 0;

  drawHead(steve.base, faceStretch);

  drawBody(steve.base);

  if (alexModel) {
    drawArms(alex.base);
  } else {
    drawArms(steve.base);
  }

  drawLegs(steve.base);

  drawHeadFins(steve.base);
  drawTailFins(steve.base);

  if (showOverlay) {
    drawHead(steve.overlay, faceStretch);
    drawBody(steve.overlay);
    if (alexModel) {
      drawArms(alex.overlay);
    } else {
      drawArms(steve.overlay);
    }
    drawLegs(steve.overlay);
    drawHeadFins(steve.overlay);
    drawTailFins(steve.overlay);
  }

  const showHeadFinsTexture = generator.hasTexture("Head Fins Texture");
  if (showHeadFinsTexture) {
    drawHeadFinsTexture();
  }

  const showTailFinsTexture = generator.hasTexture("Tail Fins Texture");

  if (showTailFinsTexture) {
    drawTailFinsTexture();
  }

  generator.drawImage("Background", [0, 0]);

  if (showFolds) {
    generator.drawImage("Folds", [0, 0]);
  }

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
