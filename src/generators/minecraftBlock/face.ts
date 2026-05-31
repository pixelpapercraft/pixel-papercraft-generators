import {
  type DrawTextureOptions,
  type Blend,
} from "@genroot/builder/modules/renderers/drawTexture";
import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import { makeNextFlip } from "../../builder/ui/texturePicker/flip";
import { currentBlockTextureId } from "./constants";
import {
  type SelectedTextureWithBlend,
  decodeSelectedTextureWithBlend,
  decodeSelectedTextureWithBlendArray,
  encodeSelectedTextureWithBlendArray,
} from "./selectedTextureWithBlend";

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
      ? decodeSelectedTextureWithBlend(selectedTextureJson)
      : null;

    if (!selectedTexture) {
      return;
    }

    const curentFaceTexturesJson = generator.getStringInputValue(faceId);
    const currentFaceTextures = curentFaceTexturesJson
      ? decodeSelectedTextureWithBlendArray(curentFaceTexturesJson)
      : [];

    const shouldErase = selectedTexture.selectedTexture?.textureDefId === "";
    const newFaceTextures = shouldErase
      ? currentFaceTextures.slice(0, -1)
      : currentFaceTextures.concat([selectedTexture]);
    const newFaceTexturesJson =
      encodeSelectedTextureWithBlendArray(newFaceTextures);
    generator.setStringInputValue(faceId, newFaceTexturesJson);
  }, faceId);
}

function drawTexture(
  generator: Generator,
  face: SelectedTextureWithBlend,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions
) {
  if (!face.selectedTexture || face.selectedTexture.textureDefId === "") {
    return;
  }

  const { textureDefId, frame, rotation, flip } = face.selectedTexture;
  const [dx, dy, dw, dh] = destination;

  const [sx, sy, sw, sh] = source;
  const [fx, fy, fw, fh] = frame.rectangle;

  const flipOption = options?.flip ?? "None";
  const [nextFlip, nextRotation] = makeNextFlip(flipOption, flip, rotation);

  const scale =
    fw === fh && fw > 0 && fw % 16 === 0 && fh % 16 === 0 ? fw / 16 : 1;
  const scaledSource = [sx * scale, sy * scale, sw * scale, sh * scale] as const;
  const [ssx, ssy, ssw, ssh] = scaledSource;

  const sourceRegion: Region = (() => {
    switch (nextRotation) {
      case "Rot0":
        return [fx + ssx, fy + ssy, ssw, ssh];
      case "Rot90":
        return [fx + ssy, fy + fw - (ssw + ssx), ssh, ssw];
      case "Rot180":
        return [fx + fw - (ssw + ssx), fy + fh - (ssh + ssy), ssw, ssh];
      case "Rot270":
        return [fx + fh - (ssh + ssy), fy + ssx, ssh, ssw];
    }
  })();

  const destinationRegion: Region = (() => {
    switch (nextRotation) {
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
    switch (nextRotation) {
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

  const blend: Blend | undefined = face.blend
    ? { kind: "MultiplyHex", hex: face.blend }
    : undefined;

  const optionsWithRotate: DrawTextureOptions = {
    ...options,
    rotate,
    flip: nextFlip,
    blend,
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
    const faceTextures = decodeSelectedTextureWithBlendArray(faceTexturesJson);
    faceTextures.forEach((selectedTexture: SelectedTextureWithBlend) => {
      drawTexture(generator, selectedTexture, source, destination, options);
    });
  }
}
