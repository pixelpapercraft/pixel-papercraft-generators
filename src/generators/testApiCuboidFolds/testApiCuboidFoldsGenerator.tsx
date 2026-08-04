"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type TextureDef,
} from "@genroot/builder";
import { drawCuboidFolds } from "../_common/cuboidFolds";
import { steve } from "../_common/minecraftCharacter";
import {
  Minecraft,
  type Center,
  type Cuboid,
  type Orientation,
} from "../_common/minecraft";
import quadrants from "./fixtures/quadrants.png";
import steveWide from "../_common/skins/wide/steve.png";

const id = "test-api-cuboid-folds";

const name = "Test API: Cuboid Folds";

const instructions: InstructionsDef = `
Diagnostic board for \`_common/cuboidFolds.ts\`. Draws one cuboid net via
the real \`Minecraft.drawCuboid\`, then \`drawCuboidFolds\` over it, at a
fixed position and dimensions so its fold-line coordinates are known and
assertable. \`orientation\` and \`center\` are both controllable — the same
two inputs \`drawCuboidFolds\` takes — so any combination can be inspected
directly against the real cuboid net, including \`center\`-adjusted cases
like the banner crossbar's real \`North\`/\`Bottom\` configuration.

The same net is drawn twice, at the same dimensions/orientation/center: once
with a synthetic 4-colour \`quadrants\` texture (for unambiguous per-face
rotation/flip checking), and again underneath with Steve's real head texture
(\`_common/skins/wide/steve.png\`) so the fold lines can be inspected against
recognisable art, not just flat colour.

Fixed for this board: position (100, 100), dimensions (w,h,d) = (90, 60, 30).
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [
  {
    id: "Quadrants",
    url: quadrants.src,
    standardWidth: 4,
    standardHeight: 4,
  },
  {
    id: "Steve",
    url: steveWide.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

// Every face samples the same full 4x4 source region, matching the Cuboid
// Tabs board — not a real net-shaped source crop, just enough to see face
// boundaries clearly against the fold lines drawn over them.
const quadrantCuboidSource: Cuboid = {
  front: [0, 0, 4, 4],
  back: [0, 0, 4, 4],
  top: [0, 0, 4, 4],
  bottom: [0, 0, 4, 4],
  left: [0, 0, 4, 4],
  right: [0, 0, 4, 4],
};

const position: [number, number] = [100, 100];
const dimensions: [number, number, number] = [90, 60, 30];

// Well clear of the first net's tallest possible extent across every
// orientation/center combination (worst case is North/South + Left/Right,
// whose dimension swap can put a 90-unit axis where a 30-unit one normally
// sits, extending to y=400), so the two nets — plus this net's own caption —
// never visually overlap.
const secondNetPosition: [number, number] = [100, 460];

type CuboidFoldsProps = {
  orientation: Orientation;
  center: Center;
};

const render = (ctx: RenderContext, props: CuboidFoldsProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  ctx.drawText(
    `dimensions (w,h,d) = ${dimensions.join(", ")}  orientation="${
      props.orientation
    }"  center="${props.center}"`,
    [20, 30],
    12
  );

  const minecraft = new Minecraft(ctx);
  minecraft.drawCuboid(
    "Quadrants",
    quadrantCuboidSource,
    position,
    dimensions,
    {
      orientation: props.orientation,
      center: props.center,
    }
  );

  drawCuboidFolds(ctx, position, dimensions, {
    orientation: props.orientation,
    center: props.center,
  });

  ctx.drawText(
    "Same net, Steve's real head texture:",
    [secondNetPosition[0], secondNetPosition[1] - 10],
    12
  );

  minecraft.drawCuboid(
    "Steve",
    steve.base.head,
    secondNetPosition,
    dimensions,
    {
      orientation: props.orientation,
      center: props.center,
    }
  );

  drawCuboidFolds(ctx, secondNetPosition, dimensions, {
    orientation: props.orientation,
    center: props.center,
  });
};

const testApiCuboidFoldsGenerator: Generator<CuboidFoldsProps> = {
  id,
  name,
  images,
  textures,
  render,
};

const orientationOptions: Array<{ id: Orientation; label: string }> = [
  { id: "West", label: "West" },
  { id: "East", label: "East" },
  { id: "North", label: "North" },
  { id: "South", label: "South" },
];

const centerOptions: Array<{ id: Center; label: string }> = [
  { id: "Front", label: "Front" },
  { id: "Back", label: "Back" },
  { id: "Top", label: "Top" },
  { id: "Bottom", label: "Bottom" },
  { id: "Left", label: "Left" },
  { id: "Right", label: "Right" },
];

function Component(): JSX.Element {
  const [orientation, setOrientation] = React.useState<Orientation>("West");
  const [center, setCenter] = React.useState<Center>("Front");

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

          <GeneratorUI.SelectControl
            label="Orientation"
            options={orientationOptions}
            value={orientation}
            onValueChange={(value) => {
              const match = orientationOptions.find(
                (option) => option.id === value
              );
              if (match) {
                setOrientation(match.id);
              }
            }}
          />

          <GeneratorUI.SelectControl
            label="Center"
            options={centerOptions}
            value={center}
            onValueChange={(value) => {
              const match = centerOptions.find((option) => option.id === value);
              if (match) {
                setCenter(match.id);
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiCuboidFoldsGenerator}
          props={{ orientation, center }}
        />
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail: null,
  Component,
};
