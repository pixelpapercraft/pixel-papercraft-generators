"use client";

import React from "react";
import {
  A4,
  GeneratorRenderer,
  GeneratorUI,
  swapPageSize,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type Rectangle,
  type RegionClickHandler,
  type RenderContext,
  type TextureDef,
} from "@genroot/builder";

const id = "test-api-page-size";

const name = "Test API: Page Size";

const instructions: InstructionsDef = `
Diagnostic board for \`usePage\`'s optional \`size\` parameter
(\`builder/engine/modelPage.ts\`). Renders a "Portrait" page with no size
argument (proving the default still resolves to A4) alongside a "Landscape"
page created via \`swapPageSize(A4.px)\` (proving an explicit size is
respected). The Landscape page also carries two independently-clickable
regions placed past x=595 — the old fixed portrait width — so a stale
click-region scale factor would place them off-canvas and any click aimed at
their real position would miss.
`;

const images: ImageDef[] = [];
const textures: TextureDef[] = [];

const regionA: Rectangle = [700, 60, 100, 100];
const regionB: Rectangle = [700, 220, 100, 100];

const clickedColor = "#22c55e";
const defaultColor = "#9ca3af";

type PageSizeProps = {
  clicked: Record<string, boolean>;
};

const render = (ctx: RenderContext, props: PageSizeProps): void => {
  ctx.usePage("Portrait");
  ctx.fillBackgroundColorWithWhite();
  ctx.drawText(`Portrait ${A4.px.width}x${A4.px.height}`, [20, 30], 14);
  ctx.fillRectangle([20, 50, 60, 60], "#3b82f6");

  ctx.usePage("Landscape", swapPageSize(A4.px));
  ctx.fillBackgroundColorWithWhite();
  ctx.drawText(`Landscape ${A4.px.height}x${A4.px.width}`, [20, 30], 14);

  ctx.fillRectangle(
    regionA,
    props.clicked["region-a"] ? clickedColor : defaultColor
  );
  ctx.defineRegion(regionA, "region-a");

  ctx.fillRectangle(
    regionB,
    props.clicked["region-b"] ? clickedColor : defaultColor
  );
  ctx.defineRegion(regionB, "region-b");
};

const testApiPageSizeGenerator: Generator<PageSizeProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [clicked, setClicked] = React.useState<Record<string, boolean>>({});

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    setClicked((current) => ({ ...current, [regionId]: !current[regionId] }));
  };

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiPageSizeGenerator}
          props={{ clicked }}
          onRegionClick={onRegionClick}
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
