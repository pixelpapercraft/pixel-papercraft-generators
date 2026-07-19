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
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import page1Image from "./images/Page1.png";
import page2Image from "./images/Page2.png";
import page3Image from "./images/Page3.png";
import page4Image from "./images/Page4.png";
import hole1Image from "./images/Hole1.png";
import hole2Image from "./images/Hole2.png";
import hole3Image from "./images/Hole3.png";

const id = "minecraft-mutant-character-v2";

const name = "Mutant Character";

const history: HistoryDef = [
  "Created by PaperDogChannel.",
  "Jul 2026 lostminer - Layout refresh.",
];

const video: VideoDef = {
  url: "https://www.youtube.com/embed/DVzumgRinjY?rel=0",
};

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Page1", url: page1Image.src },
  { id: "Page2", url: page2Image.src },
  { id: "Page3", url: page3Image.src },
  { id: "Page4", url: page4Image.src },
  { id: "Hole1", url: hole1Image.src },
  { id: "Hole2", url: hole2Image.src },
  { id: "Hole3", url: hole3Image.src },
];

// No static "Skin" texture: it's supplied at runtime by the skin picker
// through `dynamicTextures`, same as minecraftCharacterV2. See the migration
// plan's correctness note on why "None" would otherwise be wrong.
const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// `MinecraftSkinControl` only reads this for `texture`-kind options; the
// default preset options are all presets, so a shared empty map is safe.
const noTextures: Map<string, Texture> = new Map();

type MinecraftMutantCharacterProps = { isSlim: boolean };

// Ported from `minecraftMutantCharacterGenerator.ts`'s `script` render body
// verbatim: same four pages, same per-face `drawTextureLegacy` calls, same
// offsets, flips, and rotations, same draw order. The only differences are
// `generator.usePage`/`drawImage`/`drawTextureLegacy` -> `ctx.usePage`/
// `drawImage`/`drawTextureLegacy`, and `isSlimModel` -> `props.isSlim`.
const render = (
  ctx: RenderContext,
  props: MinecraftMutantCharacterProps
): void => {
  ctx.usePage("Page 1");
  ctx.drawImage("Page1", [0, 0]);

  // Head

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 260, y: 88, w: 84, h: 84 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 2, y: 88, w: 84, h: 84 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 88, y: 88, w: 84, h: 84 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 174, y: 88, w: 84, h: 84 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 2, y: 2, w: 84, h: 84 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 2, y: 174, w: 84, h: 84 },
    { flip: "Vertical" }
  ); // Bottom
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 8, w: 8, h: 8 },
    { x: 260, y: 88, w: 84, h: 84 }
  ); // Right
  ctx.drawTextureLegacy(
    "Skin",
    { x: 40, y: 8, w: 8, h: 8 },
    { x: 2, y: 88, w: 84, h: 84 }
  ); // Face
  ctx.drawTextureLegacy(
    "Skin",
    { x: 48, y: 8, w: 8, h: 8 },
    { x: 88, y: 88, w: 84, h: 84 }
  ); // Left
  ctx.drawTextureLegacy(
    "Skin",
    { x: 56, y: 8, w: 8, h: 8 },
    { x: 174, y: 88, w: 84, h: 84 }
  ); // Back
  ctx.drawTextureLegacy(
    "Skin",
    { x: 40, y: 0, w: 8, h: 8 },
    { x: 2, y: 2, w: 84, h: 84 }
  ); // Top
  ctx.drawTextureLegacy(
    "Skin",
    { x: 48, y: 0, w: 8, h: 8 },
    { x: 2, y: 174, w: 84, h: 84 },
    { flip: "Vertical" }
  ); // Bottom

  if (props.isSlim) {
    // Right Arm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 36, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 36, w: 3, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 36, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 36, w: 3, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 3, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );

    // Left Arm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 52, w: 3, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 55, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 59, y: 52, w: 3, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 48, w: 3, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
  } else {
    // Right Arm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 4, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 20, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 20, w: 4, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 36, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 36, w: 4, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 36, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 36, w: 4, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 4, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );

    // Left Arm

    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 4, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 52, w: 4, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 60, y: 52, w: 4, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 48, w: 4, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
  }

  // Legs

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 204, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 6, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 72, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 138, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 6, y: 529, w: 64, h: 65 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 36, w: 4, h: 6 },
    { x: 204, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 36, w: 4, h: 6 },
    { x: 6, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 36, w: 4, h: 6 },
    { x: 72, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 36, w: 4, h: 6 },
    { x: 138, y: 596, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 32, w: 4, h: 4 },
    { x: 6, y: 529, w: 64, h: 65 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 4, h: 6 },
    { x: 204 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 52, w: 4, h: 6 },
    { x: 6 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 6 },
    { x: 72 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 6 },
    { x: 138 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 6 + 283, y: 527, w: 64, h: 65 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 52, w: 4, h: 6 },
    { x: 204 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 52, w: 4, h: 6 },
    { x: 6 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 52, w: 4, h: 6 },
    { x: 72 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 52, w: 4, h: 6 },
    { x: 138 + 283, y: 594, w: 64, h: 116 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 4, h: 4 },
    { x: 6 + 283, y: 527, w: 64, h: 65 }
  );

  ctx.usePage("Page 2");

  ctx.drawImage("Page2", [0, 0]);

  if (props.isSlim) {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 26, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 26, w: 3, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 26, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 26, w: 3, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 42, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 42, w: 3, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 42, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 51, y: 42, w: 3, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 3, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 47, y: 32, w: 3, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 58, w: 3, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 43, y: 58, w: 3, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 58, w: 3, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 55, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 59, y: 58, w: 3, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 55, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
  } else {
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 26, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 26, w: 4, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 26, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 26, w: 4, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 42, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 42, w: 4, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 42, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 42, w: 4, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 4, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 32, w: 4, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 32, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 58, w: 4, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 44, y: 58, w: 4, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 48, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 58, w: 4, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 60, y: 58, w: 4, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 52, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    ctx.drawTextureLegacy(
      "Skin",
      { x: 56, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
  }

  // Legs

  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 26, w: 4, h: 6 },
    { x: 191, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 26, w: 4, h: 6 },
    { x: 3, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 26, w: 4, h: 6 },
    { x: 66, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 26, w: 4, h: 6 },
    { x: 128, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 3, y: 295, w: 61, h: 62 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 3, y: 295 + 62 + 4 + 110, w: 61, h: 62 },
    { flip: "Vertical" }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 42, w: 4, h: 6 },
    { x: 191, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 42, w: 4, h: 6 },
    { x: 3, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 42, w: 4, h: 6 },
    { x: 66, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 42, w: 4, h: 6 },
    { x: 128, y: 359, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 32, w: 4, h: 4 },
    { x: 3, y: 295, w: 61, h: 62 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 32, w: 4, h: 4 },
    { x: 3, y: 295 + 62 + 4 + 110, w: 61, h: 62 },
    { flip: "Vertical" }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 58, w: 4, h: 6 },
    { x: 459, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 58, w: 4, h: 6 },
    { x: 270, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 58, w: 4, h: 6 },
    { x: 333, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 58, w: 4, h: 6 },
    { x: 396, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 270, y: 293, w: 61, h: 62 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 270, y: 469, w: 61, h: 62 },
    { flip: "Vertical" }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 0, y: 58, w: 4, h: 6 },
    { x: 459, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 58, w: 4, h: 6 },
    { x: 270, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 58, w: 4, h: 6 },
    { x: 333, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 12, y: 58, w: 4, h: 6 },
    { x: 396, y: 357, w: 61, h: 110 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 4, y: 48, w: 4, h: 4 },
    { x: 270, y: 293, w: 61, h: 62 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 8, y: 48, w: 4, h: 4 },
    { x: 270, y: 469, w: 61, h: 62 },
    { flip: "Vertical" }
  );

  ctx.usePage("Page 3");

  ctx.drawImage("Page3", [0, 0]);

  // Torso11

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 7 },
    { x: 131, y: 4, w: 168, h: 126 },
    { rotateLegacy: 90.0 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 7 },
    { x: 133, y: 174, w: 252, h: 126 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 7 },
    { x: 387, y: 172, w: 168, h: 126 },
    { rotateLegacy: 270.0 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 7 },
    { x: 385, y: 598, w: 252, h: 126 },
    { rotateLegacy: 180.0 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 133, y: 4, w: 252, h: 168 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 26, w: 8, h: 1 },
    { x: 133, y: 302, w: 252, h: 168 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 36, w: 4, h: 7 },
    { x: 131, y: 4, w: 168, h: 126 },
    { rotateLegacy: 90.0 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 36, w: 8, h: 7 },
    { x: 133, y: 174, w: 252, h: 126 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 36, w: 4, h: 7 },
    { x: 387, y: 172, w: 168, h: 126 },
    { rotateLegacy: 270.0 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 36, w: 8, h: 7 },
    { x: 385, y: 598, w: 252, h: 126 },
    { rotateLegacy: 180.0 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 32, w: 8, h: 4 },
    { x: 133, y: 4, w: 252, h: 168 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 42, w: 8, h: 1 },
    { x: 133, y: 302, w: 252, h: 168 }
  );

  ctx.drawImage("Hole1", [216, 32]);

  ctx.drawImage("Hole2", [182, 320]);

  ctx.usePage("Page 4");

  ctx.drawImage("Page4", [0, 0]);

  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 27, w: 4, h: 5 },
    { x: 434, y: 134, w: 128, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 27, w: 8, h: 5 },
    { x: 3, y: 134, w: 150, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 27, w: 4, h: 5 },
    { x: 154, y: 134, w: 128, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 27, w: 8, h: 5 },
    { x: 283, y: 134, w: 150, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 3, y: 306, w: 150, h: 128 },
    { flip: "Vertical" }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 26, w: 8, h: 1 },
    { x: 3, y: 306 - 128 - 171 - 2, w: 150, h: 128 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 16, y: 41, w: 4, h: 5 },
    { x: 434, y: 134, w: 128, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 41, w: 8, h: 5 },
    { x: 3, y: 134, w: 150, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 41, w: 4, h: 5 },
    { x: 154, y: 134, w: 128, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 32, y: 41, w: 8, h: 5 },
    { x: 283, y: 134, w: 150, h: 171 }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 28, y: 39, w: 8, h: 9 },
    { x: 3, y: 306, w: 150, h: 128 },
    { flip: "Vertical" }
  );
  ctx.drawTextureLegacy(
    "Skin",
    { x: 20, y: 42, w: 8, h: 1 },
    { x: 3, y: 306 - 128 - 171 - 2, w: 150, h: 128 }
  );

  ctx.drawImage("Hole3", [3, 339]);

  ctx.drawImage("Hole3", [87, 339]);
};

const minecraftMutantCharacterGeneratorV2: GeneratorV2<MinecraftMutantCharacterProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

// Behaviourally identical to the v1 `minecraft-mutant-character` generator:
// the same reused `MinecraftSkinControl` skin picker (10 presets + None +
// upload, with model type) driving the same four-page render. No boolean
// toggles and no clickable regions. The author owns the state here and feeds
// the picker's loaded `Texture` back via `dynamicTextures`.
function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);

  const isSlim = skinValue.modelType === "Slim";

  const rendererProps: MinecraftMutantCharacterProps = { isSlim };

  const dynamicTextures = React.useMemo(
    () =>
      skinTexture
        ? new Map<string, Texture>([["Skin", skinTexture]])
        : new Map<string, Texture>(),
    [skinTexture]
  );

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
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftMutantCharacterGeneratorV2}
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
