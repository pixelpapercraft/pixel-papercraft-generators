import { describe, expect, it } from "vitest";
import { imageToTextureFrames, tilesToTextureFrames } from "./textureData";

describe("imageToTextureFrames", () => {
  it("splits vertically stacked animation frames", () => {
    expect(imageToTextureFrames("lava_flow", 32, 64)).toEqual([
      {
        id: "lava_flow_0",
        label: "lava flow (Frame 1)",
        rectangle: [0, 0, 32, 32],
        crop: [0, 0, 32, 32],
      },
      {
        id: "lava_flow_1",
        label: "lava flow (Frame 2)",
        rectangle: [0, 32, 32, 32],
        crop: [0, 0, 32, 32],
      },
    ]);
  });

  it("uses the image width as the frame size", () => {
    expect(imageToTextureFrames("sword.png", 16, 32)).toEqual([
      {
        id: "sword.png_0",
        label: "sword (Frame 1)",
        rectangle: [0, 0, 16, 16],
        crop: [0, 0, 16, 16],
      },
      {
        id: "sword.png_1",
        label: "sword (Frame 2)",
        rectangle: [0, 16, 16, 16],
        crop: [0, 0, 16, 16],
      },
    ]);
  });

  it("truncates a trailing partial frame row", () => {
    expect(imageToTextureFrames("sword.png", 16, 33)).toEqual([
      {
        id: "sword.png_0",
        label: "sword (Frame 1)",
        rectangle: [0, 0, 16, 16],
        crop: [0, 0, 16, 16],
      },
      {
        id: "sword.png_1",
        label: "sword (Frame 2)",
        rectangle: [0, 16, 16, 16],
        crop: [0, 0, 16, 16],
      },
    ]);
  });
});

describe("tilesToTextureFrames", () => {
  it("preserves crop data and labels frames", () => {
    expect(
      tilesToTextureFrames(
        [
          {
            name: "diamond_sword",
            frames: [
              {
                rectangle: [32, 48, 16, 16],
                crop: [2, 0, 12, 16],
              },
            ],
          },
        ],
        16
      )
    ).toEqual([
      {
        id: "diamond_sword",
        label: "diamond sword",
        rectangle: [32, 48, 16, 16],
        crop: [2, 0, 12, 16],
      },
    ]);
  });

  it("sorts ordinary textures before oversized and animated textures", () => {
    const frames = tilesToTextureFrames(
      [
        {
          name: "animated",
          frames: [
            { rectangle: [0, 0, 16, 16], crop: [0, 0, 16, 16] },
            { rectangle: [0, 16, 16, 16], crop: [0, 0, 16, 16] },
          ],
        },
        {
          name: "oversized",
          frames: [{ rectangle: [16, 0, 32, 32], crop: [0, 0, 32, 32] }],
        },
        {
          name: "ordinary",
          frames: [{ rectangle: [48, 0, 16, 16], crop: [0, 0, 16, 16] }],
        },
      ],
      16
    );

    expect(frames.map((frame) => frame.id)).toEqual([
      "ordinary",
      "oversized",
      "animated_0",
      "animated_1",
    ]);
  });

  it("returns no frames for an empty tile list", () => {
    expect(tilesToTextureFrames([], 16)).toEqual([]);
  });
});
