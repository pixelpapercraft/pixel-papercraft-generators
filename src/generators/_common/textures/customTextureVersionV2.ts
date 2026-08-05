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

export type VersionEntry = {
  textureDef: TextureDef;
  frames: TextureFrame[];
};

export type TextureVersionRegistry = {
  allTextureDefs: TextureDef[];
  versionIds: string[];
  findVersion: (versionId: string) => VersionEntry | null;
};

/**
 * Pure composition over an already-ordered list of version entries — no
 * module state. A `makeCustomTextureVersion()` slot satisfies `VersionEntry`
 * structurally, so it drops straight into the array alongside static
 * versions.
 */
export function makeTextureVersionRegistry(
  versions: VersionEntry[]
): TextureVersionRegistry {
  return {
    allTextureDefs: versions.map((version) => version.textureDef),
    versionIds: versions.map((version) => version.textureDef.id),
    findVersion: (versionId) =>
      versions.find((version) => version.textureDef.id === versionId) ?? null,
  };
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
