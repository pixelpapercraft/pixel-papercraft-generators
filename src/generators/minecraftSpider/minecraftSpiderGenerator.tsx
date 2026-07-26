"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type DynamicTextures,
  type Generator,
  type GeneratorDefV2,
  type HistoryDef,
  type ImageDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder";
import {
  type Dimensions,
  Minecraft,
  type Orientation,
} from "../_common/minecraft";
import { spider } from "../_common/minecraftEntity";

import foldsImage from "./images/Folds.png";
import foregroundImage from "./images/Foreground.png";
import labelsImage from "./images/Labels.png";
import caveSpiderImage from "./textures/cave_spider.png";
import spiderEyesImage from "./textures/spider_eyes.png";
import spiderImage from "./textures/spider.png";
import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";

const id = "minecraft-spider";

const name = "Minecraft Spider";

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const history: HistoryDef = [
  "08 Sep 2024 NinjolasNJM - Initial Spider generator.",
  "26 Jul 2026 lostminer - Rebuilt as a V2 generator.",
];

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

type MinecraftSpiderProps = {
  showFolds: boolean;
  showLabels: boolean;
};

const render = (
  ctx: RenderContext,
  { showFolds, showLabels }: MinecraftSpiderProps
): void => {
  const minecraft = new Minecraft(ctx);

  const drawHead = (texture: string): void => {
    const dimensions: Dimensions = [64, 64, 64];
    minecraft.drawCuboid(texture, spider.head, [169, 21], dimensions);
  };

  const drawThorax = (texture: string): void => {
    const dimensions: Dimensions = [48, 48, 48];
    minecraft.drawCuboid(texture, spider.thorax, [225, 261], dimensions, {
      center: "Top",
      rotate: 180,
      orientation: "South",
    });
  };

  const drawAbdomen = (texture: string): void => {
    const dimensions: Dimensions = [80, 64, 96];
    minecraft.drawCuboid(texture, spider.abdomen, [97, 549], dimensions, {
      center: "Top",
      rotate: 180,
      orientation: "East",
    });
  };

  const drawLeg = (
    texture: string,
    position: [number, number],
    orientation: Orientation,
    leftSide: boolean
  ): void => {
    const dimensions: Dimensions = [128, 16, 16];
    minecraft.drawCuboid(texture, spider.leg, position, dimensions, {
      center: "Top",
      rotate: 180,
      orientation,
      ...(leftSide ? { flip: "Horizontal" } : {}),
    });
  };

  const drawSpider = (texture: string): void => {
    drawHead(texture);
    drawThorax(texture);
    drawAbdomen(texture);

    drawLeg(texture, [393, 221], "North", false);
    drawLeg(texture, [393, 317], "North", false);
    drawLeg(texture, [393, 389], "South", false);
    drawLeg(texture, [393, 485], "South", false);

    drawLeg(texture, [41, 221], "North", true);
    drawLeg(texture, [41, 317], "North", true);
    drawLeg(texture, [41, 389], "South", true);
    drawLeg(texture, [41, 485], "South", true);
  };

  if (ctx.hasTexture("Spider")) {
    drawSpider("Spider");
  }
  if (ctx.hasTexture("Spider Eyes")) {
    drawSpider("Spider Eyes");
  }

  ctx.drawImage("Foreground", [0, 0]);

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }
  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftSpiderGenerator: Generator<MinecraftSpiderProps> = {
  id,
  name,
  images,
  textures: [],
  render,
};

function Component(): JSX.Element {
  const [spiderTexture, setSpiderTexture] = React.useState<Texture | null>(
    null
  );
  const [spiderEyesTexture, setSpiderEyesTexture] =
    React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);

  const props: MinecraftSpiderProps = { showFolds, showLabels };
  const dynamicTextures: DynamicTextures = {
    Spider: spiderTexture,
    "Spider Eyes": spiderEyesTexture,
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />
      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.LoadedTextureControl
              id="Spider"
              definitions={textures}
              choices={["Spider", "Cave Spider"]}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Spider"
              onChange={setSpiderTexture}
            />
            <GeneratorUI.LoadedTextureControl
              id="Spider Eyes"
              definitions={textures}
              choices={[]}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Spider Eyes"
              onChange={setSpiderEyesTexture}
            />
            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />
            <GeneratorUI.BooleanControl
              label="Show Labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftSpiderGenerator}
            props={props}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>
      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
