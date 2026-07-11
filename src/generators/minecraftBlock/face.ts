import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import { type DrawTextureOptions } from "@genroot/builder/modules/renderers/drawTexture";
import {
  defineTextureInputRegion,
  drawTextureFace,
  drawTextureFaceWithTransform,
  type DefineTextureInputRegionOptions,
  type FaceTextureTransform,
} from "@genroot/generators/_common/plugins/texturePicker/face";
import { currentBlockTextureId } from "@genroot/generators/minecraftBlock/constants";

export type { FaceTextureTransform };

export function defineInputRegion(
  generator: Generator,
  faceId: string,
  region: Region,
  options: DefineTextureInputRegionOptions = {}
) {
  defineTextureInputRegion(
    generator,
    currentBlockTextureId,
    faceId,
    region,
    options
  );
}

export function drawFace(
  generator: Generator,
  faceId: string,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions
) {
  drawTextureFace(generator, faceId, source, destination, options);
}

export function drawFaceWithTextureTransform(
  generator: Generator,
  faceId: string,
  source: Region,
  destination: Region,
  transform: FaceTextureTransform
) {
  drawTextureFaceWithTransform(
    generator,
    faceId,
    source,
    destination,
    transform
  );
}
