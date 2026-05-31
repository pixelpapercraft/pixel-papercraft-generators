import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { type TextureData } from "@genroot/builder/modules/textureData";

import { makeTextureVersions as makeSharedTextureVersions } from "./textures/textureVersions";
import { customTextureVersion } from "./customTextureVersion";
import { type TextureFrame } from "@genroot/builder/modules/textureData";

export type TextureVersion = {
  textureDef: TextureDef;
  frames: TextureFrame[];
};

export type TextureVersionDefinition = [TextureData, number];

export function makeTextureVersions(
  definitions: TextureVersionDefinition[]
): TextureVersion[] {
  return makeSharedTextureVersions(definitions);
}

export { customTextureVersion };
