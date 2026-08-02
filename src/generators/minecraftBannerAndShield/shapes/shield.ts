import { type RenderContext } from "@genroot/builder";
import {
  type Dimensions,
  makeCuboid,
  translateCuboid,
} from "../../_common/cuboid";
import { drawCuboidFolds } from "../../_common/cuboidFolds";
import { drawCuboidTabs } from "../../_common/cuboidTabs";
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
