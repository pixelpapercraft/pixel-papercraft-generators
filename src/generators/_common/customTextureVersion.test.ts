import { describe, expect, it } from "vitest";
import {
  customFrames,
  customTextureDef,
  parseAtlas,
  updateCustomTextureAtlas,
} from "./customTextureVersion";

describe("parseAtlas", () => {
  it("parses valid atlas data", () => {
    expect(
      parseAtlas(
        JSON.stringify({
          atlasWidth: 32,
          atlasHeight: 16,
          frames: [
            {
              id: "first",
              label: "first",
              rectangle: [0, 0, 16, 16],
              crop: [0, 0, 16, 16],
            },
          ],
        })
      )
    ).toEqual({
      atlasWidth: 32,
      atlasHeight: 16,
      frames: [
        {
          id: "first",
          label: "first",
          rectangle: [0, 0, 16, 16],
          crop: [0, 0, 16, 16],
        },
      ],
    });
  });

  it("rejects invalid atlas data", () => {
    expect(parseAtlas("not json")).toBeNull();
    expect(parseAtlas(JSON.stringify({ atlasWidth: 32 }))).toBeNull();
  });
});

describe("custom texture version", () => {
  it("updates the shared custom texture singleton in place", () => {
    const originalTextureDef = { ...customTextureDef };
    const originalFrames = [...customFrames];
    const atlas = {
      atlasWidth: 64,
      atlasHeight: 32,
      frames: [
        {
          id: "first",
          label: "First",
          rectangle: [0, 0, 16, 16] as [number, number, number, number],
          crop: [0, 0, 16, 16] as [number, number, number, number],
        },
      ],
    };

    try {
      updateCustomTextureAtlas("https://example.com/custom.png", atlas);

      expect(customTextureDef).toMatchObject({
        id: "custom",
        url: "https://example.com/custom.png",
        standardWidth: 64,
        standardHeight: 32,
      });
      expect([...customFrames]).toEqual([
        {
          id: "first",
          label: "First",
          rectangle: [0, 0, 16, 16],
          crop: [0, 0, 16, 16],
        },
      ]);
    } finally {
      customTextureDef.url = originalTextureDef.url;
      customTextureDef.standardWidth = originalTextureDef.standardWidth;
      customTextureDef.standardHeight = originalTextureDef.standardHeight;
      customFrames.splice(0, customFrames.length, ...originalFrames);
    }
  });
});
