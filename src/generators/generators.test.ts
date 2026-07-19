import { describe, expect, it } from "vitest";
import { findAnyGeneratorById } from "./generators";

describe("findAnyGeneratorById", () => {
  it("resolves a legacy v1 generator tagged as v1", () => {
    // Retired v1 generators live in the dev-only `legacy` group and are served
    // at a `-v1` id so they no longer collide with their promoted v2. The test
    // environment is not production, so legacy resolves here.
    const found = findAnyGeneratorById("minecraft-character-v1");
    expect(found?.kind).toBe("v1");
    expect(found?.def.id).toBe("minecraft-character-v1");
  });

  it("resolves the example v2 generator tagged as v2", () => {
    // example-v2 is registered outside production; the test environment is
    // not production, so it resolves here.
    const found = findAnyGeneratorById("example-v2");
    expect(found?.kind).toBe("v2");
    expect(found?.def.id).toBe("example-v2");
  });

  it("exposes thumbnails for the migrated v2 generators", () => {
    expect(
      findAnyGeneratorById("minecraft-character-v2")?.def.thumbnail
    ).toBeTruthy();
    expect(
      findAnyGeneratorById("minecraft-item-v2")?.def.thumbnail
    ).toBeTruthy();
  });

  it("returns null for an unknown id", () => {
    expect(findAnyGeneratorById("does-not-exist")).toBeNull();
  });
});
