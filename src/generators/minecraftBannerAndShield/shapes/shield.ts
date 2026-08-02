import { type RenderContext } from "@genroot/builder";
import {
  type Dimensions,
  makeCuboid,
  translateCuboid,
} from "../../_common/cuboid";
import { drawCuboidFolds, drawRectangleFolds } from "../../_common/cuboidFolds";
import { drawCuboidTabs, makeTabRegion } from "../../_common/cuboidTabs";
import {
  resolveCuboidFaces,
  resolveFaceVisualRectangle,
  type Rectangle,
} from "../../_common/minecraft";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";
import { makeBaseMinecraft, scaleDimensions } from "./shared";

const plateSourceDimensions: Dimensions = [12, 22, 1];
const shieldPlate = translateCuboid(makeCuboid(plateSourceDimensions), [0, 0]);

// 128 destination px per meter, the same convention minecraftBlock/
// minecraftCharacter use — renders the plate at its true modeled
// proportions rather than the banner's own deliberately-compressed scale.
const sourceUnitScale = 8;

// Positions the plate's full six-face net (not just its front face) in the
// page's top-left quadrant.
const platePosition: [number, number] = [40, 40];

const handleSourceDimensions: Dimensions = [2, 6, 6];
const shieldHandle = translateCuboid(
  makeCuboid(handleSourceDimensions),
  [26, 0]
);

const handlePosition: [number, number] = [300, 80];

// The handle's right/left faces each carry a square hole for the hand
// grip, inset one source unit on every side — a property of the texture
// art (measured against the rendered pixels), not derived from the
// cuboid's own geometry.
const handleHoleInsetSourceUnits = 1;

function handleHoleRectangle([x, y, width, height]: Rectangle): Rectangle {
  const inset = handleHoleInsetSourceUnits * sourceUnitScale;
  // One further pixel in from the hole's own bounds, so the fold line lands
  // on the black cut-out itself rather than straddling its edge.
  const lineInset = inset + 1;
  return [
    x + lineInset,
    y + lineInset,
    width - lineInset * 2,
    height - lineInset * 2,
  ];
}

function makeShieldBaseMinecraft(ctx: RenderContext, versionId: string) {
  const version = findBannerShieldTextureVersion(versionId);
  const baseId = version?.bases.shieldOptions[0]?.id;
  if (!version || !baseId) {
    return null;
  }

  return makeBaseMinecraft(
    ctx,
    version.bases.shieldOptions,
    version.shieldTextureDef,
    baseId
  );
}

export function drawShieldPlate(ctx: RenderContext, versionId: string): void {
  const minecraft = makeShieldBaseMinecraft(ctx, versionId);
  if (!minecraft) {
    return;
  }

  const dimensions = scaleDimensions(plateSourceDimensions, sourceUnitScale);
  minecraft.drawCuboid("", shieldPlate, platePosition, dimensions);
}

export function drawShieldHandle(ctx: RenderContext, versionId: string): void {
  const minecraft = makeShieldBaseMinecraft(ctx, versionId);
  if (!minecraft) {
    return;
  }

  const dimensions = scaleDimensions(handleSourceDimensions, sourceUnitScale);
  minecraft.drawCuboid("", shieldHandle, handlePosition, dimensions, {
    center: "Right",
  });
}

export function drawShieldHandleGuides(
  ctx: RenderContext,
  showFolds: boolean
): void {
  const dimensions = scaleDimensions(handleSourceDimensions, sourceUnitScale);

  if (showFolds) {
    drawCuboidFolds(ctx, handlePosition, dimensions, { center: "Right" });

    const dest = resolveCuboidFaces(handlePosition, dimensions, {
      center: "Right",
    });
    drawRectangleFolds(
      ctx,
      handleHoleRectangle(resolveFaceVisualRectangle(dest.right))
    );
    drawRectangleFolds(
      ctx,
      handleHoleRectangle(resolveFaceVisualRectangle(dest.left))
    );
  }

  drawCuboidTabs(ctx, handlePosition, dimensions, {
    center: "Right",
    tabThickness: 12,
    placements: [
      { face: "left", edge: "Top" },
      { face: "left", edge: "Bottom" },
      { face: "left", edge: "Right" },
      { face: "back", edge: "Top" },
      { face: "back", edge: "Bottom" },
      { face: "front", edge: "Top" },
      { face: "front", edge: "Bottom" },
    ],
  });
}

// The handle's grip hole runs all the way through, so assembly needs a
// lining for the tunnel between its two faces. pr-35-head's own reference
// cuts this as one strip of 4 equal flaps, individually folded in during
// assembly rather than hinged to the hole's edges in the flat net. All 4
// of its source crops render as flat gray with no discernible texture, so
// which crop lands on which physical wall doesn't matter — one crop reused
// 4 times reproduces the same result.
const handleInnerLiningCellSource: Rectangle = [32, 7, 2, 4];
const handleInnerLiningCellCount = 4;
const handleInnerLiningPosition: [number, number] = [300, 200];

// Each cell is laid out landscape (wider than tall) rather than matching
// the source crop's own portrait orientation — width/height swapped from
// source, not a texture rotation, since the flat gray crop looks identical
// either way.
function handleInnerLiningCellDimensions(): [number, number] {
  const [, , sourceWidth, sourceHeight] = handleInnerLiningCellSource;
  return [sourceHeight * sourceUnitScale, sourceWidth * sourceUnitScale];
}

export function drawShieldHandleInnerLining(
  ctx: RenderContext,
  versionId: string
): void {
  const minecraft = makeShieldBaseMinecraft(ctx, versionId);
  if (!minecraft) {
    return;
  }

  const [cellWidth, cellHeight] = handleInnerLiningCellDimensions();
  const [x, y] = handleInnerLiningPosition;

  for (let i = 0; i < handleInnerLiningCellCount; i++) {
    minecraft.drawFace(handleInnerLiningCellSource, [
      x + i * cellWidth,
      y,
      cellWidth,
      cellHeight,
    ]);
  }
}

const handleInnerLiningTabThickness = 8;

export function drawShieldHandleInnerLiningGuides(
  ctx: RenderContext,
  showFolds: boolean
): void {
  const [cellWidth, cellHeight] = handleInnerLiningCellDimensions();
  const [x, y] = handleInnerLiningPosition;
  const totalWidth = cellWidth * handleInnerLiningCellCount;

  if (showFolds) {
    drawRectangleFolds(ctx, [x, y, totalWidth, cellHeight]);
    for (let i = 1; i < handleInnerLiningCellCount; i++) {
      // Matches the -1 convention cuboidFolds.ts's own internal seam lines use.
      const seamX = x + i * cellWidth - 1;
      ctx.drawFoldLine([seamX, y], [seamX, y + cellHeight]);
    }
  }

  for (let i = 0; i < handleInnerLiningCellCount; i++) {
    const cellRectangle: Rectangle = [
      x + i * cellWidth,
      y,
      cellWidth,
      cellHeight,
    ];
    const edges =
      i === 0
        ? (["Top", "Bottom", "Left"] as const)
        : (["Top", "Bottom"] as const);
    edges.forEach((edge) => {
      const { region, orientation } = makeTabRegion(
        cellRectangle,
        edge,
        cellWidth,
        cellHeight,
        cellWidth,
        handleInnerLiningTabThickness
      );
      // drawTab's own showFoldLine parameter defaults to true when omitted,
      // unlike drawCuboidTabs's explicit `options.showFoldLine ?? false` —
      // pass false here to match that convention and keep the tab's own
      // base line out of the always-visible cut-outline.
      ctx.drawTab(region, orientation, false);
    });
  }
}

// The image asset is pre-scaled to its exact on-page size, so it's drawn
// as a plain image rather than a texture — drawTexture's nearest-neighbor
// downscaling composites each source pixel onto its destination pixel with
// normal alpha blending, so scaling a partially-transparent image down
// stacks multiple overlapping composites onto the same destination pixel,
// driving its opacity far higher than the source alpha.
function drawJoinMarker(
  ctx: RenderContext,
  imageId: string,
  [imageWidth, imageHeight]: [number, number],
  [x, y, width, height]: Rectangle
): void {
  ctx.drawImage(imageId, [
    x + (width - imageWidth) / 2,
    y + (height - imageHeight) / 2,
  ]);
}

// Marks the center of the plate's back face and the handle's front face —
// the two faces that get glued together — with the same arrow image, so
// the user can align them without guessing which way the handle faces.
export function drawShieldHandleJoinMarker(
  ctx: RenderContext,
  imageId: string,
  imageDimensions: [number, number]
): void {
  const plateDimensions = scaleDimensions(
    plateSourceDimensions,
    sourceUnitScale
  );
  const plateBack = resolveFaceVisualRectangle(
    resolveCuboidFaces(platePosition, plateDimensions).back
  );
  drawJoinMarker(ctx, imageId, imageDimensions, plateBack);

  const handleDimensions = scaleDimensions(
    handleSourceDimensions,
    sourceUnitScale
  );
  const handleFront = resolveFaceVisualRectangle(
    resolveCuboidFaces(handlePosition, handleDimensions, {
      center: "Right",
    }).front
  );
  drawJoinMarker(ctx, imageId, imageDimensions, handleFront);
}

export function drawShieldPlateGuides(
  ctx: RenderContext,
  showFolds: boolean
): void {
  const dimensions = scaleDimensions(plateSourceDimensions, sourceUnitScale);
  if (showFolds) {
    drawCuboidFolds(ctx, platePosition, dimensions);
  }
  drawCuboidTabs(ctx, platePosition, dimensions, {
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
