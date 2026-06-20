import type { Generator } from "@genroot/builder/modules/generator";
import * as Face from "../../minecraftBlock/face";
import {
  drawRectangleButton,
  getBaseFaceId,
  getSourceForFace,
  getTransformForFace,
  makeBlockRegions,
  type DioramaOptions,
} from "./shared";

export function drawBlocks(generator: Generator, options: DioramaOptions) {
  const regions = makeBlockRegions(options);

  regions.forEach(({ id: faceId, region }) => {
    const source = getSourceForFace(options.document, faceId);
    const transform = getTransformForFace(options.document, faceId);
    const textureFaceId = getTextureFaceId(generator, faceId);

    if (options.editMode === "Blocks") {
      if (options.showEditRegions) {
        drawRectangleButton(generator, region);
      }
      Face.defineInputRegion(generator, faceId, region);
    }

    Face.drawFaceWithTextureTransform(
      generator,
      textureFaceId,
      source,
      region,
      transform
    );
  });
}

function getTextureFaceId(generator: Generator, faceId: string): string {
  if (generator.getStringInputValue(faceId) !== null) {
    return faceId;
  }

  return getBaseFaceId(faceId) ?? faceId;
}
