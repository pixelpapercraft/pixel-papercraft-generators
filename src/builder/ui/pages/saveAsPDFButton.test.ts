import { describe, expect, it } from "vitest";
import { A4, swapPageSize } from "@genroot/builder/engine/modelPage";
import { getPdfPageSpec } from "./saveAsPDFButton";

describe("getPdfPageSpec", () => {
  it("derives a portrait spec from a portrait-shaped page", () => {
    const spec = getPdfPageSpec(A4.px);
    expect(spec.orientation).toBe("portrait");
    expect(spec.format[0]).toBeCloseTo(A4.mm.width, 0);
    expect(spec.format[1]).toBeCloseTo(A4.mm.height, 0);
  });

  it("derives a landscape spec from a landscape-shaped page", () => {
    const spec = getPdfPageSpec(swapPageSize(A4.px));
    expect(spec.orientation).toBe("landscape");
    expect(spec.format[0]).toBeCloseTo(A4.mm.height, 0);
    expect(spec.format[1]).toBeCloseTo(A4.mm.width, 0);
  });
});
