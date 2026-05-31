import { describe, expect, it } from "vitest";
import { makeNextRotation, rotationToDegrees } from "./rotation";

describe("makeNextRotation", () => {
  it("advances through the four quarter-turn states", () => {
    expect(makeNextRotation("Rot0")).toBe("Rot90");
    expect(makeNextRotation("Rot90")).toBe("Rot180");
    expect(makeNextRotation("Rot180")).toBe("Rot270");
    expect(makeNextRotation("Rot270")).toBe("Rot0");
  });
});

describe("rotationToDegrees", () => {
  it("maps each quarter-turn state to degrees", () => {
    expect(rotationToDegrees("Rot0")).toBe(0);
    expect(rotationToDegrees("Rot90")).toBe(90);
    expect(rotationToDegrees("Rot180")).toBe(180);
    expect(rotationToDegrees("Rot270")).toBe(270);
  });
});
