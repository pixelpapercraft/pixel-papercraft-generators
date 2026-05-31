import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type Atlas,
  type TextureFrame,
} from "@genroot/builder/modules/textureData";

import image from "./texture_custom.png";

export const customTextureDef: TextureDef = {
  id: "custom",
  url: image.src,
  standardWidth: 16,
  standardHeight: 16,
};

export const customFrame: TextureFrame = {
  id: "custom",
  label: "Custom",
  rectangle: [0, 0, 16, 16],
  crop: [0, 0, 16, 16],
};

export const customFrames: TextureFrame[] = [customFrame];

export const customTextureVersion = {
  textureDef: customTextureDef,
  frames: customFrames,
};

export function updateCustomTextureUrl(url: string): void {
  customTextureDef.url = url;
}

export function updateCustomTextureAtlas(url: string, atlas: Atlas): void {
  customTextureDef.url = url;
  customTextureDef.standardWidth = atlas.atlasWidth;
  customTextureDef.standardHeight = atlas.atlasHeight;
  customFrames.splice(0, customFrames.length, ...atlas.frames);
}

export function parseAtlas(framesJson: string | null): Atlas | null {
  if (!framesJson) {
    return null;
  }

  try {
    const atlas = JSON.parse(framesJson) as Atlas;
    if (
      typeof atlas.atlasWidth !== "number" ||
      typeof atlas.atlasHeight !== "number" ||
      !Array.isArray(atlas.frames)
    ) {
      return null;
    }

    return atlas;
  } catch {
    return null;
  }
}
