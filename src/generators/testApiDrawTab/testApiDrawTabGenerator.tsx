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

const id = "test-api-draw-tab";

const name = "Test API: Draw Tab";

const instructions: InstructionsDef = `
Diagnostic board for the \`drawTab\` primitive
(\`builder/engine/renderers/drawTab.ts\`), at the \`ctx.drawTab\` level rather
than through \`_common/cuboidTabs.ts\`. Draws every \`tabShape\`
(\`Full\`/\`Left\`/\`Middle\`/\`Right\`) side by side for the selected
\`orientation\`, each over its own light-blue reference rectangle at a fixed
size and position so every tab's outer edge lands at known, assertable
coordinates. \`Full\` tapers both outer corners to a flat-top trapezoid;
\`Left\`/\`Right\` taper only the named corner and run flat, full-width to the
other; \`Middle\` tapers neither and draws only the flat outer edge — see
\`drawTab\`'s own comment for which corner each orientation's \`Left\`/\`Right\`
names.

Fixed for every cell: \`tabAngle\` = 45, \`showFoldLine\` = true. North/South
cells use a 80×30 rectangle (width along the tabbed edge); East/West cells
use a 30×80 rectangle (height along the tabbed edge), so the taper geometry
is identical across cells within a row and only the orientation differs
between rows.
`;

const images: ImageDef[] = [];
const textures: TextureDef[] = [];

const tabShapes = ["Full", "Left", "Middle", "Right"] as const;

const orientations = ["North", "South", "East", "West"] as const;
type BoardOrientation = (typeof orientations)[number];

const alongEdge = 80;
const depth = 30;

const cellWidth = 140;
const gridOrigin: [number, number] = [20, 60];

type DrawTabProps = {
  orientation: BoardOrientation;
};

function rectangleFor(orientation: BoardOrientation): [number, number] {
  switch (orientation) {
    case "North":
    case "South":
      return [alongEdge, depth];
    case "East":
    case "West":
      return [depth, alongEdge];
    default:
      return orientation satisfies never;
  }
}

const render = (ctx: RenderContext, props: DrawTabProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  ctx.drawText(
    `orientation="${props.orientation}"  tabAngle=45  showFoldLine=true`,
    [20, 30],
    12
  );

  const [w, h] = rectangleFor(props.orientation);

  tabShapes.forEach((tabShape, index) => {
    const cellOrigin: [number, number] = [
      gridOrigin[0] + index * cellWidth,
      gridOrigin[1],
    ];

    ctx.drawText(`tabShape="${tabShape}"`, cellOrigin, 12);

    const rectangle: [number, number, number, number] = [
      cellOrigin[0],
      cellOrigin[1] + 20,
      w,
      h,
    ];

    ctx.fillRectangle(rectangle, "#dbeafe");
    ctx.drawTab(rectangle, props.orientation, {
      showFoldLine: true,
      tabAngle: 45,
      tabShape,
    });
  });
};

const testApiDrawTabGenerator: Generator<DrawTabProps> = {
  id,
  name,
  images,
  textures,
  render,
};

const orientationOptions: Array<{ id: BoardOrientation; label: string }> =
  orientations.map((orientation) => ({ id: orientation, label: orientation }));

function Component(): JSX.Element {
  const [orientation, setOrientation] =
    React.useState<BoardOrientation>("North");

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
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiDrawTabGenerator}
          props={{ orientation }}
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
