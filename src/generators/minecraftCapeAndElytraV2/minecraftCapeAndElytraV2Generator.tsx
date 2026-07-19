"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import foregroundImage from "./images/Foreground.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";

import migratorImage from "./textures/Migrator.png";
import vanillaImage from "./textures/Vanilla.png";
import cherryBlossomImage from "./textures/CherryBlossom.png";
import minecon2011Image from "./textures/Minecon2011.png";
import minecon2012Image from "./textures/Minecon2012.png";
import minecon2013Image from "./textures/Minecon2013.png";
import minecon2015Image from "./textures/Minecon2015.png";
import minecon2016Image from "./textures/Minecon2016.png";
import minecon2019Image from "./textures/Minecon2019.png";
import mojangImage from "./textures/Mojang.png";
import elytraImage from "./textures/Elytra.png";

const id = "minecraft-cape-and-elytra-v2";

const name = "Minecraft Cape And Elytra";

const history: HistoryDef = [
  "16 Mar 2021 NinjolasNJM - Initially completed both cape and elytra generation.",
  "06 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
  "02 Feb 2024 NinjolasNJM - added default textures and improved folds. ",
  "Jul 2026 lostminer - Layout refresh.",
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
    id: "Cape",
    url: migratorImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Migrator Cape",
    url: migratorImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Vanilla Cape",
    url: vanillaImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Cherry Blossom Cape",
    url: cherryBlossomImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Minecon 2011 Cape",
    url: minecon2011Image.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Minecon 2012 Cape",
    url: minecon2012Image.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Minecon 2013 Cape",
    url: minecon2013Image.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Minecon 2015 Cape",
    url: minecon2015Image.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Minecon 2016 Cape",
    url: minecon2016Image.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Founder's Cape",
    url: minecon2019Image.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Mojang Cape",
    url: mojangImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Elytra",
    url: elytraImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const choices = [
  "Migrator Cape",
  "Vanilla Cape",
  "Cherry Blossom Cape",
  "Minecon 2011 Cape",
  "Minecon 2012 Cape",
  "Minecon 2013 Cape",
  "Minecon 2015 Cape",
  "Minecon 2016 Cape",
  "Founder's Cape",
  "Mojang Cape",
  "Elytra",
];

type MinecraftCapeAndElytraProps = {
  showFolds: boolean;
  showLabels: boolean;
};

const render = (
  ctx: RenderContext,
  { showFolds, showLabels }: MinecraftCapeAndElytraProps
): void => {
  // Cape

  ctx.drawTextureLegacy(
    "Cape",
    { x: 0, y: 1, w: 1, h: 16 },
    { x: 74, y: 116, w: 8, h: 128 }
  ); // Right
  ctx.drawTextureLegacy(
    "Cape",
    { x: 1, y: 1, w: 10, h: 16 },
    { x: 82, y: 116, w: 80, h: 128 }
  ); // Face
  ctx.drawTextureLegacy(
    "Cape",
    { x: 11, y: 1, w: 1, h: 16 },
    { x: 162, y: 116, w: 8, h: 128 }
  ); // Left
  ctx.drawTextureLegacy(
    "Cape",
    { x: 12, y: 1, w: 10, h: 16 },
    { x: 170, y: 116, w: 80, h: 128 }
  ); // Back
  ctx.drawTextureLegacy(
    "Cape",
    { x: 1, y: 0, w: 10, h: 1 },
    { x: 82, y: 108, w: 80, h: 8 }
  ); // Top
  ctx.drawTextureLegacy(
    "Cape",
    { x: 11, y: 0, w: 10, h: 1 },
    { x: 82, y: 244, w: 80, h: 8 },
    { flip: "Vertical" }
  ); // Bottom

  // Elytra Harness

  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 6, h: 4 },
    { x: 402, y: 180, w: 48, h: 32 }
  ); // Left Harness Bottom
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 5 },
    { x: 418, y: 140, w: 32, h: 40 }
  ); // Left Harness Top
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 6, h: 4 },
    { x: 450, y: 180, w: 48, h: 32 },
    { flip: "Horizontal" }
  ); // Right Harness Bottom
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 5 },
    { x: 450, y: 140, w: 32, h: 40 },
    { flip: "Horizontal" }
  ); // Right Harness Top

  // Left Elytron

  // Left Wing

  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 81, y: 336, w: 80, h: 160 }
  ); // Left Wing Front (Back in game)
  ctx.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 336, w: 80, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Left Wing Top (Top in game)
  ctx.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 49, y: 336, w: 32, h: 160 }
  ); // Left Wing Side (Side in game)
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 161, y: 336, w: 80, h: 160 },
    { flip: "Horizontal" }
  ); // Left Wing Front (Back in game) Back
  ctx.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 304, w: 80, h: 32 },
    { flip: "Vertical" }
  ); // Left Wing Top (Top in game) Back
  ctx.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 241, y: 336, w: 32, h: 160 },
    { flip: "Horizontal" }
  ); // Left Wing Side (Side in game) Back
  // Left Wing Base
  ctx.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 2 },
    { x: 353, y: 352, w: 32, h: 112 }
  ); // Left Wing Base

  // Left Wing Joint

  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 375, w: 32, h: 32 }
  ); // Left Wing Joint 1
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 409, w: 32, h: 32 }
  ); // Left Wing Joint 2

  // Right Elytron

  // Right Wing

  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 81, y: 592, w: 80, h: 160 }
  ); // Right Wing Front (Back in game)
  ctx.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 592, w: 80, h: 32 },
    { rotateLegacy: 180.0 }
  ); // Right Wing Top (Top in game)
  ctx.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 49, y: 592, w: 32, h: 160 }
  ); // Right Wing Side (Side in game)
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 10, h: 20 },
    { x: 161, y: 592, w: 80, h: 160 },
    { flip: "Horizontal" }
  ); // Right Wing Front (Back in game) Back
  ctx.drawTextureLegacy(
    "Cape",
    { x: 24, y: 0, w: 10, h: 2 },
    { x: 161, y: 560, w: 80, h: 32 },
    { flip: "Vertical" }
  ); // Right Wing Top (Top in game) Back
  ctx.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 20 },
    { x: 241, y: 592, w: 32, h: 160 },
    { flip: "Horizontal" }
  ); // Right Wing Side (Side in game) Back

  // Right Wing Base

  ctx.drawTextureLegacy(
    "Cape",
    { x: 34, y: 2, w: 2, h: 2 },
    { x: 353, y: 608, w: 32, h: 112 },
    { flip: "Horizontal" }
  ); // Right Wing Base
  // Right Wing Joint
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 631, w: 32, h: 32 },
    { flip: "Horizontal" }
  ); // Right Wing Joint 1
  ctx.drawTextureLegacy(
    "Cape",
    { x: 36, y: 2, w: 4, h: 4 },
    { x: 496, y: 665, w: 32, h: 32 },
    { flip: "Horizontal" }
  ); // Right Wing Joint 2

  // Draw the Foreground image

  ctx.drawImage("Foreground", [0, 0]);

  // Folds

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const generatorV2: GeneratorV2<MinecraftCapeAndElytraProps> = {
  id,
  name,
  images,
  textures: [],
  render,
};

function Component(): JSX.Element {
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [capeTexture, setCapeTexture] = React.useState<Texture | null>(null);
  const props: MinecraftCapeAndElytraProps = { showFolds, showLabels };
  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (capeTexture) {
      map.set("Cape", capeTexture);
    }
    return map;
  }, [capeTexture]);

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
              id="Cape"
              definitions={textures}
              choices={choices}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Cape"
              onChange={setCapeTexture}
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
            generator={generatorV2}
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
