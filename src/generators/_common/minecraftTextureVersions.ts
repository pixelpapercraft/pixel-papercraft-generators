import { type TextureData } from "@genroot/builder/modules/textureData";

import * as Texture_1_7_10_Items from "@genroot/generators/_common/textures/texture_minecraft_1_7_10_items";
import * as Texture_1_7_10_Blocks from "@genroot/generators/_common/textures/texture_minecraft_1_7_10_blocks";
import * as Texture_1_13_2_Items from "@genroot/generators/_common/textures/texture_minecraft_1_13_2_items";
import * as Texture_1_13_2_Blocks from "@genroot/generators/_common/textures/texture_minecraft_1_13_2_blocks";
import * as Texture_26_1_2_Items from "@genroot/generators/_common/textures/texture_minecraft_26_1_2_items";
import * as Texture_26_1_2_Blocks from "@genroot/generators/_common/textures/texture_minecraft_26_1_2_blocks";

type TextureVersionDefinition = [TextureData, number];

const blockDefinitions: TextureVersionDefinition[] = [
  [Texture_1_7_10_Blocks.data, 16],
  [Texture_1_13_2_Blocks.data, 16],
  [Texture_26_1_2_Blocks.data, 16],
];

const itemDefinitions: TextureVersionDefinition[] = [
  [Texture_1_7_10_Items.data, 16],
  [Texture_1_13_2_Items.data, 16],
  [Texture_26_1_2_Items.data, 16],
];

export const minecraftTextureVersionDefinitions: TextureVersionDefinition[] = [
  ...itemDefinitions,
  ...blockDefinitions,
];

export const minecraftTextureVersionDefinitionsBlocksFirst: TextureVersionDefinition[] =
  [
    ...itemDefinitions,
    ...blockDefinitions,
  ];

export const minecraftTextureVersionDefinitionsItemsFirst: TextureVersionDefinition[] =
  [
    ...blockDefinitions,
    ...itemDefinitions,
  ];
