"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type ImageDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { steve, alex } from "../_common/minecraftCharacter";
import { type Dimensions, Minecraft } from "../_common/minecraft";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import foldsAlexImage from "./images/Folds-Alex.png";
import foldsSteveImage from "./images/Folds-Steve.png";
import foldsM16Image from "./images/Folds-M16.png";
import foregroundAlexImage from "./images/Foreground-Alex.png";
import foregroundSteveImage from "./images/Foreground-Steve.png";
import foregroundM16Image from "./images/Foreground-M16.png";
import labelsImage from "./images/Labels.png";
import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";

const id = "minecraft-action-figure-v2";

const name = "Minecraft Action Figure (v2)";

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Folds-Alex", url: foldsAlexImage.src },
  { id: "Folds-Steve", url: foldsSteveImage.src },
  { id: "Folds-M16", url: foldsM16Image.src },
  { id: "Foreground-Alex", url: foregroundAlexImage.src },
  { id: "Foreground-Steve", url: foregroundSteveImage.src },
  { id: "Foreground-M16", url: foregroundM16Image.src },
  { id: "Labels", url: labelsImage.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker
// through `dynamicTextures`, same as example-v2. See the migration plan's
// correctness note on why "None" would otherwise be wrong.
const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// `MinecraftSkinControl` only reads this for `texture`-kind options; the
// default preset options are all presets, so a shared empty map is safe.
const noTextures: Map<string, Texture> = new Map();

type MinecraftActionFigureProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  handNotches: boolean;
  showHeadOverlay: boolean;
  showBodyOverlay: boolean;
  showRightArmOverlay: boolean;
  showLeftArmOverlay: boolean;
  showRightLegOverlay: boolean;
  showLeftLegOverlay: boolean;
  m16Mode: boolean;
};

// Ported from `minecraftActionFigureGenerator.ts`'s `script` render body:
// same `Minecraft`/`drawCuboid`/`drawTexture`/`drawLine` calls, same offsets,
// same draw order. The only difference is every value that used to come from
// `generator.get*InputValue` now comes from an author-owned `props`, and
// region clicks are declared with `ctx.defineRegion(rect, regionId)` instead
// of a `defineRegionInput` callback.
const render = (ctx: RenderContext, props: MinecraftActionFigureProps): void => {
  const minecraftGenerator = new Minecraft(ctx);

  const char = props.isSlim ? alex : steve;

  function drawHead([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid("Skin", char.base.head, [ox, oy], dimensions);
    if (props.showHeadOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.head,
        [ox, oy],
        dimensions
      );
    }
  }

  function drawNeck([ox, oy]: [number, number]) {
    ctx.drawTexture("Skin", char.base.head.bottom, [ox, oy, 96, 64]); // Neck
    if (props.showHeadOverlay) {
      ctx.drawTexture("Skin", char.overlay.head.bottom, [ox, oy, 96, 64]); // Neck
    }
  }

  function drawBody([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.body, [ox, oy], dimensions);
    ctx.drawTexture("Skin", [0, 20, 4, 4], [ox, oy + 128, 32, 32]); // Right Hip
    ctx.drawTexture("Skin", [24, 52, 4, 4], [ox + 96, oy + 128, 32, 32]); // Left Hip

    if (props.showBodyOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.body,
        [ox, oy],
        dimensions
      );
    }
    if (props.showRightLegOverlay) {
      ctx.drawTexture("Skin", [0, 36, 4, 4], [ox, oy + 128, 32, 32]); // Right Hip
    }
    if (props.showLeftLegOverlay) {
      ctx.drawTexture("Skin", [8, 52, 4, 4], [ox + 96, oy + 128, 32, 32]); // Left Hip
    }
  }

  function drawPelvis([ox, oy]: [number, number]) {
    ctx.drawTexture("Skin", char.base.rightLeg.top, [ox, oy, 32, 128]); // Right Pelvis
    ctx.drawTexture("Skin", char.base.leftLeg.top, [
      ox + 32,
      oy,
      32,
      128,
    ]); // Left Pelvis

    if (props.showRightLegOverlay) {
      ctx.drawTexture("Skin", char.overlay.rightLeg.top, [
        ox,
        oy,
        32,
        128,
      ]); // Right Pelvis
    }

    if (props.showLeftLegOverlay) {
      ctx.drawTexture("Skin", char.overlay.leftLeg.top, [
        ox + 32,
        oy,
        32,
        128,
      ]); // Left Pelvis
    }
  }

  function drawRightArm([ox, oy]: [number, number]) {
    const dimensions: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.rightArm,
      [ox, oy],
      dimensions
    );
    if (props.showRightArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightArm,
        [ox, oy],
        dimensions
      );
    }
  }

  function drawRightShoulder([ox, oy]: [number, number]) {
    ctx.drawTexture(
      "Skin",
      [char === alex ? 47 : 48, 20, 4, 4],
      [ox, oy + 15, 32, 32]
    ); //Right Shoulder Inside
    ctx.drawTexture(
      "Skin",
      [char === alex ? 47 : 48, 20, 4, 4],
      [ox, oy + 49, 32, 32]
    ); //Right Shoulder

    if (props.showRightArmOverlay) {
      ctx.drawTexture(
        "Skin",
        [char === alex ? 47 : 48, 36, 4, 4],
        [ox, oy + 15, 32, 32]
      ); //Right Shoulder Inside
      ctx.drawTexture(
        "Skin",
        [char === alex ? 47 : 48, 36, 4, 4],
        [ox, oy + 49, 32, 32]
      ); //Right Shoulder
    }
  }

  function drawLeftArm([ox, oy]: [number, number]) {
    const dimensions: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftArm,
      [ox, oy],
      dimensions,
      { orientation: "East" }
    );

    if (props.showLeftArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftArm,
        [ox, oy],
        dimensions,
        { orientation: "East" }
      );
    }
  }

  function drawLeftShoulder([ox, oy]: [number, number]) {
    ctx.drawTexture("Skin", [32, 52, 4, 4], [ox, oy + 15, 32, 32]); //Left Shoulder Inside
    ctx.drawTexture("Skin", [32, 52, 4, 4], [ox, oy + 49, 32, 32]); //Left Shoulder

    if (props.showLeftArmOverlay) {
      ctx.drawTexture("Skin", [48, 52, 4, 4], [ox, oy + 15, 32, 32]); //Left Shoulder Inside
      ctx.drawTexture("Skin", [48, 52, 4, 4], [ox, oy + 49, 32, 32]); //Left Shoulder
    }
  }

  function drawRightLeg([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.rightLeg,
      [ox, oy],
      dimensions
    );
    ctx.drawTexture("Skin", [12, 20, 4, 4], [ox + 32, oy - 50, 32, 32], {
      rotate: 180,
    });
    ctx.drawTexture("Skin", char.base.rightLeg.top, [
      ox + 32,
      oy - 18,
      32,
      50,
    ]);

    // 50 pixels tall top, so that the back texture is in line with where it should be on the back side

    if (props.showRightLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightLeg,
        [ox, oy],
        dimensions
      );
      ctx.drawTexture(
        "Skin",
        [12, 36, 4, 4],
        [ox + 32, oy - 50, 32, 32],
        { rotate: 180 }
      );
      ctx.drawTexture("Skin", char.base.rightLeg.top, [
        ox + 32,
        oy - 18,
        32,
        50,
      ]);
      ctx.drawTexture("Skin", char.overlay.rightLeg.top, [
        ox + 32,
        oy - 18,
        32,
        50,
      ]);
      // 50 pixels tall top, so that the back texture is in line with where it should be on the back side
    }
  }
  function drawLeftLeg([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftLeg,
      [ox, oy],
      dimensions,
      { orientation: "East" }
    );
    ctx.drawTexture("Skin", [28, 52, 4, 4], [ox + 64, oy - 50, 32, 32], {
      rotate: 180,
    });
    ctx.drawTexture("Skin", char.base.leftLeg.top, [
      ox + 64,
      oy - 18,
      32,
      50,
    ]);

    // 50 pixels tall top, so that the back texture is in line with where it should be on the back side
    if (props.showLeftLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftLeg,
        [ox, oy],
        dimensions,
        { orientation: "East" }
      );
      ctx.drawTexture(
        "Skin",
        [12, 52, 4, 4],
        [ox + 64, oy - 50, 32, 32],
        { rotate: 180 }
      );
      ctx.drawTexture("Skin", char.base.leftLeg.top, [
        ox + 64,
        oy - 18,
        32,
        50,
      ]);
      ctx.drawTexture("Skin", char.overlay.leftLeg.top, [
        ox + 64,
        oy - 18,
        32,
        50,
      ]);
      // 50 pixels tall top, so that the back texture is in line with where it should be on the back side
    }
  }

  function drawNotch([ox, oy]: [number, number], isLeftSide: boolean) {
    const dir = isLeftSide ? 1 : 0;
    const [x, y, w, h] = [ox + dir, oy, 8, 24];

    const color = "#7b7b7b";
    ctx.drawLine([x, y - 1], [x + w - 1, y - 1], { color });
    ctx.drawLine([x + w - 10 * dir, y], [x + w - 10 * dir, y + h], {
      color,
      lineDash: [7, 1],
    });
    ctx.drawLine([x + w - 1, y + h + 1], [x, y + h + 1], { color });
  }

  // The foreground was designed on a 32px grid with an offset of (9, 5) that makes the cells more centered. This function makes finding the [ox, oy] much easier as you only need to count the cells instead of find the actual coordinates.
  function getGridOrigin(x: number, y: number): [number, number] {
    return [9 + 32 * x, 5 + 32 * y];
  }

  // Head
  let [ox, oy] = getGridOrigin(1, 1);

  drawHead([ox, oy]);

  ctx.defineRegion([ox, oy, 256, 192], "head");

  // Neck

  [ox, oy] = getGridOrigin(13, 3);

  drawNeck([ox, oy]);

  // Body

  [ox, oy] = getGridOrigin(7, 6);

  drawBody([ox, oy]);
  ctx.defineRegion([ox, oy, 192, 160], "body");

  // Pelvis

  [ox, oy] = getGridOrigin(8, 17);

  drawPelvis([ox, oy]);

  // Arms

  // Right Arm

  [ox, oy] = getGridOrigin(1, 10);
  ox = props.isSlim ? ox + 8 : ox;

  drawRightArm([ox, oy]);

  ctx.defineRegion([ox, oy, props.isSlim ? 112 : 128, 160], "rightArm");

  // Right Shoulder

  [ox, oy] = getGridOrigin(7, 12);

  drawRightShoulder([ox, oy]);

  // Left Arm

  [ox, oy] = getGridOrigin(13, 10);
  ox = props.isSlim ? ox + 8 : ox;

  drawLeftArm([ox, oy]);

  ctx.defineRegion([ox, oy, props.isSlim ? 112 : 128, 166], "leftArm");

  // Left  Shoulder

  [ox, oy] = getGridOrigin(10, 12);

  drawLeftShoulder([ox, oy]);

  // Right Leg

  [ox, oy] = getGridOrigin(1, 18);

  drawRightLeg([ox, oy]);
  ctx.defineRegion([ox, oy - 48, 128, 208], "rightLeg");

  // Left Leg

  [ox, oy] = getGridOrigin(13, 18);

  drawLeftLeg([ox, oy]);
  ctx.defineRegion([ox, oy - 48, 128, 208], "leftLeg");

  // Foreground
  if (props.isSlim) {
    ctx.drawImage("Foreground-Alex", [0, 0]);
  } else {
    ctx.drawImage("Foreground-Steve", [0, 0]);
  }

  // Folds
  if (props.showFolds) {
    if (props.isSlim) {
      ctx.drawImage("Folds-Alex", [0, 0]);
    } else {
      ctx.drawImage("Folds-Steve", [0, 0]);
    }
  }

  // M16 Mode

  ctx.defineRegion([1016, 1016, 64, 64], "m16");
  // M + 16 = 1000 + 16 = 1016
  if (props.m16Mode) {
    // draw new body and legs
    [ox, oy] = getGridOrigin(7, 6);
    drawBody([ox, oy]);
    [ox, oy] = getGridOrigin(1, 18);

    drawRightLeg([ox, oy]);
    [ox, oy] = getGridOrigin(13, 18);

    drawLeftLeg([ox, oy]);

    // Draw images
    ctx.drawImage("Foreground-M16", [0, 0]);
    if (props.showFolds) {
      ctx.drawImage("Folds-M16", [0, 0]);
    }
  }

  // Hand Notches
  if (props.handNotches) {
    // Right Hand Notches
    [ox, oy] = getGridOrigin(1, 10);
    ox = props.isSlim ? ox + 4 : ox;
    drawNotch([ox + 44, oy + 104], false); // Front Notch
    drawNotch([ox + (props.isSlim ? 100 : 108), oy + 104], true); // Back Notch

    // Left Hand Notches
    [ox, oy] = getGridOrigin(13, 10);
    ox = props.isSlim ? ox + 4 : ox;
    drawNotch([ox + (props.isSlim ? 68 : 76), oy + 104], true); // Front Notch
    drawNotch([ox + 12, oy + 104], false); // Back Notch
  }

  // Labels
  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftActionFigureGeneratorV2: GeneratorV2<MinecraftActionFigureProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

// Behaviourally identical to the v1 `minecraft-action-figure` generator: the
// same reused `MinecraftSkinControl` skin picker (10 presets + None + upload,
// with model type) plus Show Folds/Show Labels/Hand Notches toggles, six
// clickable overlay regions, and a seventh (M16) region toggling `m16Mode`.
// The author owns the state here and feeds the picker's outputs back — the
// loaded `Texture` via `dynamicTextures`, everything else via `props`.
function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [handNotches, setHandNotches] = React.useState(true);
  const [showHeadOverlay, setShowHeadOverlay] = React.useState(true);
  const [showBodyOverlay, setShowBodyOverlay] = React.useState(true);
  const [showRightArmOverlay, setShowRightArmOverlay] = React.useState(true);
  const [showLeftArmOverlay, setShowLeftArmOverlay] = React.useState(true);
  const [showRightLegOverlay, setShowRightLegOverlay] = React.useState(true);
  const [showLeftLegOverlay, setShowLeftLegOverlay] = React.useState(true);
  const [m16Mode, setM16Mode] = React.useState(false);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftActionFigureProps = {
    isSlim,
    showFolds,
    showLabels,
    handNotches,
    showHeadOverlay,
    showBodyOverlay,
    showRightArmOverlay,
    showLeftArmOverlay,
    showRightLegOverlay,
    showLeftLegOverlay,
    m16Mode,
  };

  const dynamicTextures = React.useMemo(
    () =>
      skinTexture
        ? new Map<string, Texture>([["Skin", skinTexture]])
        : new Map<string, Texture>(),
    [skinTexture]
  );

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "head":
        setShowHeadOverlay((value) => !value);
        break;
      case "body":
        setShowBodyOverlay((value) => !value);
        break;
      case "rightArm":
        setShowRightArmOverlay((value) => !value);
        break;
      case "leftArm":
        setShowLeftArmOverlay((value) => !value);
        break;
      case "rightLeg":
        setShowRightLegOverlay((value) => !value);
        break;
      case "leftLeg":
        setShowLeftLegOverlay((value) => !value);
        break;
      case "m16":
        setM16Mode((value) => !value);
        break;
    }
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
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

            <GeneratorUI.BooleanInput
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />

            <GeneratorUI.BooleanInput
              label="Show Labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />

            <GeneratorUI.BooleanInput
              label="Hand Notches"
              checked={handNotches}
              onCheckedChange={setHandNotches}
            />

            <GeneratorUI.Text>
              Click in the papercraft template to turn on and off the overlay
              for each part.
            </GeneratorUI.Text>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftActionFigureGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
