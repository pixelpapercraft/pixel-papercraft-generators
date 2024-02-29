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
import { steve } from "../_common/minecraftCharacter";
import { Minecraft } from "../_common/minecraft";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import actionFigureImage from "./images/Action-Figure.png";
import tabsImage from "./images/Tabs.png";
import steveImage from "./textures/Steve.png";
import alexImage from "./textures/Alex.png";
import zombieImage from "./textures/Zombie.png";
import endermanImage from "./textures/Enderman.png";
import skeletonImage from "./textures/Skeleton.png";
import witherSkeletonImage from "./textures/Wither_Skeleton.png";
import creeperImage from "./textures/Creeper.png";
import blazeImage from "./textures/Blaze.png";

const id = "minecraft-character-heads";

const name = "Minecraft Character Heads";

const history: HistoryDef = [
  "Originally developed by ODF.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "12 Jun 2022 NinjolasNJM - Updated to use Minecraft module, and added Action Figure option",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Tabs", url: tabsImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Action Figure", url: actionFigureImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin 1",
    url: steveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Steve",
    url: steveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Alex",
    url: alexImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Zombie",
    url: zombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Enderman",
    url: endermanImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Skeleton",
    url: skeletonImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Wither Skeleton",
    url: witherSkeletonImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Creeper",
    url: creeperImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Blaze",
    url: blazeImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const minecraft = new Minecraft(generator);

  // Define user inputs

  for (let i = 1; i <= 8; i++) {
    generator.defineTextureInput(`Skin ${i}`, {
      standardWidth: 64,
      standardHeight: 64,
      choices: [
        "Steve",
        "Alex",
        "Zombie",
        "Enderman",
        "Skeleton",
        "Wither Skeleton",
        "Creeper",
        "Blaze",
      ],
    });
  }

  // Define and get user variables

  const showFolds = generator.defineAndGetBooleanInput("Show Folds", true);
  const actionFigure = generator.defineAndGetBooleanInput(
    "Action Figure",
    false
  );

  // Helper Function to draw heads

  const drawHead = (textureId: string, ox: number, oy: number) => {
    const x = ox - 64;
    const y = oy - 64;

    if (generator.hasTexture(textureId)) {
      // Draw Tabs

      generator.drawImage("Tabs", [x - 26, y - 1]);

      // Define Overlay Input

      const showOverlay = generator.getBooleanInputValueWithDefault(
        "Show " + textureId + " Overlay",
        true
      );

      generator.defineRegionInput([x, y, 256, 192], () => {
        generator.setBooleanInputValue(
          "Show " + textureId + " Overlay",
          !showOverlay
        );
      });

      // Draw Head

      minecraft.drawCuboid(textureId, steve.base.head, [x, y], [64, 64, 64]);

      if (showOverlay) {
        minecraft.drawCuboid(
          textureId,
          steve.overlay.head,
          [x, y],
          [64, 64, 64]
        );
      }

      // draw Folds and Action Figure Cut lines

      if (showFolds) {
        generator.drawImage("Folds", [x - 26, y - 1]);
      }

      if (actionFigure) {
        generator.drawImage("Action Figure", [x + 64, y + 128]);
      }
    }
  };

  // Background

  generator.drawImage("Background", [0, 0]);

  // Draw the heads

  drawHead("Skin 1", 99, 79);
  drawHead("Skin 2", 387, 79);
  drawHead("Skin 3", 99, 279);
  drawHead("Skin 4", 387, 279);
  drawHead("Skin 5", 99, 479);
  drawHead("Skin 6", 387, 479);
  drawHead("Skin 7", 99, 679);
  drawHead("Skin 8", 387, 679);
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
