import { type Atlas } from "@genroot/builder/engine/textureData";
import { describe, expect, it } from "vitest";
import { makeCustomTextureVersion } from "./customTextureVersionV2";

describe("makeCustomTextureVersion", () => {
  it("initializes textureDef and a single default frame from the given options", () => {
    const version = makeCustomTextureVersion({
      id: "custom-banner",
      label: "Custom Banner",
      placeholderUrl: "/placeholder-banner.png",
      standardWidth: 20,
      standardHeight: 40,
    });

    expect(version.textureDef).toEqual<typeof version.textureDef>({
      id: "custom-banner",
      url: "/placeholder-banner.png",
      standardWidth: 20,
      standardHeight: 40,
    });
    expect(version.frames).toEqual<typeof version.frames>([
      {
        id: "custom-banner",
        label: "Custom Banner",
        rectangle: [0, 0, 20, 40],
        crop: [0, 0, 20, 40],
      },
    ]);
  });

  it("keeps each call's state independent", () => {
    const banner = makeCustomTextureVersion({
      id: "custom-banner",
      label: "Custom Banner",
      placeholderUrl: "/placeholder-banner.png",
      standardWidth: 20,
      standardHeight: 40,
    });
    const shield = makeCustomTextureVersion({
      id: "custom-shield",
      label: "Custom Shield",
      placeholderUrl: "/placeholder-shield.png",
      standardWidth: 12,
      standardHeight: 14,
    });

    banner.updateAtlas("/uploaded-banner.png", null);

    expect(banner.textureDef.url).toBe("/uploaded-banner.png");
    expect(shield.textureDef.url).toBe("/placeholder-shield.png");
  });

  it("updateAtlas with no atlas only replaces the url", () => {
    const version = makeCustomTextureVersion({
      id: "custom",
      label: "Custom",
      placeholderUrl: "/placeholder.png",
      standardWidth: 16,
      standardHeight: 16,
    });

    version.updateAtlas("/uploaded.png", null);

    expect(version.textureDef).toEqual<typeof version.textureDef>({
      id: "custom",
      url: "/uploaded.png",
      standardWidth: 16,
      standardHeight: 16,
    });
  });

  it("updateAtlas with an atlas replaces url, dimensions, and frames in place", () => {
    const version = makeCustomTextureVersion({
      id: "custom",
      label: "Custom",
      placeholderUrl: "/placeholder.png",
      standardWidth: 16,
      standardHeight: 16,
    });
    const originalFramesArray = version.frames;
    const atlas: Atlas = {
      atlasWidth: 32,
      atlasHeight: 16,
      frames: [
        {
          id: "first",
          label: "First",
          rectangle: [0, 0, 16, 16],
          crop: [2, 3, 12, 10],
        },
      ],
    };

    version.updateAtlas("/uploaded-atlas.png", atlas);

    expect(version.textureDef).toEqual<typeof version.textureDef>({
      id: "custom",
      url: "/uploaded-atlas.png",
      standardWidth: 32,
      standardHeight: 16,
    });
    expect(version.frames).toEqual<typeof version.frames>(atlas.frames);
    expect(version.frames).toBe(originalFramesArray);
  });
});
