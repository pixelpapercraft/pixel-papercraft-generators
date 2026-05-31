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
import leatherTexture from "./textures/leather.png";
import leatherOverlayTexture from "./textures/leather_overlay.png";
import goldTexture from "./textures/gold.png";
import copperTexture from "./textures/copper.png";
import ironTexture from "./textures/iron.png";
import diamondTexture from "./textures/diamond.png";
import netheriteTexture from "./textures/netherite.png";
import { Blend } from "@genroot/builder/modules/renderers/drawTexture";
import { Dimensions, Minecraft } from "../_common/minecraft";
import { horse } from "../_common/minecraftEntity";
import {
  defineGlintControls,
  entityGlintTextureDefs,
} from "../_common/plugins/glint";
import { defineTintInput } from "../_common/tintSelector/tintSelector";
import { armorTintChoiceGroups } from "../_common/tintSelector/tints";

const id = "minecraft-horse";

const name = "Minecraft Horse";

const history: HistoryDef = [
  "11 Jul 2021 NinjolasNJM - Initial script finished.",
  "16 May 2026 NinjolasNJM - Changed to use new glint and tint input.",
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
    id: "Horse",
    url: horseWhiteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
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
    url: leatherTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Leather Overlay",
    url: leatherOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Armor Overlay",
    url: leatherOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Gold",
    url: goldTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Copper",
    url: copperTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Iron",
    url: ironTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Diamond",
    url: diamondTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Netherite",
    url: netheriteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  ...entityGlintTextureDefs,
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);
  const glint = defineGlintControls(generator);
  function getTint(colorId: string): Blend {
    const hex =
      defineTintInput(generator, colorId, {
        defaultValue: "#A06540",
        choiceGroups: armorTintChoiceGroups,
        includeNoTint: false,
      }) ?? "#A06540";

    return { kind: "MultiplyHex", hex: hex };
  }

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
    choices: ["Leather", "Gold", "Copper", "Iron", "Diamond", "Netherite"],
  });

  // Define user variables

  const tintArmor = generator.defineAndGetBooleanInput("Tint Armor", false);

  if (tintArmor) {
    generator.defineTextureInput("Armor Overlay", {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Leather Overlay"],
    });
  }

  const armorTint: Blend = tintArmor
    ? getTint("Armor Color")
    : { kind: "None" };

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineRegionInput([256, 249, 124, 72], () => {
    generator.setBooleanInputValue("Donkey / Mule Model", !muleModel);
  });

  // Get user variable values

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const muleModel = generator.getBooleanInputValue("Donkey / Mule Model");

  const drawHorse = (texture: string, blend: Blend, enchanted: boolean) => {
    let ox: number;
    let oy: number;
    let dimensions: Dimensions;

    const plugin = glint.getPlugin(enchanted);

    // Head
    [ox, oy] = [20, 20];
    dimensions = [48, 40, 56];
    minecraftGenerator.drawCuboid(texture, horse.head, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Mouth
    [ox, oy] = [140, 142];
    dimensions = [32, 40, 40];
    minecraftGenerator.drawCuboid(texture, horse.mouth, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Neck
    [ox, oy] = [24, 232];
    dimensions = [32, 96, 56];
    minecraftGenerator.drawCuboid(texture, horse.neck, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Mane
    [ox, oy] = [321, 16];
    dimensions = [16, 128, 16];
    minecraftGenerator.drawCuboid(texture, horse.mane, [ox, oy], dimensions, {
      blend,
      center: "Back",
      plugin,
    });

    // Tail
    [ox, oy] = [224, 348];
    dimensions = [24, 112, 32];
    minecraftGenerator.drawCuboid(texture, horse.tail, [ox, oy], dimensions, {
      blend,
      center: "Back",
      plugin,
    });

    // Horse Ears

    const horseEars = (ox: number, oy: number) => {
      dimensions = [16, 16, 8];
      minecraftGenerator.drawCuboid(
        texture,
        horse.horseEar,
        [ox, oy + 40],
        dimensions,
        { blend, plugin }
      );
    };

    // Donkey / Mule Ears

    const muleEars = (ox: number, oy: number) => {
      dimensions = [16, 56, 8];
      minecraftGenerator.drawCuboid(
        texture,
        horse.muleEar,
        [ox, oy],
        dimensions,
        { blend, plugin }
      );
    };

    // Left Ear

    [ox, oy] = [332, 249];

    if (muleModel) {
      muleEars(ox, oy);
    } else {
      horseEars(ox, oy);
    }

    // Right Ear

    [ox, oy] = [256, 249];

    if (muleModel) {
      muleEars(ox, oy);
    } else {
      horseEars(ox, oy);
    }

    // Body
    [ox, oy] = [-40, 452];
    dimensions = [80, 80, 176];
    minecraftGenerator.drawCuboid(texture, horse.body, [ox, oy], dimensions, {
      blend,
      center: "Top",
      rotate: 180,
      orientation: "East",
      plugin,
    });

    // Legs

    // Front Left Leg
    [ox, oy] = [413, 40];
    dimensions = [32, 88, 32];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      flip: "Horizontal",
      orientation: "West",
      plugin,
    });

    // Back Left Leg
    [ox, oy] = [413, 436];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      flip: "Horizontal",
      orientation: "West",
      plugin,
    });

    // Front Right Leg
    [ox, oy] = [413, 238];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Back Right Leg
    [ox, oy] = [413, 634];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      plugin,
    });
  };
  const enchantArmor = generator.getBooleanInputValueWithDefault(
    "Enchant Armor",
    false
  );
  generator.defineRegionInput([40, 452, 320, 336], () => {
    generator.setBooleanInputValue("Enchant Armor", !enchantArmor);
  });

  // Draw Horse

  drawHorse("Horse", { kind: "None" }, false);
  drawHorse("Markings", { kind: "None" }, false);
  drawHorse("Armor", armorTint, enchantArmor);
  if (tintArmor) {
    drawHorse("Armor Overlay", { kind: "None" }, enchantArmor);
  }

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
