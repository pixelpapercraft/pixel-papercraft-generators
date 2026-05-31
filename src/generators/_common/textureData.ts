import {
  type Atlas,
  type Rectangle,
  type TextureData,
  type TextureData_Tile,
  type TextureData_TileFrame,
  type TextureFrame,
  imageToTextureFrames,
  tilesToTextureFrames,
} from "@genroot/builder/modules/textureData";

export type {
  Atlas,
  Rectangle,
  TextureData,
  TextureData_Tile,
  TextureData_TileFrame,
  TextureFrame,
};

export { imageToTextureFrames, tilesToTextureFrames };

export function makeFrameLabel(frame: TextureFrame): string {
  return frame.label;
}
