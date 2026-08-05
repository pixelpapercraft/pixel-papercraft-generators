"use client";

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

const id = "minecraft-diorama";

const name = "Minecraft Diorama";

const instructions: InstructionsDef = `
Skeleton for the Minecraft Diorama generator rebuild. No content yet.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

// No controls or props yet — the render function just proves the page
// lifecycle works so the skeleton is exercisable before any real content
// lands.
type DioramaProps = Record<string, never>;

const noProps: DioramaProps = {};

const render = (ctx: RenderContext): void => {
  ctx.fillBackgroundColorWithWhite();
};

const minecraftDioramaGenerator: Generator<DioramaProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
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
          generator={minecraftDioramaGenerator}
          props={noProps}
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
