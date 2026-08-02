import { type RenderContext } from "@genroot/builder";
import {
  type Dimensions,
  makeCuboid,
  translateCuboid,
} from "../../_common/cuboid";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";
import { makeBaseMinecraft, scaleDimensions } from "./shared";

const plateSourceDimensions: Dimensions = [12, 22, 1];
const shieldPlate = translateCuboid(makeCuboid(plateSourceDimensions), [0, 0]);

// Chosen to center the plate's full six-face net (not just its front face)
// on the page; not derived from pr-35-head's own coordinates, which use a
// different destination scale.
const platePosition: [number, number] = [220, 349];

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

  const dimensions = scaleDimensions(plateSourceDimensions);
  minecraft.drawCuboid("", shieldPlate, platePosition, dimensions);
}
