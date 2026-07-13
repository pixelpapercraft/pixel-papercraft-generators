"use client";

import React from "react";
import {
  type ImageDef,
  type InstructionsDef,
  type TextureDef,
} from "@genroot/builder/modules/generatorDef";
import {
  type GeneratorV2,
  type RenderContext,
} from "@genroot/builder/v2/generatorV2";
import { GeneratorRenderer } from "@genroot/builder/v2/generatorRenderer";
import {
  GeneratorUI,
  type SelectOption,
} from "@genroot/builder/v2/generatorUI";

import skinImage from "./textures/Skin.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";

const id = "example-v2";

const name = "Example (v2)";

// Same copy as the v1 example generator's `instructions` — this is a
// UI-layout demo, not a content change.
const instructions: InstructionsDef = `
An example generator to demonstrate how to write a generator script.
`;

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
  highlightColor: string;
  highlightWidth: number;
};

const highlightColorOptions: SelectOption[] = [
  { id: "#ff00ff", label: "Pink" },
  { id: "#06b6d4", label: "Cyan" },
  { id: "#f59e0b", label: "Gold" },
];

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
    ctx.drawRectangle([185, 117, 64, 64], {
      color: props.highlightColor,
      width: props.highlightWidth,
    });
  }
};

export const exampleGeneratorV2: GeneratorV2<ExampleProps> = {
  id,
  name,
  images,
  textures,
  render,
};

// This control gallery demonstrates that authors can use V2's common controls
// while keeping state and layout fully local to the generator UI.
export function ExampleGeneratorV2UI(): JSX.Element {
  const [showFolds, setShowFolds] = React.useState(true);
  const [highlightHead, setHighlightHead] = React.useState(false);
  const [highlightColor, setHighlightColor] = React.useState("#ff00ff");
  const [highlightWidth, setHighlightWidth] = React.useState(3);

  const rendererProps: ExampleProps = {
    showFolds,
    highlightHead,
    highlightColor,
    highlightWidth,
  };

  return (
    <div className="lg:flex gap-8">
      <div className="flex-1 min-w-0" data-testid="generator-sidebar">
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

          <GeneratorUI.Text>
            These controls are V2 convenience components. They update local
            React state, which redraws the preview.
          </GeneratorUI.Text>

          <GeneratorUI.BooleanInput
            label="Show Folds"
            checked={showFolds}
            onCheckedChange={setShowFolds}
          />

          <GeneratorUI.SelectInput
            label="Head Highlight Color"
            options={highlightColorOptions}
            value={highlightColor}
            onValueChange={setHighlightColor}
          />

          <GeneratorUI.RangeInput
            label="Head Highlight Width"
            min={1}
            max={8}
            step={1}
            value={highlightWidth}
            valueLabel={`${highlightWidth}px`}
            onValueChange={setHighlightWidth}
          />

          <GeneratorUI.Button
            title="Toggle head highlight"
            size="Small"
            color="Blue"
            onClick={() => setHighlightHead((value) => !value)}
          >
            Toggle Head Highlight
          </GeneratorUI.Button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={exampleGeneratorV2}
          props={rendererProps}
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
