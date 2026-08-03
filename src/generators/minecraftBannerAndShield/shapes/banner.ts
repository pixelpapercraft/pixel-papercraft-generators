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

// Shifts a shape's own fixed page position down by a slot's vertical offset
// (0 for the top-half template, half the page height for the bottom-half
// one) — every position constant in this file assumes the single-template,
// full-page layout, so this is applied at each call site rather than baked
// into the constants themselves.
function withYOffset(
  [x, y]: [number, number],
  yOffset: number
): [number, number] {
  return [x, y + yOffset];
}

// Chosen for a round ~2m pole height rather than the exact-model-proportion
// value of 8 (128 destination px per meter, the same convention
// minecraftBlock/minecraftCharacter use) — every banner shape's destination
// size is its own source-cuboid units at this scale, so every face's
// source:destination stretch ratio stays a whole number.
const sourceUnitScale = 6;

const flagSourceDimensions: Dimensions = [20, 40, 1];
const bannerFlag = translateCuboid(makeCuboid(flagSourceDimensions), [0, 0]);
// x/y hand-tuned to 40 to match the shield plate's own top-left offset
// (shapes/shield.ts's platePosition) now that both templates share a page;
// pole/crossbar below are shifted by the same deltas to keep their
// alignment to the flag unchanged (-97 on x, -98 on y).
const flagPosition: [number, number] = [40, 40];

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
  baseId: string,
  yOffset: number
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  const dimensions = scaleDimensions(flagSourceDimensions, sourceUnitScale);
  minecraft.drawCuboid(
    "",
    bannerFlag,
    withYOffset(flagPosition, yOffset),
    dimensions
  );
}

// Fold/tab guides, drawn separately from the base texture so the caller can
// stamp pattern layers on top of the flag *between* the two calls — patterns
// re-draw the flag's full cuboid texture, which would otherwise paint over
// any guide line that falls on the printed fabric rather than blank page
// background (only the flag has this problem: pole/crossbar have nothing
// drawn over them afterward).
export function drawBannerFlagGuides(
  ctx: RenderContext,
  showFolds: boolean,
  yOffset: number
): void {
  const dimensions = scaleDimensions(flagSourceDimensions, sourceUnitScale);
  const position = withYOffset(flagPosition, yOffset);
  if (showFolds) {
    drawCuboidFolds(ctx, position, dimensions);
  }
  drawCuboidTabs(ctx, position, dimensions, {
    tabThickness: 12,
    placements: [
      { face: "top", edge: "Top" },
      { face: "right", edge: "Left" },
      { face: "bottom", edge: "Bottom" },
      { face: "right", edge: "Top" },
      { face: "right", edge: "Bottom" },
      { face: "left", edge: "Top" },
      { face: "left", edge: "Bottom" },
    ],
  });
}

export function drawBannerPattern(
  ctx: RenderContext,
  versionId: string,
  patternId: string,
  blend: string | null,
  yOffset: number
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
    withYOffset(flagPosition, yOffset),
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
export function bannerFlagFrontRegion(yOffset: number): Rectangle {
  const [width, height, depth] = scaleDimensions(
    flagSourceDimensions,
    sourceUnitScale
  );
  const [x, y] = withYOffset(flagPosition, yOffset);
  return roundRectangleToPixelBounds([x + depth, y + depth, width, height]);
}

// Hand-tuned so flag/pole/crossbar sit in one evenly-spaced horizontal row.
// Net widths follow makeDest's real West-orientation face layout (right/
// front/left/back all placed side by side) — right + front + left + back =
// depth + width + depth + width = 2 * (width + depth) — not just
// right + front + left as first assumed:
// flag ~252px (2 * (120 + 6)), pole ~48px (2 * (12 + 12)), crossbar ~144px
// (North orientation stacks front/back vertically instead, so its span is
// just 2 * depth + width = 2 * 12 + 120). Spaced with ~36px gaps so the
// row's left/right margins both land near 40px.
const polePosition: [number, number] = [328, 22];

export function drawBannerPole(
  ctx: RenderContext,
  versionId: string,
  baseId: string,
  showFolds: boolean,
  yOffset: number
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  const position = withYOffset(polePosition, yOffset);
  const dimensions = scaleDimensions(poleSourceDimensions, sourceUnitScale);
  minecraft.drawCuboid("", bannerPole, position, dimensions);
  if (showFolds) {
    drawCuboidFolds(ctx, position, dimensions);
  }
  drawCuboidTabs(ctx, position, dimensions, {
    baseDimensions: uniformTabBaseDimensions(dimensions).map((v) => v * 2) as [
      number,
      number,
      number,
    ],
    // Same placements as cuboidTabs.ts's own default set, except the right
    // face's Left-edge tab (the one facing the flag) is a little larger
    // than its auto-derived ~6px thickness.
    placements: [
      { face: "right", edge: "Top" },
      { face: "right", edge: "Bottom" },
      { face: "right", edge: "Left", tabThickness: 10 },
      { face: "left", edge: "Top" },
      { face: "left", edge: "Bottom" },
      { face: "back", edge: "Top" },
      { face: "back", edge: "Bottom" },
    ],
  });
}

// Positioned to the right of the pole, at the same y as the flag, to sit in
// the same evenly-spaced row (see polePosition's comment).
const crossbarPosition: [number, number] = [412, flagPosition[1]];

export function drawBannerCrossbar(
  ctx: RenderContext,
  versionId: string,
  baseId: string,
  showFolds: boolean,
  yOffset: number
): void {
  const minecraft = makeBannerBaseMinecraft(ctx, versionId, baseId);
  if (!minecraft) {
    return;
  }

  const position = withYOffset(crossbarPosition, yOffset);
  const dimensions = scaleDimensions(crossbarSourceDimensions, sourceUnitScale);
  minecraft.drawCuboid("", bannerCrossbar, position, dimensions, {
    center: "Bottom",
    orientation: "North",
  });
  if (showFolds) {
    drawCuboidFolds(ctx, position, dimensions, {
      center: "Bottom",
      orientation: "North",
    });
  }
  drawCuboidTabs(ctx, position, dimensions, {
    center: "Bottom",
    orientation: "North",
    baseDimensions: uniformTabBaseDimensions(dimensions).map((v) => v * 2) as [
      number,
      number,
      number,
    ],
    placements: [
      { face: "front", edge: "Top", tabThickness: 10 },
      { face: "front", edge: "Left" },
      { face: "front", edge: "Right" },
      { face: "back", edge: "Left" },
      { face: "back", edge: "Right" },
      { face: "top", edge: "Left" },
      { face: "top", edge: "Right" },
    ],
  });
}
