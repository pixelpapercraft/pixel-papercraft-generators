import { type TextureFrame } from "@genroot/builder/engine/textureData";

export function shouldClearSelectedFrame(
  selectedFrame: TextureFrame | null,
  frames: TextureFrame[]
): boolean {
  return (
    selectedFrame !== null &&
    !frames.some((frame) => frame.id === selectedFrame.id)
  );
}
