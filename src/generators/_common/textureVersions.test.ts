import { describe, expect, it } from "vitest";
import { makeTextureVersions } from "./textureVersions";

describe("makeTextureVersions", () => {
  it("converts generated texture data into legacy texture versions for the current generators", () => {
    const textureVersions = makeTextureVersions([
      [
        {
          textureDef: {
            id: "example-texture",
            url: "https://example.com/texture.png",
            standardWidth: 16,
            standardHeight: 16,
          },
          tiles: [
            {
              name: "example_tile",
              frames: [
                {
                  rectangle: [0, 0, 16, 16],
                  crop: [0, 0, 16, 16],
                },
              ],
            },
          ],
        },
        16,
      ],
    ]);

    expect(textureVersions).toEqual([
      {
        textureDef: {
          id: "example-texture",
          url: "https://example.com/texture.png",
          standardWidth: 16,
          standardHeight: 16,
        },
        frames: [
          {
            id: "example_tile",
            name: "example_tile",
            rectangle: [0, 0, 16, 16],
            frameIndex: 0,
            frameCount: 1,
          },
        ],
      },
    ]);
  });
});
