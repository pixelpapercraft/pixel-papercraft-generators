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
import { steve } from "../_common/minecraftCharacter";
import { getSkinUrl } from "../_common/skins";
import {
  makeDefaultMinecraftSkinPresetOptions,
  makeMinecraftSkinPresetOption,
} from "../_common/skins/options";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import tabsImage from "./images/Tabs.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import actionFigureImage from "./images/Action-Figure.png";
import actionFigureFoldsImage from "./images/Action-Figure-Folds.png";
import actionFigureLabelsImage from "./images/Action-Figure-Labels.png";

const id = "minecraft-creeper-character";

const name = "Minecraft Creeper Character";

const history: HistoryDef = [
  "Created by CanadaCraft, template by BrickyBoy99.",
  "13 Sep 2020 NinjolasNJM - Updated to work with 1.8+ Skins.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Tabs", url: tabsImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Action-Figure", url: actionFigureImage.src },
  { id: "Action-Figure-Folds", url: actionFigureFoldsImage.src },
  { id: "Action-Figure-Labels", url: actionFigureLabelsImage.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker through
// `dynamicTextures`, same as minecraftCharacterV2. This is why explicit "None"
// correctly renders no skin.
const textures: TextureDef[] = [];

// The default presets plus a fixed "Default (Slim)" choice. V1 exposes the
// latter as a `defineTextureInput` texture option pointing at the slim default
// skin; here it's a preset whose Wide and Slim URLs are both that slim skin, so
// the (hidden) model-type toggle can't change it and the pixels match V1's
// texture option exactly (same technique as minecraftCharacterHeadsV2).
const skinOptions = [
  ...makeDefaultMinecraftSkinPresetOptions(),
  makeMinecraftSkinPresetOption(
    "Default (Slim)",
    getSkinUrl("Default", "Slim"),
    getSkinUrl("Default", "Slim")
  ),
];

// `MinecraftSkinControl` only reads this for `texture`-kind options; every
// option above is a preset, so a shared empty map is safe.
const noTextures: Map<string, Texture> = new Map();

type MinecraftCreeperCharacterProps = {
  showFolds: boolean;
  showLabels: boolean;
  actionFigure: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideFrontRightPant: boolean;
  hideFrontLeftPant: boolean;
  hideBackRightPant: boolean;
  hideBackLeftPant: boolean;
};

// Ported from `minecraftCreeperCharacterGenerator.ts`'s `script` render body:
// the same `drawTexture` calls with the same `steve` cuboid faces, offsets,
// flips and draw order. Every value that used to come from
// `generator.get*InputValue` now comes from an author-owned `props`, and the
// six `defineRegionInput` toggles become declarative `defineRegion`s whose
// clicks are handled in `Component`.
const render = (
  ctx: RenderContext,
  {
    showFolds,
    showLabels,
    actionFigure,
    hideHelmet,
    hideJacket,
    hideFrontRightPant,
    hideFrontLeftPant,
    hideBackRightPant,
    hideBackLeftPant,
  }: MinecraftCreeperCharacterProps
): void => {
  let ox: number;
  let oy: number;

  // Overlay-toggle regions (helmet, jacket, four foot pants).
  ctx.defineRegion([164, 110, 260, 196], "helmet");
  ctx.defineRegion([196, 340, 196, 196], "jacket");
  ctx.defineRegion([62, 471, 134, 116], "frontRightPant");
  ctx.defineRegion([121, 589, 134, 116], "frontLeftPant");
  ctx.defineRegion([419, 471, 134, 116], "backRightPant");
  ctx.defineRegion([367, 589, 134, 116], "backLeftPant");

  // Background

  ctx.drawImage("Background", [0, 0]);
  ctx.drawImage("Tabs", [0, 0]);

  // Head

  ox = 164;
  oy = 110;

  ctx.drawTexture("Skin", steve.base.head.right, [0 + ox, 64 + oy, 64, 64]);
  ctx.drawTexture("Skin", steve.base.head.front, [64 + ox, 64 + oy, 64, 64]);
  ctx.drawTexture("Skin", steve.base.head.left, [128 + ox, 64 + oy, 64, 64]);
  ctx.drawTexture("Skin", steve.base.head.back, [192 + ox, 64 + oy, 64, 64]);
  ctx.drawTexture("Skin", steve.base.head.top, [64 + ox, 0 + oy, 64, 64]);
  ctx.drawTexture("Skin", steve.base.head.bottom, [64 + ox, 128 + oy, 64, 64], {
    flip: "Vertical",
  });

  // Body

  ox = 196;
  oy = 340;

  ctx.drawTexture("Skin", steve.base.body.right, [0 + ox, 32 + oy, 32, 96]);
  ctx.drawTexture("Skin", steve.base.body.front, [32 + ox, 32 + oy, 64, 96]);
  ctx.drawTexture("Skin", steve.base.body.left, [96 + ox, 32 + oy, 32, 96]);
  ctx.drawTexture("Skin", steve.base.body.back, [128 + ox, 32 + oy, 64, 96]);
  ctx.drawTexture("Skin", steve.base.body.top, [32 + ox, oy, 64, 32]);
  ctx.drawTexture("Skin", steve.base.body.bottom, [80 + ox, 144 + oy, 64, 32], {
    flip: "Vertical",
    rotate: 90.0,
  });

  // Front Right Foot

  ox = 62;
  oy = 471;

  ctx.drawTexture("Skin", steve.base.rightLeg.back, [0 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.rightLeg.right, [
    32 + ox,
    32 + oy,
    32,
    48,
  ]);
  ctx.drawTexture("Skin", steve.base.rightLeg.front, [
    64 + ox,
    32 + oy,
    32,
    48,
  ]);
  ctx.drawTexture("Skin", steve.base.rightLeg.left, [96 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.rightLeg.top, [64 + ox, 0 + oy, 32, 32]);
  ctx.drawTexture(
    "Skin",
    steve.base.rightLeg.bottom,
    [64 + ox, 80 + oy, 32, 32],
    { flip: "Vertical" }
  );

  // Front Left Foot

  ox = 121;
  oy = 589;

  ctx.drawTexture("Skin", steve.base.leftLeg.back, [0 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.right, [32 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.front, [64 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.left, [96 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.top, [64 + ox, 0 + oy, 32, 32]);
  ctx.drawTexture(
    "Skin",
    steve.base.leftLeg.bottom,
    [64 + ox, 80 + oy, 32, 32],
    { flip: "Vertical" }
  );

  // Back Right Foot

  ox = 419;
  oy = 471;

  ctx.drawTexture("Skin", steve.base.rightLeg.right, [
    64 + ox,
    32 + oy,
    32,
    48,
  ]);
  ctx.drawTexture("Skin", steve.base.rightLeg.front, [
    96 + ox,
    32 + oy,
    32,
    48,
  ]);
  ctx.drawTexture("Skin", steve.base.rightLeg.left, [0 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.rightLeg.back, [32 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.rightLeg.top, [32 + ox, oy, 32, 32], {
    rotate: 180.0,
  });
  ctx.drawTexture(
    "Skin",
    steve.base.rightLeg.bottom,
    [32 + ox, 80 + oy, 32, 32],
    { flip: "Vertical", rotate: 180.0 }
  );

  // Back Left Foot

  ox = 367;
  oy = 589;

  ctx.drawTexture("Skin", steve.base.leftLeg.right, [64 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.front, [96 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.left, [0 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.back, [32 + ox, 32 + oy, 32, 48]);
  ctx.drawTexture("Skin", steve.base.leftLeg.top, [32 + ox, oy, 32, 32], {
    rotate: 180.0,
  });
  ctx.drawTexture(
    "Skin",
    steve.base.leftLeg.bottom,
    [32 + ox, 80 + oy, 32, 32],
    { flip: "Vertical", rotate: 180.0 }
  );

  // Overlays

  if (!hideHelmet) {
    // Helmet

    ox = 164;
    oy = 110;

    ctx.drawTexture("Skin", steve.overlay.head.right, [
      0 + ox,
      64 + oy,
      64,
      64,
    ]);
    ctx.drawTexture("Skin", steve.overlay.head.front, [
      64 + ox,
      64 + oy,
      64,
      64,
    ]);
    ctx.drawTexture("Skin", steve.overlay.head.left, [
      128 + ox,
      64 + oy,
      64,
      64,
    ]);
    ctx.drawTexture("Skin", steve.overlay.head.back, [
      192 + ox,
      64 + oy,
      64,
      64,
    ]);
    ctx.drawTexture("Skin", steve.overlay.head.top, [64 + ox, 0 + oy, 64, 64]);
    ctx.drawTexture(
      "Skin",
      steve.overlay.head.bottom,
      [64 + ox, 128 + oy, 64, 64],
      { flip: "Vertical" }
    );
  }

  if (!hideJacket) {
    // Jacket

    ox = 196;
    oy = 340;

    ctx.drawTexture("Skin", steve.overlay.body.right, [
      0 + ox,
      32 + oy,
      32,
      96,
    ]);
    ctx.drawTexture("Skin", steve.overlay.body.front, [
      32 + ox,
      32 + oy,
      64,
      96,
    ]);
    ctx.drawTexture("Skin", steve.overlay.body.left, [
      96 + ox,
      32 + oy,
      32,
      96,
    ]);
    ctx.drawTexture("Skin", steve.overlay.body.back, [
      128 + ox,
      32 + oy,
      64,
      96,
    ]);
    ctx.drawTexture("Skin", steve.overlay.body.top, [32 + ox, oy, 64, 32]);
    ctx.drawTexture(
      "Skin",
      steve.overlay.body.bottom,
      [80 + ox, 144 + oy, 64, 32],
      { flip: "Vertical", rotate: 90.0 }
    );
  }

  if (!hideFrontRightPant) {
    // Front Right Pant

    ox = 62;
    oy = 471;

    ctx.drawTexture("Skin", steve.overlay.rightLeg.back, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.right, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.front, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.left, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.top, [
      64 + ox,
      0 + oy,
      32,
      32,
    ]);
    ctx.drawTexture(
      "Skin",
      steve.overlay.rightLeg.bottom,
      [64 + ox, 80 + oy, 32, 32],
      { flip: "Vertical" }
    );
  }

  if (!hideFrontLeftPant) {
    // Front Left Pant

    ox = 121;
    oy = 589;

    ctx.drawTexture("Skin", steve.overlay.leftLeg.back, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.right, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.front, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.left, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.top, [
      64 + ox,
      0 + oy,
      32,
      32,
    ]);
    ctx.drawTexture(
      "Skin",
      steve.overlay.leftLeg.bottom,
      [64 + ox, 80 + oy, 32, 32],
      { flip: "Vertical" }
    );
  }

  if (!hideBackRightPant) {
    // Back Right Pant

    ox = 419;
    oy = 471;

    ctx.drawTexture("Skin", steve.overlay.rightLeg.right, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.front, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.left, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.back, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.rightLeg.top, [32 + ox, oy, 32, 32], {
      rotate: 180.0,
    });
    ctx.drawTexture(
      "Skin",
      steve.overlay.rightLeg.bottom,
      [32 + ox, 80 + oy, 32, 32],
      { flip: "Vertical", rotate: 180.0 }
    );
  }

  if (!hideBackLeftPant) {
    // Back Left Pant

    ox = 367;
    oy = 589;

    ctx.drawTexture("Skin", steve.overlay.leftLeg.left, [
      64 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.front, [
      96 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.right, [
      0 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.back, [
      32 + ox,
      32 + oy,
      32,
      48,
    ]);
    ctx.drawTexture("Skin", steve.overlay.leftLeg.top, [32 + ox, oy, 32, 32], {
      rotate: 180.0,
    });
    ctx.drawTexture(
      "Skin",
      steve.overlay.leftLeg.bottom,
      [32 + ox, 80 + oy, 32, 32],
      { flip: "Vertical", rotate: 180.0 }
    );
  }

  // Action Figure
  if (actionFigure) {
    // Neck

    ctx.drawTexture("Skin", steve.base.head.bottom, [44, 254, 64, 96]);

    // Neck Overlay

    if (!hideHelmet) {
      ctx.drawTexture("Skin", steve.overlay.head.bottom, [44, 254, 64, 96]);
    }

    // Foreground

    ctx.drawImage("Action-Figure", [0, 0]);

    // Folds

    if (showFolds) {
      ctx.drawImage("Action-Figure-Folds", [0, 0]);
    }

    // Labels

    if (showLabels) {
      ctx.drawImage("Action-Figure-Labels", [0, 0]);
    }
  }

  // Folds

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftCreeperCharacterGeneratorV2: GeneratorV2<MinecraftCreeperCharacterProps> =
  { id, name, images, textures, render };

// Behaviourally identical to the v1 `minecraft-creeper-character` generator: the
// same reused `MinecraftSkinControl` skin picker (presets plus a fixed "Default
// (Slim)" option, no model-type toggle) plus Show Folds / Show Labels / Action
// Figure toggles and six clickable overlay regions (helmet, jacket, and the
// four foot pants), driving the same body-part render. The author owns the
// state here and feeds the picker's outputs back — the loaded `Texture` via
// `dynamicTextures`, everything else via `props`.
function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [actionFigure, setActionFigure] = React.useState(false);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideFrontRightPant, setHideFrontRightPant] = React.useState(false);
  const [hideFrontLeftPant, setHideFrontLeftPant] = React.useState(false);
  const [hideBackRightPant, setHideBackRightPant] = React.useState(false);
  const [hideBackLeftPant, setHideBackLeftPant] = React.useState(false);

  const rendererProps: MinecraftCreeperCharacterProps = {
    showFolds,
    showLabels,
    actionFigure,
    hideHelmet,
    hideJacket,
    hideFrontRightPant,
    hideFrontLeftPant,
    hideBackRightPant,
    hideBackLeftPant,
  };

  const dynamicTextures: DynamicTextures = { Skin: skinTexture };

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "helmet":
        setHideHelmet((v) => !v);
        break;
      case "jacket":
        setHideJacket((v) => !v);
        break;
      case "frontRightPant":
        setHideFrontRightPant((v) => !v);
        break;
      case "frontLeftPant":
        setHideFrontLeftPant((v) => !v);
        break;
      case "backRightPant":
        setHideBackRightPant((v) => !v);
        break;
      case "backLeftPant":
        setHideBackLeftPant((v) => !v);
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
              showModelType={false}
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

            <GeneratorUI.BooleanControl
              label="Action Figure"
              checked={actionFigure}
              onCheckedChange={setActionFigure}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftCreeperCharacterGeneratorV2}
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
