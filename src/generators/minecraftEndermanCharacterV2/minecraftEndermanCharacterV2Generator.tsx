"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
  type DynamicTextures,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { steve, alex } from "../_common/minecraftCharacterLegacy";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";

const id = "minecraft-enderman-character";

const name = "Minecraft Enderman Character";

const history: HistoryDef = [
  "Originally developed by ODF.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "12 Sep 2020 NinjolasNJM - Updated to use 1.8+ skins; fixed rotation of left arms and legs.",
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Folds", url: foldsImage.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker through
// `dynamicTextures`, same as minecraftCatCharacterV2. Selecting "None" then
// renders nothing rather than a stale default.
const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

const noTextures: Map<string, Texture> = new Map();

type MinecraftEndermanCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideRightPant: boolean;
  hideLeftPant: boolean;
  hideRightSleeve: boolean;
  hideLeftSleeve: boolean;
};

// Ported 1:1 from `minecraftEndermanCharacterGenerator.ts`'s `script` render
// body: same `drawTextureLegacy` calls, offsets and draw order. Values that
// used to come from `generator.get*InputValue` now come from `props`.
//
// NOTE: the two left-sleeve overlay branches deliberately draw `leftArm.front`
// twice (where a `.left` would be expected) — this reproduces a latent V1 quirk
// verbatim so the V2 output stays byte-identical to V1. Do not "fix" it.
const render = (
  ctx: RenderContext,
  props: MinecraftEndermanCharacterProps
): void => {
  ctx.defineRegion([74, 25, 256, 192], "helmet");
  ctx.defineRegion([268, 201, 192, 160], "jacket");
  ctx.defineRegion([276, 384, 64, 270], "rightPant");
  ctx.defineRegion([353, 384, 64, 270], "leftPant");
  ctx.defineRegion([96, 384, 64, 270], "rightSleeve");
  ctx.defineRegion([174, 384, 64, 270], "leftSleeve");

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Head

  ctx.drawTextureLegacy("Skin", steve.base.head.right, {
    x: 74,
    y: 89,
    w: 64,
    h: 64,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.head.front, {
    x: 138,
    y: 89,
    w: 64,
    h: 64,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.head.left, {
    x: 202,
    y: 89,
    w: 64,
    h: 64,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.head.back, {
    x: 266,
    y: 89,
    w: 64,
    h: 64,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.head.top, {
    x: 138,
    y: 25,
    w: 64,
    h: 64,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.head.bottom,
    { x: 138, y: 153, w: 64, h: 64 },
    { flip: "Vertical" }
  ); // Bottom

  // Body

  ctx.drawTextureLegacy("Skin", steve.base.body.right, {
    x: 268,
    y: 233,
    w: 32,
    h: 96,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.body.front, {
    x: 300,
    y: 233,
    w: 64,
    h: 96,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.body.left, {
    x: 364,
    y: 233,
    w: 32,
    h: 96,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.body.back, {
    x: 396,
    y: 233,
    w: 64,
    h: 96,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.body.top, {
    x: 300,
    y: 201,
    w: 64,
    h: 32,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.body.bottom,
    { x: 300, y: 329, w: 64, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Right arm

  if (props.isSlim) {
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.right, {
      x: 96,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.front, {
      x: 112,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.left, {
      x: 128,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.back, {
      x: 144,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.top, {
      x: 112,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      alex.base.rightArm.bottom,
      { x: 112, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  } else {
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.right, {
      x: 96,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.front, {
      x: 112,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.left, {
      x: 128,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.back, {
      x: 144,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.top, {
      x: 112,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.base.rightArm.bottom,
      { x: 112, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Left arm

  if (props.isSlim) {
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.right, {
      x: 190,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.front, {
      x: 206,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.left, {
      x: 222,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.back, {
      x: 174,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.top, {
      x: 206,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      alex.base.leftArm.bottom,
      { x: 206, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  } else {
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.right, {
      x: 190,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.front, {
      x: 206,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.left, {
      x: 222,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.back, {
      x: 174,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.top, {
      x: 206,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.base.leftArm.bottom,
      { x: 206, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Right leg

  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.right, {
    x: 276,
    y: 400,
    w: 16,
    h: 238,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.front, {
    x: 292,
    y: 400,
    w: 16,
    h: 238,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.left, {
    x: 308,
    y: 400,
    w: 16,
    h: 238,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.back, {
    x: 324,
    y: 400,
    w: 16,
    h: 238,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.top, {
    x: 292,
    y: 384,
    w: 16,
    h: 16,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.rightLeg.bottom,
    { x: 292, y: 638, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Left Leg

  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.right, {
    x: 369,
    y: 400,
    w: 16,
    h: 238,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.front, {
    x: 385,
    y: 400,
    w: 16,
    h: 238,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.left, {
    x: 401,
    y: 400,
    w: 16,
    h: 238,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.back, {
    x: 353,
    y: 400,
    w: 16,
    h: 238,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.top, {
    x: 385,
    y: 384,
    w: 16,
    h: 16,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.leftLeg.bottom,
    { x: 385, y: 638, w: 16, h: 16 },
    { flip: "Vertical" }
  ); // Bottom

  // Overlays

  if (!props.hideHelmet) {
    // Hat layer

    ctx.drawTextureLegacy("Skin", steve.overlay.head.right, {
      x: 74,
      y: 89,
      w: 64,
      h: 64,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.head.front, {
      x: 138,
      y: 89,
      w: 64,
      h: 64,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.overlay.head.left, {
      x: 202,
      y: 89,
      w: 64,
      h: 64,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.head.back, {
      x: 266,
      y: 89,
      w: 64,
      h: 64,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.head.top, {
      x: 138,
      y: 25,
      w: 64,
      h: 64,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.head.bottom,
      { x: 138, y: 153, w: 64, h: 64 },
      { flip: "Vertical" }
    ); // Bottom
  }
  if (!props.hideJacket) {
    // Jacket

    ctx.drawTextureLegacy("Skin", steve.overlay.body.right, {
      x: 268,
      y: 233,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.body.front, {
      x: 300,
      y: 233,
      w: 64,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.overlay.body.left, {
      x: 364,
      y: 233,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.body.back, {
      x: 396,
      y: 233,
      w: 64,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.body.top, {
      x: 300,
      y: 201,
      w: 64,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.body.bottom,
      { x: 300, y: 329, w: 64, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
  }
  if (!props.hideRightSleeve) {
    // Right Sleeve

    if (props.isSlim) {
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.right, {
        x: 96,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.front, {
        x: 112,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.left, {
        x: 128,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.back, {
        x: 144,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.top, {
        x: 112,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      ctx.drawTextureLegacy(
        "Skin",
        alex.overlay.rightArm.bottom,
        { x: 112, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    } else {
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.right, {
        x: 96,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.front, {
        x: 112,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.left, {
        x: 128,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.back, {
        x: 144,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.top, {
        x: 112,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      ctx.drawTextureLegacy(
        "Skin",
        steve.overlay.rightArm.bottom,
        { x: 112, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    }
  }
  if (!props.hideLeftSleeve) {
    // Left Sleeve

    if (props.isSlim) {
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.right, {
        x: 190,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.front, {
        x: 206,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.front, {
        x: 222,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.back, {
        x: 174,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.top, {
        x: 206,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      ctx.drawTextureLegacy(
        "Skin",
        alex.overlay.leftArm.bottom,
        { x: 206, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    } else {
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.right, {
        x: 190,
        y: 400,
        w: 16,
        h: 238,
      }); // Right
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.front, {
        x: 206,
        y: 400,
        w: 16,
        h: 238,
      }); // Face
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.front, {
        x: 222,
        y: 400,
        w: 16,
        h: 238,
      }); // Left
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.back, {
        x: 174,
        y: 400,
        w: 16,
        h: 238,
      }); // Back
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.top, {
        x: 206,
        y: 384,
        w: 16,
        h: 16,
      }); // Top
      ctx.drawTextureLegacy(
        "Skin",
        steve.overlay.leftArm.bottom,
        { x: 206, y: 638, w: 16, h: 16 },
        { flip: "Vertical" }
      ); // Bottom
    }
  }
  if (!props.hideRightPant) {
    // Right Pant

    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.right, {
      x: 276,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.front, {
      x: 292,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.left, {
      x: 308,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.back, {
      x: 324,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.top, {
      x: 292,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.rightLeg.bottom,
      { x: 292, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }
  if (!props.hideLeftPant) {
    // Left Pant

    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.right, {
      x: 369,
      y: 400,
      w: 16,
      h: 238,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.front, {
      x: 385,
      y: 400,
      w: 16,
      h: 238,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.left, {
      x: 401,
      y: 400,
      w: 16,
      h: 238,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.back, {
      x: 353,
      y: 400,
      w: 16,
      h: 238,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.top, {
      x: 385,
      y: 384,
      w: 16,
      h: 16,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.leftLeg.bottom,
      { x: 385, y: 638, w: 16, h: 16 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Fold Lines

  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftEndermanCharacterGeneratorV2: GeneratorV2<MinecraftEndermanCharacterProps> =
  { id, name, images, textures, render };

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftEndermanCharacterProps = {
    isSlim,
    showFolds,
    showLabels,
    hideHelmet,
    hideJacket,
    hideRightPant,
    hideLeftPant,
    hideRightSleeve,
    hideLeftSleeve,
  };

  const dynamicTextures: DynamicTextures = { Skin: skinTexture };

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "helmet":
        setHideHelmet((value) => !value);
        break;
      case "jacket":
        setHideJacket((value) => !value);
        break;
      case "rightPant":
        setHideRightPant((value) => !value);
        break;
      case "leftPant":
        setHideLeftPant((value) => !value);
        break;
      case "rightSleeve":
        setHideRightSleeve((value) => !value);
        break;
      case "leftSleeve":
        setHideLeftSleeve((value) => !value);
        break;
    }
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
            generator={minecraftEndermanCharacterGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
