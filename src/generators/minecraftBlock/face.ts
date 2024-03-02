import { type DrawTextureOptions } from "@/builder/modules/renderers/drawTexture";
import { type Generator, type Region } from "@/builder/modules/generator";
import { currentBlockTextureId } from "./constants";
import {
  type SelectedTexture,
  decodeSelectedTexture,
  decodeSelectedTextures,
  encodeSelectedTextures,
} from "@/builder/ui/texturePicker/selectedTexture";

export function defineInputRegion(
  generator: Generator,
  faceId: string,
  region: Region
) {
  generator.defineRegionInput(region, () => {
    const selectedTextureJson = generator.getStringInputValue(
      currentBlockTextureId
    );

    const selectedTexture = selectedTextureJson
      ? decodeSelectedTexture(selectedTextureJson)
      : null;

    if (selectedTexture) {
      const curentFaceTexturesJson = generator.getStringInputValue(faceId);
      const currentFaceTextures = curentFaceTexturesJson
        ? decodeSelectedTextures(curentFaceTexturesJson)
        : [];

      const newFaceTextures = currentFaceTextures.concat([selectedTexture]);
      const newFaceTexturesJson = encodeSelectedTextures(newFaceTextures);
      generator.setStringInputValue(faceId, newFaceTexturesJson);
    }
  });
}

function drawTexture(
  generator: Generator,
  face: SelectedTexture,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions
) {
  const { textureDefId, frame, rotation } = face;
  const [dx, dy, dw, dh] = destination;

  const [sx, sy, sw, sh] = source;
  const [fx, fy, fw, fh] = frame.rectangle;

  const sourceRegion: Region = [sx + fx, sy + fy, sw, sh];

  const destinationRegion: Region = (() => {
    switch (rotation) {
      case "Rot0":
        return [dx, dy, dw, dh];
      case "Rot90":
        return [dx + (dw - dh) / 2, dy - (dw - dh) / 2, dh, dw];
      case "Rot180":
        return [dx, dy, dw, dh];
      case "Rot270":
        return [dx + (dw - dh) / 2, dy - (dw - dh) / 2, dh, dw];
      default:
        return [dx, dy, dw, dh];
    }
  })();

  const rotate: number = ((): number => {
    const currRotate = options ? options.rotate ?? 0 : 0;
    switch (rotation) {
      case "Rot0":
        return currRotate;
      case "Rot90":
        return currRotate + 90;
      case "Rot180":
        return currRotate + 180;
      case "Rot270":
        return currRotate + 270;
    }
  })();

  const optionsWithRotate: DrawTextureOptions = {
    ...options,
    rotate,
  };

  generator.drawTexture(
    textureDefId,
    sourceRegion,
    destinationRegion,
    optionsWithRotate
  );
}

export function drawFace(
  generator: Generator,
  faceId: string,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions
) {
  const faceTexturesJson = generator.getStringInputValue(faceId);
  if (faceTexturesJson) {
    const faceTextures = decodeSelectedTextures(faceTexturesJson);
    faceTextures.forEach((selectedTexture: SelectedTexture) => {
      drawTexture(generator, selectedTexture, source, destination, options);
    });
  }
}
