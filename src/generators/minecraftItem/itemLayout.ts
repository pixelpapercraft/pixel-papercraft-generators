import { type TextureFrame } from "@genroot/builder/modules/textureData";
import {
  type Flip,
  makeNextFlip,
} from "@genroot/builder/ui/texturePicker/flip";
import { type Rotation } from "@genroot/builder/ui/texturePicker/rotation";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";

/** [x, y, width, height] */
export type Rectangle = [number, number, number, number];

const defaultFrameSize = 16;

export function getFrameSourceScale(frame: TextureFrame): number {
  const [, , width, height] = frame.rectangle;
  return width === height &&
    width > 0 &&
    width % defaultFrameSize === 0 &&
    height % defaultFrameSize === 0
    ? width / defaultFrameSize
    : 1;
}

export function getFrameSourceCrop(frame: TextureFrame): Rectangle {
  const [frameX, frameY] = frame.rectangle;
  const [cropX, cropY, cropWidth, cropHeight] = frame.crop;
  return [frameX + cropX, frameY + cropY, cropWidth, cropHeight];
}

export function getFrameLogicalCrop(frame: TextureFrame): Rectangle {
  const scale = getFrameSourceScale(frame);
  const [x, y, width, height] = frame.crop;
  return [x / scale, y / scale, width / scale, height / scale];
}

export function getFrameLogicalBounds(frame: TextureFrame): Rectangle {
  const scale = getFrameSourceScale(frame);
  const [, , width, height] = frame.rectangle;
  return [0, 0, width / scale, height / scale];
}

export function rotateCrop(
  crop: Rectangle,
  bounds: Rectangle,
  rotation: Rotation
): Rectangle {
  const [x, y, width, height] = crop;
  const [, , boundsWidth, boundsHeight] = bounds;

  switch (rotation) {
    case "Rot0":
      return crop;
    case "Rot90":
      return [y, boundsWidth - (x + width), height, width];
    case "Rot180":
      return [
        boundsWidth - (x + width),
        boundsHeight - (y + height),
        width,
        height,
      ];
    case "Rot270":
      return [boundsHeight - (y + height), x, height, width];
  }
}

export function flipCrop(
  crop: Rectangle,
  bounds: Rectangle,
  flip: Flip
): Rectangle {
  const [x, y, width, height] = crop;
  const [, , boundsWidth, boundsHeight] = bounds;

  switch (flip) {
    case "None":
      return crop;
    case "Horizontal":
      return [boundsWidth - (x + width), y, width, height];
    case "Vertical":
      return [x, boundsHeight - (y + height), width, height];
  }
}

export function getTransformedCrop(
  layer: SelectedTexture,
  appliedFlip: Flip
): Rectangle {
  const { flip, rotation, frame } = layer;
  const [nextFlip, nextRotation] = makeNextFlip(flip, appliedFlip, rotation);
  const crop = getFrameLogicalCrop(frame);
  const bounds = getFrameLogicalBounds(frame);
  const flippedCrop = flipCrop(crop, bounds, nextFlip);
  return rotateCrop(flippedCrop, bounds, nextRotation);
}

export function getCropBounds(crops: Rectangle[]): Rectangle {
  const minX = Math.min(...crops.map(([x]) => x));
  const minY = Math.min(...crops.map(([, y]) => y));
  const maxX = Math.max(...crops.map(([x, , width]) => x + width));
  const maxY = Math.max(...crops.map(([, y, , height]) => y + height));
  return [minX, minY, maxX - minX, maxY - minY];
}

export function getItemLayers(
  selectedTextureFrame: SelectedTexture
): SelectedTexture[] {
  return selectedTextureFrame.itemLayers ?? [selectedTextureFrame];
}

export function getItemHalfCropBounds(
  layers: SelectedTexture[],
  appliedFlip: Flip
): Rectangle {
  return getCropBounds(
    layers.map((layer) => getTransformedCrop(layer, appliedFlip))
  );
}

export function getItemLayout(layers: SelectedTexture[]): {
  leftBounds: Rectangle;
  rightBounds: Rectangle;
  height: number;
  minY: number;
} {
  const leftBounds = getItemHalfCropBounds(layers, "None");
  const rightBounds = getItemHalfCropBounds(layers, "Horizontal");
  const minY = Math.min(leftBounds[1], rightBounds[1]);
  const maxY = Math.max(
    leftBounds[1] + leftBounds[3],
    rightBounds[1] + rightBounds[3]
  );

  return {
    leftBounds,
    rightBounds,
    height: maxY - minY,
    minY,
  };
}

export function getItemDimensions(
  selectedTextureFrame: SelectedTexture,
  scale: number
): {
  leftHalfWidth: number;
  rightHalfWidth: number;
  width: number;
  height: number;
} {
  const layers = getItemLayers(selectedTextureFrame);
  const { leftBounds, rightBounds, height } = getItemLayout(layers);
  const leftHalfWidth = leftBounds[2] * scale;
  const rightHalfWidth = rightBounds[2] * scale;
  return {
    leftHalfWidth,
    rightHalfWidth,
    width: leftHalfWidth + rightHalfWidth,
    height: height * scale,
  };
}

export function getLayerHalfDestination(
  halfCropBounds: Rectangle,
  itemMinY: number,
  layer: SelectedTexture,
  x: number,
  y: number,
  scale: number,
  appliedFlip: Flip
): {
  source: Rectangle;
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const [halfCropX] = halfCropBounds;
  const { rotation } = layer;
  const [, transformedRotation] = makeNextFlip(
    layer.flip,
    appliedFlip,
    rotation
  );
  const [layerCropX, layerCropY] = getTransformedCrop(layer, appliedFlip);
  const [, , cropWidth, cropHeight] = getFrameLogicalCrop(layer.frame);
  const drawWidth = cropWidth * scale;
  const drawHeight = cropHeight * scale;
  const orientedX = x + (layerCropX - halfCropX) * scale;
  const orientedY = y + (layerCropY - itemMinY) * scale;
  const rotateOffset =
    transformedRotation === "Rot90" || transformedRotation === "Rot270"
      ? (drawWidth - drawHeight) / 2
      : 0;

  return {
    source: getFrameSourceCrop(layer.frame),
    x: orientedX - rotateOffset,
    y: orientedY + rotateOffset,
    width: drawWidth,
    height: drawHeight,
  };
}
