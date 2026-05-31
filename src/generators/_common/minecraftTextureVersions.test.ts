import { describe, expect, it } from "vitest";
import {
  minecraftTextureVersionDefinitions,
  minecraftTextureVersionDefinitionsBlocksFirst,
  minecraftTextureVersionDefinitionsItemsFirst,
} from "./minecraftTextureVersions";

describe("minecraft texture version definitions", () => {
  it("collects the shared minecraft block and item texture sources", () => {
    expect(minecraftTextureVersionDefinitions).toHaveLength(6);
    expect(minecraftTextureVersionDefinitions[0]?.[0].textureDef.id).toBe(
      "minecraft-1.7.10-items"
    );
    expect(minecraftTextureVersionDefinitions.at(-1)?.[0].textureDef.id).toBe(
      "minecraft-26.1.2-blocks"
    );
  });

  it("keeps block-first and item-first ordering available for the legacy wrappers", () => {
    expect(minecraftTextureVersionDefinitionsBlocksFirst[0]?.[0].textureDef.id).toBe(
      "minecraft-1.7.10-items"
    );
    expect(minecraftTextureVersionDefinitionsItemsFirst[0]?.[0].textureDef.id).toBe(
      "minecraft-1.7.10-blocks"
    );
  });
});
