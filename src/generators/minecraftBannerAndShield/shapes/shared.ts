import {
  type RenderContext,
  type TextureDef,
  type TextureFrame,
  type TexturePlugin,
} from "@genroot/builder";
import { type Dimensions } from "../../_common/cuboid";
import {
  Minecraft,
  type Face,
  type Rectangle,
  type RotationDegrees,
} from "../../_common/minecraft";
import { type BannerShieldBaseOption } from "../../_common/patternTexturePicker/types";

// A shape's destination size is its own source-cuboid units at an integer
// scale, so every face's source:destination stretch ratio is a whole number
// and nearest-neighbour pixel replication is even across the shape. Each
// shape picks its own scale rather than sharing one constant, since banner
// and shield shapes target different real-world sizes.
export function scaleDimensions(
  [width, height, depth]: Dimensions,
  scale: number
): Dimensions {
  return [width * scale, height * scale, depth * scale];
}

// Faces in one cuboid share their mathematical boundaries. Quantising each
// rectangle from its absolute edges keeps those shared boundaries on the
// same integer pixel, so adjacent faces stay flush.
export function roundRectangleToPixelBounds([
  x,
  y,
  width,
  height,
]: Rectangle): Rectangle {
  const left = Math.round(x);
  const top = Math.round(y);
  const right = Math.round(x + width);
  const bottom = Math.round(y + height);

  return [left, top, right - left, bottom - top];
}

// The renderer draws a rotated face by translating to (x, y) and rotating
// the canvas about that point before drawing a width x height image at the
// local origin, so a face's declared rectangle is not where its content
// visually lands once rotate is non-zero: the rotation shifts the visual
// footprint away from (x, y) by exactly the face's own width and/or height.
// Converting to that true visual rectangle first means every face, rotated
// or not, can be rounded from absolute edges the same way (matching a
// neighbour's shared edge, or - for a face whose declared width/height was
// itself only an independently-rounded approximation, like a rotated
// square end cap - keeping its own edges self-consistent), then converted
// back to the declared rectangle the renderer expects.
function toVisualRectangle(
  [x, y, width, height]: Rectangle,
  rotate: RotationDegrees
): Rectangle {
  switch (rotate) {
    case 0:
      return [x, y, width, height];
    case 90:
      return [x - height, y, height, width];
    case 180:
      return [x - width, y - height, width, height];
    case 270:
      return [x, y - width, height, width];
  }
}

function fromVisualRectangle(
  [x, y, width, height]: Rectangle,
  rotate: RotationDegrees
): Rectangle {
  switch (rotate) {
    case 0:
      return [x, y, width, height];
    case 90:
      return [x + width, y, height, width];
    case 180:
      return [x + width, y + height, width, height];
    case 270:
      return [x, y + height, height, width];
  }
}

export function roundDestinationRectangle(
  rectangle: Rectangle,
  rotate: RotationDegrees
): Rectangle {
  const visual = toVisualRectangle(rectangle, rotate);
  const roundedVisual = roundRectangleToPixelBounds(visual);
  return fromVisualRectangle(roundedVisual, rotate);
}

export function makeFrameSourceRegion(
  frame: TextureFrame,
  source: Rectangle
): Rectangle {
  const [frameX, frameY, frameWidth, frameHeight] = frame.rectangle;
  const sourceScale =
    frameWidth === frameHeight && frameWidth % 64 === 0 ? frameWidth / 64 : 1;
  const [sourceX, sourceY, sourceWidth, sourceHeight] = source;

  return [
    frameX + sourceX * sourceScale,
    frameY + sourceY * sourceScale,
    sourceWidth * sourceScale,
    sourceHeight * sourceScale,
  ];
}

// Draws a cuboid's faces from a base texture option (a frame into the
// shared multi-base texture atlas), applying the crop-region remap and the
// per-face pixel-boundary rounding fractional-scale destinations need.
// Shared by every Banner and Shield shape, since both draw from the same
// atlas convention.
export class BaseMinecraft extends Minecraft {
  constructor(
    private ctx: RenderContext,
    private textureId: string,
    private frame: TextureFrame
  ) {
    super(ctx);
  }

  override drawFaceTexture(
    _textureId: string,
    source: Rectangle,
    destination: Face
  ): void {
    this.ctx.drawTexture(
      this.textureId,
      makeFrameSourceRegion(this.frame, source),
      roundDestinationRectangle(destination.rectangle, destination.rotate),
      {
        flip: destination.flip,
        rotateLegacy: destination.rotate,
        blend: destination.blend,
        plugin: destination.plugin ?? undefined,
      }
    );
  }

  // Draws a flat texture crop at an explicit destination rectangle, outside
  // the cuboid-face abstraction drawCuboid uses — for content that isn't one
  // of a cuboid's 6 faces (e.g. a separate cut-out piece drawn alongside a
  // shape's net).
  drawFace(
    source: Rectangle,
    destination: Rectangle,
    rotate: RotationDegrees = 0,
    plugin?: TexturePlugin
  ): void {
    this.ctx.drawTexture(
      this.textureId,
      makeFrameSourceRegion(this.frame, source),
      destination,
      { rotateLegacy: rotate, plugin }
    );
  }
}

export function makeBaseMinecraft(
  ctx: RenderContext,
  options: BannerShieldBaseOption[],
  fallbackTextureDef: TextureDef,
  baseId: string
): BaseMinecraft | null {
  const base = options.find(({ id }) => id === baseId);
  if (!base) {
    return null;
  }

  const textureId = (base.textureDef ?? fallbackTextureDef).id;
  return new BaseMinecraft(ctx, textureId, base);
}
