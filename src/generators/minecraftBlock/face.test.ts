import { describe, expect, it, vi } from "vitest";
import {
  encodeSelectedTexture,
  encodeSelectedTextures,
  decodeSelectedTextures,
  makeNextFlip,
  rotationToDegrees,
  type DrawTextureOptions,
  type Flip,
  type Rotation,
  type SelectedTexture,
} from "@genroot/builder";
import { currentBlockTextureId } from "@genroot/generators/_common/block/constants";
import { type BlockRenderContext } from "./blockRenderContext";
import { makeBlockRenderContext } from "./blockRenderContext.fake";
import { defineInputRegion, drawFace } from "./face";

function makeGenerator(faceId: string, faceJson: string): BlockRenderContext {
  return makeBlockRenderContext({
    getStringInputValue: (id: string) => (id === faceId ? faceJson : null),
  });
}

function makeFaceJson({
  rotation,
  flip,
  rectangle = [16, 32, 16, 16],
}: {
  rotation: Rotation;
  flip: Flip;
  rectangle?: [number, number, number, number];
}) {
  return encodeSelectedTextures([
    {
      textureDefId: "test-texture",
      frame: {
        id: "frame",
        label: "frame",
        rectangle,
        crop: [0, 0, rectangle[2], rectangle[3]],
      },
      rotation,
      flip,
      blend: null,
    },
  ]);
}

function makeExpectedDestination(
  rotation: Rotation,
  destination: [number, number, number, number]
): [number, number, number, number] {
  const [dx, dy, dw, dh] = destination;
  switch (rotation) {
    case "Rot0":
    case "Rot180":
      return destination;
    case "Rot90":
    case "Rot270":
      return [dx + (dw - dh) / 2, dy - (dw - dh) / 2, dh, dw];
    default:
      return rotation satisfies never;
  }
}

describe("drawFace", () => {
  const source: [number, number, number, number] = [0, 0, 16, 16];
  const destination: [number, number, number, number] = [20, 30, 40, 50];
  const faceId = "BlockFaceTop1";

  const rotations: Rotation[] = ["Rot0", "Rot90", "Rot180", "Rot270"];
  const flips: Flip[] = ["None", "Horizontal", "Vertical"];

  const cases: Array<{ name: string; rotation: Rotation; flip: Flip }> =
    rotations.flatMap((rotation) =>
      flips.map((flip) => ({
        name: `${rotation.toLowerCase()} ${flip.toLowerCase()}`,
        rotation,
        flip,
      }))
    );

  cases.forEach(({ name, rotation, flip }) => {
    it(`forwards orientation correctly for ${name}`, () => {
      const generator = makeGenerator(faceId, makeFaceJson({ rotation, flip }));
      const [expectedFlip] = makeNextFlip(flip, "None", rotation);

      drawFace(generator, faceId, source, destination);

      expect(generator.drawTexture).toHaveBeenCalledTimes(1);
      expect(generator.drawTexture).toHaveBeenCalledWith(
        "test-texture",
        [16, 32, 16, 16],
        makeExpectedDestination(rotation, destination),
        expect.objectContaining<DrawTextureOptions>({
          rotate: rotationToDegrees(rotation),
          flip: expectedFlip,
          blend: undefined,
        })
      );
    });
  });

  it("composes a generator flip with the stored selected texture orientation", () => {
    const rotation: Rotation = "Rot90";
    const flip: Flip = "Horizontal";
    const generator = makeGenerator(faceId, makeFaceJson({ rotation, flip }));
    const [expectedFlip, expectedRotation] = makeNextFlip(
      flip,
      "Horizontal",
      rotation
    );

    drawFace(generator, faceId, source, destination, { flip: "Horizontal" });

    expect(generator.drawTexture).toHaveBeenCalledTimes(1);
    expect(generator.drawTexture).toHaveBeenCalledWith(
      "test-texture",
      [16, 32, 16, 16],
      makeExpectedDestination(expectedRotation, destination),
      expect.objectContaining<DrawTextureOptions>({
        rotate: rotationToDegrees(expectedRotation),
        flip: expectedFlip,
        blend: undefined,
      })
    );
  });

  it("scales partial source regions to match larger atlas frames", () => {
    const generator = makeGenerator(
      faceId,
      makeFaceJson({
        rotation: "Rot0",
        flip: "None",
        rectangle: [464, 384, 32, 32],
      })
    );

    drawFace(generator, faceId, [8, 3.5, 8, 1.5], destination);

    expect(generator.drawTexture).toHaveBeenCalledTimes(1);
    expect(generator.drawTexture).toHaveBeenCalledWith(
      "test-texture",
      [480, 391, 16, 3],
      destination,
      expect.objectContaining<DrawTextureOptions>({
        rotate: 0,
        flip: "None",
        blend: undefined,
      })
    );
  });
});

describe("defineInputRegion", () => {
  const faceId = "BlockFaceTop1";
  const region: [number, number, number, number] = [0, 0, 16, 16];

  function makeSelectedTexture(textureDefId: string): SelectedTexture {
    return {
      textureDefId,
      frame: {
        id: "frame",
        label: "frame",
        rectangle: [0, 0, 16, 16],
        crop: [0, 0, 16, 16],
      },
      rotation: "Rot0",
      flip: "None",
      blend: null,
    };
  }

  function makeRegionGenerator({
    currentTextureJson,
    faceJson,
  }: {
    currentTextureJson: string;
    faceJson: string;
  }) {
    let onRegionClick: (() => void) | undefined;
    let nextFaceJson: string | null = null;
    const generator = makeBlockRenderContext({
      defineRegionInput: vi.fn((_region, callback: () => void) => {
        onRegionClick = callback;
      }),
      getStringInputValue: vi.fn((id: string) => {
        if (id === currentBlockTextureId) {
          return currentTextureJson;
        }
        if (id === faceId) {
          return faceJson;
        }
        return null;
      }),
      setStringInputValue: vi.fn((id: string, value: string) => {
        if (id === faceId) {
          nextFaceJson = value;
        }
      }),
    });

    defineInputRegion(generator, faceId, region);

    const click = onRegionClick;
    if (!click) {
      throw new Error("Region callback was not registered");
    }

    return {
      click,
      getNextFaceTextures: () =>
        nextFaceJson ? decodeSelectedTextures(nextFaceJson) : [],
    };
  }

  it("appends the selected texture to the face", () => {
    const { click, getNextFaceTextures } = makeRegionGenerator({
      currentTextureJson: encodeSelectedTexture(makeSelectedTexture("stone")),
      faceJson: "",
    });

    click();

    expect(getNextFaceTextures()).toHaveLength(1);
    expect(getNextFaceTextures()[0]?.textureDefId).toBe("stone");
  });

  it("erases the last face texture when the picker selection is empty", () => {
    const { click, getNextFaceTextures } = makeRegionGenerator({
      currentTextureJson: encodeSelectedTexture(makeSelectedTexture("")),
      faceJson: encodeSelectedTextures([
        makeSelectedTexture("stone"),
        makeSelectedTexture("dirt"),
      ]),
    });

    click();

    expect(getNextFaceTextures()).toHaveLength(1);
    expect(getNextFaceTextures()[0]?.textureDefId).toBe("stone");
  });
});
