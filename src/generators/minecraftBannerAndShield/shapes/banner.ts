import { type RenderContext, type TextureFrame } from "@genroot/builder";
import {
  type Dimensions,
  makeCuboid,
  translateCuboid,
} from "../../_common/cuboid";
import { drawCuboidFolds } from "../../_common/cuboidFolds";
import {
  drawCuboidTabs,
  uniformTabBaseDimensions,
} from "../../_common/cuboidTabs";
import {
  Minecraft,
  type Face,
  type Rectangle,
  type RotationDegrees,
} from "../../_common/minecraft";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";

// Every shape's destination size is derived from its own source-cuboid
// units at an integer scale of 6, so every face's source:destination
// stretch ratio is a whole number and nearest-neighbour pixel replication
// is even across the shape. Position uses a separate, non-integer page
// scale (6/16): translation does not resample a texture, so it carries no
// equivalent distortion risk to the texture itself. Both approximate
// pr-35-head's own design, which draws every axis of every shape at exactly
// 16 destination pixels per source-cuboid unit.
const pageScale = 6 / 16;
const sourceUnitScale = 6;

// Rounded rather than left fractional: a fractional position doesn't distort
// a texture (see above), but it does put a 1px stroked line (a fold/tab
// guide) astride two pixel rows/columns instead of one, since the
// canvas-line-crispness offset trick assumes an integer starting
// coordinate. Every downstream shape dimension is already an integer
// (`scaleDimensions`'s `sourceUnitScale` is a whole number), so rounding
// only `position` keeps every face's texture, fold line, and tab exactly
// self-consistent — the existing per-face `roundRectangleToPixelBounds`
// rounding becomes a no-op instead of doing real work.
function scaleToPage(value: number): number {
  return Math.round(value * pageScale);
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
const flagPosition: [number, number] = [scaleToPage(364), scaleToPage(368)];

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
  baseId: string,
  showFolds: boolean
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  const dimensions = scaleDimensions(flagSourceDimensions);
  minecraft.drawCuboid("", bannerFlag, flagPosition, dimensions);
  if (showFolds) {
    drawCuboidFolds(ctx, flagPosition, dimensions);
  }
  drawCuboidTabs(ctx, flagPosition, dimensions, {
    tabThickness: 12,
    placements: [
      { face: "top", edge: "Top" },
      { face: "right", edge: "Left" },
      { face: "back", edge: "Top", tabThickness: 6 },
      { face: "back", edge: "Bottom", tabThickness: 6 },
      { face: "right", edge: "Top", tabThickness: 6 },
      { face: "right", edge: "Bottom", tabThickness: 6 },
      { face: "left", edge: "Top", tabThickness: 6 },
      { face: "left", edge: "Bottom", tabThickness: 6 },
    ],
  });
}

// The stack's always-present first entry, present even before the user has
// placed anything. `pr-35-head`'s `face.ts` names this same pattern id/tint
// pair `defaultPatternId`/`defaultPatternTint` for the identical purpose.
// The hex is Minecraft's actual "White" dye color, not pure white.
export const defaultBannerPatternId = "base";
export const defaultBannerPatternTint = "#F9FFFE";

export function drawBannerPattern(
  ctx: RenderContext,
  versionId: string,
  patternId: string,
  blend: string | null
): void {
  const version = findBannerShieldTextureVersion(versionId);
  const pattern = version?.patterns.find(({ id }) => id === patternId);
  const frame = pattern?.bannerFrame;
  if (!version || !frame) {
    return;
  }

  const minecraft = new BannerBaseMinecraft(
    ctx,
    version.bannerTextureDef.id,
    frame
  );

  minecraft.drawCuboid(
    "",
    bannerFlag,
    flagPosition,
    scaleDimensions(flagSourceDimensions),
    blend ? { blend: { kind: "MultiplyHex", hex: blend } } : {}
  );
}

// The single clickable region for arming/placing a pattern on the flag —
// matches `pr-35-head`'s own design (`Face.defineInputRegion` in his
// `shapes/banner.ts`), which defines exactly one region sized to the front
// face and lets it drive a pattern stack shared by every face of the
// cuboid, so the back face mirrors the front automatically at render time.
// The offset/size formula mirrors `drawCuboid`'s own front-face placement
// for this cuboid's default `orientation: "West"`/`center: "Front"`: the
// front face sits at the cuboid's position shifted by its own depth on both
// axes, sized to its declared width/height.
export function bannerFlagFrontRegion(): Rectangle {
  const [width, height, depth] = scaleDimensions(flagSourceDimensions);
  const [x, y] = flagPosition;
  return roundRectangleToPixelBounds([x + depth, y + depth, width, height]);
}

const polePosition: [number, number] = [scaleToPage(1292), scaleToPage(320)];

export function drawBannerPole(
  ctx: RenderContext,
  versionId: string,
  baseId: string,
  showFolds: boolean
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  const dimensions = scaleDimensions(poleSourceDimensions);
  minecraft.drawCuboid("", bannerPole, polePosition, dimensions);
  if (showFolds) {
    drawCuboidFolds(ctx, polePosition, dimensions);
  }
  drawCuboidTabs(ctx, polePosition, dimensions, {
    baseDimensions: uniformTabBaseDimensions(dimensions).map((v) => v * 2) as [
      number,
      number,
      number,
    ],
  });
}

const crossbarPosition: [number, number] = [scaleToPage(516), scaleToPage(112)];

export function drawBannerCrossbar(
  ctx: RenderContext,
  versionId: string,
  baseId: string,
  showFolds: boolean
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  const dimensions = scaleDimensions(crossbarSourceDimensions);
  minecraft.drawCuboid("", bannerCrossbar, crossbarPosition, dimensions, {
    center: "Bottom",
    orientation: "North",
  });
  if (showFolds) {
    drawCuboidFolds(ctx, crossbarPosition, dimensions, {
      center: "Bottom",
      orientation: "North",
    });
  }
  drawCuboidTabs(ctx, crossbarPosition, dimensions, {
    center: "Bottom",
    orientation: "North",
    baseDimensions: uniformTabBaseDimensions(dimensions).map((v) => v * 2) as [
      number,
      number,
      number,
    ],
    placements: [
      { face: "front", edge: "Top" },
      { face: "front", edge: "Left" },
      { face: "front", edge: "Right" },
      { face: "back", edge: "Left" },
      { face: "back", edge: "Right" },
      { face: "top", edge: "Left" },
      { face: "top", edge: "Right" },
    ],
  });
}
