import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import {
  type TextureData,
  type TextureFrame,
  tilesToTextureFrames,
} from "@genroot/builder/engine/textureData";

import * as Texture_1_7_10_Blocks from "./texture_minecraft_1_7_10_blocks";
import * as Texture_1_7_10_Items from "./texture_minecraft_1_7_10_items";
import * as Texture_1_13_2_Blocks from "./texture_minecraft_1_13_2_blocks";
import * as Texture_1_13_2_Items from "./texture_minecraft_1_13_2_items";
import * as Texture_26_1_2_Blocks from "./texture_minecraft_26_1_2_blocks";
import * as Texture_26_1_2_Items from "./texture_minecraft_26_1_2_items";

export type TextureVersionDefinition = [TextureData, number];

const blockDefinitions: [TextureData, number][] = [
  [Texture_1_7_10_Blocks.data, 16],
  [Texture_1_13_2_Blocks.data, 16],
  [Texture_26_1_2_Blocks.data, 16],
];

const itemDefinitions: [TextureData, number][] = [
  [Texture_1_7_10_Items.data, 16],
  [Texture_1_13_2_Items.data, 16],
  [Texture_26_1_2_Items.data, 16],
];

export type TextureVersion = {
  textureDef: TextureDef;
  frames: TextureFrame[];
};

export function makeTextureVersions(
  definitions: TextureVersionDefinition[]
): TextureVersion[] {
  return definitions.map(([data, frameSize]) => {
    const { textureDef, tiles } = data;
    const frames = tilesToTextureFrames(tiles, frameSize);

    return { textureDef, frames };
  });
}

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
