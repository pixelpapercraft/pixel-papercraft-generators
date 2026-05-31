import { type TextureFrame } from "@genroot/builder/modules/textureData";
import { type Flip } from "./flip";
import { type Rotation } from "./rotation";

export type SelectedTexture = {
  textureDefId: string;
  frame: TextureFrame;
  rotation: Rotation;
  flip: Flip;
  blend: string | null;
  itemScale?: number | null;
  itemLayers?: SelectedTexture[];
  enchanted?: boolean;
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
