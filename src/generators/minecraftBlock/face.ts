import {
  type DrawTextureOptions,
  type Blend,
} from "@genroot/builder/modules/renderers/drawTexture";
import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  type SelectedTexture,
  encodeSelectedTextures,
  decodeSelectedTextures,
  decodeSelectedTexture,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
import {
  type Flip,
  makeNextFlip,
} from "@genroot/builder/ui/texturePicker/flip";
import { type Rotation } from "@genroot/builder/ui/texturePicker/rotation";
import { currentBlockTextureId } from "@genroot/generators/minecraftBlock/constants";

export type FaceTextureTransform = {
  rotate: 0 | 90 | 180 | 270;
  flip: Flip;
};

export function defineInputRegion(
  generator: Generator,
  faceId: string,
  region: Region
) {
  generator.defineRegionInput(
    region,
    () => {
      const selectedTextureJson = generator.getStringInputValue(
        currentBlockTextureId
      );

      const selectedTexture = selectedTextureJson
        ? decodeSelectedTexture(selectedTextureJson)
        : null;

      if (!selectedTexture) {
        return;
      }

      const curentFaceTexturesJson = generator.getStringInputValue(faceId);
      const currentFaceTextures = curentFaceTexturesJson
        ? decodeSelectedTextures(curentFaceTexturesJson)
        : [];

      const shouldErase = selectedTexture.textureDefId === "";
      const newFaceTextures = shouldErase
        ? currentFaceTextures.slice(0, -1)
        : currentFaceTextures.concat([selectedTexture]);
      const newFaceTexturesJson = encodeSelectedTextures(newFaceTextures);
      generator.setStringInputValue(faceId, newFaceTexturesJson);
    },
    faceId
  );
}

function drawTexture(
  generator: Generator,
  face: SelectedTexture,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions
) {
  if (face.textureDefId === "") {
    return;
  }

  const { textureDefId, frame, rotation, flip } = face;
  const [dx, dy, dw, dh] = destination;

  const [sx, sy, sw, sh] = source;
  const [fx, fy, fw, fh] = frame.rectangle;

  const flipOption = options?.flip ?? "None";
  const [nextFlip, nextRotation] = makeNextFlip(flip, flipOption, rotation);

  const scaleX = fw / 16;
  const scaleY = fh / 16;
  const scaledSource = [
    sx * scaleX,
    sy * scaleY,
    sw * scaleX,
    sh * scaleY,
  ] as const;
  const [ssx, ssy, ssw, ssh] = scaledSource;

  const sourceRegion: Region = (() => {
    switch (nextRotation) {
      case "Rot0":
        return [fx + ssx, fy + ssy, ssw, ssh];
      case "Rot90":
        return [
          fx + sy * scaleX,
          fy + (16 - (sx + sw)) * scaleY,
          sh * scaleX,
          sw * scaleY,
        ];
      case "Rot180":
        return [fx + fw - (ssw + ssx), fy + fh - (ssh + ssy), ssw, ssh];
      case "Rot270":
        return [
          fx + (16 - (sy + sh)) * scaleX,
          fy + sx * scaleY,
          sh * scaleX,
          sw * scaleY,
        ];
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
    const faceTextures = decodeSelectedTextures(faceTexturesJson);
    faceTextures.forEach((selectedTexture: SelectedTexture) => {
      drawTexture(generator, selectedTexture, source, destination, options);
    });
  }
}

export function drawFaceWithTextureTransform(
  generator: Generator,
  faceId: string,
  source: Region,
  destination: Region,
  transform: FaceTextureTransform
) {
  const faceTexturesJson = generator.getStringInputValue(faceId);
  if (faceTexturesJson) {
    const faceTextures = decodeSelectedTextures(faceTexturesJson);
    faceTextures.forEach((selectedTexture: SelectedTexture) => {
      drawTexture(
        generator,
        {
          ...selectedTexture,
          rotation: rotateTextureRotation(
            selectedTexture.rotation,
            transform.rotate
          ),
        },
        source,
        destination,
        { flip: transform.flip }
      );
    });
  }
}

function rotateTextureRotation(
  rotation: Rotation,
  degrees: FaceTextureTransform["rotate"]
): Rotation {
  const rotations: Rotation[] = ["Rot0", "Rot90", "Rot180", "Rot270"];
  const currentIndex = rotations.indexOf(rotation);
  const addIndex = degrees / 90;
  return rotations[(currentIndex + addIndex) % rotations.length] ?? "Rot0";
}
