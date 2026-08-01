import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import {
  type Atlas,
  type TextureFrame,
} from "@genroot/builder/engine/textureData";

export type CustomTextureVersion = {
  textureDef: TextureDef;
  frames: TextureFrame[];
  updateAtlas: (url: string, atlas: Atlas | null) => void;
};

export type MakeCustomTextureVersionOptions = {
  id: string;
  label: string;
  placeholderUrl: string;
  standardWidth: number;
  standardHeight: number;
};

/**
 * Creates an independent custom-texture-atlas slot: a placeholder texture
 * until the caller uploads a real image (and optionally an atlas of frames),
 * at which point `updateAtlas` swaps them in. Each call returns its own
 * `textureDef`/`frames`, so multiple slots (e.g. one per pattern type) never
 * share state.
 */
export function makeCustomTextureVersion(
  options: MakeCustomTextureVersionOptions
): CustomTextureVersion {
  const textureDef: TextureDef = {
    id: options.id,
    url: options.placeholderUrl,
    standardWidth: options.standardWidth,
    standardHeight: options.standardHeight,
  };

  const frames: TextureFrame[] = [
    {
      id: options.id,
      label: options.label,
      rectangle: [0, 0, options.standardWidth, options.standardHeight],
      crop: [0, 0, options.standardWidth, options.standardHeight],
    },
  ];

  function updateAtlas(url: string, atlas: Atlas | null): void {
    textureDef.url = url;
    if (atlas) {
      textureDef.standardWidth = atlas.atlasWidth;
      textureDef.standardHeight = atlas.atlasHeight;
      frames.splice(0, frames.length, ...atlas.frames);
    }
  }

  return { textureDef, frames, updateAtlas };
}
