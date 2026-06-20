import { describe, expect, it } from "vitest";
import { clampSourceToBounds } from "./source";

describe("diorama source edit helpers", () => {
  it("keeps source regions in normalized 16px face units", () => {
    expect(clampSourceToBounds([8, 0, 8, 16])).toEqual([8, 0, 8, 16]);
  });

  it("clamps source regions to the normalized source bounds", () => {
    expect(clampSourceToBounds([31.75, 15.75, 16, 16])).toEqual([
      15.5,
      15.5,
      0.5,
      0.5,
    ]);
  });
});
