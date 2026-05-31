import { describe, expect, it } from "vitest";
import { makeFrameLabel, tilesToTextureFrames } from "./textureData";

describe("tilesToTextureFrames", () => {
  it("preserves frame labels and crops for multi-frame textures", () => {
    const frames = tilesToTextureFrames(
      [
        {
          name: "animated_block",
          frames: [
            {
              rectangle: [0, 0, 16, 16],
              crop: [0, 0, 16, 16],
            },
            {
              rectangle: [0, 16, 16, 16],
              crop: [0, 0, 16, 16],
            },
          ],
        },
      ],
      16
    );

    expect(frames).toHaveLength(2);
    expect(frames[0]).toEqual({
      id: "animated_block_0",
      label: "animated block (Frame 1)",
      rectangle: [0, 0, 16, 16],
      crop: [0, 0, 16, 16],
    });
    expect(frames[1]).toEqual({
      id: "animated_block_1",
      label: "animated block (Frame 2)",
      rectangle: [0, 16, 16, 16],
      crop: [0, 0, 16, 16],
    });
  });

  it("keeps a large single-frame texture as a single frame", () => {
    const frames = tilesToTextureFrames(
      [
        {
          name: "large_single_frame",
          frames: [
            {
              rectangle: [0, 0, 32, 32],
              crop: [0, 0, 32, 32],
            },
          ],
        },
      ],
      16
    );

    expect(frames).toHaveLength(1);
    expect(frames[0]).toEqual({
      id: "large_single_frame",
      label: "large single frame",
      rectangle: [0, 0, 32, 32],
      crop: [0, 0, 32, 32],
    });
  });
});

describe("makeFrameLabel", () => {
  it("returns the frame label", () => {
    expect(
      makeFrameLabel({
        id: "animated_block_1",
        label: "animated block (Frame 2)",
        rectangle: [0, 16, 16, 16],
        crop: [0, 0, 16, 16],
      })
    ).toBe("animated block (Frame 2)");
  });
});
