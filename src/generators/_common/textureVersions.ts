import { type TextureDef } from "../../builder/modules/generatorDef";
import { type TextureData } from "../../builder/modules/textureData";

import { makeTextureVersions as makeSharedTextureVersions } from "./textures/textureVersions";
import { customTextureVersion } from "./customTextureVersion";
import { type TextureFrame } from "../../builder/modules/textureData";

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
