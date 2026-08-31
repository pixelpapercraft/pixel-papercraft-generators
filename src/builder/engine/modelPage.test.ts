import { describe, expect, it } from "vitest";
import { A4, pxToMm, swapPageSize } from "./modelPage";

describe("pxToMm", () => {
  it("converts A4's own px width/height to its known mm size", () => {
    expect(pxToMm(A4.px.width)).toBeCloseTo(A4.mm.width, 0);
    expect(pxToMm(A4.px.height)).toBeCloseTo(A4.mm.height, 0);
  });

  it("scales linearly", () => {
    expect(pxToMm(72)).toBeCloseTo(25.4, 5);
    expect(pxToMm(0)).toBe(0);
  });
});

describe("swapPageSize", () => {
  it("swaps width and height", () => {
    expect(swapPageSize({ width: 595, height: 842 })).toEqual({
      width: 842,
      height: 595,
    });
  });

  it("round-trips back to the original", () => {
    const size = { width: 100, height: 50 };
    expect(swapPageSize(swapPageSize(size))).toEqual(size);
  });
});
