import { z } from "zod";

/** [x, y, width, height] */
type Rectangle = [number, number, number, number];

const rectangleSchema = z.custom<Rectangle>((value: unknown) => {
  if (!Array.isArray(value)) {
    throw new Error("Rectangle must be an array");
  }
  if (value.length !== 4) {
    throw new Error("Rectangle must have 4 elements");
  }
  return value as Rectangle;
});

const rotationSchema = z.enum(["Rot0", "Rot90", "Rot180", "Rot270"]);

export type Rotation = z.infer<typeof rotationSchema>;

const textureFrameSchema = z.object({
  id: z.string(),
  name: z.string(),
  rectangle: rectangleSchema,
  frameIndex: z.number(),
  frameCount: z.number(),
});

export type TextureFrame = z.infer<typeof textureFrameSchema>;

const selectedTextureSchema = z.object({
  textureDefId: z.string(),
  frame: textureFrameSchema,
  rotation: rotationSchema,
});

export type SelectedTexture = z.infer<typeof selectedTextureSchema>;

const selectedTexturesSchema = z.array(selectedTextureSchema);

export const encodeSelectedTexture = (
  selectedTexture: SelectedTexture
): string => {
  return JSON.stringify(selectedTexture);
};

export const decodeSelectedTexture = (json: string): SelectedTexture => {
  const result = selectedTextureSchema.safeParse(JSON.parse(json));
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const encodeSelectedTextures = (
  selectedTextures: SelectedTexture[]
): string => {
  return JSON.stringify(selectedTextures);
};

export const decodeSelectedTextures = (json: string): SelectedTexture[] => {
  const result = selectedTexturesSchema.safeParse(JSON.parse(json));
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};
