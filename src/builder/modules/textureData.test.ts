import { describe, expect, it } from "vitest";
import { imageToTextureFrames, tilesToTextureFrames } from "./textureData";

describe("imageToTextureFrames", () => {
  it("splits vertically stacked animation frames", () => {
    expect(imageToTextureFrames("lava_flow", 64, 128)).toEqual([
      {
        id: "lava_flow_0",
        label: "lava flow (Frame 1)",
        rectangle: [0, 0, 64, 64],
        crop: [0, 0, 64, 64],
      },
      {
        id: "lava_flow_1",
        label: "lava flow (Frame 2)",
        rectangle: [0, 64, 64, 64],
        crop: [0, 0, 64, 64],
      },
    ]);
  });

  it("uses the image width as the frame size", () => {
    expect(imageToTextureFrames("sword.png", 64, 64)).toEqual([
      {
        id: "sword.png",
        label: "sword",
        rectangle: [0, 0, 64, 64],
        crop: [0, 0, 64, 64],
      },
    ]);
  });

  it("treats a square image as a single frame", () => {
    expect(imageToTextureFrames("shield.png", 32, 32)).toEqual([
      {
        id: "shield.png",
        label: "shield",
        rectangle: [0, 0, 32, 32],
        crop: [0, 0, 32, 32],
      },
    ]);
  });

  it("truncates a trailing partial frame row", () => {
    expect(imageToTextureFrames("sword.png", 64, 96)).toEqual([
      {
        id: "sword.png",
        label: "sword",
        rectangle: [0, 0, 64, 64],
        crop: [0, 0, 64, 64],
      },
    ]);
  });

  it("does not add a frame number until there are two full rows", () => {
    expect(imageToTextureFrames("sword.png", 64, 65)).toEqual([
      {
        id: "sword.png",
        label: "sword",
        rectangle: [0, 0, 64, 64],
        crop: [0, 0, 64, 64],
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
