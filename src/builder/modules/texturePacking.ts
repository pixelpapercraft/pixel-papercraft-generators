import { type Atlas, type Rectangle } from "./textureData";

// PackableImage is the builder-side input shape for atlas packing.
// The rectangle describes the source image bounds.
// The crop is [left inset, top inset, visible width, visible height] within that rectangle.
export type PackableImage = {
  id: string;
  label?: string;
  rectangle: Rectangle;
  crop: Rectangle;
  sourceIndex: number;
};

type PackedImage = PackableImage & {
  x: number;
  y: number;
};

// Pack images into rows on a fixed-width atlas canvas.
// The algorithm is intentionally simple and stable rather than optimal.
export function packImages(
  images: PackableImage[],
  canvasWidth: number
): Atlas {
  const imagesSorted = [...images].sort((imageA, imageB) => {
    const heightA = imageA.rectangle[3];
    const heightB = imageB.rectangle[3];
    if (heightA !== heightB) {
      return heightA - heightB;
    }

    return imageA.sourceIndex - imageB.sourceIndex;
  });

  let nextX = 0;
  let nextY = 0;
  let rowHeight = 0;
  let canvasHeight = 0;
  const packedImages: PackedImage[] = [];

  imagesSorted.forEach((image) => {
    const width = image.rectangle[2];
    const height = image.rectangle[3];

    if (width > canvasWidth) {
      console.warn(
        `Skipping image ${image.id} because width ${width} exceeds canvas width ${canvasWidth}`
      );
      return;
    }

    let x: number;
    let y: number;

    if (nextX + width > canvasWidth) {
      x = 0;
      y = nextY + rowHeight;
      canvasHeight += rowHeight;
      nextX = width;
      nextY = y;
      rowHeight = height;
    } else {
      x = nextX;
      y = nextY;
      nextX = x + width;
      rowHeight = Math.max(rowHeight, height);
    }

    packedImages.push({
      ...image,
      x,
      y,
    });
  });

  const frames = packedImages.map((packedImage) => ({
    id: packedImage.id,
    label: packedImage.label ?? packedImage.id,
    rectangle: [
      packedImage.x,
      packedImage.y,
      packedImage.rectangle[2],
      packedImage.rectangle[3],
    ] satisfies Rectangle,
    crop: packedImage.crop,
  }));

  canvasHeight += rowHeight;
  return {
    atlasWidth: canvasWidth,
    atlasHeight: canvasHeight,
    frames,
  };
}
