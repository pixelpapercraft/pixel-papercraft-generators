import { type Atlas, imageToTextureFrames } from "../../modules/textureData";
import { packImages } from "../../modules/texturePacking";

type AtlasBuildResult = Atlas & {
  url: string;
  framesJson: string;
};

function getFrameCrop(
  image: HTMLImageElement,
  [frameX, frameY, frameWidth, frameHeight]: [number, number, number, number]
): [number, number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return [0, 0, frameWidth, frameHeight];
  }

  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(frameX, frameY, frameWidth, frameHeight)
    .data;

  let minX = frameWidth;
  let minY = frameHeight;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const alpha = pixels[(y * frameWidth + x) * 4 + 3] ?? 0;
      if (alpha === 0) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  return maxX === -1
    ? [0, 0, frameWidth, frameHeight]
    : [minX, minY, maxX - minX + 1, maxY - minY + 1];
}

export function createAtlas(
  images: HTMLImageElement[],
  standardWidth: number,
  standardHeight: number
): AtlasBuildResult {
  if (images.length === 0) {
    throw new Error("No images to pack into atlas");
  }

  const sourceFrames = new Map<
    string,
    {
      sourceIndex: number;
      sourceRectangle: [number, number, number, number];
    }
  >();

  const packableImages = images.flatMap((image, index) => {
    const imageName =
      (image as HTMLImageElement & { name?: string }).name ?? `image_${index}`;
    const frames = imageToTextureFrames(imageName, image.width, image.height);

    return frames.map((frame) => {
      sourceFrames.set(frame.id, {
        sourceIndex: index,
        sourceRectangle: frame.rectangle,
      });

      return {
        id: frame.id,
        label: frame.label,
        rectangle: [0, 0, frame.rectangle[2], frame.rectangle[3]] as [
          number,
          number,
          number,
          number,
        ],
        crop: getFrameCrop(image, frame.rectangle),
        sourceIndex: index,
      };
    });
  });

  const widestFrame = packableImages.reduce(
    (max, frame) => Math.max(max, frame.rectangle[2]),
    0
  );
  const estimateWidth = Math.max(
    standardWidth,
    standardHeight,
    widestFrame,
    Math.min(2048, Math.ceil(Math.sqrt(packableImages.length)) * standardWidth)
  );

  const packedAtlas = packImages(packableImages, estimateWidth);
  const { atlasWidth, atlasHeight } = packedAtlas;

  const canvas = document.createElement("canvas");
  canvas.width = atlasWidth;
  canvas.height = atlasHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to get canvas context");
  }

  packedAtlas.frames.forEach((frame) => {
    const sourceInfo = sourceFrames.get(frame.id);
    if (!sourceInfo) {
      return;
    }

    const image = images[sourceInfo.sourceIndex];
    if (!image) {
      return;
    }

    const [sx, sy, sw, sh] = sourceInfo.sourceRectangle;
    context.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      frame.rectangle[0],
      frame.rectangle[1],
      sw,
      sh
    );
  });

  const url = canvas.toDataURL("image/png");
  const framesJson = JSON.stringify({
    atlasWidth,
    atlasHeight,
    frames: packedAtlas.frames,
  });

  return {
    atlasWidth,
    atlasHeight,
    frames: packedAtlas.frames,
    url,
    framesJson,
  };
}
