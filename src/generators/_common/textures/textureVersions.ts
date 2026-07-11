import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type TextureData,
  type TextureFrame,
  tilesToTextureFrames,
} from "@genroot/builder/modules/textureData";

import { customTextureVersion } from "./customTextureVersion";
import * as Texture_1_7_10_Blocks from "./texture_minecraft_1_7_10_blocks";
import * as Texture_1_7_10_Items from "./texture_minecraft_1_7_10_items";
import * as Texture_1_13_2_Blocks from "./texture_minecraft_1_13_2_blocks";
import * as Texture_1_13_2_Items from "./texture_minecraft_1_13_2_items";
import * as Texture_26_2_Blocks from "./texture_minecraft_26_2_blocks";
import * as Texture_26_2_Items from "./texture_minecraft_26_2_items";

const blockDefinitions: [TextureData, number][] = [
  [Texture_1_7_10_Blocks.data, 16],
  [Texture_1_13_2_Blocks.data, 16],
  [Texture_26_2_Blocks.data, 16],
];

const itemDefinitions: [TextureData, number][] = [
  [Texture_1_7_10_Items.data, 16],
  [Texture_1_13_2_Items.data, 16],
  [Texture_26_2_Items.data, 16],
];

export type TextureVersion = {
  textureDef: TextureDef;
  frames: TextureFrame[];
};

export const blockTextureVersions: TextureVersion[] = blockDefinitions.map(
  ([data, frameSize]) => {
    const { textureDef, tiles } = data;
    const frames = tilesToTextureFrames(tiles, frameSize);

    return { textureDef, frames };
  }
);

export const itemTextureVersions: TextureVersion[] = itemDefinitions.map(
  ([data, frameSize]) => {
    const { textureDef, tiles } = data;
    const frames = tilesToTextureFrames(tiles, frameSize);

    return { textureDef, frames };
  }
);

export const allTextureDefs = [
  ...blockTextureVersions,
  ...itemTextureVersions,
  customTextureVersion,
].map(({ textureDef }) => textureDef);

export const versionIdsBlocksFirst = [
  customTextureVersion,
  ...itemTextureVersions,
  ...blockTextureVersions,
]
  .map(({ textureDef }) => textureDef.id)
  .reverse();

export const versionIdsItemsFirst = [
  customTextureVersion,
  ...blockTextureVersions,
  ...itemTextureVersions,
]
  .map(({ textureDef }) => textureDef.id)
  .reverse();

export function findVersion(versionId: string): TextureVersion | null {
  return (
    [
      ...blockTextureVersions,
      ...itemTextureVersions,
      customTextureVersion,
    ].find(({ textureDef }) => textureDef.id === versionId) ?? null
  );
}
