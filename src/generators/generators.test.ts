import { describe, expect, it } from "vitest";
import { findAnyGeneratorById } from "./generators";

describe("findAnyGeneratorById", () => {
  it("resolves the example generator", () => {
    // The example generator is registered outside production; the test
    // environment is not production, so it resolves here. It now claims the
    // base `example` id (the retired v1 moved to `example-v1`).
    const found = findAnyGeneratorById("example");
    expect(found?.id).toBe("example");
    expect(found?.Component).toBeTypeOf("function");
  });

  it("exposes thumbnails for the migrated generators", () => {
    expect(findAnyGeneratorById("minecraft-character")?.thumbnail).toBeTruthy();
    expect(findAnyGeneratorById("minecraft-item")?.thumbnail).toBeTruthy();
  });

  it("returns null for an unknown id", () => {
    expect(findAnyGeneratorById("does-not-exist")).toBeNull();
  });
});
