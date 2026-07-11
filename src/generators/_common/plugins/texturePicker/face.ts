import {
  type DrawTextureOptions,
  type Blend,
} from "@genroot/builder/modules/renderers/drawTexture";
import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  makeNextFlip,
  type Flip,
} from "@genroot/builder/ui/texturePicker/flip";
import { type Rotation } from "@genroot/builder/ui/texturePicker/rotation";
import {
  type SelectedTexture,
  decodeSelectedTexture,
  decodeSelectedTextures,
  encodeSelectedTextures,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
import { scaleTextureSource } from "./sourceRegion";

export type FaceTextureTransform = {
  rotate: 0 | 90 | 180 | 270;
  flip: Flip;
};

export type DefineTextureInputRegionOptions = {
  enableErase?: boolean;
};

export function defineTextureInputRegion(
  generator: Generator,
  selectedTextureInputId: string,
  faceId: string,
  region: Region,
  options: DefineTextureInputRegionOptions = {}
) {
  const enableErase = options.enableErase ?? true;
  generator.defineRegionInput(
    region,
    () => {
      const selectedTextureJson = generator.getStringInputValue(
        selectedTextureInputId
      );

      const selectedTexture = selectedTextureJson
        ? decodeSelectedTexture(selectedTextureJson)
        : null;

      if (!selectedTexture) {
        return;
      }

      const currentFaceTexturesJson = generator.getStringInputValue(faceId);
      const currentFaceTextures = currentFaceTexturesJson
        ? decodeSelectedTextures(currentFaceTexturesJson)
        : [];

      const shouldErase =
        selectedTexture.textureDefId === "" && selectedTexture.blend === null;
      const newFaceTextures = shouldErase
        ? currentFaceTextures.slice(0, -1)
        : selectedTexture.textureDefId === ""
          ? applyBlendToTopTexture(currentFaceTextures, selectedTexture.blend)
          : currentFaceTextures.concat([selectedTexture]);
      generator.setStringInputValue(
        faceId,
        encodeSelectedTextures(newFaceTextures)
      );
    },
    faceId,
    enableErase
      ? () => {
          eraseLastFaceTexture(generator, faceId);
        }
      : undefined
  );
}

function applyBlendToTopTexture(
  textures: SelectedTexture[],
  blend: string | null
): SelectedTexture[] {
  if (!isValidTint(blend) || textures.length === 0) {
    return textures;
  }

  return textures.map((texture, index) =>
    index === textures.length - 1 ? { ...texture, blend } : texture
  );
}

function isValidTint(blend: string | null): blend is string {
  return /^#[\da-f]{6}$/i.test(blend ?? "");
}

function eraseLastFaceTexture(generator: Generator, faceId: string) {
  const currentFaceTexturesJson = generator.getStringInputValue(faceId);
  const currentFaceTextures = currentFaceTexturesJson
    ? decodeSelectedTextures(currentFaceTexturesJson)
    : [];

  generator.setStringInputValue(
    faceId,
    encodeSelectedTextures(currentFaceTextures.slice(0, -1))
  );
}

export function drawSelectedTexture(
  generator: Generator,
  face: SelectedTexture,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions
) {
  const { textureDefId, frame, rotation, flip } = face;
  const [dx, dy, dw, dh] = destination;

  const [fx, fy, fw, fh] = frame.rectangle;

  const flipOption = options?.flip ?? "None";
  const [nextFlip, nextRotation] = makeNextFlip(flipOption, flip, rotation);

  const [ssx, ssy, ssw, ssh] = scaleTextureSource(source, frame, 16);

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
      case "Rot270":
        return [dx + (dw - dh) / 2, dy - (dw - dh) / 2, dh, dw];
      case "Rot180":
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

  generator.drawTexture(textureDefId, sourceRegion, destinationRegion, {
    ...options,
    rotate,
    flip: nextFlip,
    blend,
  });
}

export function drawTextureFace(
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
      drawSelectedTexture(
        generator,
        selectedTexture,
        source,
        destination,
        options
      );
    });
  }
}

export function drawTextureFaceWithTransform(
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
      drawSelectedTexture(
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
