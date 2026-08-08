import { describe, expect, it } from "vitest";
import {
  getEdgeId,
  getFaceId,
  getSourceColumnId,
  getSourceRowId,
} from "./dioramaDocument";
import {
  getEdgeBoundaryLine,
  getFaceCellSize,
  getGridDimensions,
  makeBoundaryEdgeRegions,
  makeEdgeRegions,
  makeFaceRegions,
  makeSourceColumnHeaderRegions,
  makeSourceRowHeaderRegions,
  type EdgeRegion,
  type FaceRegion,
  type SourceHeaderRegion,
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

describe("makeEdgeRegions", () => {
  it("gives North/South strips the orientation whose drawTab fold lands on the true face-boundary edge, not the strip's own compass name", () => {
    const regions = makeEdgeRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });

    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("North", 0, 0),
      orientation: "South",
      region: [10, 20, 128, 32],
    });
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("South", 0, 0),
      orientation: "North",
      region: [10, 20 + 128 - 32, 128, 32],
    });
  });

  it("leaves East/West strips as an identity orientation mapping", () => {
    const regions = makeEdgeRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });

    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("East", 0, 0),
      orientation: "East",
      region: [10, 20, 32, 128],
    });
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("West", 0, 0),
      orientation: "West",
      region: [10 + 128 - 32, 20, 32, 128],
    });
  });
});

describe("getEdgeBoundaryLine", () => {
  const region: [number, number, number, number] = [10, 20, 100, 40];

  it("puts North's fold at the bottom of the region, matching drawTab.ts's drawTabNorth", () => {
    expect(getEdgeBoundaryLine("North", region)).toEqual([
      [10, 60],
      [110, 60],
    ]);
  });

  it("puts South's fold at the top of the region, matching drawTab.ts's drawTabSouth", () => {
    expect(getEdgeBoundaryLine("South", region)).toEqual([
      [10, 20],
      [110, 20],
    ]);
  });

  it("leaves East/West unchanged (left/right lines)", () => {
    expect(getEdgeBoundaryLine("East", region)).toEqual([
      [10, 20],
      [10, 60],
    ]);
    expect(getEdgeBoundaryLine("West", region)).toEqual([
      [110, 20],
      [110, 60],
    ]);
  });
});

describe("makeBoundaryEdgeRegions", () => {
  it("produces 2 * (columns + rows) regions", () => {
    const regions = makeBoundaryEdgeRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });
    expect(regions).toHaveLength(2 * (4 + 6));
  });

  it("positions a flap in the page margin just outside the grid on each side", () => {
    const regions = makeBoundaryEdgeRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });

    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("North", 0, -1),
      orientation: "North",
      region: [10, 20 - 32, 128, 32],
    });
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("South", 0, 6),
      orientation: "South",
      region: [10, 20 + 6 * 128, 128, 32],
    });
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("West", -1, 0),
      orientation: "West",
      region: [10 - 32, 20, 32, 128],
    });
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("East", 4, 0),
      orientation: "East",
      region: [10 + 4 * 128, 20, 32, 128],
    });
  });

  it("offsets ids by columnOffset/rowOffset without moving pixel regions", () => {
    const regions = makeBoundaryEdgeRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
      columnOffset: 4,
      rowOffset: 6,
    });

    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("North", 4, 5),
      orientation: "North",
      region: [0, -32, 128, 32],
    });
  });

  it("never collides with makeEdgeRegions' own per-face edge ids", () => {
    const options = {
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks" as const,
    };
    const faceEdgeIds = makeEdgeRegions(options).map(({ id }) => id);
    const boundaryEdgeIds = makeBoundaryEdgeRegions(options).map(
      ({ id }) => id
    );
    const allIds = new Set([...faceEdgeIds, ...boundaryEdgeIds]);

    expect(allIds.size).toBe(faceEdgeIds.length + boundaryEdgeIds.length);
  });
});

describe("makeSourceColumnHeaderRegions", () => {
  it("produces one band per column, positioned in the margin above the grid", () => {
    const regions = makeSourceColumnHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });

    expect(regions).toHaveLength(4);
    expect(regions[0]).toEqual<SourceHeaderRegion>({
      id: getSourceColumnId(0),
      region: [10, 20 - 32, 128, 32],
    });
    expect(regions[1]).toEqual<SourceHeaderRegion>({
      id: getSourceColumnId(1),
      region: [10 + 128, 20 - 32, 128, 32],
    });
  });

  it("offsets ids by columnOffset without moving pixel regions", () => {
    const regions = makeSourceColumnHeaderRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
      columnOffset: 4,
    });

    expect(regions[0]).toEqual<SourceHeaderRegion>({
      id: getSourceColumnId(4),
      region: [0, -32, 128, 32],
    });
  });
});

describe("makeSourceRowHeaderRegions", () => {
  it("produces one band per row, positioned in the margin left of the grid", () => {
    const regions = makeSourceRowHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
    });

    expect(regions).toHaveLength(6);
    expect(regions[0]).toEqual<SourceHeaderRegion>({
      id: getSourceRowId(0),
      region: [10 - 32, 20, 32, 128],
    });
    expect(regions[1]).toEqual<SourceHeaderRegion>({
      id: getSourceRowId(1),
      region: [10 - 32, 20 + 128, 32, 128],
    });
  });

  it("offsets ids by rowOffset without moving pixel regions", () => {
    const regions = makeSourceRowHeaderRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      preset: "Full Blocks",
      rowOffset: 6,
    });

    expect(regions[0]).toEqual<SourceHeaderRegion>({
      id: getSourceRowId(6),
      region: [-32, 0, 32, 128],
    });
  });
});
