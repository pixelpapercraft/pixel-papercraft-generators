import { describe, expect, it } from "vitest";
import { textureDefs, textureVersionIds } from "./textureVersions";

describe("minecraft block texture versions", () => {
  it("lists block textures before item textures", () => {
    expect(textureDefs).toHaveLength(7);
    expect(textureVersionIds).toEqual([
      "minecraft-26.1.2-blocks",
      "minecraft-1.13.2-blocks",
      "minecraft-1.7.10-blocks",
      "minecraft-26.1.2-items",
      "minecraft-1.13.2-items",
      "minecraft-1.7.10-items",
      "custom",
    ]);
  });
});
