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
import { steve, alex } from "../_common/minecraftCharacterLegacy";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import steveImage from "./textures/Steve.png";

const id = "minecraft-cow-character";

const name = "Minecraft Cow Character";

const history: HistoryDef = [
  "Originally created by Poekoko.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "29 Sep 2020 NinjolasNJM - Updated to work with 1.8+ Skins.",
  "17 Jul 2021 M16 - Updated generator photo.",
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
    url: steveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  let ox: number;
  let oy: number;

  // Define input textures

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

  // Overlay region variables

  const hideHelmet = generator.getBooleanInputValue("Hide Helmet");
  const hideJacket = generator.getBooleanInputValue("Hide Jacket");
  const hideLeftSleeve = generator.getBooleanInputValue("Hide Left Sleeve");
  const hideRightSleeve = generator.getBooleanInputValue("Hide Right Sleeve");
  const hideLeftPant = generator.getBooleanInputValue("Hide Left Pant");
  const hideRightPant = generator.getBooleanInputValue("Hide Right Pant");

  generator.defineRegionInput([25, 24, 224, 160], () => {
    generator.setBooleanInputValue("Hide Helmet", !hideHelmet);
  });
  generator.defineRegionInput([194, 115, 352, 304], () => {
    generator.setBooleanInputValue("Hide Jacket", !hideJacket);
  });
  generator.defineRegionInput([421, 394, 128, 160], () => {
    generator.setBooleanInputValue("Hide Left Sleeve", !hideLeftSleeve);
  });
  generator.defineRegionInput([46, 394, 128, 160], () => {
    generator.setBooleanInputValue("Hide Right Sleeve", !hideRightSleeve);
  });
  generator.defineRegionInput([421, 586, 128, 160], () => {
    generator.setBooleanInputValue("Hide Left Pant", !hideLeftPant);
  });
  generator.defineRegionInput([46, 586, 128, 160], () => {
    generator.setBooleanInputValue("Hide Right Pant", !hideRightPant);
  });

  // Background

  generator.drawImage("Background", [0, 0]);

  // Head

  generator.drawTextureLegacy("Skin", steve.base.head.right, {
    x: 25,
    y: 72,
    w: 48,
    h: 64,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.head.front, {
    x: 73,
    y: 72,
    w: 64,
    h: 64,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.head.left, {
    x: 137,
    y: 72,
    w: 48,
    h: 64,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.head.back, {
    x: 185,
    y: 72,
    w: 64,
    h: 64,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.head.top, {
    x: 73,
    y: 24,
    w: 64,
    h: 48,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.head.bottom,
    { x: 73, y: 136, w: 64, h: 48 },
    { flip: "Vertical" }
  ); // Bottom

  // Arms

  if (alexModel) {
    // Right Arm

    ox = 46;
    oy = 394;

    generator.drawTextureLegacy("Skin", alex.base.rightArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", alex.base.rightArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", alex.base.rightArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", alex.base.rightArm.back, {
      x: ox + 96,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", alex.base.rightArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      alex.base.rightArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom

    // Left Arm

    ox = 453;
    oy = 394;

    generator.drawTextureLegacy("Skin", alex.base.leftArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", alex.base.leftArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", alex.base.leftArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", alex.base.leftArm.back, {
      x: ox - 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", alex.base.leftArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      alex.base.leftArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
  } else {
    // Right Arm

    ox = 46;
    oy = 394;

    generator.drawTextureLegacy("Skin", steve.base.rightArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.base.rightArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.base.rightArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.base.rightArm.back, {
      x: ox + 96,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.base.rightArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.base.rightArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom

    // Left Arm

    ox = 453;
    oy = 394;

    generator.drawTextureLegacy("Skin", steve.base.leftArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.base.leftArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.base.leftArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.base.leftArm.back, {
      x: ox - 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.base.leftArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.base.leftArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Body

  generator.drawTextureLegacy("Skin", steve.base.body.right, {
    x: 194,
    y: 195,
    w: 80,
    h: 144,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.body.front, {
    x: 274,
    y: 195,
    w: 96,
    h: 144,
  }); // Front
  generator.drawTextureLegacy("Skin", steve.base.body.left, {
    x: 370,
    y: 195,
    w: 80,
    h: 144,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.body.back, {
    x: 450,
    y: 195,
    w: 96,
    h: 144,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.body.top, {
    x: 274,
    y: 115,
    w: 96,
    h: 80,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.body.bottom,
    { x: 274, y: 339, w: 96, h: 80 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Leg

  ox = 46;
  oy = 586;

  generator.drawTextureLegacy("Skin", steve.base.rightLeg.right, {
    x: ox,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.front, {
    x: ox + 32,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.left, {
    x: ox + 64,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.back, {
    x: ox + 96,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.rightLeg.top, {
    x: ox + 32,
    y: oy,
    w: 32,
    h: 32,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.rightLeg.bottom,
    { x: ox + 32, y: oy + 128, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Left Leg

  ox = 453;
  oy = 586;

  generator.drawTextureLegacy("Skin", steve.base.leftLeg.right, {
    x: ox,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Right
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.front, {
    x: ox + 32,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Face
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.left, {
    x: ox + 64,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Left
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.back, {
    x: ox - 32,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Back
  generator.drawTextureLegacy("Skin", steve.base.leftLeg.top, {
    x: ox + 32,
    y: oy,
    w: 32,
    h: 32,
  }); // Top
  generator.drawTextureLegacy(
    "Skin",
    steve.base.leftLeg.bottom,
    { x: ox + 32, y: oy + 128, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Overlays

  if (!hideHelmet) {
    // Helmet
    generator.drawTextureLegacy("Skin", steve.overlay.head.right, {
      x: 25,
      y: 72,
      w: 48,
      h: 64,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.head.front, {
      x: 73,
      y: 72,
      w: 64,
      h: 64,
    }); // Front
    generator.drawTextureLegacy("Skin", steve.overlay.head.left, {
      x: 137,
      y: 72,
      w: 48,
      h: 64,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.head.back, {
      x: 185,
      y: 72,
      w: 64,
      h: 64,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.head.top, {
      x: 73,
      y: 24,
      w: 64,
      h: 48,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.head.bottom,
      { x: 73, y: 136, w: 64, h: 48 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Arms2

  if (alexModel) {
    if (!hideRightSleeve) {
      // Right Arm2

      const ox = 46;
      const oy = 394;

      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Face
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.left, {
        x: ox + 56,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.back, {
        x: ox + 88,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Back
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.top, {
        x: ox + 32,
        y: oy,
        w: 24,
        h: 32,
      }); // Top
      generator.drawTextureLegacy("Skin", alex.overlay.rightArm.bottom, {
        x: ox + 32,
        y: oy + 128,
        w: 24,
        h: 32,
      });
    } // Bottom

    if (!hideLeftSleeve) {
      // Left Arm2

      const ox = 453;
      const oy = 394;

      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Face
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.left, {
        x: ox + 56,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.back, {
        x: ox - 24,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Back
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.top, {
        x: ox + 32,
        y: oy,
        w: 24,
        h: 32,
      }); // Top
      generator.drawTextureLegacy("Skin", alex.overlay.leftArm.bottom, {
        x: ox + 32,
        y: oy + 128,
        w: 24,
        h: 32,
      });
    } // Bottom
  } else {
    if (!hideRightSleeve) {
      // Right Arm2

      const ox = 46;
      const oy = 394;

      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Face
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.left, {
        x: ox + 64,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.back, {
        x: ox + 96,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Back
      generator.drawTextureLegacy("Skin", steve.overlay.rightArm.top, {
        x: ox + 32,
        y: oy,
        w: 32,
        h: 32,
      }); // Top
      generator.drawTextureLegacy(
        "Skin",
        steve.overlay.rightArm.bottom,
        { x: ox + 32, y: oy + 128, w: 32, h: 32 },
        { flip: "Vertical" }
      );
    } // Bottom
    if (!hideLeftSleeve) {
      // Left Arm2

      const ox = 453;
      const oy = 394;

      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Face
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.left, {
        x: ox + 64,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.back, {
        x: ox - 32,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Back
      generator.drawTextureLegacy("Skin", steve.overlay.leftArm.top, {
        x: ox + 32,
        y: oy,
        w: 32,
        h: 32,
      }); // Top
      generator.drawTextureLegacy(
        "Skin",
        steve.overlay.leftArm.bottom,
        { x: ox + 32, y: oy + 128, w: 32, h: 32 },
        { flip: "Vertical" }
      );
    } // Bottom
  }
  if (!hideJacket) {
    // Jacket

    generator.drawTextureLegacy("Skin", steve.overlay.body.right, {
      x: 194,
      y: 195,
      w: 80,
      h: 144,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.body.front, {
      x: 274,
      y: 195,
      w: 96,
      h: 144,
    }); // Front
    generator.drawTextureLegacy("Skin", steve.overlay.body.left, {
      x: 370,
      y: 195,
      w: 80,
      h: 144,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.body.back, {
      x: 450,
      y: 195,
      w: 96,
      h: 144,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.body.top, {
      x: 274,
      y: 115,
      w: 96,
      h: 80,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.body.bottom,
      { x: 274, y: 339, w: 96, h: 80 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!hideRightPant) {
    // Right Leg2
    const ox = 46;
    const oy = 586;
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.back, {
      x: ox + 96,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.rightLeg.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.rightLeg.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    );
  } // Bottom

  if (!hideLeftPant) {
    // Left Leg2

    const ox = 453;
    const oy = 586;

    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.back, {
      x: ox - 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    generator.drawTextureLegacy("Skin", steve.overlay.leftLeg.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    generator.drawTextureLegacy(
      "Skin",
      steve.overlay.leftLeg.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    );
  } // Bottom

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
