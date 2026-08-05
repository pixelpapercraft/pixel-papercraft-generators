"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  rotationToDegrees,
  type Blend,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RegionClickHandler,
  type RenderContext,
  type SelectedTexture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder";
import { makeTextureVersionRegistry } from "@genroot/generators/_common/textures/customTextureVersionV2";
import {
  blockTextureVersions,
  itemTextureVersions,
} from "@genroot/generators/_common/textures/textureVersions";
import { TexturePickerV3 } from "@genroot/generators/_common/textures/texturePickerV3";

import {
  addFaceTexture,
  blockPresets,
  eraseFaceTexture,
  isBlockPreset,
  makeEmptyDioramaDocument,
  setPreset,
  type DioramaDocument,
} from "./dioramaDocument";
import { makeFaceRegions } from "./layout";

import thumbnailImage from "./thumbnail/v3-thumbnail-256.png";
import backgroundImage from "./images/Background.png";
import titleLandscapeImage from "./images/TitleLandscape.png";
import titlePortraitImage from "./images/TitlePortrait.png";

const id = "minecraft-diorama";

const name = "Minecraft Diorama";

const gridOriginX = 42;
const gridOriginY = 41;
const gridAreaWidth = 512;
const gridAreaHeight = 768;

const instructions: InstructionsDef = `
## How to use the Minecraft Diorama Generator?
* Select a block texture, then click a face on the grid to place it.
* Multiple textures can be stacked on the same face by clicking again.
* Select the eraser in the texture picker, then click a face to remove its most recently placed texture.
* Use the "Block Preset" dropdown to switch between whole blocks and quarter blocks for finer layouts.

This is still an early, dev-only build: tabs, folds, source/destination
editing, splitting, and multi-page layouts are not built yet.
`;

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title Landscape", url: titleLandscapeImage.src },
  { id: "Title Portrait", url: titlePortraitImage.src },
];

// Reversing [...items, ...blocks] orders the dropdown blocks-first, each
// group newest-version-first.
const registry = makeTextureVersionRegistry(
  [...itemTextureVersions, ...blockTextureVersions].slice().reverse()
);

const textures: TextureDef[] = registry.allTextureDefs;

type DioramaProps = {
  document: DioramaDocument;
};

function drawFaceTexture(
  ctx: RenderContext,
  texture: SelectedTexture,
  destination: [number, number, number, number]
): void {
  if (texture.textureDefId === "") {
    return;
  }

  const blend: Blend | undefined = texture.blend
    ? { kind: "MultiplyHex", hex: texture.blend }
    : undefined;

  ctx.drawTexture(texture.textureDefId, texture.frame.rectangle, destination, {
    rotate: rotationToDegrees(texture.rotation),
    flip: texture.flip,
    blend,
  });
}

const render = (ctx: RenderContext, props: DioramaProps): void => {
  ctx.fillBackgroundColorWithWhite();
  ctx.drawImage("Background", [0, 0]);

  const faceRegions = makeFaceRegions({
    originX: gridOriginX,
    originY: gridOriginY,
    pageWidth: gridAreaWidth,
    pageHeight: gridAreaHeight,
    preset: props.document.preset,
  });

  faceRegions.forEach(({ id: faceId, region }) => {
    ctx.defineRegion(region, faceId);
    const stack = props.document.faceTextures[faceId] ?? [];
    stack.forEach((texture) => drawFaceTexture(ctx, texture, region));
  });

  ctx.drawImage("Title Portrait", [0, 0]);
};

const minecraftDioramaGenerator: Generator<DioramaProps> = {
  id,
  name,
  images,
  textures,
  render,
};

const presetOptions = blockPresets.map((preset) => ({
  id: preset,
  label: preset,
}));

function Component(): JSX.Element {
  const [document, setDocument] = React.useState<DioramaDocument>(
    makeEmptyDioramaDocument()
  );
  const [versionId, setVersionId] = React.useState(
    registry.versionIds[0] ?? ""
  );
  const [selectedTexture, setSelectedTexture] =
    React.useState<SelectedTexture | null>(null);
  const [blend, setBlend] = React.useState<string | null>(null);
  const textureVersion = registry.findVersion(versionId);

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    if (!selectedTexture) {
      return;
    }
    setDocument((current) =>
      selectedTexture.textureDefId === ""
        ? eraseFaceTexture(current, regionId)
        : addFaceTexture(current, regionId, { ...selectedTexture, blend })
    );
  };

  const props: DioramaProps = { document };

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
            <GeneratorUI.SelectControl
              label="Block Preset"
              options={presetOptions}
              value={document.preset}
              onValueChange={(value) => {
                if (!isBlockPreset(value)) {
                  return;
                }
                setDocument((current) => setPreset(current, value));
              }}
            />
            <GeneratorUI.SelectControl
              label="Version"
              options={registry.versionIds.map((id) => ({ id, label: id }))}
              value={versionId}
              onValueChange={(value) => {
                setVersionId(value);
                setSelectedTexture((current) =>
                  current?.textureDefId === value ? current : null
                );
              }}
            />
            {textureVersion ? (
              <TexturePickerV3
                textureVersion={textureVersion}
                blend={blend}
                onTextureSelected={setSelectedTexture}
                onBlendSelected={setBlend}
              />
            ) : null}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftDioramaGenerator}
            props={props}
            onRegionClick={onRegionClick}
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
