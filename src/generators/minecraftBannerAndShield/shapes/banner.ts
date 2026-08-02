import { type RenderContext } from "@genroot/builder";
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
import { type Rectangle } from "../../_common/minecraft";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";
import {
  BaseMinecraft,
  makeBaseMinecraft,
  roundRectangleToPixelBounds,
  scaleDimensions,
} from "./shared";

// Chosen for a round ~2m pole height rather than the exact-model-proportion
// value of 8 (128 destination px per meter, the same convention
// minecraftBlock/minecraftCharacter use) — every banner shape's destination
// size is its own source-cuboid units at this scale, so every face's
// source:destination stretch ratio stays a whole number.
const sourceUnitScale = 6;

// Position uses a separate, non-integer page scale (6/16): translation does
// not resample a texture, so it carries no equivalent distortion risk to the
// texture itself. Both approximate pr-35-head's own design, which draws
// every axis of every shape at exactly 16 destination pixels per
// source-cuboid unit.
const pageScale = 6 / 16;

// Rounded rather than left fractional: a fractional position doesn't distort
// a texture (see above), but it does put a 1px stroked line (a fold/tab
// guide) astride two pixel rows/columns instead of one, since the
// canvas-line-crispness offset trick assumes an integer starting
// coordinate. Every downstream shape dimension is already an integer
// (`sourceUnitScale` is a whole number), so rounding only `position` keeps
// every face's texture, fold line, and tab exactly self-consistent — the
// existing per-face `roundRectangleToPixelBounds` rounding becomes a no-op
// instead of doing real work.
function scaleToPage(value: number): number {
  return Math.round(value * pageScale);
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

function makeBannerBaseMinecraft(
  ctx: RenderContext,
  versionId: string,
  baseId: string
) {
  const version = findBannerShieldTextureVersion(versionId);
  if (!version) {
    return null;
  }

  return makeBaseMinecraft(
    ctx,
    version.bases.bannerOptions,
    version.bannerTextureDef,
    baseId
  );
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

  const dimensions = scaleDimensions(flagSourceDimensions, sourceUnitScale);
  minecraft.drawCuboid("", bannerFlag, flagPosition, dimensions);
}

// Fold/tab guides, drawn separately from the base texture so the caller can
// stamp pattern layers on top of the flag *between* the two calls — patterns
// re-draw the flag's full cuboid texture, which would otherwise paint over
// any guide line that falls on the printed fabric rather than blank page
// background (only the flag has this problem: pole/crossbar have nothing
// drawn over them afterward).
export function drawBannerFlagGuides(
  ctx: RenderContext,
  showFolds: boolean
): void {
  const dimensions = scaleDimensions(flagSourceDimensions, sourceUnitScale);
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

  const minecraft = new BaseMinecraft(ctx, version.bannerTextureDef.id, frame);

  minecraft.drawCuboid(
    "",
    bannerFlag,
    flagPosition,
    scaleDimensions(flagSourceDimensions, sourceUnitScale),
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
  const [width, height, depth] = scaleDimensions(
    flagSourceDimensions,
    sourceUnitScale
  );
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

  const dimensions = scaleDimensions(poleSourceDimensions, sourceUnitScale);
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

  const dimensions = scaleDimensions(crossbarSourceDimensions, sourceUnitScale);
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
