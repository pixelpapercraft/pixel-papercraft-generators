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
import {
  drawCuboidTabs,
  uniformTabBaseDimensions,
  type CuboidTabEdge,
  type CuboidTabFace,
} from "../_common/cuboidTabs";
import {
  Minecraft,
  makeFace,
  resolveCuboidFaces,
  resolveFaceVisualRectangle,
  type Cuboid,
  type Orientation,
  type RotationDegrees,
} from "../_common/minecraft";
import quadrants from "./fixtures/quadrants.png";

const id = "test-api-cuboid-tabs";

const name = "Test API: Cuboid Tabs";

const instructions: InstructionsDef = `
Diagnostic board for \`_common/cuboidTabs.ts\`. Draws the same cuboid net
four times, once per \`orientation\` (\`West\`/\`East\`/\`North\`/\`South\`,
\`center\` left at its default \`Front\` throughout) — via the real
\`Minecraft.drawCuboid\`, not a hand-drawn stand-in, so this exercises the
same production code path a real generator uses and shows genuine
per-face texture rotation/flip, not just face position. Every face samples
the same 4-colour \`quadrants\` fixture (red top-left, green top-right, blue
bottom-left, yellow bottom-right — see Test API: Drawing Textures), so a
face rendered with the wrong rotation/flip shows up as the wrong colour in
the wrong corner. Each face is also labelled by name. Plus exactly one tab
per net drawn via \`drawCuboidTabs\`'s \`placements\` option — the same
face/edge/uniform-base selection applied to all four, so any
orientation-specific difference is visible side by side.

Fixed dimensions for this board: width 90, height 60, depth 30 (all
different, so the three axes are never ambiguous at a glance).
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [
  {
    id: "Quadrants",
    url: quadrants.src,
    standardWidth: 4,
    standardHeight: 4,
  },
];

// Every face samples the same full 4x4 source region — not a real net-shaped
// source crop (`makeCuboid` builds one of those for genuine texture assets) —
// so any face rendered with the wrong rotation/flip is immediately visible as
// the wrong quadrant colour in the wrong corner.
const quadrantCuboidSource: Cuboid = {
  front: [0, 0, 4, 4],
  back: [0, 0, 4, 4],
  top: [0, 0, 4, 4],
  bottom: [0, 0, 4, 4],
  left: [0, 0, 4, 4],
  right: [0, 0, 4, 4],
};

const dimensions: [number, number, number] = [90, 60, 30];

const orientations: Orientation[] = ["West", "East", "North", "South"];

const gridCellWidth = 280;
const gridCellHeight = 260;
const gridOrigin: [number, number] = [20, 90];
const netInset: [number, number] = [40, 30];

const faceNames: CuboidTabFace[] = [
  "front",
  "back",
  "top",
  "bottom",
  "left",
  "right",
];

type CuboidTabsProps = {
  face: CuboidTabFace;
  edge: CuboidTabEdge;
  uniformBase: boolean;
};

function drawLabeledNetWithTab(
  ctx: RenderContext,
  position: [number, number],
  orientation: Orientation,
  props: CuboidTabsProps
): void {
  const minecraft = new Minecraft(ctx);
  minecraft.drawCuboid(
    "Quadrants",
    quadrantCuboidSource,
    position,
    dimensions,
    {
      orientation,
    }
  );

  const dest = resolveCuboidFaces(position, dimensions, { orientation });
  faceNames.forEach((face) => {
    // Label/border go on the true visual rectangle, not `dest[face]`'s raw
    // stored one — for a rotated face those differ (see
    // `resolveFaceVisualRectangle`'s doc comment), and `Minecraft.drawCuboid`
    // above already drew the real texture at the visual position.
    const rectangle = resolveFaceVisualRectangle(dest[face]);
    ctx.drawRectangle(rectangle, { color: "#000000", width: 1 });
    ctx.drawText(face, [rectangle[0] + 4, rectangle[1] + 14], 11);
  });

  drawCuboidTabs(ctx, position, dimensions, {
    orientation,
    placements: [{ face: props.face, edge: props.edge }],
    showFoldLine: true,
    baseDimensions: props.uniformBase
      ? uniformTabBaseDimensions(dimensions)
      : undefined,
  });
}

const render = (ctx: RenderContext, props: CuboidTabsProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  ctx.drawText(
    `dimensions (w,h,d) = ${dimensions.join(", ")}  center = default (Front)`,
    [20, 30],
    10
  );
  ctx.drawText(
    `tab: face="${props.face}" edge="${props.edge}"  uniformBase=${props.uniformBase}`,
    [20, 50],
    12
  );

  orientations.forEach((orientation, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const cellOrigin: [number, number] = [
      gridOrigin[0] + column * gridCellWidth,
      gridOrigin[1] + row * gridCellHeight,
    ];
    ctx.drawText(
      `orientation="${orientation}"`,
      [cellOrigin[0], cellOrigin[1]],
      12
    );
    const netPosition: [number, number] = [
      cellOrigin[0] + netInset[0],
      cellOrigin[1] + netInset[1],
    ];
    drawLabeledNetWithTab(ctx, netPosition, orientation, props);
  });

  drawRotationGroundTruthPage(ctx);
};

// A face's `rotate` is applied by `drawTexture` as a corner-pivot rotation
// around its stored `rectangle`'s own corner — `rotateLocalFace` pre-shifts
// that stored rectangle specifically to compensate, so for any `rotate !==
// 0` the stored rectangle is an anchor for the rotation transform, not the
// visual bounding box. This page makes that gap directly visible: a dashed
// red outline at the naive (unrotated-assumption) rectangle vs. where the
// quadrant texture actually lands, for each of the 4 possible `rotate`
// values — ground truth for fixing `cuboidTabs.ts`'s tab placement, which
// currently does plain arithmetic on the stored rectangle with no
// awareness of `rotate` at all.
const rotationProbeValues: RotationDegrees[] = [0, 90, 180, 270];
const rotationProbeSize: [number, number] = [80, 20];
const rotationProbeY = 200;

function drawRotationGroundTruthPage(ctx: RenderContext): void {
  ctx.usePage("Rotation ground truth");
  ctx.fillBackgroundColorWithWhite();
  ctx.drawText(
    "Dashed red = naive (unrotated) rectangle. Solid quadrants = where the texture actually renders for that `rotate` value.",
    [20, 30],
    11
  );

  const minecraft = new Minecraft(ctx);
  rotationProbeValues.forEach((rotate, index) => {
    const [x, y] = [250, rotationProbeY + index * 170];
    const [w, h] = rotationProbeSize;
    ctx.drawText(`rotate=${rotate}`, [x, y - 10], 11);
    ctx.drawRectangle([x, y, w, h], {
      color: "#dc2626",
      width: 1,
      lineDash: [4, 3],
    });
    minecraft.drawFaceTexture("Quadrants", [0, 0, 4, 4], {
      ...makeFace([x, y, w, h]),
      rotate,
    });
  });
}

const testApiCuboidTabsGenerator: Generator<CuboidTabsProps> = {
  id,
  name,
  images,
  textures,
  render,
};

const faceOptions: Array<{ id: CuboidTabFace; label: string }> = [
  { id: "front", label: "front" },
  { id: "back", label: "back" },
  { id: "top", label: "top" },
  { id: "bottom", label: "bottom" },
  { id: "left", label: "left" },
  { id: "right", label: "right" },
];

const edgeOptions: Array<{ id: CuboidTabEdge; label: string }> = [
  { id: "Top", label: "Top" },
  { id: "Bottom", label: "Bottom" },
  { id: "Left", label: "Left" },
  { id: "Right", label: "Right" },
];

function Component(): JSX.Element {
  const [face, setFace] = React.useState<CuboidTabFace>("right");
  const [edge, setEdge] = React.useState<CuboidTabEdge>("Top");
  const [uniformBase, setUniformBase] = React.useState(false);

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

          <GeneratorUI.SelectControl
            label="Tab face"
            options={faceOptions}
            value={face}
            onValueChange={(value) => {
              const match = faceOptions.find((option) => option.id === value);
              if (match) {
                setFace(match.id);
              }
            }}
          />

          <GeneratorUI.SelectControl
            label="Tab edge"
            options={edgeOptions}
            value={edge}
            onValueChange={(value) => {
              const match = edgeOptions.find((option) => option.id === value);
              if (match) {
                setEdge(match.id);
              }
            }}
          />

          <GeneratorUI.BooleanControl
            label="Uniform base (normalize back to match right/left)"
            checked={uniformBase}
            onCheckedChange={setUniformBase}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiCuboidTabsGenerator}
          props={{ face, edge, uniformBase }}
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
