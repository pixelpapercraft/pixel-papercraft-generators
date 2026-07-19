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
  type VideoDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
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
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";
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
  "Jul 2026 lostminer - Layout refresh.",
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

type MinecraftAxolotlCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  showOverlay: boolean;
  faceStretch: number;
};

const render = (
  ctx: RenderContext,
  props: MinecraftAxolotlCharacterProps
): void => {
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
    ctx.drawTexture("Skin", head.right, [ox - 40, oy, 40 - offset, 40], {
      pixelate,
    });
    ctx.drawTexture("Skin", head.front, [ox - offset, oy, 64 + offset * 2, 40]);
    ctx.drawTexture(
      "Skin",
      head.left,
      [ox + 64 + offset, oy, 40 - offset, 40],
      { pixelate }
    );
    ctx.drawTexture("Skin", head.back, [ox + 64 + 40, oy, 64, 40]);
    ctx.drawTexture("Skin", head.top, [ox, oy - 40, 64, 40]);
    ctx.drawTexture("Skin", head.bottom, [ox, oy + 40, 64, 40], {
      flip: "Vertical",
    });
  };

  const drawBody = (layer: Layer) => {
    const { body } = layer;
    const ox = 234;
    const oy = 405;
    ctx.drawTexture("Skin", body.top, [ox, oy, 64, 32]);
    ctx.drawTexture("Skin", body.back, [ox, oy - 80, 64, 80], {
      flip: "Vertical",
    });
    ctx.drawTexture("Skin", body.bottom, [ox + 80 + 64, oy, 64, 32], {
      flip: "Vertical",
    });
    ctx.drawTexture("Skin", body.front, [ox, oy + 32, 64, 80]);
    ctx.drawTexture("Skin", body.left, [ox + 64, oy + 32, 32, 80], {
      rotateLegacy: -90.0,
    });
    ctx.drawTexture("Skin", body.right, [ox, oy, 32, 80], {
      rotateLegacy: 90.0,
    });
  };

  const drawLimb = (leg: Cuboid, ox: number, oy: number) => {
    ctx.drawTexture("Skin", armOrLegPart(leg.left), [ox + 8, oy - 24, 8, 24]);
    ctx.drawTexture("Skin", handOrFootPart(leg.left), [ox, oy, 24, 16]);
    ctx.drawTexture("Skin", armOrLegPart(leg.right), [ox - 16, oy - 24, 8, 24]);
    ctx.drawTexture("Skin", handOrFootPart(leg.right), [ox - 24, oy, 24, 16]);
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

    ctx.drawTexture("Skin", [topX + 1, topY + 2, 2, 1], headFins.topLeftBack);

    ctx.drawTexture("Skin", [topX + 1, topY + 1, 2, 1], headFins.topLeftFront, {
      flip: "Horizontal",
    });

    ctx.drawTexture(
      "Skin",
      [topX + 5, topY + 1, 2, 1],
      headFins.topRightFront,
      {
        flip: "Horizontal",
      }
    );

    ctx.drawTexture("Skin", [topX + 5, topY + 2, 2, 1], headFins.topRightBack);

    ctx.drawTexture(
      "Skin",
      [rightX + 1, rightY, 1, 3],
      headFins.middleLeftBack
    );

    ctx.drawTexture(
      "Skin",
      [rightX + 2, rightY, 1, 3],
      headFins.middleLeftFront
    );

    ctx.drawTexture("Skin", [leftX + 6, leftY, 1, 3], headFins.middleRightBack);

    ctx.drawTexture(
      "Skin",
      [leftX + 5, leftY, 1, 3],
      headFins.middleRightFront
    );

    ctx.drawTexture(
      "Skin",
      [rightX + 2, rightY + 6, 1, 2],
      headFins.bottomLeftBack
    );

    ctx.drawTexture(
      "Skin",
      [rightX + 1, rightY + 6, 1, 2],
      headFins.bottomLeftFront
    );

    ctx.drawTexture(
      "Skin",
      [leftX + 5, leftY + 6, 1, 2],
      headFins.bottomRightBack
    );

    ctx.drawTexture(
      "Skin",
      [leftX + 6, leftY + 6, 1, 2],
      headFins.bottomRightFront
    );
  };

  const drawHeadFinsTexture = () => {
    ctx.drawTexture("Head Fins Texture", [3, 37, 3, 3], headFins.topLeftBack);
    ctx.drawTexture("Head Fins Texture", [8, 37, 3, 3], headFins.topLeftFront);
    ctx.drawTexture("Head Fins Texture", [3, 37, 3, 3], headFins.topRightFront);
    ctx.drawTexture("Head Fins Texture", [8, 37, 3, 3], headFins.topRightBack);
    ctx.drawTexture(
      "Head Fins Texture",
      [0, 40, 3, 4],
      headFins.middleLeftBack
    );
    ctx.drawTexture(
      "Head Fins Texture",
      [0, 40, 3, 4],
      headFins.middleLeftFront,
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      "Head Fins Texture",
      [11, 40, 3, 4],
      headFins.middleRightBack
    );
    ctx.drawTexture(
      "Head Fins Texture",
      [11, 40, 3, 4],
      headFins.middleRightFront,
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      "Head Fins Texture",
      [0, 44, 3, 3],
      headFins.bottomLeftBack
    );
    ctx.drawTexture(
      "Head Fins Texture",
      [0, 44, 3, 3],
      headFins.bottomLeftFront,
      { flip: "Vertical" }
    );
    ctx.drawTexture(
      "Head Fins Texture",
      [11, 44, 3, 3],
      headFins.bottomRightBack
    );
    ctx.drawTexture(
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

    ctx.drawTexture(
      "Skin",
      [backX + 3, backY, 1, backHeight],
      [258, 533, 40, 168]
    );

    ctx.drawTexture(
      "Skin",
      [backX + 4, backY, 1, backHeight],
      [298, 533, 40, 168]
    );
  };

  const drawTailFinsTexture = () => {
    ctx.drawTexture(
      // Left Side upper
      "Tail Fins Texture",
      [2, 26, 9, 1],
      [258 - 32, 533 + 32, 72, 8],
      { rotate: -90.0 }
    );
    ctx.drawTexture(
      // Right Side upper
      "Tail Fins Texture",
      [2, 26, 9, 1],
      [330 - 32, 533 + 32, 72, 8],
      { rotate: -90.0, flip: "Vertical" }
    );
    ctx.drawTexture(
      // Left Side lower
      "Tail Fins Texture",
      [2, 31, 12, 5],
      [258 - 28, 605 + 28, 96, 40],
      { rotate: -90.0 }
    );
    ctx.drawTexture(
      // Right Side lower
      "Tail Fins Texture",
      [2, 31, 12, 5],
      [298 - 28, 605 + 28, 96, 40],
      { rotate: -90.0, flip: "Vertical" }
    );
  };

  const isSlimModel = props.isSlim;
  const showFolds = props.showFolds;
  const showLabels = props.showLabels;
  const showOverlay = props.showOverlay;
  const faceStretch = props.faceStretch;

  drawHead(steve.base, faceStretch);

  drawBody(steve.base);

  if (isSlimModel) {
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
    if (isSlimModel) {
      drawArms(alex.overlay);
    } else {
      drawArms(steve.overlay);
    }
    drawLegs(steve.overlay);
    drawHeadFins(steve.overlay);
    drawTailFins(steve.overlay);
  }

  const showHeadFinsTexture = ctx.hasTexture("Head Fins Texture");
  if (showHeadFinsTexture) {
    drawHeadFinsTexture();
  }

  const showTailFinsTexture = ctx.hasTexture("Tail Fins Texture");

  if (showTailFinsTexture) {
    drawTailFinsTexture();
  }

  ctx.drawImage("Background", [0, 0]);

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftAxolotlCharacterGeneratorV2: GeneratorV2<MinecraftAxolotlCharacterProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();
const finChoices = ["Blue", "Cyan", "Pink", "Gold", "Brown"];

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [headFinsTexture, setHeadFinsTexture] = React.useState<Texture | null>(
    null
  );
  const [tailFinsTexture, setTailFinsTexture] = React.useState<Texture | null>(
    null
  );
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [showOverlay, setShowOverlay] = React.useState(true);
  const [faceStretch, setFaceStretch] = React.useState(0);

  const rendererProps: MinecraftAxolotlCharacterProps = {
    isSlim: skinValue.modelType === "Slim",
    showFolds,
    showLabels,
    showOverlay,
    faceStretch,
  };

  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (skinTexture) {
      map.set("Skin", skinTexture);
    }
    if (headFinsTexture) {
      map.set("Head Fins Texture", headFinsTexture);
    }
    if (tailFinsTexture) {
      map.set("Tail Fins Texture", tailFinsTexture);
    }
    return map;
  }, [skinTexture, headFinsTexture, tailFinsTexture]);

  return (
    <div>
      <GeneratorUI.MediaHero video={video} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <MinecraftSkinControl
              id="Skin"
              options={skinOptions}
              standardWidth={64}
              standardHeight={64}
              showModelType={true}
              value={skinValue}
              textures={noTextures}
              onValueChange={setSkinValue}
              onChange={setSkinTexture}
            />

            <GeneratorUI.LoadedTextureControl
              id="Head Fins Texture"
              definitions={textures}
              standardWidth={64}
              standardHeight={64}
              choices={finChoices}
              loadingMessage="Loading fin choices…"
              errorMessage="Fin choices could not be loaded."
              onChange={setHeadFinsTexture}
            />

            <GeneratorUI.LoadedTextureControl
              id="Tail Fins Texture"
              definitions={textures}
              standardWidth={64}
              standardHeight={64}
              choices={finChoices}
              loadingMessage="Loading fin choices…"
              errorMessage="Fin choices could not be loaded."
              onChange={setTailFinsTexture}
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
            <GeneratorUI.BooleanControl
              label="Show Overlay"
              checked={showOverlay}
              onCheckedChange={setShowOverlay}
            />
            <GeneratorUI.RangeControl
              label="Axolotl Face"
              min={0}
              max={5}
              step={1}
              value={faceStretch}
              onValueChange={setFaceStretch}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftAxolotlCharacterGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
