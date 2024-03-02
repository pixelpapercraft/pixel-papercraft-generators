import imageInfoLib from "./imageInfoLib";

export type ImageInfo = {
  type: string;
  format: string;
  mimeType: string;
  width: number;
  height: number;
};

export function readImageInfo(buffer: Buffer): ImageInfo | null {
  const imageInfo = imageInfoLib(buffer);
  if (!imageInfo) {
    return null;
  }

  const { type, format, mimeType, width, height } = imageInfo;

  if (typeof width !== "number" || typeof height !== "number") {
    return null;
  }

  return {
    type,
    format,
    mimeType,
    width,
    height,
  };
}
