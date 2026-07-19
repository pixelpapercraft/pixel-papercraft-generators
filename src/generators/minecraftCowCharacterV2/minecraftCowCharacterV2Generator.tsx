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

const id = "minecraft-cow-character";
const name = "Minecraft Cow Character";
const thumbnail: ThumbnailDef = { url: thumbnailImage.src };
const history: HistoryDef = [
  "Originally created by Poekoko.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "29 Sep 2020 NinjolasNJM - Updated to work with 1.8+ Skins.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "Jul 2026 lostminer - Layout refresh.",
];
const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];
const textures: TextureDef[] = [];
const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();

type MinecraftCowCharacterProps = {
  isSlim: boolean;
  showFolds: boolean;
  showLabels: boolean;
  hideHelmet: boolean;
  hideJacket: boolean;
  hideLeftSleeve: boolean;
  hideRightSleeve: boolean;
  hideLeftPant: boolean;
  hideRightPant: boolean;
};

const render = (
  ctx: RenderContext,
  props: MinecraftCowCharacterProps
): void => {
  let ox: number;
  let oy: number;

  ctx.defineRegion([25, 24, 224, 160], "helmet");
  ctx.defineRegion([194, 115, 352, 304], "jacket");
  ctx.defineRegion([421, 394, 128, 160], "leftSleeve");
  ctx.defineRegion([46, 394, 128, 160], "rightSleeve");
  ctx.defineRegion([421, 586, 128, 160], "leftPant");
  ctx.defineRegion([46, 586, 128, 160], "rightPant");

  // Background

  ctx.drawImage("Background", [0, 0]);

  // Head

  ctx.drawTextureLegacy("Skin", steve.base.head.right, {
    x: 25,
    y: 72,
    w: 48,
    h: 64,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.head.front, {
    x: 73,
    y: 72,
    w: 64,
    h: 64,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.head.left, {
    x: 137,
    y: 72,
    w: 48,
    h: 64,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.head.back, {
    x: 185,
    y: 72,
    w: 64,
    h: 64,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.head.top, {
    x: 73,
    y: 24,
    w: 64,
    h: 48,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.head.bottom,
    { x: 73, y: 136, w: 64, h: 48 },
    { flip: "Vertical" }
  ); // Bottom

  // Arms

  if (props.isSlim) {
    // Right Arm

    ox = 46;
    oy = 394;

    ctx.drawTextureLegacy("Skin", alex.base.rightArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.back, {
      x: ox + 96,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", alex.base.rightArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      alex.base.rightArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom

    // Left Arm

    ox = 453;
    oy = 394;

    ctx.drawTextureLegacy("Skin", alex.base.leftArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.back, {
      x: ox - 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", alex.base.leftArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      alex.base.leftArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
  } else {
    // Right Arm

    ox = 46;
    oy = 394;

    ctx.drawTextureLegacy("Skin", steve.base.rightArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.back, {
      x: ox + 96,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.base.rightArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.base.rightArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom

    // Left Arm

    ox = 453;
    oy = 394;

    ctx.drawTextureLegacy("Skin", steve.base.leftArm.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.back, {
      x: ox - 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.base.leftArm.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.base.leftArm.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Body

  ctx.drawTextureLegacy("Skin", steve.base.body.right, {
    x: 194,
    y: 195,
    w: 80,
    h: 144,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.body.front, {
    x: 274,
    y: 195,
    w: 96,
    h: 144,
  }); // Front
  ctx.drawTextureLegacy("Skin", steve.base.body.left, {
    x: 370,
    y: 195,
    w: 80,
    h: 144,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.body.back, {
    x: 450,
    y: 195,
    w: 96,
    h: 144,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.body.top, {
    x: 274,
    y: 115,
    w: 96,
    h: 80,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.body.bottom,
    { x: 274, y: 339, w: 96, h: 80 },
    { flip: "Vertical" }
  ); // Bottom

  // Right Leg

  ox = 46;
  oy = 586;

  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.right, {
    x: ox,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.front, {
    x: ox + 32,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.left, {
    x: ox + 64,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.back, {
    x: ox + 96,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.rightLeg.top, {
    x: ox + 32,
    y: oy,
    w: 32,
    h: 32,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.rightLeg.bottom,
    { x: ox + 32, y: oy + 128, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Left Leg

  ox = 453;
  oy = 586;

  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.right, {
    x: ox,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Right
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.front, {
    x: ox + 32,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Face
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.left, {
    x: ox + 64,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Left
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.back, {
    x: ox - 32,
    y: oy + 32,
    w: 32,
    h: 96,
  }); // Back
  ctx.drawTextureLegacy("Skin", steve.base.leftLeg.top, {
    x: ox + 32,
    y: oy,
    w: 32,
    h: 32,
  }); // Top
  ctx.drawTextureLegacy(
    "Skin",
    steve.base.leftLeg.bottom,
    { x: ox + 32, y: oy + 128, w: 32, h: 32 },
    { flip: "Vertical" }
  ); // Bottom

  // Overlays

  if (!props.hideHelmet) {
    // Helmet
    ctx.drawTextureLegacy("Skin", steve.overlay.head.right, {
      x: 25,
      y: 72,
      w: 48,
      h: 64,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.head.front, {
      x: 73,
      y: 72,
      w: 64,
      h: 64,
    }); // Front
    ctx.drawTextureLegacy("Skin", steve.overlay.head.left, {
      x: 137,
      y: 72,
      w: 48,
      h: 64,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.head.back, {
      x: 185,
      y: 72,
      w: 64,
      h: 64,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.head.top, {
      x: 73,
      y: 24,
      w: 64,
      h: 48,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.head.bottom,
      { x: 73, y: 136, w: 64, h: 48 },
      { flip: "Vertical" }
    ); // Bottom
  }

  // Arms2

  if (props.isSlim) {
    if (!props.hideRightSleeve) {
      // Right Arm2

      const ox = 46;
      const oy = 394;

      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Face
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.left, {
        x: ox + 56,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.back, {
        x: ox + 88,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Back
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.top, {
        x: ox + 32,
        y: oy,
        w: 24,
        h: 32,
      }); // Top
      ctx.drawTextureLegacy("Skin", alex.overlay.rightArm.bottom, {
        x: ox + 32,
        y: oy + 128,
        w: 24,
        h: 32,
      });
    } // Bottom

    if (!props.hideLeftSleeve) {
      // Left Arm2

      const ox = 453;
      const oy = 394;

      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Face
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.left, {
        x: ox + 56,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.back, {
        x: ox - 24,
        y: oy + 32,
        w: 24,
        h: 96,
      }); // Back
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.top, {
        x: ox + 32,
        y: oy,
        w: 24,
        h: 32,
      }); // Top
      ctx.drawTextureLegacy("Skin", alex.overlay.leftArm.bottom, {
        x: ox + 32,
        y: oy + 128,
        w: 24,
        h: 32,
      });
    } // Bottom
  } else {
    if (!props.hideRightSleeve) {
      // Right Arm2

      const ox = 46;
      const oy = 394;

      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Face
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.left, {
        x: ox + 64,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.back, {
        x: ox + 96,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Back
      ctx.drawTextureLegacy("Skin", steve.overlay.rightArm.top, {
        x: ox + 32,
        y: oy,
        w: 32,
        h: 32,
      }); // Top
      ctx.drawTextureLegacy(
        "Skin",
        steve.overlay.rightArm.bottom,
        { x: ox + 32, y: oy + 128, w: 32, h: 32 },
        { flip: "Vertical" }
      );
    } // Bottom
    if (!props.hideLeftSleeve) {
      // Left Arm2

      const ox = 453;
      const oy = 394;

      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.right, {
        x: ox,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Right
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.front, {
        x: ox + 32,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Face
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.left, {
        x: ox + 64,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Left
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.back, {
        x: ox - 32,
        y: oy + 32,
        w: 32,
        h: 96,
      }); // Back
      ctx.drawTextureLegacy("Skin", steve.overlay.leftArm.top, {
        x: ox + 32,
        y: oy,
        w: 32,
        h: 32,
      }); // Top
      ctx.drawTextureLegacy(
        "Skin",
        steve.overlay.leftArm.bottom,
        { x: ox + 32, y: oy + 128, w: 32, h: 32 },
        { flip: "Vertical" }
      );
    } // Bottom
  }
  if (!props.hideJacket) {
    // Jacket

    ctx.drawTextureLegacy("Skin", steve.overlay.body.right, {
      x: 194,
      y: 195,
      w: 80,
      h: 144,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.body.front, {
      x: 274,
      y: 195,
      w: 96,
      h: 144,
    }); // Front
    ctx.drawTextureLegacy("Skin", steve.overlay.body.left, {
      x: 370,
      y: 195,
      w: 80,
      h: 144,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.body.back, {
      x: 450,
      y: 195,
      w: 96,
      h: 144,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.body.top, {
      x: 274,
      y: 115,
      w: 96,
      h: 80,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.body.bottom,
      { x: 274, y: 339, w: 96, h: 80 },
      { flip: "Vertical" }
    ); // Bottom
  }

  if (!props.hideRightPant) {
    // Right Leg2
    const ox = 46;
    const oy = 586;
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.back, {
      x: ox + 96,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.rightLeg.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.rightLeg.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    );
  } // Bottom

  if (!props.hideLeftPant) {
    // Left Leg2

    const ox = 453;
    const oy = 586;

    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.right, {
      x: ox,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Right
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.front, {
      x: ox + 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Face
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.left, {
      x: ox + 64,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Left
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.back, {
      x: ox - 32,
      y: oy + 32,
      w: 32,
      h: 96,
    }); // Back
    ctx.drawTextureLegacy("Skin", steve.overlay.leftLeg.top, {
      x: ox + 32,
      y: oy,
      w: 32,
      h: 32,
    }); // Top
    ctx.drawTextureLegacy(
      "Skin",
      steve.overlay.leftLeg.bottom,
      { x: ox + 32, y: oy + 128, w: 32, h: 32 },
      { flip: "Vertical" }
    );
  } // Bottom

  // Folds

  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftCowCharacterGeneratorV2: GeneratorV2<MinecraftCowCharacterProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [hideHelmet, setHideHelmet] = React.useState(false);
  const [hideJacket, setHideJacket] = React.useState(false);
  const [hideLeftSleeve, setHideLeftSleeve] = React.useState(false);
  const [hideRightSleeve, setHideRightSleeve] = React.useState(false);
  const [hideLeftPant, setHideLeftPant] = React.useState(false);
  const [hideRightPant, setHideRightPant] = React.useState(false);

  const rendererProps: MinecraftCowCharacterProps = {
    isSlim: skinValue.modelType === "Slim",
    showFolds,
    showLabels,
    hideHelmet,
    hideJacket,
    hideLeftSleeve,
    hideRightSleeve,
    hideLeftPant,
    hideRightPant,
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
      case "helmet":
        setHideHelmet((value) => !value);
        break;
      case "jacket":
        setHideJacket((value) => !value);
        break;
      case "leftSleeve":
        setHideLeftSleeve((value) => !value);
        break;
      case "rightSleeve":
        setHideRightSleeve((value) => !value);
        break;
      case "leftPant":
        setHideLeftPant((value) => !value);
        break;
      case "rightPant":
        setHideRightPant((value) => !value);
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
            generator={minecraftCowCharacterGeneratorV2}
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
