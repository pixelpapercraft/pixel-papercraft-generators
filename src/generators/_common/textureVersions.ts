import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import { type TextureData } from "@genroot/builder/engine/textureData";

import { makeTextureVersions as makeSharedTextureVersions } from "./textures/textureVersions";
import { customTextureVersion } from "./customTextureVersion";
import { type TextureFrame } from "@genroot/builder/engine/textureData";

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
