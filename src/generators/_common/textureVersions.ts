import { type TextureDef } from "../../builder/modules/generatorDef";
import { type TextureData } from "../../builder/modules/textureData";

import {
  makeTextureVersions as makeSharedTextureVersions,
  type TextureVersion as SharedTextureVersion,
} from "./textures/textureVersions";
import { customTextureVersion } from "./customTextureVersion";
import { type TextureFrame } from "./textureData";

export type TextureVersion = {
  textureDef: TextureDef;
  frames: TextureFrame[];
};

export type TextureVersionDefinition = [TextureData, number];

// Normalize the shared frame label into a stable tile name for downstream use.
function toLegacyFrameName(label: string): string {
  return label.replace(/ \(Frame \d+\)$/, "").replace(/ /g, "_");
}

function toLegacyTextureVersion(
  textureVersion: SharedTextureVersion
): TextureVersion {
  const frameCounts = new Map<string, number>();
  const frameIndices = new Map<string, number>();

  for (const frame of textureVersion.frames) {
    const name = toLegacyFrameName(frame.label);
    frameCounts.set(name, (frameCounts.get(name) ?? 0) + 1);
  }

  const frames = textureVersion.frames.map((frame) => {
    const name = toLegacyFrameName(frame.label);
    const frameIndex = frameIndices.get(name) ?? 0;
    frameIndices.set(name, frameIndex + 1);
    const frameCount = frameCounts.get(name) ?? 1;

    // Use the normalized tile name for the exposed frame id and name.
    return {
      id: frameCount > 1 ? `${name}_${frameIndex}` : frame.id,
      name,
      rectangle: frame.rectangle,
      frameIndex,
      frameCount,
    };
  });

  return { textureDef: textureVersion.textureDef, frames };
}

export function makeTextureVersions(
  definitions: TextureVersionDefinition[]
): TextureVersion[] {
  return makeSharedTextureVersions(definitions).map(toLegacyTextureVersion);
}

export { customTextureVersion };
