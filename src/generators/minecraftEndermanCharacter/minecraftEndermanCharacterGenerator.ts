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
import { steve, alex } from "../_common/minecraftCharacterLegacy";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import steveTexture from "./textures/Steve.png";

const id = "minecraft-enderman-character";

const name = "Minecraft Enderman Character";

const history: HistoryDef = [
  "Originally developed by ODF.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "12 Sep 2020 NinjolasNJM - Updated to use 1.8+ skins; fixed rotation of left arms and legs.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Folds", url: foldsImage.src },
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
  // Define input textures

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

  // Get user variable values

  const alexModel = generator.getSelectInputValue("Skin Model Type") === "Alex";
  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  // Overlay Region variables

  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");

  generator.defineRegionInput([74, 25, 256, 192], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([268, 201, 192, 160], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([276, 384, 64, 270], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });
  generator.defineRegionInput([353, 384, 64, 270], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([96, 384, 64, 270], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([174, 384, 64, 270], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });

  // Background

  generator.drawImage("Background", [0, 0]);

  // Head

  generator.drawTextureLegacy("Skin", steve.base.head.right, {
    x: 74,
    y: 89,
    w: 64,
    h: 64,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.head.front, {
    x: 138,
    y: 89,
    w: 64,
    h: 64,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.head.left, {
    x: 202,
    y: 89,
    w: 64,
    h: 64,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.head.back, {
    x: 266,
    y: 89,
    w: 64,
    h: 64,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.head.top, {
    x: 138,
    y: 25,
    w: 64,
    h: 64,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.head.bottom,
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Body

  generator.drawTextureLegacy("Skin", steve.base.body.right, {
    x: 268,
    y: 233,
    w: 32,
    h: 96,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.body.front, {
    x: 300,
    y: 233,
    w: 64,
    h: 96,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.body.left, {
    x: 364,
    y: 233,
    w: 32,
    h: 96,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.body.back, {
    x: 396,
    y: 233,
    w: 64,
    h: 96,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.body.top, {
    x: 300,
    y: 201,
    w: 64,
    h: 32,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.body.bottom,
    { x: 300, y: 329, w: 64, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Right arm

  if (alexModel) {
    generator.drawTextureLegacy("Skin", alex.base.rightArm.right, {
      x: 96,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    generator.drawTextureLegacy("Skin", alex.base.rightArm.front, {
      x: 112,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    generator.drawTextureLegacy("Skin", alex.base.rightArm.left, {
      x: 128,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    generator.drawTextureLegacy("Skin", alex.base.rightArm.back, {
      x: 144,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    generator.drawTextureLegacy("Skin", alex.base.rightArm.top, {
      x: 112,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      alex.base.rightArm.bottom,
      { x: 112, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  } else {
    generator.drawTextureLegacy("Skin", steve.base.rightArm.right, {
      x: 96,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.base.rightArm.front, {
      x: 112,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.base.rightArm.left, {
      x: 128,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.base.rightArm.back, {
      x: 144,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.base.rightArm.top, {
      x: 112,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.base.rightArm.bottom,
      { x: 112, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Left arm

  if (alexModel) {
    generator.drawTextureLegacy("Skin", alex.base.leftArm.right, {
      x: 190,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    generator.drawTextureLegacy("Skin", alex.base.leftArm.front, {
      x: 206,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    generator.drawTextureLegacy("Skin", alex.base.leftArm.left, {
      x: 222,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    generator.drawTextureLegacy("Skin", alex.base.leftArm.back, {
      x: 174,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    generator.drawTextureLegacy("Skin", alex.base.leftArm.top, {
      x: 206,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      alex.base.leftArm.bottom,
      { x: 206, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  } else {
    generator.drawTextureLegacy("Skin", steve.base.leftArm.right, {
      x: 190,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.base.leftArm.front, {
      x: 206,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.base.leftArm.left, {
      x: 222,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.base.leftArm.back, {
      x: 174,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.base.leftArm.top, {
      x: 206,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.base.leftArm.bottom,
      { x: 206, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Right leg

  generator.drawTextureLegacy("Skin", steve.base.rightLeg.right, {
    x: 276,
    y: 400,
    w: 16,
    h: 238,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.front, {
    x: 292,
    y: 400,
    w: 16,
    h: 238,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.left, {
    x: 308,
    y: 400,
    w: 16,
    h: 238,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.back, {
    x: 324,
    y: 400,
    w: 16,
    h: 238,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.top, {
    x: 292,
    y: 384,
    w: 16,
    h: 16,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.rightLeg.bottom,
    { x: 292, y: 638, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Left Leg

  generator.drawTextureLegacy("Skin", steve.base.leftLeg.right, {
    x: 369,
    y: 400,
    w: 16,
    h: 238,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.front, {
    x: 385,
    y: 400,
    w: 16,
    h: 238,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.left, {
    x: 401,
    y: 400,
    w: 16,
    h: 238,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.back, {
    x: 353,
    y: 400,
    w: 16,
    h: 238,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.top, {
    x: 385,
    y: 384,
    w: 16,
    h: 16,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.leftLeg.bottom,
    { x: 385, y: 638, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Overlays

  if (!hideHelmet) {
    // Hat layer

    generator.drawTextureLegacy("Skin", steve.overlay.head.right, {
      x: 74,
      y: 89,
      w: 64,
      h: 64,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.head.front, {
      x: 138,
      y: 89,
      w: 64,
      h: 64,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.overlay.head.left, {
      x: 202,
      y: 89,
      w: 64,
      h: 64,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.head.back, {
      x: 266,
      y: 89,
      w: 64,
      h: 64,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.head.top, {
      x: 138,
      y: 25,
      w: 64,
      h: 64,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.head.bottom,
      { x: 138, y: 153, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom
  }
  if (!hideJacket) {
    // Jacket

    generator.drawTextureLegacy("Skin", steve.overlay.body.right, {
      x: 268,
      y: 233,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.body.front, {
      x: 300,
      y: 233,
      w: 64,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.overlay.body.left, {
      x: 364,
      y: 233,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.body.back, {
      x: 396,
      y: 233,
      w: 64,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.body.top, {
      x: 300,
      y: 201,
      w: 64,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.body.bottom,
      { x: 300, y: 329, w: 64, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
  }
  if (!hideRightSleeve) {
    // Right Sleeve

    if (alexModel) {
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.right, {
        x: 96,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.front, {
        x: 112,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.left, {
        x: 128,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.back, {
        x: 144,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.top, {
        x: 112,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      generator.drawTextureLegacy(
        "Skin",
        alex.overlay.rightArm.bottom,
        { x: 112, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    } else {
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.right, {
        x: 96,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.front, {
        x: 112,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.left, {
        x: 128,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.back, {
        x: 144,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.top, {
        x: 112,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      generator.drawTextureLegacy(
        "Skin",
        steve.overlay.rightArm.bottom,
        { x: 112, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    }
  }
  if (!hideLeftSleeve) {
    // Left Sleeve

    if (alexModel) {
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.right, {
        x: 190,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.front, {
        x: 206,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.front, {
        x: 222,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.back, {
        x: 174,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.top, {
        x: 206,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      generator.drawTextureLegacy(
        "Skin",
        alex.overlay.leftArm.bottom,
        { x: 206, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    } else {
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.right, {
        x: 190,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.front, {
        x: 206,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.front, {
        x: 222,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.back, {
        x: 174,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.top, {
        x: 206,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      generator.drawTextureLegacy(
        "Skin",
        steve.overlay.leftArm.bottom,
        { x: 206, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    }
  }
  if (!hideRightPant) {
    // Right Pant

    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.right, {
      x: 276,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.front, {
      x: 292,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.left, {
      x: 308,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.back, {
      x: 324,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.top, {
      x: 292,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.rightLeg.bottom,
      { x: 292, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }
  if (!hideLeftPant) {
    // Left Pant

    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.right, {
      x: 369,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.front, {
      x: 385,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.left, {
      x: 401,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.back, {
      x: 353,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.top, {
      x: 385,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.leftLeg.bottom,
      { x: 385, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Fold Lines

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
