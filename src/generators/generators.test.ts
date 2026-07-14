import { describe, expect, it } from "vitest";
import { findAnyGeneratorById } from "./generators";

describe("findAnyGeneratorById", () => {
  it("resolves an always-registered v1 generator tagged as v1", () => {
    const found = findAnyGeneratorById("minecraft-character");
    expect(found?.kind).toBe("v1");
    expect(found?.def.id).toBe("minecraft-character");
  });

  it("resolves the example v2 generator tagged as v2", () => {
    // example-v2 is registered outside production; the test environment is
    // not production, so it resolves here.
    const found = findAnyGeneratorById("example-v2");
    expect(found?.kind).toBe("v2");
    expect(found?.def.id).toBe("example-v2");
  });

  it("returns null for an unknown id", () => {
    expect(findAnyGeneratorById("does-not-exist")).toBeNull();
  });
});
