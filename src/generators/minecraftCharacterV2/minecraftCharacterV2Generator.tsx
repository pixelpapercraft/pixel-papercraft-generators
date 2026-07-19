"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type ImageDef,
  type InstructionsDef,
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

import backgroundImage from "./images/Background.png";
import steveTabsImage from "./images/SteveTabs.png";
import steveFoldsImage from "./images/SteveFolds.png";
import alexTabsImage from "./images/AlexTabs.png";
import alexFoldsImage from "./images/AlexFolds.png";
import labelsImage from "./images/Labels.png";
import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";

const id = "minecraft-character-v2";

const name = "Minecraft Character";

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

// Same copy as the v1 minecraft-character generator's `instructions`.
const instructions: InstructionsDef = `
## How to use the Minecraft Character Generator?

1. Select your Minecraft skin file.
2. Choose the your Minecraft skin file model type.
3. Download and print your character papercraft.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "SteveTabs", url: steveTabsImage.src },
  { id: "SteveFolds", url: steveFoldsImage.src },
  { id: "AlexTabs", url: alexTabsImage.src },
  { id: "AlexFolds", url: alexFoldsImage.src },
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

type MinecraftCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  showHeadOverlay: boolean;
  showBodyOverlay: boolean;
  showRightArmOverlay: boolean;
  showLeftArmOverlay: boolean;
  showRightLegOverlay: boolean;
  showLeftLegOverlay: boolean;
};

// Ported from `minecraftCharacterGenerator.ts`'s `script` render body: same
// `Minecraft`/`drawCuboid` calls, same offsets, same draw order (background,
// tabs, six body parts each followed by its region, folds, labels). The only
// difference is every value that used to come from `generator.get*InputValue`
// now comes from an author-owned `props`.
const render = (ctx: RenderContext, props: MinecraftCharacterProps): void => {
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

  function drawBody([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.body, [ox, oy], dimensions);
    if (props.showBodyOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.body,
        [ox, oy],
        dimensions
      );
    }
  }

  function drawRightArm([ox, oy]: [number, number]) {
    const dimensions: Dimensions = props.isSlim ? [24, 96, 32] : [32, 96, 32];
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

  function drawLeftArm([ox, oy]: [number, number]) {
    const dimensions: Dimensions = props.isSlim ? [24, 96, 32] : [32, 96, 32];
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

  function drawRightLeg([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.rightLeg,
      [ox, oy],
      dimensions
    );
    if (props.showRightLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightLeg,
        [ox, oy],
        dimensions
      );
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
    if (props.showLeftLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftLeg,
        [ox, oy],
        dimensions,
        { orientation: "East" }
      );
    }
  }

  function drawFolds() {
    if (props.isSlim) {
      ctx.drawImage("AlexFolds", [0, 0]);
    } else {
      ctx.drawImage("SteveFolds", [0, 0]);
    }
  }

  // Background

  ctx.drawImage("Background", [0, 0]);

  if (props.isSlim) {
    ctx.drawImage("AlexTabs", [0, 0]);
  } else {
    ctx.drawImage("SteveTabs", [0, 0]);
  }

  // Head

  const [oxHead, oyHead] = [74, 25];

  drawHead([oxHead, oyHead]);

  ctx.defineRegion([oxHead, oyHead, 256, 192], "head");

  // Body

  const [oxBody, oyBody] = [268, 201];

  drawBody([oxBody, oyBody]);

  ctx.defineRegion([oxBody, oyBody, 192, 160], "body");

  // Arms

  // Right Arm

  const [oxRightArm, oyRightArm] = props.isSlim ? [107, 373] : [99, 373];

  drawRightArm([oxRightArm, oyRightArm]);

  ctx.defineRegion(
    [oxRightArm, oyRightArm, props.isSlim ? 112 : 128, 160],
    "rightArm"
  );

  // Left Arm

  const [oxLeftArm, oyLeftArm] = props.isSlim ? [391, 373] : [383, 373];

  drawLeftArm([oxLeftArm, oyLeftArm]);

  ctx.defineRegion(
    [oxLeftArm, oyLeftArm, props.isSlim ? 112 : 128, 166],
    "leftArm"
  );

  // Right Leg

  const [oxRightLeg, oyRightLeg] = [99, 587];

  drawRightLeg([oxRightLeg, oyRightLeg]);

  ctx.defineRegion([oxRightLeg, oyRightLeg, 128, 160], "rightLeg");

  // Left Leg

  const [oxLeftLeg, oyLeftLeg] = [383, 587];

  drawLeftLeg([oxLeftLeg, oyLeftLeg]);

  ctx.defineRegion([oxLeftLeg, oyLeftLeg, 128, 160], "leftLeg");

  // Folds

  if (props.showFolds) {
    drawFolds();
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftCharacterGeneratorV2: GeneratorV2<MinecraftCharacterProps> = {
  id,
  name,
  images,
  textures,
  render,
};

// Behaviourally identical to the v1 `minecraft-character` generator: the same
// reused `MinecraftSkinControl` skin picker (10 presets + None + upload, with
// model type) plus Show Folds/Show Labels toggles and six clickable overlay
// regions, driving the same body-part render. The author owns the state here
// and feeds the picker's outputs back — the loaded `Texture` via
// `dynamicTextures`, everything else via `props`.
function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [showHeadOverlay, setShowHeadOverlay] = React.useState(true);
  const [showBodyOverlay, setShowBodyOverlay] = React.useState(true);
  const [showRightArmOverlay, setShowRightArmOverlay] = React.useState(true);
  const [showLeftArmOverlay, setShowLeftArmOverlay] = React.useState(true);
  const [showRightLegOverlay, setShowRightLegOverlay] = React.useState(true);
  const [showLeftLegOverlay, setShowLeftLegOverlay] = React.useState(true);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftCharacterProps = {
    isSlim,
    showFolds,
    showLabels,
    showHeadOverlay,
    showBodyOverlay,
    showRightArmOverlay,
    showLeftArmOverlay,
    showRightLegOverlay,
    showLeftLegOverlay,
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
            <GeneratorUI.Instructions markdown={instructions} />

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

            <GeneratorUI.TextControl>
              Click in the papercraft template to turn on and off the overlay
              for each part.
            </GeneratorUI.TextControl>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftCharacterGeneratorV2}
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
