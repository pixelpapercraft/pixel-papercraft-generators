import { describe, expect, it, vi } from "vitest";
import { packImages } from "./texturePacking";

describe("packImages", () => {
  it("packs by height and preserves crop data", () => {
    const atlas = packImages(
      [
        {
          id: "tall",
          label: "Tall",
          rectangle: [0, 0, 16, 32],
          crop: [1, 2, 14, 28],
          sourceIndex: 0,
        },
        {
          id: "short",
          label: "Short",
          rectangle: [0, 0, 16, 16],
          crop: [3, 4, 10, 11],
          sourceIndex: 1,
        },
      ],
      32
    );

    expect(atlas).toEqual({
      atlasWidth: 32,
      atlasHeight: 32,
      frames: [
        {
          id: "short",
          label: "Short",
          rectangle: [0, 0, 16, 16],
          crop: [3, 4, 10, 11],
        },
        {
          id: "tall",
          label: "Tall",
          rectangle: [16, 0, 16, 32],
          crop: [1, 2, 14, 28],
        },
      ],
    });
  });

  it("skips images that cannot fit the atlas width", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const atlas = packImages(
      [
        {
          id: "too-wide",
          rectangle: [0, 0, 64, 16],
          crop: [0, 0, 64, 16],
          sourceIndex: 0,
        },
        {
          id: "fits",
          rectangle: [0, 0, 16, 16],
          crop: [0, 0, 16, 16],
          sourceIndex: 1,
        },
      ],
      32
    );

    expect(atlas.frames.map((frame) => frame.id)).toEqual(["fits"]);
    expect(warn).toHaveBeenCalledWith(
      "Skipping image too-wide because width 64 exceeds canvas width 32"
    );

    warn.mockRestore();
  });

  it("wraps to a new row when the current row is full", () => {
    const atlas = packImages(
      [
        {
          id: "wide",
          rectangle: [0, 0, 20, 10],
          crop: [0, 0, 20, 10],
          sourceIndex: 0,
        },
        {
          id: "tall",
          rectangle: [0, 0, 12, 12],
          crop: [0, 0, 12, 12],
          sourceIndex: 1,
        },
        {
          id: "third",
          rectangle: [0, 0, 16, 8],
          crop: [0, 0, 16, 8],
          sourceIndex: 2,
        },
      ],
      32
    );

    expect(atlas).toEqual({
      atlasWidth: 32,
      atlasHeight: 20,
      frames: [
        {
          id: "third",
          label: "third",
          rectangle: [0, 0, 16, 8],
          crop: [0, 0, 16, 8],
        },
        {
          id: "wide",
          label: "wide",
          rectangle: [0, 8, 20, 10],
          crop: [0, 0, 20, 10],
        },
        {
          id: "tall",
          label: "tall",
          rectangle: [20, 8, 12, 12],
          crop: [0, 0, 12, 12],
        },
      ],
    });
  });

  it("returns an empty atlas for an empty image list", () => {
    expect(packImages([], 32)).toEqual({
      atlasWidth: 32,
      atlasHeight: 0,
      frames: [],
    });
  });
});
