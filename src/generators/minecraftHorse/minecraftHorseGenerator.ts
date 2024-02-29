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

import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpeg";
import foregroundHorseImage from "./images/Foreground-Horse.png";
import foregroundMuleImage from "./images/Foreground-Mule.png";
import foldsHorseImage from "./images/Folds-Horse.png";
import foldsMuleImage from "./images/Folds-Mule.png";
import labelsImage from "./images/Labels.png";
import horseBlackTexture from "./textures/horse_black.png";
import horseBrownTexture from "./textures/horse_brown.png";
import horseChestnutTexture from "./textures/horse_chestnut.png";
import horseCreamyTexture from "./textures/horse_creamy.png";
import horseDarkbrownTexture from "./textures/horse_darkbrown.png";
import horseGrayTexture from "./textures/horse_gray.png";
import horseWhiteTexture from "./textures/horse_white.png";
import horseSkeletonTexture from "./textures/horse_skeleton.png";
import horseZombieTexture from "./textures/horse_zombie.png";
import donkeyTexture from "./textures/donkey.png";
import muleTexture from "./textures/mule.png";
import horseMarkingsBlackDotsTexture from "./textures/horse_markings_blackdots.png";
import horseMarkingsWhiteTexture from "./textures/horse_markings_white.png";
import horseMarkingsWhiteDotsTexture from "./textures/horse_markings_whitedots.png";
import horseMarkingsWhiteFieldTexture from "./textures/horse_markings_whitefield.png";
import horseArmorLeatherTexture from "./textures/horse_armor_leather.png";
import horseArmorGoldTexture from "./textures/horse_armor_gold.png";
import horseArmorIronTexture from "./textures/horse_armor_iron.png";
import horseArmorDiamondTexture from "./textures/horse_armor_diamond.png";

const id = "minecraft-horse";

const name = "Minecraft Horse";

const history: HistoryDef = [
  "11 Jul 2021 NinjolasNJM - Initial script finished.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  {
    id: "Foreground-Horse",
    url: foregroundHorseImage.src,
  },
  {
    id: "Foreground-Mule",
    url: foregroundMuleImage.src,
  },
  {
    id: "Folds-Horse",
    url: foldsHorseImage.src,
  },
  {
    id: "Folds-Mule",
    url: foldsMuleImage.src,
  },
  {
    id: "Labels",
    url: labelsImage.src,
  },
];

const textures: TextureDef[] = [
  {
    id: "Black Horse",
    url: horseBlackTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Brown Horse",
    url: horseBrownTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Chestnut Horse",
    url: horseChestnutTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Creamy Horse",
    url: horseCreamyTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Dark Brown Horse",
    url: horseDarkbrownTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Gray Horse",
    url: horseGrayTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White Horse",
    url: horseWhiteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Skeleton Horse",
    url: horseSkeletonTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Zombie Horse",
    url: horseZombieTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Donkey",
    url: donkeyTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Mule",
    url: muleTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Black Dots",
    url: horseMarkingsBlackDotsTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White",
    url: horseMarkingsWhiteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White Dots",
    url: horseMarkingsWhiteDotsTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White Field",
    url: horseMarkingsWhiteFieldTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Leather",
    url: horseArmorLeatherTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Gold",
    url: horseArmorGoldTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Iron",
    url: horseArmorIronTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Diamond",
    url: horseArmorDiamondTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  // Define user inputs

  generator.defineTextureInput("Horse", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [
      "Black Horse",
      "Brown Horse",
      "Chestnut Horse",
      "Creamy Horse",
      "Dark Brown Horse",
      "Gray Horse",
      "White Horse",
      "Skeleton Horse",
      "Zombie Horse",
      "Donkey",
      "Mule",
    ],
  });

  generator.defineTextureInput("Markings", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Black Dots", "White", "White Dots", "White Field"],
  });

  generator.defineTextureInput("Armor", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Leather", "Gold", "Iron", "Diamond"],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Donkey / Mule Model", false);

  // Get user variable values

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const muleModel = generator.getBooleanInputValue("Donkey / Mule Model");

  const drawHorse = (texture: string) => {
    let ox: number;
    let oy: number;

    // Head
    ox = 20;
    oy = 20;
    generator.drawTexture(texture, [7, 13, 6, 7], [ox + 56, oy + 0, 48, 56]); // Top
    generator.drawTexture(texture, [13, 13, 6, 7], [ox + 56, oy + 96, 48, 56], {
      flip: "Vertical",
    }); // Bottom
    generator.drawTexture(texture, [0, 20, 7, 5], [ox + 0, oy + 56, 56, 40]); // Right
    generator.drawTexture(texture, [7, 20, 6, 5], [ox + 56, oy + 56, 48, 40]); // Front
    generator.drawTexture(texture, [13, 20, 7, 5], [ox + 104, oy + 56, 56, 40]); // Left
    generator.drawTexture(texture, [20, 20, 6, 5], [ox + 160, oy + 56, 48, 40]); // Back
    // Mouth
    ox = 140;
    oy = 142;
    generator.drawTexture(texture, [5, 25, 4, 5], [ox + 40, oy + 0, 32, 40]); // Top
    generator.drawTexture(texture, [9, 25, 4, 5], [ox + 40, oy + 80, 32, 40], {
      flip: "Vertical",
    }); // Bottom
    generator.drawTexture(texture, [0, 30, 5, 5], [ox + 0, oy + 40, 40, 40]); // Right
    generator.drawTexture(texture, [5, 30, 4, 5], [ox + 40, oy + 40, 32, 40]); // Front
    generator.drawTexture(texture, [9, 30, 5, 5], [ox + 72, oy + 40, 40, 40]); // Left
    generator.drawTexture(texture, [14, 30, 4, 5], [ox + 112, oy + 40, 32, 40]); // Back
    // Neck
    ox = 24;
    oy = 232;
    generator.drawTexture(texture, [7, 35, 4, 7], [ox + 56, oy + 0, 32, 56]); // Top
    generator.drawTexture(
      texture,
      [11, 35, 4, 7],
      [ox + 56, oy + 152, 32, 56],
      { flip: "Vertical" }
    ); // Bottom
    generator.drawTexture(texture, [0, 42, 7, 12], [ox + 0, oy + 56, 56, 96]); // Right
    generator.drawTexture(texture, [7, 42, 4, 12], [ox + 56, oy + 56, 32, 96]); // Front
    generator.drawTexture(texture, [11, 42, 7, 12], [ox + 88, oy + 56, 56, 96]); // Left
    generator.drawTexture(
      texture,
      [18, 42, 4, 12],
      [ox + 144, oy + 56, 32, 96]
    ); // Back

    // Mane

    ox = 321;
    oy = 16;

    generator.drawTexture(texture, [58, 36, 2, 2], [ox + 16, oy + 0, 16, 16], {
      rotate: 180.0,
    }); // Top
    generator.drawTexture(
      texture,
      [56, 38, 2, 16],
      [ox + 32, oy + 16, 16, 128]
    ); // Right
    generator.drawTexture(
      texture,
      [58, 38, 2, 16],
      [ox + 48, oy + 16, 16, 128]
    ); // Front
    generator.drawTexture(texture, [60, 38, 2, 16], [ox + 0, oy + 16, 16, 128]); // Left
    generator.drawTexture(
      texture,
      [62, 38, 2, 16],
      [ox + 16, oy + 16, 16, 128]
    ); // Back

    // Tail

    ox = 224;
    oy = 348;

    generator.drawTexture(texture, [46, 36, 3, 4], [ox + 32, oy + 0, 24, 32], {
      rotate: 180.0,
    }); // Top
    generator.drawTexture(
      texture,
      [42, 40, 4, 14],
      [ox + 56, oy + 32, 32, 112]
    ); // Right
    generator.drawTexture(
      texture,
      [46, 40, 3, 14],
      [ox + 88, oy + 32, 24, 112]
    ); // Front
    generator.drawTexture(texture, [49, 40, 4, 14], [ox + 0, oy + 32, 32, 112]); // Left
    generator.drawTexture(
      texture,
      [53, 40, 3, 14],
      [ox + 32, oy + 32, 24, 112]
    ); // Back

    // Horse Ears

    const horseEars = (ox: number, oy: number) => {
      generator.drawTexture(texture, [20, 16, 2, 1], [ox + 8, oy + 40, 16, 8]); // Top
      generator.drawTexture(texture, [22, 16, 2, 1], [ox + 8, oy + 64, 16, 8], {
        flip: "Vertical",
      }); // Bottom
      generator.drawTexture(texture, [19, 17, 1, 2], [ox + 0, oy + 48, 8, 16]); // Right
      generator.drawTexture(texture, [20, 17, 2, 2], [ox + 8, oy + 48, 16, 16]); // Front
      generator.drawTexture(texture, [22, 17, 1, 2], [ox + 24, oy + 48, 8, 16]); // Left
      generator.drawTexture(
        texture,
        [23, 17, 2, 2],
        [ox + 32, oy + 48, 16, 16]
      ); // Back
    };

    // Donkey / Mule Ears

    const muleEars = (ox: number, oy: number) => {
      generator.drawTexture(texture, [1, 12, 2, 1], [ox + 8, oy + 0, 16, 8]); // Top
      generator.drawTexture(texture, [3, 12, 2, 1], [ox + 8, oy + 64, 16, 8], {
        flip: "Vertical",
      }); // Bottom
      generator.drawTexture(texture, [0, 13, 1, 7], [ox + 0, oy + 8, 8, 56]); // Right
      generator.drawTexture(texture, [1, 13, 2, 7], [ox + 8, oy + 8, 16, 56]); // Front
      generator.drawTexture(texture, [3, 13, 1, 7], [ox + 24, oy + 8, 8, 56]); // Left
      generator.drawTexture(texture, [4, 13, 2, 7], [ox + 32, oy + 8, 16, 56]); // Back
    };

    // Left Ear

    ox = 332;
    oy = 249;

    if (muleModel) {
      muleEars(ox, oy);
    } else {
      horseEars(ox, oy);
    }

    // Right Ear

    ox = 256;
    oy = 249;

    if (muleModel) {
      muleEars(ox, oy);
    } else {
      horseEars(ox, oy);
    }

    // Body

    ox = 40;
    oy = 452;

    generator.drawTexture(
      texture,
      [22, 32, 10, 22],
      [ox + 80, oy + 80, 80, 176],
      { rotate: 180.0 }
    ); // Top
    generator.drawTexture(
      texture,
      [32, 32, 10, 22],
      [ox + 240, oy + 80, 80, 176],
      { flip: "Vertical" }
    ); // Bottom
    generator.drawTexture(
      texture,
      [0, 54, 22, 10],
      [ox + 112, oy + 128, 176, 80],
      { rotate: -90.0 }
    ); // Right
    generator.drawTexture(
      texture,
      [22, 54, 10, 10],
      [ox + 80, oy + 0, 80, 80],
      { rotate: 180.0 }
    ); // Front
    generator.drawTexture(
      texture,
      [32, 54, 22, 10],
      [ox - 48, oy + 128, 176, 80],
      { rotate: 90.0 }
    ); // Left
    generator.drawTexture(
      texture,
      [54, 54, 10, 10],
      [ox + 80, oy + 256, 80, 80]
    ); // Back

    // Front Left Leg

    ox = 413;
    oy = 40;

    generator.drawTexture(texture, [52, 21, 4, 4], [ox + 64, oy + 0, 32, 32], {
      flip: "Horizontal",
    }); // Top
    generator.drawTexture(
      texture,
      [56, 21, 4, 4],
      [ox + 64, oy + 120, 32, 32],
      { rotate: 180.0 }
    ); // Bottom
    generator.drawTexture(
      texture,
      [48, 25, 4, 11],
      [ox + 96, oy + 32, 32, 88],
      { flip: "Horizontal" }
    ); // Right
    generator.drawTexture(
      texture,
      [52, 25, 4, 11],
      [ox + 64, oy + 32, 32, 88],
      { flip: "Horizontal" }
    ); // Front
    generator.drawTexture(
      texture,
      [56, 25, 4, 11],
      [ox + 32, oy + 32, 32, 88],
      { flip: "Horizontal" }
    ); // Left
    generator.drawTexture(texture, [60, 25, 4, 11], [ox + 0, oy + 32, 32, 88], {
      flip: "Horizontal",
    }); // Back

    // Front Right Leg

    ox = 413;
    oy = 238;

    generator.drawTexture(texture, [52, 21, 4, 4], [ox + 32, oy + 0, 32, 32]); // Top
    generator.drawTexture(
      texture,
      [56, 21, 4, 4],
      [ox + 32, oy + 120, 32, 32],
      { flip: "Vertical" }
    ); // Bottom
    generator.drawTexture(texture, [48, 25, 4, 11], [ox + 0, oy + 32, 32, 88]); // Right
    generator.drawTexture(texture, [52, 25, 4, 11], [ox + 32, oy + 32, 32, 88]); // Front
    generator.drawTexture(texture, [56, 25, 4, 11], [ox + 64, oy + 32, 32, 88]); // Left
    generator.drawTexture(texture, [60, 25, 4, 11], [ox + 96, oy + 32, 32, 88]); // Back
    // Back Left Leg
    ox = 413;
    oy = 436;
    generator.drawTexture(texture, [52, 21, 4, 4], [ox + 64, oy + 0, 32, 32], {
      flip: "Horizontal",
    }); // Top
    generator.drawTexture(
      texture,
      [56, 21, 4, 4],
      [ox + 64, oy + 120, 32, 32],
      { rotate: 180.0 }
    ); // Bottom
    generator.drawTexture(
      texture,
      [48, 25, 4, 11],
      [ox + 96, oy + 32, 32, 88],
      { flip: "Horizontal" }
    ); // Right
    generator.drawTexture(
      texture,
      [52, 25, 4, 11],
      [ox + 64, oy + 32, 32, 88],
      { flip: "Horizontal" }
    ); // Front
    generator.drawTexture(
      texture,
      [56, 25, 4, 11],
      [ox + 32, oy + 32, 32, 88],
      { flip: "Horizontal" }
    ); // Left
    generator.drawTexture(texture, [60, 25, 4, 11], [ox + 0, oy + 32, 32, 88], {
      flip: "Horizontal",
    }); // Back
    // Back Right Leg
    ox = 413;
    oy = 634;
    generator.drawTexture(texture, [52, 21, 4, 4], [ox + 32, oy + 0, 32, 32]); // Top
    generator.drawTexture(
      texture,
      [56, 21, 4, 4],
      [ox + 32, oy + 120, 32, 32],
      { flip: "Vertical" }
    ); // Bottom
    generator.drawTexture(texture, [48, 25, 4, 11], [ox + 0, oy + 32, 32, 88]); // Right
    generator.drawTexture(texture, [52, 25, 4, 11], [ox + 32, oy + 32, 32, 88]); // Front
    generator.drawTexture(texture, [56, 25, 4, 11], [ox + 64, oy + 32, 32, 88]); // Left
    generator.drawTexture(texture, [60, 25, 4, 11], [ox + 96, oy + 32, 32, 88]); // Back
  };

  // Draw Horse

  drawHorse("Horse");
  drawHorse("Markings");
  drawHorse("Armor");

  // Foreground

  if (muleModel) {
    generator.drawImage("Foreground-Mule", [0, 0]);
  } else {
    generator.drawImage("Foreground-Horse", [0, 0]);
  }

  // Folds

  if (showFolds) {
    if (muleModel) {
      generator.drawImage("Folds-Mule", [0, 0]);
    } else {
      generator.drawImage("Folds-Horse", [0, 0]);
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
