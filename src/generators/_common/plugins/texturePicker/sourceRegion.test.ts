import { describe, expect, it } from "vitest";
import { type TextureFrame } from "@genroot/builder/modules/textureData";
import {
  getTextureFrameScale,
  makeTextureFrameSourceRegion,
  scaleTextureSource,
} from "./sourceRegion";

function frame(rectangle: [number, number, number, number]): TextureFrame {
  return {
    id: "frame",
    label: "frame",
    rectangle,
    crop: [0, 0, rectangle[2], rectangle[3]],
  };
}

describe("texture picker source regions", () => {
  it("scales block sources from 16x16 logical frames", () => {
    const textureFrame = frame([464, 384, 32, 32]);

    expect(getTextureFrameScale(textureFrame, 16)).toBe(2);
    expect(scaleTextureSource([8, 3.5, 8, 1.5], textureFrame, 16)).toEqual([
      16, 7, 16, 3,
    ]);
  });

  it("offsets scaled block sources into their atlas frame", () => {
    expect(
      makeTextureFrameSourceRegion(
        frame([464, 384, 32, 32]),
        [8, 3.5, 8, 1.5],
        16
      )
    ).toEqual([480, 391, 16, 3]);
  });

  it("scales banner and shield model sources from 64x64 logical frames", () => {
    expect(
      makeTextureFrameSourceRegion(frame([64, 0, 128, 128]), [1, 1, 20, 40], 64)
    ).toEqual([66, 2, 40, 80]);
  });
});
