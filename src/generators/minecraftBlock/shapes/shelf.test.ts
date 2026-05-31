import { describe, expect, it, vi } from "vitest";
import { type Generator } from "@genroot/builder/modules/generator";
import { encodeSelectedTextures } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { drawShelf } from "./shelf";

function makeShelfFaceJson(): string {
  return encodeSelectedTextures([
    {
      textureDefId: "test-texture",
      frame: {
        id: "frame",
        label: "frame",
        rectangle: [0, 0, 16, 16] as [number, number, number, number],
        crop: [0, 0, 16, 16] as [number, number, number, number],
      },
      rotation: "Rot0",
      flip: "None",
      blend: null,
    },
  ]);
}

function makeGenerator(state: string): Generator {
  const faceJson = makeShelfFaceJson();

  return {
    defineSelectInput: vi.fn(),
    defineRegionInput: vi.fn(),
    drawImage: vi.fn(),
    drawTexture: vi.fn(),
    getSelectInputValue: (id: string) =>
      id === "Block 1 State" ? state : null,
    getStringInputValue: (id: string) =>
      id === "ShelfFace1" ? faceJson : null,
  } as unknown as Generator;
}

describe("drawShelf", () => {
  it.each([
    ["Unpowered", [0, 2, 8, 4]],
    ["Single", [8, 12, 8, 4]],
    ["Left", [0, 8, 8, 4]],
    ["Center", [0, 12, 8, 4]],
    ["Right", [8, 8, 8, 4]],
  ] as const)("uses the %s front source", (state, expectedSource) => {
    const generator = makeGenerator(state);

    drawShelf(generator, "1", 57, 16, true);

    expect(generator.drawTexture).toHaveBeenCalledWith(
      "test-texture",
      expectedSource,
      [185, 192, 128, 64],
      expect.objectContaining({
        rotate: 0,
        flip: "None",
        blend: undefined,
      })
    );
  });

  it("registers the shelf state control and shelf art", () => {
    const generator = makeGenerator("Unpowered");

    drawShelf(generator, "1", 57, 16, true);

    expect(generator.defineSelectInput).toHaveBeenCalledWith("Block 1 State", [
      "Unpowered",
      "Single",
      "Left",
      "Center",
      "Right",
    ]);
    expect(generator.defineRegionInput).toHaveBeenCalledWith(
      [185, 192, 128, 64],
      expect.any(Function),
      "ShelfFace1"
    );
    expect(generator.drawImage).toHaveBeenCalledWith("Tabs-Shelf", [25, 15]);
    expect(generator.drawImage).toHaveBeenCalledWith("Folds-Shelf", [25, 15]);
  });
});
