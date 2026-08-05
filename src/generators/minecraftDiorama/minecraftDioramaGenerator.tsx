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
  type ThumbnailDef,
} from "@genroot/builder";

import thumbnailImage from "./thumbnail/v3-thumbnail-256.png";
import backgroundImage from "./images/Background.png";
import titleLandscapeImage from "./images/TitleLandscape.png";
import titlePortraitImage from "./images/TitlePortrait.png";

const id = "minecraft-diorama";

const name = "Minecraft Diorama";

const instructions: InstructionsDef = `
Skeleton for the Minecraft Diorama generator rebuild. No content yet.
`;

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title Landscape", url: titleLandscapeImage.src },
  { id: "Title Portrait", url: titlePortraitImage.src },
];

const textures: TextureDef[] = [];

// No controls or props yet — the render function just proves the page
// lifecycle works so the skeleton is exercisable before any real content
// lands. Title Landscape is registered but unused: the V2 render API only
// creates portrait pages until landscape gets its own builder capability.
type DioramaProps = Record<string, never>;

const noProps: DioramaProps = {};

const render = (ctx: RenderContext): void => {
  ctx.fillBackgroundColorWithWhite();
  ctx.drawImage("Background", [0, 0]);
  ctx.drawImage("Title Portrait", [0, 0]);
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
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

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
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
