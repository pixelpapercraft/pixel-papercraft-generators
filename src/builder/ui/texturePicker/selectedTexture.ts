import { type Rotation } from "./rotation";

/** [x, y, width, height] */
type Rectangle = [number, number, number, number];

export type TextureFrame = {
  id: string;
  name: string;
  rectangle: Rectangle;
  frameIndex: number;
  frameCount: number;
};

export type SelectedTexture = {
  textureDefId: string;
  frame: TextureFrame;
  rotation: Rotation;
};

export const encodeSelectedTexture = (
  selectedTexture: SelectedTexture
): string => {
  return JSON.stringify(selectedTexture);
};

export const decodeSelectedTexture = (json: string): SelectedTexture => {
  return JSON.parse(json);
};

export const encodeSelectedTextures = (
  selectedTextures: SelectedTexture[]
): string => {
  return JSON.stringify(selectedTextures);
};

export const decodeSelectedTextures = (json: string): SelectedTexture[] => {
  return JSON.parse(json);
};
