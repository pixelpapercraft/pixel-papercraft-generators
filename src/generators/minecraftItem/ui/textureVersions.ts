import { type TextureDef } from "@/builder/modules/generatorDef";
import {
  type TextureFrame,
  tilesToFrames,
} from "@/builder/modules/textureFrame";

import * as Texture_1_7_10_Items from "@/textures/texture_minecraft_1_7_10_items";
import * as Texture_1_7_10_Blocks from "@/textures/texture_minecraft_1_7_10_blocks";

import * as Texture_1_13_2_Items from "@/textures/texture_minecraft_1_13_2_items";
import * as Texture_1_13_2_Blocks from "@/textures/texture_minecraft_1_13_2_blocks";

import * as Texture_1_18_2_Items from "@/textures/texture_minecraft_1_18_2_items";
import * as Texture_1_18_2_Blocks from "@/textures/texture_minecraft_1_18_2_blocks";

import * as Texture_1_20_4_Items from "@/textures/texture_minecraft_1_20_4_items";
import * as Texture_1_20_4_Blocks from "@/textures/texture_minecraft_1_20_4_blocks";

type Tile = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type TextureData = {
  textureDef: TextureDef;
  tiles: Tile[];
};

const definitions: [TextureData, number][] = [
  [Texture_1_7_10_Items.data, 16],
  [Texture_1_7_10_Blocks.data, 16],
  [Texture_1_13_2_Items.data, 16],
  [Texture_1_13_2_Blocks.data, 16],
  [Texture_1_18_2_Items.data, 16],
  [Texture_1_18_2_Blocks.data, 16],
  [Texture_1_20_4_Items.data, 16],
  [Texture_1_20_4_Blocks.data, 16],
];

export type TextureVersion = {
  textureDef: TextureDef;
  frames: TextureFrame[];
};

export const textureVersions: TextureVersion[] = definitions.map(
  ([data, frameSize]) => {
    const { textureDef, tiles } = data;
    const frames = tilesToFrames(tiles, frameSize);
    return { textureDef, frames };
  }
);

export const allTextureDefs = textureVersions.map(
  ({ textureDef }) => textureDef
);

export const versionIds = textureVersions
  .map(({ textureDef }) => textureDef.id)
  .reverse();

export function findVersion(versionId: string): TextureVersion | null {
  return (
    textureVersions.find(({ textureDef }) => textureDef.id === versionId) ??
    null
  );
}
