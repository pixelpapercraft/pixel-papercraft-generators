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

const id = "test-api-tint-selector";

const name = "Test API: Tint Selector";

const instructions: InstructionsDef = `
Coverage board for the shared \`_common\` tint selector V2 (\`TintSelector\`).

It exists because the component is meant to be reused across generators, but
its only other current exercise is temporary throwaway wiring in the Banner
& Shield skeleton generator. Mounts the control on its own with a single dye
swatch group and draws whatever color it resolves to, so a pixel read
confirms the selection reached the render pass.

A second control below it sets \`includeNoTint={false}\`, for generators
(Armor, Horse, Cat) whose tint must always have a value.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

type TintSelectorProps = {
  tint: string | null;
  requiredTint: string;
};

const render = (ctx: RenderContext, props: TintSelectorProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();
  if (props.tint) {
    ctx.fillRectangle([20, 20, 64, 64], props.tint);
  }
  ctx.fillRectangle([100, 20, 64, 64], props.requiredTint);
};

const testApiTintSelectorGenerator: Generator<TintSelectorProps> = {
  id,
  name,
  images,
  textures,
  render,
};

const defaultRequiredTint = getFirstSwatchColor(dyeTintGroup) ?? "#1D1D21";

function Component(): JSX.Element {
  const [tint, setTint] = React.useState<string | null>(
    getFirstSwatchColor(dyeTintGroup)
  );
  const [requiredTint, setRequiredTint] =
    React.useState<string>(defaultRequiredTint);

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

          <TintSelector
            value={tint}
            label="Tint"
            swatchGroups={[dyeTintGroup]}
            onChange={setTint}
          />

          <TintSelector
            value={requiredTint}
            label="Required Tint"
            swatchGroups={[dyeTintGroup]}
            includeNoTint={false}
            onChange={(hex) => setRequiredTint(hex ?? defaultRequiredTint)}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiTintSelectorGenerator}
          props={{ tint, requiredTint }}
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
