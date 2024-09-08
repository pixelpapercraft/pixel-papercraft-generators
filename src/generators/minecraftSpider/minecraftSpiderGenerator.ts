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
import { spider } from "../_common/minecraftEntities";
import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import spiderImage from "./textures/spider.png";
import caveSpiderImage from "./textures/cave_spider.png";
import spiderEyesImage from "./textures/spider_eyes.png";
import foregroundImage from "./images/Foreground.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import { Dimensions, Minecraft, Orientation } from "../_common/minecraft";

const id = "minecraft-spider";

const name = "Minecraft Spider";

const history: HistoryDef = [
  "30 Jun 2022 NinjolasNJM - first release.",
  "28 Jan 2024 NinjolasNJM - Fixed to work with new functions.",
  "08 Sep 2024 NinjolasNJM - Converted to Typescript Generator.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Foreground", url: foregroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Spider",
    url: spiderImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Cave Spider",
    url: caveSpiderImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Spider Eyes",
    url: spiderEyesImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);

  // Define functions

  function drawHead(texture: string, [ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid(texture, spider.head, [ox, oy], dimensions);
  }

  function drawThorax(texture: string, [ox, oy]: [number, number]) {
    const dimensions: Dimensions = [48, 48, 48];
    minecraftGenerator.drawCuboid(
      texture,
      spider.thorax,
      [ox, oy],
      dimensions,
      {
        center: "Top",
        rotate: 180,
        orientation: "South",
      }
    );
  }

  function drawAbdomen(texture: string, [ox, oy]: [number, number]) {
    const dimensions: Dimensions = [80, 64, 96];
    minecraftGenerator.drawCuboid(
      texture,
      spider.abdomen,
      [ox, oy],
      dimensions,
      {
        center: "Top",
        rotate: 180,
        orientation: "East",
      }
    );
  }

  function drawLeg(
    texture: string,
    [ox, oy]: [number, number],
    orientation: Orientation,
    leftSide: boolean
  ) {
    const dimensions: Dimensions = [128, 16, 16];
    if (leftSide) {
      minecraftGenerator.drawCuboid(texture, spider.leg, [ox, oy], dimensions, {
        center: "Top",
        rotate: 180,
        orientation: orientation,
        flip: "Horizontal",
      });
    } else {
      minecraftGenerator.drawCuboid(texture, spider.leg, [ox, oy], dimensions, {
        center: "Top",
        rotate: 180,
        orientation: orientation,
      });
    }
  }

  function drawSpider(texture: string) {
    drawHead(texture, [169, 21]);

    drawThorax(texture, [225, 261]);

    drawAbdomen(texture, [97, 549]);
    drawLeg(texture, [393, 205 + 16], "North", false);
    drawLeg(texture, [393, 301 + 16], "North", false);
    drawLeg(texture, [393, 405 - 16], "South", false);
    drawLeg(texture, [393, 501 - 16], "South", false);

    drawLeg(texture, [41, 205 + 16], "North", true);
    drawLeg(texture, [41, 301 + 16], "North", true);
    drawLeg(texture, [41, 405 - 16], "South", true);
    drawLeg(texture, [41, 501 - 16], "South", true);
  }

  function drawFolds() {
    generator.drawFoldLineCuboid([169, 21], [64, 64, 64]);
    generator.drawFoldLineCuboid([225, 309], [48, 48, 48]);
    generator.drawFoldLineCuboid([177, 549], [80, 96, 64]);
    generator.drawImage("Folds", [0, 0]);
  }

  let ox: number;
  let oy: number;

  // Define user inputs

  generator.defineTextureInput("Spider", {
    standardWidth: 64,
    standardHeight: 32,
    choices: ["Spider", "Cave Spider"],
  });
  generator.defineTextureInput("Spider Eyes", {
    standardWidth: 64,
    standardHeight: 32,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variables

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  drawSpider("Spider");
  drawSpider("Spider Eyes");

  // Foreground

  generator.drawImage("Foreground", [0, 0]);

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
  history,
  thumbnail,
  video: null,
  instructions: null,
  images,
  textures,
  script,
};
