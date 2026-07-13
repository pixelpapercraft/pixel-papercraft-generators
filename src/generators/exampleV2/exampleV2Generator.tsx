"use client";

import React from "react";
import { type ImageDef, type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type GeneratorV2,
  type RenderContext,
} from "@genroot/builder/v2/generatorV2";
import { GeneratorRenderer } from "@genroot/builder/v2/generatorRenderer";

import skinImage from "./textures/Skin.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";

const id = "example-v2";

const name = "Example (v2)";

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
];

// The preset `Skin` texture, same asset the v1 example generator ships with.
// This prototype draws it as-is (no Minecraft-skin picker) — see the plan's
// "Prototype scope" section.
const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skinImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

export type ExampleProps = {
  showFolds: boolean;
  highlightHead: boolean;
};

// Ported verbatim from `exampleGenerator.ts`'s `script` render body: same
// `drawHead` helper, same `drawImage("Background")`/folds calls. Only
// difference is where `showFolds` comes from — an author-owned prop instead
// of `generator.getBooleanInputValue("Show Folds")` — plus the region-click
// demo below (`highlightHead`/`defineRegion`).
const render = (ctx: RenderContext, props: ExampleProps): void => {
  // Helper Function to draw heads
  const drawHead = (name: string, x: number, y: number) => {
    // Head Base
    ctx.drawTexture(name, [0, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    ctx.drawTexture(name, [8, 8, 8, 8], [x, y, 64, 64]); // Face
    ctx.drawTexture(name, [16, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    ctx.drawTexture(name, [24, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    ctx.drawTexture(name, [8, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    ctx.drawTexture(name, [16, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: "Vertical",
    }); // Bottom

    // Head Overlay
    ctx.drawTexture(name, [32, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    ctx.drawTexture(name, [40, 8, 8, 8], [x, y, 64, 64]); // Face
    ctx.drawTexture(name, [48, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    ctx.drawTexture(name, [56, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    ctx.drawTexture(name, [40, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    ctx.drawTexture(name, [48, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: "Vertical",
    }); // Bottom
  };

  ctx.drawImage("Background", [0, 0]);

  drawHead("Skin", 185, 117);

  if (props.showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Region-click demo: the head's face is drawn at this same dest rectangle
  // (see `drawHead`'s `[x, y, 64, 64]` face call above). Clicking it calls
  // `onRegionClick` with `regionId: "head"`; the UI below toggles
  // `highlightHead` in response, which this pure `render` reflects by
  // drawing a bright outline — the click's effect made obvious.
  ctx.defineRegion([185, 117, 64, 64], "head");

  if (props.highlightHead) {
    ctx.drawRectangle([185, 117, 64, 64], { color: "#ff00ff", width: 3 });
  }
};

export const exampleGeneratorV2: GeneratorV2<ExampleProps> = {
  id,
  name,
  images,
  textures,
  render,
};

// Minimal, fully-custom author-written React UI: a `useState` boolean drives
// `<GeneratorRenderer>`'s `props`, and toggling it is the whole reactive
// seam this prototype proves — no `defineBooleanInput`/`onChange` wiring.
export function ExampleGeneratorV2UI(): JSX.Element {
  const [showFolds, setShowFolds] = React.useState(true);
  const [highlightHead, setHighlightHead] = React.useState(false);

  return (
    <div className="lg:flex gap-8">
      <div className="flex-1 min-w-0" data-testid="generator-sidebar">
        <div className="w-full bg-gray-100 p-8">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showFolds}
              onChange={(event) => setShowFolds(event.target.checked)}
            />
            Show Folds
          </label>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={exampleGeneratorV2}
          props={{ showFolds, highlightHead }}
          onRegionClick={({ regionId }) => {
            if (regionId === "head") {
              setHighlightHead((v) => !v);
            }
          }}
        />
      </div>
    </div>
  );
}
