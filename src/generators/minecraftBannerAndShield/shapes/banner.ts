import { type RenderContext, type TextureFrame } from "@genroot/builder";
import {
  type Dimensions,
  makeCuboid,
  translateCuboid,
} from "../../_common/cuboid";
import {
  Minecraft,
  type Face,
  type Rectangle,
  type RotationDegrees,
} from "../../_common/minecraft";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";

// Every shape's destination size is derived from its own source-cuboid
// units at an integer scale of 5, so every face's source:destination
// stretch ratio is a whole number and nearest-neighbour pixel replication
// is even across the shape. Position uses a separate, non-integer page
// scale (5/16): translation does not resample a texture, so it carries no
// equivalent distortion risk. Both approximate pr-35-head's own design,
// which draws every axis of every shape at exactly 16 destination pixels
// per source-cuboid unit.
const pageScale = 5 / 16;
const sourceUnitScale = 5;

function scaleToPage(value: number): number {
  return value * pageScale;
}

function scaleDimensions([width, height, depth]: Dimensions): Dimensions {
  return [
    width * sourceUnitScale,
    height * sourceUnitScale,
    depth * sourceUnitScale,
  ];
}

const flagSourceDimensions: Dimensions = [20, 40, 1];
const bannerFlag = translateCuboid(makeCuboid(flagSourceDimensions), [0, 0]);

// pr-35-head's declared pole height is 704, not the pattern's 42 * 16 =
// 672; this generator's pole height follows the same source-unit rule as
// every other axis of every other shape, so it does not preserve 704.
const poleSourceDimensions: Dimensions = [2, 42, 2];
const bannerPole = translateCuboid(makeCuboid(poleSourceDimensions), [44, 0]);

const crossbarSourceDimensions: Dimensions = [20, 2, 2];
const bannerCrossbar = translateCuboid(
  makeCuboid(crossbarSourceDimensions),
  [0, 42]
);

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

function makeFrameSourceRegion(
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

class BannerBaseMinecraft extends Minecraft {
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
}

function makeBannerBaseMinecraft(
  ctx: RenderContext,
  versionId: string,
  baseId: string
): BannerBaseMinecraft | null {
  const version = findBannerShieldTextureVersion(versionId);
  const base = version?.bases.bannerOptions.find(({ id }) => id === baseId);
  if (!version || !base) {
    return null;
  }

  const textureId = (base.textureDef ?? version.bannerTextureDef).id;
  return new BannerBaseMinecraft(ctx, textureId, base);
}

export function drawBannerFlag(
  ctx: RenderContext,
  versionId: string,
  baseId: string
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  minecraft.drawCuboid(
    "",
    bannerFlag,
    [scaleToPage(364), scaleToPage(368)],
    scaleDimensions(flagSourceDimensions)
  );
}

export function drawBannerPole(
  ctx: RenderContext,
  versionId: string,
  baseId: string
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  minecraft.drawCuboid(
    "",
    bannerPole,
    [scaleToPage(1292), scaleToPage(320)],
    scaleDimensions(poleSourceDimensions)
  );
}

export function drawBannerCrossbar(
  ctx: RenderContext,
  versionId: string,
  baseId: string
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  minecraft.drawCuboid(
    "",
    bannerCrossbar,
    [scaleToPage(516), scaleToPage(112)],
    scaleDimensions(crossbarSourceDimensions),
    { center: "Bottom", orientation: "North" }
  );
}
