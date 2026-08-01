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

const id = "minecraft-banner-and-shield";

const name = "Minecraft Banner and Shield";

const instructions: InstructionsDef = `
Skeleton generator — component-by-component rebuild in progress. No banner or shield content yet.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

type BannerAndShieldProps = {
  showPlaceholderBorder: boolean;
};

const render = (ctx: RenderContext, props: BannerAndShieldProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  ctx.drawText("Banner and Shield", [40, 60], 24);
  ctx.drawText("Skeleton page - no content yet", [40, 90], 12);

  if (props.showPlaceholderBorder) {
    ctx.drawRectangle([20, 20, 555, 802]);
  }
};

const bannerAndShieldGenerator: Generator<BannerAndShieldProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [showPlaceholderBorder, setShowPlaceholderBorder] =
    React.useState(true);

  const rendererProps: BannerAndShieldProps = { showPlaceholderBorder };

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

          <GeneratorUI.BooleanControl
            label="Show Placeholder Border"
            checked={showPlaceholderBorder}
            onCheckedChange={setShowPlaceholderBorder}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={bannerAndShieldGenerator}
          props={rendererProps}
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
