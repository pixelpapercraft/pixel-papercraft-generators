import { describe, expect, it } from "vitest";
import { blockTextureVersions, itemTextureVersions } from "./textureVersions";

describe("texture versions", () => {
  it("collects the regenerated shared minecraft texture sources", () => {
    expect(itemTextureVersions.map(({ textureDef }) => textureDef.id)).toEqual([
      "minecraft-1.7.10-items",
      "minecraft-1.13.2-items",
      "minecraft-26.1.2-items",
    ]);
    expect(blockTextureVersions.map(({ textureDef }) => textureDef.id)).toEqual(
      [
        "minecraft-1.7.10-blocks",
        "minecraft-1.13.2-blocks",
        "minecraft-26.1.2-blocks",
      ]
    );
  });
});
