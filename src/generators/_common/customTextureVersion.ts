import { type TextureDef } from "../../builder/modules/generatorDef";
import { type Atlas } from "../../builder/modules/textureData";
import { type TextureFrame } from "./textureData";

import { customTextureDef as sharedCustomTextureDef } from "./textures/customTextureVersion";

export const customTextureDef: TextureDef = sharedCustomTextureDef;

// The compatibility layer keeps the legacy picker shape alive for the current block/item flows.
export const customFrame: TextureFrame = {
  id: "custom",
  name: "Custom",
  rectangle: [0, 0, 16, 16],
  frameIndex: 0,
  frameCount: 1,
};

export const customFrames: TextureFrame[] = [customFrame];

export const customTextureVersion = {
  textureDef: customTextureDef,
  frames: customFrames,
};

export function updateCustomTextureUrl(url: string): void {
  customTextureDef.url = url;
}

function toLegacyTextureFrame(
  frame: Atlas["frames"][number],
  frameIndex: number,
  frameCount: number
): TextureFrame {
  const name = frame.label.replace(/ \(Frame \d+\)$/, "").replace(/ /g, "_");
  return {
    id: frameCount > 1 ? `${name}_${frameIndex}` : name,
    name,
    rectangle: frame.rectangle,
    frameIndex,
    frameCount,
  };
}

export function updateCustomTextureAtlas(url: string, atlas: Atlas): void {
  // Update the shared singleton in place so all consumers see the new image.
  customTextureDef.url = url;
  customTextureDef.standardWidth = atlas.atlasWidth;
  customTextureDef.standardHeight = atlas.atlasHeight;
  const frameCount = atlas.frames.length;
  customFrames.splice(
    0,
    customFrames.length,
    ...atlas.frames.map((frame, frameIndex) =>
      toLegacyTextureFrame(frame, frameIndex, frameCount)
    )
  );
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
