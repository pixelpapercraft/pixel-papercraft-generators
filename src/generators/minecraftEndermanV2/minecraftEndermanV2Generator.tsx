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

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import endermanTexture from "./textures/enderman.png";
import endermanEyesTexture from "./textures/enderman_eyes.png";

const id = "minecraft-enderman-v2";

const name = "Minecraft Enderman";

const history: HistoryDef = [
  "Originally developed by ODF.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "19 Sep 2020 NinjolasNJM - Fixed orientations of limbs.",
  "07 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
  "17 Jul 2021 M16 - Updated generator photo.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

// Definitions for the two loaded-texture controls. Each carries its own default
// texture, loaded on mount and fed to the render through `dynamicTextures`; the
// generator itself declares no static textures.
const endermanDefinitions: TextureDef[] = [
  {
    id: "Enderman",
    url: endermanTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];
const eyesDefinitions: TextureDef[] = [
  {
    id: "Enderman Eyes",
    url: endermanEyesTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

type MinecraftEndermanProps = {
  showFolds: boolean;
  showLabels: boolean;
};

// Ported from `minecraftEndermanGenerator.ts`'s `script` render body: the same
// `drawTextureLegacy` calls, source/dest rects, flips and draw order — the
// full "Enderman" body pass followed by the "Enderman Eyes" overlay pass over
// the same geometry. Every value that came from `generator.get*InputValue` now
// comes from an author-owned `props`.
const render = (
  ctx: RenderContext,
  { showFolds, showLabels }: MinecraftEndermanProps
): void => {
  // Background

  ctx.drawImage("Background", [0, 0]);

  // Mouth

  ctx.drawTextureLegacy(
    "Enderman",
    { x: 0, y: 24, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 24, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 24, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 24, y: 24, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 16, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 16, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Head

  ctx.drawTextureLegacy(
    "Enderman",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Body

  ctx.drawTextureLegacy(
    "Enderman",
    { x: 32, y: 20, w: 4, h: 12 },
    { x: 268, y: 233, w: 32, h: 96 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 36, y: 20, w: 8, h: 12 },
    { x: 300, y: 233, w: 64, h: 96 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 44, y: 20, w: 4, h: 12 },
    { x: 364, y: 233, w: 32, h: 96 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 48, y: 20, w: 8, h: 12 },
    { x: 396, y: 233, w: 64, h: 96 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 36, y: 16, w: 8, h: 4 },
    { x: 300, y: 201, w: 64, h: 32 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 44, y: 16, w: 8, h: 4 },
    { x: 300, y: 329, w: 64, h: 32 },
    { flip: "Vertical" }
  ); // Bottom
  // Right arm
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 96, y: 399, w: 16, h: 240 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 112, y: 399, w: 16, h: 240 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 128, y: 399, w: 16, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 144, y: 399, w: 16, h: 240 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 112, y: 383, w: 16, h: 16 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 112, y: 639, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom
  // Left arm
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 222, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 206, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 190, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 174, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 206, y: 383, w: 16, h: 16 },
    { flip: "Horizontal" }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 222, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  // Right leg

  ctx.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 276, y: 399, w: 16, h: 240 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 292, y: 399, w: 16, h: 240 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 308, y: 399, w: 16, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 324, y: 399, w: 16, h: 240 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 292, y: 383, w: 16, h: 16 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 292, y: 639, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom
  // Left Leg
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 401, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 385, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 369, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 353, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 385, y: 383, w: 16, h: 16 },
    { flip: "Horizontal" }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 401, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  //-------------------------------------------------------------//
  // FROM NOW ALL THE TEXTURES ARE FROM THE FILE "enderman_eyes" //
  //-------------------------------------------------------------//

  // Mouth

  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 0, y: 24, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 24, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 24, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 24, y: 24, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 16, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 16, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom
  // Head
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 74, y: 89, w: 64, h: 64 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 138, y: 89, w: 64, h: 64 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 202, y: 89, w: 64, h: 64 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 266, y: 89, w: 64, h: 64 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 138, y: 25, w: 64, h: 64 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Body

  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 32, y: 20, w: 4, h: 12 },
    { x: 268, y: 233, w: 32, h: 96 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 36, y: 20, w: 8, h: 12 },
    { x: 300, y: 233, w: 64, h: 96 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 44, y: 20, w: 4, h: 12 },
    { x: 364, y: 233, w: 32, h: 96 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 48, y: 20, w: 8, h: 12 },
    { x: 396, y: 233, w: 64, h: 96 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 36, y: 16, w: 8, h: 4 },
    { x: 300, y: 201, w: 64, h: 32 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 44, y: 16, w: 8, h: 4 },
    { x: 300, y: 329, w: 64, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Right arm

  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 96, y: 399, w: 16, h: 240 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 112, y: 399, w: 16, h: 240 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 128, y: 399, w: 16, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 144, y: 399, w: 16, h: 240 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 112, y: 383, w: 16, h: 16 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 112, y: 639, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Left arm

  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 222, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 206, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 190, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 174, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 206, y: 383, w: 16, h: 16 },
    { flip: "Horizontal" }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 222, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  // Right leg

  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 276, y: 399, w: 16, h: 240 }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 292, y: 399, w: 16, h: 240 }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 308, y: 399, w: 16, h: 240 }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 324, y: 399, w: 16, h: 240 }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 292, y: 383, w: 16, h: 16 }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 292, y: 639, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Left Leg

  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 56, y: 2, w: 2, h: 30 },
    { x: 401, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Right
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 2, w: 2, h: 30 },
    { x: 385, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Face
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 2, w: 2, h: 30 },
    { x: 369, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Left
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 62, y: 2, w: 2, h: 30 },
    { x: 353, y: 399, w: 16, h: 240 },
    { flip: "Horizontal" }
  ); // Back
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 58, y: 0, w: 2, h: 2 },
    { x: 385, y: 383, w: 16, h: 16 },
    { flip: "Horizontal" }
  ); // Top
  ctx.drawTextureLegacy(
    "Enderman Eyes",
    { x: 60, y: 0, w: 2, h: 2 },
    { x: 401, y: 655, w: 16, h: 16 },
    { rotateLegacy: 180.0 }
  ); // Bottom

  // Fold Lines

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftEndermanGeneratorV2: GeneratorV2<MinecraftEndermanProps> = {
  id,
  name,
  images,
  textures: [],
  render,
};

// Behaviourally identical to the v1 `minecraft-enderman` generator: two
// independent loaded-texture controls (the "Enderman" body skin and the
// "Enderman Eyes" glowing overlay, each defaulting to its bundled texture) plus
// Show Folds / Show Labels toggles, driving the same two-pass render. The author
// owns the state here and feeds each control's loaded `Texture` back through
// `dynamicTextures` under its id.
function Component(): JSX.Element {
  const [endermanTex, setEndermanTex] = React.useState<Texture | null>(null);
  const [eyesTex, setEyesTex] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);

  const rendererProps: MinecraftEndermanProps = { showFolds, showLabels };

  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (endermanTex) {
      map.set("Enderman", endermanTex);
    }
    if (eyesTex) {
      map.set("Enderman Eyes", eyesTex);
    }
    return map;
  }, [endermanTex, eyesTex]);

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
              id="Enderman"
              definitions={endermanDefinitions}
              choices={[]}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Enderman"
              onChange={setEndermanTex}
            />
            <GeneratorUI.LoadedTextureControl
              id="Enderman Eyes"
              definitions={eyesDefinitions}
              choices={[]}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Enderman Eyes"
              onChange={setEyesTex}
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
            generator={minecraftEndermanGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
