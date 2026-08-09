import { describe, expect, it } from "vitest";
import { A4, swapPageSize } from "@genroot/builder/engine/modelPage";
import { getPrintPageSizeMm, getPrintStyles } from "./printImageButton";

describe("getPrintPageSizeMm", () => {
  it("converts a portrait page's own px size to mm", () => {
    const size = getPrintPageSizeMm(A4.px);
    expect(size.width).toBeCloseTo(A4.mm.width, 0);
    expect(size.height).toBeCloseTo(A4.mm.height, 0);
  });

  it("converts a landscape page's own px size to mm", () => {
    const size = getPrintPageSizeMm(swapPageSize(A4.px));
    expect(size.width).toBeCloseTo(A4.mm.height, 0);
    expect(size.height).toBeCloseTo(A4.mm.width, 0);
  });
});

function extractPageSizeMm(styles: string): [number, number] {
  const match = styles.match(/@page\s*\{\s*size:\s*([\d.]+)mm\s+([\d.]+)mm;/);
  if (!match || !match[1] || !match[2]) {
    throw new Error("No @page size rule found in print styles");
  }
  return [Number(match[1]), Number(match[2])];
}

describe("getPrintStyles", () => {
  it("declares an @page size matching a portrait page's own mm size", () => {
    const [width, height] = extractPageSizeMm(getPrintStyles(A4.px));
    expect(width).toBeCloseTo(A4.mm.width, 0);
    expect(height).toBeCloseTo(A4.mm.height, 0);
  });

  it("declares an @page size matching a landscape page's own mm size — the missing rule that let a landscape page overflow onto a second printed sheet", () => {
    const [width, height] = extractPageSizeMm(
      getPrintStyles(swapPageSize(A4.px))
    );
    expect(width).toBeCloseTo(A4.mm.height, 0);
    expect(height).toBeCloseTo(A4.mm.width, 0);
  });
});
