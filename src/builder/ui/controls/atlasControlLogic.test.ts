import { afterEach, describe, expect, it, vi } from "vitest";

import { createAtlas } from "./atlasControlLogic";

describe("createAtlas", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("packs uploaded images and preserves crop bounds", () => {
    const atlasDrawImage = vi.fn();
    const cropDrawImage = vi.fn();
    const getImageData = vi.fn(() => {
      const pixels = new Uint8ClampedArray(16 * 16 * 4);
      for (let y = 3; y < 9; y += 1) {
        for (let x = 2; x < 6; x += 1) {
          pixels[(y * 16 + x) * 4 + 3] = 255;
        }
      }
      return { data: pixels };
    });
    let canvasIndex = 0;
    vi.stubGlobal("document", {
      createElement: vi.fn(() => {
        canvasIndex += 1;
        if (canvasIndex === 1) {
          return {
            width: 0,
            height: 0,
            getContext: vi.fn(() => ({
              drawImage: cropDrawImage,
              getImageData,
            })),
          };
        }

        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({
            drawImage: atlasDrawImage,
          })),
          toDataURL: vi.fn(() => "data:image/png;base64,atlas"),
        };
      }),
    });

    const image = {
      name: "sword.png",
      width: 16,
      height: 16,
    } as HTMLImageElement;

    const atlas = createAtlas([image], 16, 16);

    expect(atlas.atlasWidth).toBe(16);
    expect(atlas.atlasHeight).toBe(16);
    expect(atlas.url).toBe("data:image/png;base64,atlas");
    expect(atlasDrawImage).toHaveBeenCalledWith(image, 0, 0, 16, 16, 0, 0, 16, 16);
    expect(cropDrawImage).toHaveBeenCalledWith(image, 0, 0);
    expect(getImageData).toHaveBeenCalledWith(0, 0, 16, 16);
    expect(JSON.parse(atlas.framesJson)).toEqual({
      atlasWidth: 16,
      atlasHeight: 16,
      frames: [
        {
          id: "sword.png",
          label: "sword",
          rectangle: [0, 0, 16, 16],
          crop: [2, 3, 4, 6],
        },
      ],
    });
  });

  it("rejects an empty image list", () => {
    expect(() => createAtlas([], 16, 16)).toThrow("No images to pack into atlas");
  });
});
