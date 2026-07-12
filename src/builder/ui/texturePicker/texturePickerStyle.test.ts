import { describe, expect, it } from "vitest";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { type TextureFrame } from "@genroot/builder/modules/textureData";
import { makeTileStyle } from "./texturePickerStyle";

const textureDef: TextureDef = {
  id: "TestTexture",
  url: "https://example.com/texture.png",
  standardWidth: 64,
  standardHeight: 64,
};

function makeFrame(rectangle: TextureFrame["rectangle"]): TextureFrame {
  return {
    id: "frame",
    label: "Frame",
    rectangle,
    crop: rectangle,
  };
}

describe("makeTileStyle", () => {
  it("scales a square frame's position and size to the tile size", () => {
    const frame = makeFrame([16, 16, 16, 16]);

    const style = makeTileStyle(textureDef, frame, 32);

    // 32 / 16 = 2x scale in both axes.
    expect(style.backgroundPosition).toBe("-32px -32px");
    expect(style.backgroundSize).toBe("128px 128px");
    expect(style.backgroundImage).toBe("url(https://example.com/texture.png)");
    expect(style.backgroundRepeat).toBe("no-repeat");
    expect(style.imageRendering).toBe("pixelated");
  });

  it("scales width and height independently for a non-square frame", () => {
    // A 32x16 frame previewed at a 32x32 tile size: width doesn't scale
    // (32/32 = 1x) but height scales 2x (32/16) — the two axes must not
    // share a single scale factor, or this preview would distort.
    const frame = makeFrame([0, 0, 32, 16]);

    const style = makeTileStyle(textureDef, frame, 32);

    expect(style.backgroundSize).toBe("64px 128px");
  });

  it("offsets the background position by the frame's origin, scaled", () => {
    const frame = makeFrame([8, 24, 16, 16]);

    const style = makeTileStyle(textureDef, frame, 16);

    // 16 / 16 = 1x scale, so the offset matches the frame origin directly.
    expect(style.backgroundPosition).toBe("-8px -24px");
  });
});
