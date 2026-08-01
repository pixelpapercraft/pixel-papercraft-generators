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
import { TintSelector } from "../_common/tintSelectorV2/tintSelector";
import { getFirstSwatchColor } from "../_common/tintSelectorV2/tintSelectorLogic";
import { dyeTintGroup } from "../_common/tintSelectorV2/tints";

const id = "minecraft-banner-and-shield";

const name = "Minecraft Banner and Shield";

const instructions: InstructionsDef = `
Skeleton generator — component-by-component rebuild in progress. No banner or shield content yet.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

type BannerAndShieldProps = {
  showPlaceholderBorder: boolean;
  tint: string | null;
};

const render = (ctx: RenderContext, props: BannerAndShieldProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  ctx.drawText("Banner and Shield", [40, 60], 24);
  ctx.drawText("Skeleton page - no content yet", [40, 90], 12);

  if (props.showPlaceholderBorder) {
    ctx.drawRectangle([20, 20, 555, 802]);
  }

  // Temporary: proves the tint selector V2 port is wired end to end. Removed
  // once the pattern picker component lands and consumes the tint itself.
  if (props.tint) {
    ctx.fillRectangle([420, 40, 130, 130], props.tint);
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
  const [tint, setTint] = React.useState<string | null>(
    getFirstSwatchColor(dyeTintGroup)
  );

  const rendererProps: BannerAndShieldProps = { showPlaceholderBorder, tint };

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

          {/* Temporary: exercises the tint selector V2 port in isolation. */}
          <TintSelector
            value={tint}
            label="Tint (V2 port test)"
            swatchGroups={[dyeTintGroup]}
            onChange={setTint}
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
