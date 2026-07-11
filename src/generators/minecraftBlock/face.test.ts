import { describe, expect, it, vi } from "vitest";
import { type Generator } from "@genroot/builder/modules/generator";
import { type DrawTextureOptions } from "@genroot/builder/modules/renderers/drawTexture";
import { makeNextFlip } from "@genroot/builder/ui/texturePicker/flip";
import { currentBlockTextureId } from "./constants";
import {
  decodeSelectedTextures,
  encodeSelectedTexture,
  encodeSelectedTextures,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
import {
  defineInputRegion,
  drawFace,
  drawFaceWithTextureTransform,
} from "./face";

function makeGenerator(faceId: string, faceJson: string): Generator {
  return {
    getStringInputValue: (id: string) => (id === faceId ? faceJson : null),
    drawTexture: vi.fn(),
  } as unknown as Generator;
}

function makeFaceJson({
  rotation,
  flip,
  rectangle = [16, 32, 16, 16],
}: {
  rotation: "Rot0" | "Rot90" | "Rot180" | "Rot270";
  flip: "None" | "Horizontal" | "Vertical";
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
  rotation: "Rot0" | "Rot90" | "Rot180" | "Rot270",
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
  }
}

describe("drawFace", () => {
  const source: [number, number, number, number] = [0, 0, 16, 16];
  const destination: [number, number, number, number] = [20, 30, 40, 50];
  const faceId = "BlockFaceTop1";

  const cases: Array<{
    name: string;
    rotation: "Rot0" | "Rot90" | "Rot180" | "Rot270";
    flip: "None" | "Horizontal" | "Vertical";
    expectedRotate: number;
  }> = [
    { name: "rot0 none", rotation: "Rot0", flip: "None", expectedRotate: 0 },
    {
      name: "rot0 horizontal",
      rotation: "Rot0",
      flip: "Horizontal",
      expectedRotate: 0,
    },
    {
      name: "rot0 vertical",
      rotation: "Rot0",
      flip: "Vertical",
      expectedRotate: 0,
    },
    {
      name: "rot90 none",
      rotation: "Rot90",
      flip: "None",
      expectedRotate: 90,
    },
    {
      name: "rot90 horizontal",
      rotation: "Rot90",
      flip: "Horizontal",
      expectedRotate: 90,
    },
    {
      name: "rot90 vertical",
      rotation: "Rot90",
      flip: "Vertical",
      expectedRotate: 90,
    },
    {
      name: "rot180 none",
      rotation: "Rot180",
      flip: "None",
      expectedRotate: 180,
    },
    {
      name: "rot180 horizontal",
      rotation: "Rot180",
      flip: "Horizontal",
      expectedRotate: 180,
    },
    {
      name: "rot180 vertical",
      rotation: "Rot180",
      flip: "Vertical",
      expectedRotate: 180,
    },
    {
      name: "rot270 none",
      rotation: "Rot270",
      flip: "None",
      expectedRotate: 270,
    },
    {
      name: "rot270 horizontal",
      rotation: "Rot270",
      flip: "Horizontal",
      expectedRotate: 270,
    },
    {
      name: "rot270 vertical",
      rotation: "Rot270",
      flip: "Vertical",
      expectedRotate: 270,
    },
  ];

  cases.forEach(({ name, rotation, flip, expectedRotate }) => {
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
          rotate: expectedRotate,
          flip: expectedFlip,
          blend: undefined,
        })
      );
    });
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

  it("applies face transforms through the texture rotation path", () => {
    const generator = makeGenerator(
      faceId,
      makeFaceJson({ rotation: "Rot0", flip: "None" })
    );

    drawFaceWithTextureTransform(generator, faceId, source, destination, {
      rotate: 90,
      flip: "None",
    });

    expect(generator.drawTexture).toHaveBeenCalledTimes(1);
    expect(generator.drawTexture).toHaveBeenCalledWith(
      "test-texture",
      [16, 32, 16, 16],
      makeExpectedDestination("Rot90", destination),
      expect.objectContaining<DrawTextureOptions>({
        rotate: 90,
        flip: "None",
        blend: undefined,
      })
    );
  });
});

describe("defineInputRegion", () => {
  const faceId = "BlockFaceTop1";
  const region: [number, number, number, number] = [0, 0, 16, 16];

  function makeSelectedTextureJson(
    textureDefId: string,
    blend: string | null = null
  ): string {
    return encodeSelectedTexture({
      textureDefId,
      frame: {
        id: "frame",
        label: "frame",
        rectangle: [0, 0, 16, 16],
        crop: [0, 0, 16, 16],
      },
      rotation: "Rot0",
      flip: "None",
      blend,
    });
  }

  function makeRegionGenerator({
    currentTextureJson,
    faceJson,
    enableErase = true,
  }: {
    currentTextureJson: string;
    faceJson: string;
    enableErase?: boolean;
  }) {
    let onRegionClick: (() => void) | undefined;
    let onRegionRightClick: (() => void) | undefined;
    let nextFaceJson: string | null = null;
    const generator = {
      defineRegionInput: vi.fn(
        (
          _region: unknown,
          callback: () => void,
          _id: string | undefined,
          rightClick?: () => void
        ) => {
          onRegionClick = callback;
          onRegionRightClick = rightClick;
        }
      ),
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
    } as unknown as Generator;

    defineInputRegion(generator, faceId, region, { enableErase });

    const click = onRegionClick;
    if (!click) {
      throw new Error("Region callback was not registered");
    }

    return {
      click,
      rightClick: onRegionRightClick,
      getNextFaceTextures: () =>
        nextFaceJson ? decodeSelectedTextures(nextFaceJson) : [],
    };
  }

  it("appends the selected texture to the face", () => {
    const currentTextureJson = makeSelectedTextureJson("stone");
    const { click, getNextFaceTextures } = makeRegionGenerator({
      currentTextureJson,
      faceJson: "",
    });

    click();

    expect(getNextFaceTextures()).toHaveLength(1);
    expect(getNextFaceTextures()[0]?.textureDefId).toBe("stone");
  });

  it("erases the last face texture when the picker selection is empty", () => {
    const currentTextureJson = makeSelectedTextureJson("");
    const faceJson = encodeSelectedTextures([
      JSON.parse(makeSelectedTextureJson("stone")),
      JSON.parse(makeSelectedTextureJson("dirt")),
    ]);
    const { click, getNextFaceTextures } = makeRegionGenerator({
      currentTextureJson,
      faceJson,
    });

    click();

    expect(getNextFaceTextures()).toHaveLength(1);
    expect(getNextFaceTextures()[0]?.textureDefId).toBe("stone");
  });

  it("applies a tint-only picker selection to the last face texture", () => {
    const currentTextureJson = makeSelectedTextureJson("", "#3C44AA");
    const faceJson = encodeSelectedTextures([
      JSON.parse(makeSelectedTextureJson("stone")),
      JSON.parse(makeSelectedTextureJson("dirt")),
    ]);
    const { click, getNextFaceTextures } = makeRegionGenerator({
      currentTextureJson,
      faceJson,
    });

    click();

    expect(getNextFaceTextures()).toHaveLength(2);
    expect(getNextFaceTextures()[0]?.blend).toBe(null);
    expect(getNextFaceTextures()[1]?.textureDefId).toBe("dirt");
    expect(getNextFaceTextures()[1]?.blend).toBe("#3C44AA");
  });

  it("erases the last face texture on right click without changing the selected texture", () => {
    const currentTextureJson = makeSelectedTextureJson("grass_block_top");
    const faceJson = encodeSelectedTextures([
      JSON.parse(makeSelectedTextureJson("stone")),
      JSON.parse(makeSelectedTextureJson("dirt")),
    ]);
    const { rightClick, getNextFaceTextures } = makeRegionGenerator({
      currentTextureJson,
      faceJson,
    });

    expect(rightClick).toBeDefined();
    rightClick?.();

    expect(getNextFaceTextures()).toHaveLength(1);
    expect(getNextFaceTextures()[0]?.textureDefId).toBe("stone");
  });

  it("does not register right click erase when erase is disabled", () => {
    const { rightClick } = makeRegionGenerator({
      currentTextureJson: makeSelectedTextureJson("stone"),
      faceJson: "",
      enableErase: false,
    });

    expect(rightClick).toBeUndefined();
  });
});
