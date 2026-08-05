import { describe, expect, it } from "vitest";
import { getFaceId } from "./dioramaDocument";
import {
  getFaceCellSize,
  getGridDimensions,
  makeFaceRegions,
  type FaceRegion,
} from "./layout";

const a4PortraitPageWidth = 595;
const a4PortraitPageHeight = 842;

describe("getFaceCellSize", () => {
  it("is 128px for Full Blocks (16 Minecraft units at 8px/unit)", () => {
    expect(getFaceCellSize("Full Blocks")).toBe(128);
  });

  it("is 64px for Quarter Blocks (8 Minecraft units at 8px/unit)", () => {
    expect(getFaceCellSize("Quarter Blocks")).toBe(64);
  });
});

describe("getGridDimensions", () => {
  it("fits a Full Blocks grid on an A4 portrait page", () => {
    expect(
      getGridDimensions({
        pageWidth: a4PortraitPageWidth,
        pageHeight: a4PortraitPageHeight,
        preset: "Full Blocks",
      })
    ).toEqual<{ columns: number; rows: number }>({ columns: 4, rows: 6 });
  });

  it("fits a Quarter Blocks grid on an A4 portrait page", () => {
    expect(
      getGridDimensions({
        pageWidth: a4PortraitPageWidth,
        pageHeight: a4PortraitPageHeight,
        preset: "Quarter Blocks",
      })
    ).toEqual<{ columns: number; rows: number }>({ columns: 9, rows: 13 });
  });

  it("always fits at least one column and row, even on a tiny page", () => {
    expect(
      getGridDimensions({ pageWidth: 1, pageHeight: 1, preset: "Full Blocks" })
    ).toEqual<{ columns: number; rows: number }>({ columns: 1, rows: 1 });
  });
});

describe("makeFaceRegions", () => {
  it("produces columns * rows regions", () => {
    const regions = makeFaceRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });
    expect(regions).toHaveLength(4 * 6);
  });

  it("lays out face ids and pixel regions in row-major cell order from the origin", () => {
    const regions = makeFaceRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });

    expect(regions[0]).toEqual<FaceRegion>({
      id: getFaceId(0, 0),
      region: [10, 20, 128, 128],
    });
    expect(regions[1]).toEqual<FaceRegion>({
      id: getFaceId(0, 1),
      region: [10, 148, 128, 128],
    });
    expect(regions[6]).toEqual<FaceRegion>({
      id: getFaceId(1, 0),
      region: [138, 20, 128, 128],
    });
  });

  it("offsets face ids by columnOffset/rowOffset without moving pixel regions", () => {
    const regions = makeFaceRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
      columnOffset: 4,
      rowOffset: 6,
    });

    expect(regions[0]).toEqual<FaceRegion>({
      id: getFaceId(4, 6),
      region: [0, 0, 128, 128],
    });
  });
});
