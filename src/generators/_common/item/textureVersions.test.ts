import { describe, expect, it } from "vitest";
import { allTextureDefs, versionIds } from "./textureVersions";

describe("minecraft item texture versions", () => {
  it("includes the shared picker textures", () => {
    expect(allTextureDefs).toHaveLength(7);
    expect(versionIds).toEqual([
      "minecraft-26.1.2-items",
      "minecraft-1.13.2-items",
      "minecraft-1.7.10-items",
      "minecraft-26.1.2-blocks",
      "minecraft-1.13.2-blocks",
      "minecraft-1.7.10-blocks",
      "custom",
    ]);
  });
});
