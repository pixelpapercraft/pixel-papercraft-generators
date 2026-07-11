import { type Region } from "@genroot/builder/modules/generator";
import { type TextureFrame } from "@genroot/builder/modules/textureData";

type TextureSource = readonly [number, number, number, number];

export function getTextureFrameScale(
  frame: TextureFrame,
  logicalFrameSize: number
): number {
  const [, , frameWidth, frameHeight] = frame.rectangle;
  return frameWidth === frameHeight &&
    frameWidth > 0 &&
    frameWidth % logicalFrameSize === 0 &&
    frameHeight % logicalFrameSize === 0
    ? frameWidth / logicalFrameSize
    : 1;
}

export function scaleTextureSource(
  source: TextureSource,
  frame: TextureFrame,
  logicalFrameSize: number
): Region {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = source;
  const scale = getTextureFrameScale(frame, logicalFrameSize);

  return [
    sourceX * scale,
    sourceY * scale,
    sourceWidth * scale,
    sourceHeight * scale,
  ];
}

export function makeTextureFrameSourceRegion(
  frame: TextureFrame,
  source: TextureSource,
  logicalFrameSize: number
): Region {
  const [frameX, frameY] = frame.rectangle;
  const [sourceX, sourceY, sourceWidth, sourceHeight] = scaleTextureSource(
    source,
    frame,
    logicalFrameSize
  );

  return [
    frameX + sourceX,
    frameY + sourceY,
    sourceWidth,
    sourceHeight,
  ];
}
