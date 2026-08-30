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
  type SelectedTexture,
  type Texture,
  type TextureDef,
} from "@genroot/builder";
import {
  makeCustomTextureVersion,
  makeTextureVersionRegistry,
  parseAtlas,
  type VersionEntry,
} from "@genroot/generators/_common/textures/customTextureVersionV2";
import { TexturePickerV2 } from "@genroot/generators/_common/textures/texturePickerV2";
import customPlaceholderImage from "@genroot/generators/_common/textures/texture_custom.png";
import quadrants from "./fixtures/quadrants.png";

const id = "test-api-texture-picker-v2";

const name = "Test API: Texture Picker V2";

const instructions: InstructionsDef = `
Coverage board for the instance-based texture-version registry
(\`makeTextureVersionRegistry\`) and \`TexturePickerV2\`, the singleton-free
successor to \`_common/block/texturePicker.tsx\`'s \`findVersion\`/
\`TexturePicker\` pair.

Two static versions ("alpha", "beta") each expose two frames cropped from the
same 4-colour \`quadrants\` fixture (red/green top row, blue/yellow bottom
row — see Test API: Cuboid Tabs), plus a "custom" version backed by a real
\`makeCustomTextureVersion()\` slot with its own upload control. Selecting a
frame draws it into a fixed square, so a pixel read confirms the registry
resolved the right version and the picker resolved the right frame.
`;

const alphaVersion: VersionEntry = {
  textureDef: {
    id: "alpha",
    url: quadrants.src,
    standardWidth: 4,
    standardHeight: 4,
  },
  frames: [
    { id: "red", label: "Red", rectangle: [0, 0, 2, 2], crop: [0, 0, 2, 2] },
    {
      id: "green",
      label: "Green",
      rectangle: [2, 0, 2, 2],
      crop: [2, 0, 2, 2],
    },
  ],
};

const betaVersion: VersionEntry = {
  textureDef: {
    id: "beta",
    url: quadrants.src,
    standardWidth: 4,
    standardHeight: 4,
  },
  frames: [
    { id: "blue", label: "Blue", rectangle: [0, 2, 2, 2], crop: [0, 2, 2, 2] },
    {
      id: "yellow",
      label: "Yellow",
      rectangle: [2, 2, 2, 2],
      crop: [2, 2, 2, 2],
    },
  ],
};

// One dedicated slot owned by this generator module — each
// `makeCustomTextureVersion()` call returns an independent instance, so a
// second board or generator's own call never collides with this one.
const customVersion = makeCustomTextureVersion({
  id: "custom",
  label: "Custom",
  placeholderUrl: customPlaceholderImage.src,
  standardWidth: 4,
  standardHeight: 4,
});

const registry = makeTextureVersionRegistry([
  alphaVersion,
  betaVersion,
  customVersion,
]);

const images: ImageDef[] = [];

const textures: TextureDef[] = registry.allTextureDefs;

const swatchDestination: [number, number, number, number] = [40, 40, 64, 64];

type TexturePickerV2Props = {
  selectedTexture: SelectedTexture | null;
};

const render = (ctx: RenderContext, props: TexturePickerV2Props): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  if (!props.selectedTexture) {
    return;
  }
  const { textureDefId, frame, blend } = props.selectedTexture;
  ctx.drawTexture(textureDefId, frame.crop, swatchDestination, {
    blend: blend ? { kind: "MultiplyHex", hex: blend } : undefined,
  });
};

const testApiTexturePickerV2Generator: Generator<TexturePickerV2Props> = {
  id,
  name,
  images,
  textures,
  render,
};

const versionOptions = registry.versionIds.map((versionId) => ({
  id: versionId,
  label: versionId,
}));

function Component(): JSX.Element {
  const [versionId, setVersionId] = React.useState(
    registry.versionIds[0] ?? ""
  );
  const [selectedTexture, setSelectedTexture] =
    React.useState<SelectedTexture | null>(null);
  const [customTexture, setCustomTexture] = React.useState<Texture | null>(
    null
  );

  const dynamicTextures = new Map<string, Texture>();
  if (customTexture) {
    dynamicTextures.set(customVersion.textureDef.id, customTexture);
  }

  const onAtlasChange = (
    texture: Texture | null,
    framesJson: string | null
  ) => {
    setCustomTexture(texture);
    if (!texture) {
      return;
    }
    const url = texture.imageWithCanvas.image.src;
    const atlas = parseAtlas(framesJson);
    customVersion.updateAtlas(
      url,
      atlas && atlas.frames.length > 0 ? atlas : null
    );
  };

  const textureVersion = registry.findVersion(versionId);

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="mb-8">
          <GeneratorUI.Instructions markdown={instructions} />
        </div>

        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.SelectControl
            label="Version"
            options={versionOptions}
            value={versionId}
            onValueChange={(value) => {
              setVersionId(value);
              setSelectedTexture((current) =>
                current?.textureDefId === value ? current : null
              );
            }}
          />

          {versionId === customVersion.textureDef.id ? (
            <GeneratorUI.AtlasControl
              label="Custom"
              standardWidth={4}
              standardHeight={4}
              choices={[]}
              textures={dynamicTextures}
              onChange={onAtlasChange}
            />
          ) : null}

          <TexturePickerV2
            textureVersion={textureVersion}
            blend={selectedTexture?.blend ?? null}
            onTextureSelected={setSelectedTexture}
            onBlendSelected={(blend) =>
              setSelectedTexture((current) =>
                current ? { ...current, blend } : null
              )
            }
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiTexturePickerV2Generator}
          props={{ selectedTexture }}
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
