import { describe, expect, it } from "vitest";
import {
  blockTextureVersions,
  findVersion,
  itemTextureVersions,
  versionIdsBlocksFirst,
  versionIdsItemsFirst,
} from "./textureVersions";

describe("texture versions", () => {
  it("collects the regenerated shared minecraft texture sources", () => {
    expect(itemTextureVersions.map(({ textureDef }) => textureDef.id)).toEqual([
      "minecraft-1.7.10-items",
      "minecraft-1.13.2-items",
      "minecraft-26.2-items",
    ]);
    expect(blockTextureVersions.map(({ textureDef }) => textureDef.id)).toEqual(
      [
        "minecraft-1.7.10-blocks",
        "minecraft-1.13.2-blocks",
        "minecraft-26.2-blocks",
      ]
    );
  });

  it("orders version ids for block-first and item-first pickers", () => {
    expect(versionIdsBlocksFirst[0]).toBe("minecraft-26.2-blocks");
    expect(versionIdsItemsFirst[0]).toBe("minecraft-26.2-items");
    expect(versionIdsBlocksFirst.at(-1)).toBe("custom");
    expect(versionIdsItemsFirst.at(-1)).toBe("custom");
  });

  it("finds versions by id and exposes cropped frames", () => {
    const version = findVersion("minecraft-26.2-items");

    expect(version?.textureDef.id).toBe("minecraft-26.2-items");
    expect(version?.frames[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
        rectangle: expect.any(Array),
        crop: expect.any(Array),
      })
    );
    expect(findVersion("missing")).toBeNull();
  });
});
