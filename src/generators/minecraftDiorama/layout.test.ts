import { describe, expect, it } from "vitest";
import {
  getDestinationColumnId,
  getDestinationRowId,
  getEdgeId,
  getFaceId,
  getSourceColumnId,
  getSourceRowId,
  makeEmptyDioramaDocument,
  setColumnWidth,
  setRowHeight,
  type DioramaDocument,
} from "./dioramaDocument";
import {
  getEdgeBoundaryLine,
  getFaceCellSize,
  getGridDimensions,
  getTotalRowsAcrossPages,
  makeBoundaryEdgeRegions,
  makeDestinationColumnHeaderRegions,
  makeDestinationRowHeaderRegions,
  makeEdgeRegions,
  makeFaceRegions,
  makeSourceColumnHeaderRegions,
  makeSourceRowHeaderRegions,
  type EdgeRegion,
  type FaceRegion,
  type HeaderRegion,
} from "./layout";

const a4PortraitPageWidth = 595;
const a4PortraitPageHeight = 842;

const fullBlocks = (): DioramaDocument =>
  makeEmptyDioramaDocument("Full Blocks");
const quarterBlocks = (): DioramaDocument =>
  makeEmptyDioramaDocument("Quarter Blocks");

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
        document: fullBlocks(),
      })
    ).toEqual<{ columns: number; rows: number }>({ columns: 4, rows: 6 });
  });

  it("fits a Quarter Blocks grid on an A4 portrait page", () => {
    expect(
      getGridDimensions({
        pageWidth: a4PortraitPageWidth,
        pageHeight: a4PortraitPageHeight,
        document: quarterBlocks(),
      })
    ).toEqual<{ columns: number; rows: number }>({ columns: 9, rows: 13 });
  });

  it("always fits at least one column and row, even on a tiny page", () => {
    expect(
      getGridDimensions({
        pageWidth: 1,
        pageHeight: 1,
        document: fullBlocks(),
      })
    ).toEqual<{ columns: number; rows: number }>({ columns: 1, rows: 1 });
  });

  it("fits fewer columns once one column is widened enough to displace a later default column", () => {
    // 4 default 128px columns normally sum to 512 (fits in the 595px page).
    // Widening column 0 to 28 units (224px) makes the running total 480
    // after 3 columns (224+128+128) but 608 after 4 (224+128+128+128) — the
    // 4th no longer fits, so only 3 columns fit instead of 4.
    const document = setColumnWidth(fullBlocks(), 0, 28);
    expect(
      getGridDimensions({
        pageWidth: a4PortraitPageWidth,
        pageHeight: a4PortraitPageHeight,
        document,
      })
    ).toEqual<{ columns: number; rows: number }>({ columns: 3, rows: 6 });
  });

  it("accounts for columnOffset/rowOffset when resolving each column/row's own size", () => {
    // Resizing world column 4 (not column 0) only matters once columnOffset
    // shifts local column 0 to reach it.
    const document = setColumnWidth(fullBlocks(), 4, 32);
    const atOffsetZero = getGridDimensions({
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });
    const atOffsetFour = getGridDimensions({
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
      columnOffset: 4,
    });
    expect(atOffsetZero.columns).toBe(4);
    expect(atOffsetFour.columns).toBe(3);
  });
});

describe("makeFaceRegions", () => {
  it("produces columns * rows regions", () => {
    const regions = makeFaceRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document: fullBlocks(),
    });
    expect(regions).toHaveLength(4 * 6);
  });

  it("lays out face ids and pixel regions in row-major cell order from the origin", () => {
    const regions = makeFaceRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document: fullBlocks(),
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
      document: fullBlocks(),
      columnOffset: 4,
      rowOffset: 6,
    });

    expect(regions[0]).toEqual<FaceRegion>({
      id: getFaceId(4, 6),
      region: [0, 0, 128, 128],
    });
  });

  it("gives a resized column/row its own pixel size and shifts every later column/row's offset to match", () => {
    const document = setRowHeight(setColumnWidth(fullBlocks(), 0, 24), 0, 24);
    const regions = makeFaceRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    // Column 0 / row 0 is now 192x192 (24 units * 8px) instead of 128x128.
    expect(regions[0]).toEqual<FaceRegion>({
      id: getFaceId(0, 0),
      region: [0, 0, 192, 192],
    });
    // Row 1 in column 0 starts right after row 0's new 192px height, but is
    // itself still the default 128px tall.
    expect(regions[1]).toEqual<FaceRegion>({
      id: getFaceId(0, 1),
      region: [0, 192, 192, 128],
    });
    // Column 1 starts right after column 0's new 192px width.
    const column1Row0 = regions.find(({ id }) => id === getFaceId(1, 0));
    expect(column1Row0).toEqual<FaceRegion>({
      id: getFaceId(1, 0),
      region: [192, 0, 128, 192],
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
      document: fullBlocks(),
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
      document: fullBlocks(),
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

  it("scales North/South thickness with the face's row height and East/West thickness with its column width", () => {
    const document = setRowHeight(setColumnWidth(fullBlocks(), 0, 32), 0, 32);
    const regions = makeEdgeRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    // Face (0,0) is now 256x256 (32 units * 8px); its North thickness scales
    // with its own 256px height (256/4 = 64), not the default 32.
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("North", 0, 0),
      orientation: "South",
      region: [0, 0, 256, 64],
    });
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("East", 0, 0),
      orientation: "East",
      region: [0, 0, 64, 256],
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
      document: fullBlocks(),
    });
    expect(regions).toHaveLength(2 * (4 + 6));
  });

  it("positions a flap in the page margin just outside the grid on each side", () => {
    const regions = makeBoundaryEdgeRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document: fullBlocks(),
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
      document: fullBlocks(),
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
      document: fullBlocks(),
    };
    const faceEdgeIds = makeEdgeRegions(options).map(({ id }) => id);
    const boundaryEdgeIds = makeBoundaryEdgeRegions(options).map(
      ({ id }) => id
    );
    const allIds = new Set([...faceEdgeIds, ...boundaryEdgeIds]);

    expect(allIds.size).toBe(faceEdgeIds.length + boundaryEdgeIds.length);
  });

  it("reuses row 0's/column 0's own thickness for the North/West flaps when they're resized, since there's no row/column beyond the edge to derive it from", () => {
    const document = setRowHeight(setColumnWidth(fullBlocks(), 0, 32), 0, 32);
    const regions = makeBoundaryEdgeRegions({
      originX: 0,
      originY: 0,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    // Row 0 is now 256px tall, so its North flap's thickness is 256/4 = 64.
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("North", 0, -1),
      orientation: "North",
      region: [0, -64, 256, 64],
    });
    // Column 0 is now 256px wide, so its West flap's thickness is 64 too.
    expect(regions).toContainEqual<EdgeRegion>({
      id: getEdgeId("West", -1, 0),
      orientation: "West",
      region: [-64, 0, 64, 256],
    });
  });
});

describe("makeSourceColumnHeaderRegions", () => {
  it("produces one band per column, positioned in the margin above the grid", () => {
    const regions = makeSourceColumnHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document: fullBlocks(),
    });

    expect(regions).toHaveLength(4);
    expect(regions[0]).toEqual<HeaderRegion>({
      id: getSourceColumnId(0),
      region: [10, 20 - 32, 128, 32],
    });
    expect(regions[1]).toEqual<HeaderRegion>({
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
      document: fullBlocks(),
      columnOffset: 4,
    });

    expect(regions[0]).toEqual<HeaderRegion>({
      id: getSourceColumnId(4),
      region: [0, -32, 128, 32],
    });
  });

  it("keeps its own thickness fixed even when the column it targets is resized wider", () => {
    // A widened column 0 changes the band's *width* (tracking the column),
    // but must not also change its *thickness* (region[3]) — the thickness
    // must stay the preset default (32), not derive from the column's own
    // resized width, or a Destination-mode width click would grow this
    // band's own height as an unwanted side effect.
    const document = setColumnWidth(fullBlocks(), 0, 32);
    const regions = makeSourceColumnHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    expect(regions[0]).toEqual<HeaderRegion>({
      id: getSourceColumnId(0),
      region: [10, 20 - 32, 256, 32],
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
      document: fullBlocks(),
    });

    expect(regions).toHaveLength(6);
    expect(regions[0]).toEqual<HeaderRegion>({
      id: getSourceRowId(0),
      region: [10 - 32, 20, 32, 128],
    });
    expect(regions[1]).toEqual<HeaderRegion>({
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
      document: fullBlocks(),
      rowOffset: 6,
    });

    expect(regions[0]).toEqual<HeaderRegion>({
      id: getSourceRowId(6),
      region: [-32, 0, 32, 128],
    });
  });

  it("keeps its own thickness fixed even when the row it targets is resized taller", () => {
    const document = setRowHeight(fullBlocks(), 0, 32);
    const regions = makeSourceRowHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    expect(regions[0]).toEqual<HeaderRegion>({
      id: getSourceRowId(0),
      region: [10 - 32, 20, 32, 256],
    });
  });
});

describe("makeDestinationColumnHeaderRegions / makeDestinationRowHeaderRegions", () => {
  it("use the same placement as the Source header bands, but a distinct id namespace", () => {
    const document = fullBlocks();
    const columnRegions = makeDestinationColumnHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });
    const rowRegions = makeDestinationRowHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    expect(columnRegions[0]).toEqual<HeaderRegion>({
      id: getDestinationColumnId(0),
      region: [10, 20 - 32, 128, 32],
    });
    expect(rowRegions[0]).toEqual<HeaderRegion>({
      id: getDestinationRowId(0),
      region: [10 - 32, 20, 32, 128],
    });
  });

  it("never collides with the Source header bands' own ids", () => {
    const options = {
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document: fullBlocks(),
    };
    const sourceIds = [
      ...makeSourceColumnHeaderRegions(options),
      ...makeSourceRowHeaderRegions(options),
    ].map(({ id }) => id);
    const destinationIds = [
      ...makeDestinationColumnHeaderRegions(options),
      ...makeDestinationRowHeaderRegions(options),
    ].map(({ id }) => id);

    const allIds = new Set([...sourceIds, ...destinationIds]);
    expect(allIds.size).toBe(sourceIds.length + destinationIds.length);
  });

  it("keeps each band's own thickness fixed even when the column/row it targets is resized — this is the exact control a Destination-mode click drives", () => {
    // Resizing column 0 wider must not also grow its own header band's
    // thickness (region[3] stays 32, not width/4); same for row 0's height
    // and its row header's thickness (region[2]).
    const document = setRowHeight(setColumnWidth(fullBlocks(), 0, 32), 0, 32);
    const columnRegions = makeDestinationColumnHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });
    const rowRegions = makeDestinationRowHeaderRegions({
      originX: 10,
      originY: 20,
      pageWidth: a4PortraitPageWidth,
      pageHeight: a4PortraitPageHeight,
      document,
    });

    expect(columnRegions[0]).toEqual<HeaderRegion>({
      id: getDestinationColumnId(0),
      region: [10, 20 - 32, 256, 32],
    });
    expect(rowRegions[0]).toEqual<HeaderRegion>({
      id: getDestinationRowId(0),
      region: [10 - 32, 20, 32, 256],
    });
  });
});

describe("getTotalRowsAcrossPages", () => {
  it("multiplies rows-per-page by pageCount when every row is the default size", () => {
    expect(
      getTotalRowsAcrossPages({
        pageWidth: a4PortraitPageWidth,
        pageHeight: a4PortraitPageHeight,
        document: fullBlocks(),
        pageCount: 3,
      })
    ).toBe(6 * 3);
  });

  it("accounts for a resized row changing how many rows fit on its own page", () => {
    // Row 0 at 48 units (384px) leaves only 458px for page 1's other rows —
    // 3 more 128px rows (384px) fit, a 4th would need 512px. Page 1 holds 4
    // rows total (1 resized + 3 default) instead of the usual 6, so pages 2+
    // start later than a naive pageIndex * 6 would assume.
    const document = setRowHeight(fullBlocks(), 0, 48);
    expect(
      getTotalRowsAcrossPages({
        pageWidth: a4PortraitPageWidth,
        pageHeight: a4PortraitPageHeight,
        document,
        pageCount: 2,
      })
    ).toBe(4 + 6);
  });
});
