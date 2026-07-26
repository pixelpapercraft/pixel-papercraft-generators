"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type DynamicTextures,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type Texture,
  type TextureDef,
} from "@genroot/builder";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { makeMinecraftSkinPresetOption } from "../_common/skins/options";
import skinFixture from "@genroot/generators/_common/fixtures/testSheet.png";

const id = "test-api-skin-control";

const name = "Test API: Skin Control";

const instructions: InstructionsDef = `
Coverage board for the shared \`_common\` Minecraft skin control
(\`MinecraftSkinControl\`).

It exists for the username fetch/conversion path — entering a username, fetching
the skin from the Mojang lookup service, and converting it into the standard
sheet format. That path is reachable from no other test: skin *upload* and
*preset* selection are already covered by the individual generator specs, but
nothing else drives the fetch input.

Mounts the control with one deterministic preset built from the checked-in 64x64
\`testSheet.png\` fixture, and draws whatever texture the control produces, so a
single pixel read tells you a skin arrived and was converted.
`;

const images: ImageDef[] = [];

// No static textures: the skin arrives at runtime from the control and is fed
// back through `dynamicTextures`, exactly as a real V2 generator does it.
const textures: TextureDef[] = [];

// A single fixed preset — the same URL for Wide and Slim, so the model-type
// toggle never changes which bitmap is expected.
const skinOptions = [
  makeMinecraftSkinPresetOption("Fixture", skinFixture.src, skinFixture.src),
];

// `MinecraftSkinControl` reads this only for `texture`-kind options; the one
// option here is a preset, so a shared empty map is safe and keeps a stable
// identity across renders.
const noTextures: Map<string, Texture> = new Map();

type SkinControlProps = Record<string, never>;

const noProps: SkinControlProps = {};

// Same geometry as the retired V1 Controls board's skin page: source [0,0,64,64]
// drawn to [20,20,64,64], so a read at (24,24) lands inside the skin.
const render = (ctx: RenderContext): void => {
  ctx.usePage("Skin");
  if (ctx.hasTexture("Skin")) {
    ctx.drawTexture("Skin", [0, 0, 64, 64], [20, 20, 64, 64]);
  }
};

const testApiSkinControlGenerator: Generator<SkinControlProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [skinValue, setSkinValue] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skinTexture, setSkinTexture] = React.useState<Texture | null>(null);

  const dynamicTextures: DynamicTextures = { Skin: skinTexture };

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

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
          generator={testApiSkinControlGenerator}
          props={noProps}
          dynamicTextures={dynamicTextures}
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
