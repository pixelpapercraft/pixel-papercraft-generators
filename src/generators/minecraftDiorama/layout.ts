import {
  getColumnWidth,
  getDestinationColumnId,
  getDestinationRowId,
  getEdgeId,
  getFaceId,
  getRowHeight,
  getSourceColumnId,
  getSourceRowId,
  getSplitColumnId,
  getSplitFaceId,
  getSplitPageId,
  getSplitRowId,
  getTransformColumnId,
  getTransformRowId,
  getWorldUnitsForPreset,
  splitParts,
  type BlockPreset,
  type DioramaDocument,
  type EdgeDirection,
  type EdgeId,
  type FaceId,
  type SplitSize,
} from "./dioramaDocument";

export type FaceRegion = {
  id: FaceId;
  region: [number, number, number, number];
};

export type EdgeRegion = {
  id: EdgeId;
  region: [number, number, number, number];
  // The clickable/hoverable area for this edge — usually identical to
  // `region`, but shrunk for a split part's own edges (see
  // `makeEdgeRegions`), where `region`'s own thickness is fixed to the
  // whole (unsplit) cell size and so can cover most or all of a much
  // smaller part, leaving neighboring edges unclickable.
  controlRegion: [number, number, number, number];
  orientation: EdgeDirection;
};

export const pixelsPerMinecraftUnit = 8;

// The pixel size of a column/row that hasn't been resized — still useful as
// a default/reference size even though `makeFaceRegions` etc. now compute
// each column/row's actual size individually via `getColumnWidthPixels`/
// `getRowHeightPixels`.
export function getFaceCellSize(preset: BlockPreset): number {
  return getWorldUnitsForPreset(preset) * pixelsPerMinecraftUnit;
}

function unitsToPixels(units: number): number {
  return Math.max(
    pixelsPerMinecraftUnit,
    Math.round(units * pixelsPerMinecraftUnit)
  );
}

export function getColumnWidthPixels(
  document: DioramaDocument,
  column: number
): number {
  return unitsToPixels(getColumnWidth(document, column));
}

export function getRowHeightPixels(
  document: DioramaDocument,
  row: number
): number {
  return unitsToPixels(getRowHeight(document, row));
}

function makeOffsets(sizes: number[]): number[] {
  const offsets: number[] = [];
  let offset = 0;
  sizes.forEach((size) => {
    offsets.push(offset);
    offset += size;
  });
  return offsets;
}

function getTotalSize(sizes: number[]): number {
  return sizes.reduce((total, size) => total + size, 0);
}

function countThatFits(
  availableSize: number,
  getSize: (index: number) => number
): number {
  let count = 0;
  let usedSize = 0;

  while (usedSize < availableSize) {
    const nextSize = getSize(count);
    if (usedSize + nextSize > availableSize) {
      break;
    }
    usedSize += nextSize;
    count += 1;
  }

  return Math.max(1, count);
}

// How many columns/rows fit in the given pixel area, walking each one's
// actual (possibly resized) pixel size in turn rather than dividing by a
// single uniform cell size — a resized column/row changes how many more fit
// after it.
export function getGridDimensions({
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
  rowOffset = 0,
}: {
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
  rowOffset?: number;
}): { columns: number; rows: number } {
  return {
    columns: countThatFits(pageWidth, (column) =>
      getColumnWidthPixels(document, column + columnOffset)
    ),
    rows: countThatFits(pageHeight, (row) =>
      getRowHeightPixels(document, row + rowOffset)
    ),
  };
}

function makeColumnWidths({
  document,
  columns,
  columnOffset,
}: {
  document: DioramaDocument;
  columns: number;
  columnOffset: number;
}): number[] {
  return Array.from({ length: columns }, (_, column) =>
    getColumnWidthPixels(document, column + columnOffset)
  );
}

function makeRowHeights({
  document,
  rows,
  rowOffset,
}: {
  document: DioramaDocument;
  rows: number;
  rowOffset: number;
}): number[] {
  return Array.from({ length: rows }, (_, row) =>
    getRowHeightPixels(document, row + rowOffset)
  );
}

export function makeFaceRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
  rowOffset?: number;
}): FaceRegion[] {
  const { columns, rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
    rowOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const rowOffsetsPx = makeOffsets(rowHeights);
  const regions: FaceRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      regions.push({
        id: getFaceId(column + columnOffset, row + rowOffset),
        region: [
          originX + (columnOffsetsPx[column] ?? 0),
          originY + (rowOffsetsPx[row] ?? 0),
          columnWidths[column] ?? pixelsPerMinecraftUnit,
          rowHeights[row] ?? pixelsPerMinecraftUnit,
        ],
      });
    }
  }

  return regions;
}

// The 4 sub-rectangles a split face's own region divides into — pure
// geometry, mirroring the `pr-34-original` reference's `makeSplitBlockRegions`
// math. `split.width`/`split.height` are always expressed out of a fixed
// 16-unit grid (matching Source's own 0-16 convention), regardless of the
// face's actual preset/resize, so the same fraction gives the correct split
// point at any pixel size.
const splitUnitGridSize = 16;

export function makeSplitPartRegions(
  [x, y, width, height]: [number, number, number, number],
  split: SplitSize
): Record<"A" | "B" | "C" | "D", [number, number, number, number]> {
  const leftWidth = (width * split.width) / splitUnitGridSize;
  const rightWidth = width - leftWidth;
  const topHeight = (height * split.height) / splitUnitGridSize;
  const bottomHeight = height - topHeight;

  return {
    A: [x, y, leftWidth, topHeight],
    B: [x + leftWidth, y, rightWidth, topHeight],
    C: [x, y + topHeight, leftWidth, bottomHeight],
    D: [x + leftWidth, y + topHeight, rightWidth, bottomHeight],
  };
}

// Same face-grid iteration as `makeFaceRegions`, but a face with a `splits`
// entry contributes its 4 part sub-regions (own ids via `getSplitFaceId`)
// instead of one whole-face region. Used for Blocks/Source/Transform/Split
// mode and the texture-drawing loop, all of which must address a split
// face's parts individually; `makeFaceRegions` itself is left untouched and
// keeps serving Destination mode, which always resizes the whole column/row
// regardless of split state.
export function makeBlockFaceRegions(params: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
  rowOffset?: number;
}): FaceRegion[] {
  return makeFaceRegions(params).flatMap(({ id: baseFaceId, region }) => {
    const split = params.document.splits[baseFaceId];
    if (!split) {
      return [{ id: baseFaceId, region }];
    }

    const parts = makeSplitPartRegions(region, split);
    return splitParts.map((part) => ({
      id: getSplitFaceId(baseFaceId, part),
      region: parts[part],
    }));
  });
}

export function getEdgeThickness(size: number): number {
  return size / 4;
}

// A face's own North/South/East/West edge strips, one set per face rather
// than one shared strip per boundary — matching the `pr-34-original`
// reference's per-face `EdgeId` convention that `dioramaDocument.ts`'s
// `getEdgeId` already follows. Two adjacent faces' facing edges (e.g. one
// face's South and the next row's North) sit right on the same boundary
// line but stay independently addressable. Thickness (a tab/fold's own
// protrusion depth) is fixed to the preset's default cell size, not the
// face's own (possibly resized) column width/row height — a resized column/
// row must still make the *span* of its own edges longer (below), but its
// tab/fold depth shouldn't also grow, mirroring the same fix applied to the
// Source/Destination header bands' own thickness.
export function makeEdgeRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
  rowOffset?: number;
}): EdgeRegion[] {
  const { columns, rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
    rowOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const rowOffsetsPx = makeOffsets(rowHeights);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: EdgeRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const x = originX + (columnOffsetsPx[column] ?? 0);
      const y = originY + (rowOffsetsPx[row] ?? 0);
      const width = columnWidths[column] ?? pixelsPerMinecraftUnit;
      const height = rowHeights[row] ?? pixelsPerMinecraftUnit;
      const faceColumn = column + columnOffset;
      const faceRow = row + rowOffset;
      const split = document.splits[getFaceId(faceColumn, faceRow)];

      // North/South's drawTab orientation is swapped relative to the
      // strip's own position: drawTab's "North" puts its fold at the bottom
      // of the rectangle it's given, "South" puts it at the top. The fold
      // needs to land on each strip's true face-boundary edge (touching the
      // neighboring face, not the strip's own face interior) — matching the
      // reference's own rotation-derived orientation (rotation 2 on the
      // North-id region, rotation 0 on the South-id region), confirmed by
      // pixel-sampling both apps' rendered tabs. East/West need no such
      // swap. A split face gets this same quad once per part, over that
      // part's own sub-rectangle, rather than once over the whole face —
      // matching the reference's own tab availability on all 4 of a part's
      // sides, including its 2 internal seams shared with a sibling part
      // (confirmed by driving the reference directly: 4 seam tabs fold
      // inward to a shared X at the part's own center, a deliberate-looking
      // pattern for framing a cut-out hole rather than a rendering bug).
      if (split) {
        const parts = makeSplitPartRegions([x, y, width, height], split);
        splitParts.forEach((part) => {
          const [partX, partY, partWidth, partHeight] = parts[part];
          // The click/hover area uses a thickness derived from this part's
          // own (much smaller) size rather than the fixed whole-cell
          // `thickness` used for drawing — otherwise a part's own
          // perpendicular edges (e.g. North and East) can fully overlap
          // each other, permanently hiding whichever renders first in the
          // DOM. Matches the reference's own separate, smaller click
          // region for split parts.
          const controlThicknessX = getEdgeThickness(partWidth);
          const controlThicknessY = getEdgeThickness(partHeight);
          regions.push(
            {
              id: getEdgeId("North", faceColumn, faceRow, part),
              orientation: "South",
              region: [partX, partY, partWidth, thickness],
              controlRegion: [partX, partY, partWidth, controlThicknessY],
            },
            {
              id: getEdgeId("South", faceColumn, faceRow, part),
              orientation: "North",
              region: [
                partX,
                partY + partHeight - thickness,
                partWidth,
                thickness,
              ],
              controlRegion: [
                partX,
                partY + partHeight - controlThicknessY,
                partWidth,
                controlThicknessY,
              ],
            },
            {
              id: getEdgeId("East", faceColumn, faceRow, part),
              orientation: "East",
              region: [partX, partY, thickness, partHeight],
              controlRegion: [partX, partY, controlThicknessX, partHeight],
            },
            {
              id: getEdgeId("West", faceColumn, faceRow, part),
              orientation: "West",
              region: [
                partX + partWidth - thickness,
                partY,
                thickness,
                partHeight,
              ],
              controlRegion: [
                partX + partWidth - controlThicknessX,
                partY,
                controlThicknessX,
                partHeight,
              ],
            }
          );
        });
        continue;
      }

      regions.push(
        {
          id: getEdgeId("North", faceColumn, faceRow),
          orientation: "South",
          region: [x, y, width, thickness],
          controlRegion: [x, y, width, thickness],
        },
        {
          id: getEdgeId("South", faceColumn, faceRow),
          orientation: "North",
          region: [x, y + height - thickness, width, thickness],
          controlRegion: [x, y + height - thickness, width, thickness],
        },
        {
          id: getEdgeId("East", faceColumn, faceRow),
          orientation: "East",
          region: [x, y, thickness, height],
          controlRegion: [x, y, thickness, height],
        },
        {
          id: getEdgeId("West", faceColumn, faceRow),
          orientation: "West",
          region: [x + width - thickness, y, thickness, height],
          controlRegion: [x + width - thickness, y, thickness, height],
        }
      );
    }
  }

  return regions;
}

// Tab flaps along the whole grid's four outer edges, positioned in the page
// margin outside the grid rather than inset inside a boundary face's own
// cell (contrast with `makeEdgeRegions`, which stays inset — used for fold
// creases between adjacent faces). The virtual column/row baked into each id
// (rowOffset - 1, rowOffset + rows, columnOffset - 1, columnOffset +
// columns) always falls outside the real grid's own coordinate range, so
// these ids can never collide with a real face's own edge ids. Thickness is
// fixed to the preset's default cell size, same as `makeEdgeRegions` — not
// tied to row 0's/the last row's/column 0's/the last column's own (possibly
// resized) size.
export function makeBoundaryEdgeRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
  rowOffset?: number;
}): EdgeRegion[] {
  const { columns, rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
    rowOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const rowOffsetsPx = makeOffsets(rowHeights);
  const totalWidth = getTotalSize(columnWidths);
  const totalHeight = getTotalSize(rowHeights);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: EdgeRegion[] = [];

  // A boundary flap belongs to whichever real face sits at that edge of the
  // page (row 0's North, the last row's South, column 0's West, the last
  // column's East) — if that face is split, the flap divides into its 2
  // owning parts (per the same North/South -> A+B/C+D, West/East -> A+C/B+D
  // mapping `dioramaDocument.ts`'s split functions use) at the matching
  // fractional width/height, instead of staying one full-width/height flap.
  for (let column = 0; column < columns; column += 1) {
    const faceColumn = column + columnOffset;
    const x = originX + (columnOffsetsPx[column] ?? 0);
    const width = columnWidths[column] ?? pixelsPerMinecraftUnit;

    const topSplit = document.splits[getFaceId(faceColumn, rowOffset)];
    if (topSplit) {
      const { A, B } = makeSplitPartRegions([x, 0, width, 0], topSplit);
      const regionA: EdgeRegion["region"] = [
        A[0],
        originY - thickness,
        A[2],
        thickness,
      ];
      const regionB: EdgeRegion["region"] = [
        B[0],
        originY - thickness,
        B[2],
        thickness,
      ];
      regions.push(
        {
          id: getEdgeId("North", faceColumn, rowOffset - 1, "A"),
          orientation: "North",
          region: regionA,
          controlRegion: regionA,
        },
        {
          id: getEdgeId("North", faceColumn, rowOffset - 1, "B"),
          orientation: "North",
          region: regionB,
          controlRegion: regionB,
        }
      );
    } else {
      const region: EdgeRegion["region"] = [
        x,
        originY - thickness,
        width,
        thickness,
      ];
      regions.push({
        id: getEdgeId("North", faceColumn, rowOffset - 1),
        orientation: "North",
        region,
        controlRegion: region,
      });
    }

    const bottomSplit =
      document.splits[getFaceId(faceColumn, rowOffset + rows - 1)];
    if (bottomSplit) {
      const { C, D } = makeSplitPartRegions([x, 0, width, 0], bottomSplit);
      const regionC: EdgeRegion["region"] = [
        C[0],
        originY + totalHeight,
        C[2],
        thickness,
      ];
      const regionD: EdgeRegion["region"] = [
        D[0],
        originY + totalHeight,
        D[2],
        thickness,
      ];
      regions.push(
        {
          id: getEdgeId("South", faceColumn, rowOffset + rows, "C"),
          orientation: "South",
          region: regionC,
          controlRegion: regionC,
        },
        {
          id: getEdgeId("South", faceColumn, rowOffset + rows, "D"),
          orientation: "South",
          region: regionD,
          controlRegion: regionD,
        }
      );
    } else {
      const region: EdgeRegion["region"] = [
        x,
        originY + totalHeight,
        width,
        thickness,
      ];
      regions.push({
        id: getEdgeId("South", faceColumn, rowOffset + rows),
        orientation: "South",
        region,
        controlRegion: region,
      });
    }
  }

  for (let row = 0; row < rows; row += 1) {
    const faceRow = row + rowOffset;
    const y = originY + (rowOffsetsPx[row] ?? 0);
    const height = rowHeights[row] ?? pixelsPerMinecraftUnit;

    const leftSplit = document.splits[getFaceId(columnOffset, faceRow)];
    if (leftSplit) {
      const { A, C } = makeSplitPartRegions([0, y, 0, height], leftSplit);
      const regionA: EdgeRegion["region"] = [
        originX - thickness,
        A[1],
        thickness,
        A[3],
      ];
      const regionC: EdgeRegion["region"] = [
        originX - thickness,
        C[1],
        thickness,
        C[3],
      ];
      regions.push(
        {
          id: getEdgeId("West", columnOffset - 1, faceRow, "A"),
          orientation: "West",
          region: regionA,
          controlRegion: regionA,
        },
        {
          id: getEdgeId("West", columnOffset - 1, faceRow, "C"),
          orientation: "West",
          region: regionC,
          controlRegion: regionC,
        }
      );
    } else {
      const region: EdgeRegion["region"] = [
        originX - thickness,
        y,
        thickness,
        height,
      ];
      regions.push({
        id: getEdgeId("West", columnOffset - 1, faceRow),
        orientation: "West",
        region,
        controlRegion: region,
      });
    }

    const rightSplit =
      document.splits[getFaceId(columnOffset + columns - 1, faceRow)];
    if (rightSplit) {
      const { B, D } = makeSplitPartRegions([0, y, 0, height], rightSplit);
      const regionB: EdgeRegion["region"] = [
        originX + totalWidth,
        B[1],
        thickness,
        B[3],
      ];
      const regionD: EdgeRegion["region"] = [
        originX + totalWidth,
        D[1],
        thickness,
        D[3],
      ];
      regions.push(
        {
          id: getEdgeId("East", columnOffset + columns, faceRow, "B"),
          orientation: "East",
          region: regionB,
          controlRegion: regionB,
        },
        {
          id: getEdgeId("East", columnOffset + columns, faceRow, "D"),
          orientation: "East",
          region: regionD,
          controlRegion: regionD,
        }
      );
    } else {
      const region: EdgeRegion["region"] = [
        originX + totalWidth,
        y,
        thickness,
        height,
      ];
      regions.push({
        id: getEdgeId("East", columnOffset + columns, faceRow),
        orientation: "East",
        region,
        controlRegion: region,
      });
    }
  }

  return regions;
}

export type HeaderRegion = {
  id: string;
  region: [number, number, number, number];
};

// A thin click band above each column, in the page margin just above the
// grid's top row — bulk-applies the current source crop to every face in
// that column, across every page (a column is one continuous vertical strip
// of the document's world grid, so this isn't scoped to a single page the
// way `makeSourceRowHeaderRegions` is). Callers render this only once, on
// the first page, to avoid one redundant band per page. Each band's own
// thickness is fixed to the preset's default cell size, not the column's own
// (possibly resized) width — a column header band's thickness must not
// depend on the very dimension a Destination-mode click through it changes,
// or growing a column's width would also grow its own header band's
// thickness as an unwanted side effect.
export function makeSourceColumnHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
}): HeaderRegion[] {
  const { columns } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    const width = columnWidths[column] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getSourceColumnId(column + columnOffset),
      region: [
        originX + (columnOffsetsPx[column] ?? 0),
        originY - thickness,
        width,
        thickness,
      ],
    });
  }

  return regions;
}

// A thin click band to the left of each row, bulk-applying the current
// source crop to every face in that row. Unlike columns, a row is already
// scoped to one page (rows continue onto the next page as new row numbers,
// per `rowOffset`), so this is rendered on every page for that page's own
// rows. Thickness is fixed to the preset's default cell size for the same
// reason as `makeSourceColumnHeaderRegions`' own thickness — it must not
// track the row's own (possibly resized) height.
export function makeSourceRowHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  rowOffset?: number;
}): HeaderRegion[] {
  const { rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    rowOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const rowOffsetsPx = makeOffsets(rowHeights);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let row = 0; row < rows; row += 1) {
    const height = rowHeights[row] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getSourceRowId(row + rowOffset),
      region: [
        originX - thickness,
        originY + (rowOffsetsPx[row] ?? 0),
        thickness,
        height,
      ],
    });
  }

  return regions;
}

// Same shape and placement as `makeSourceColumnHeaderRegions`, a distinct id
// namespace for Destination edit mode's own column-width bulk-apply band.
// Thickness is fixed to the preset's default cell size for the same reason:
// this band's own thickness must not track the column width it exists to
// edit, or resizing a column wider would also grow its own header band
// taller as an unwanted side effect.
export function makeDestinationColumnHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
}): HeaderRegion[] {
  const { columns } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    const width = columnWidths[column] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getDestinationColumnId(column + columnOffset),
      region: [
        originX + (columnOffsetsPx[column] ?? 0),
        originY - thickness,
        width,
        thickness,
      ],
    });
  }

  return regions;
}

// Same shape and placement as `makeSourceRowHeaderRegions`, a distinct id
// namespace for Destination edit mode's own row-height bulk-apply band.
// Thickness is fixed to the preset's default cell size for the same reason:
// this band's own thickness must not track the row height it exists to
// edit, or resizing a row taller would also grow its own header band wider
// as an unwanted side effect.
export function makeDestinationRowHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  rowOffset?: number;
}): HeaderRegion[] {
  const { rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    rowOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const rowOffsetsPx = makeOffsets(rowHeights);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let row = 0; row < rows; row += 1) {
    const height = rowHeights[row] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getDestinationRowId(row + rowOffset),
      region: [
        originX - thickness,
        originY + (rowOffsetsPx[row] ?? 0),
        thickness,
        height,
      ],
    });
  }

  return regions;
}

// Same shape and placement as `makeSourceColumnHeaderRegions`, a distinct id
// namespace for Transform edit mode's own column bulk-apply band. Thickness
// is fixed to the preset's default cell size for the same reason as the
// Source/Destination bands: it must not track anything the click itself
// changes.
export function makeTransformColumnHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
}): HeaderRegion[] {
  const { columns } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    const width = columnWidths[column] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getTransformColumnId(column + columnOffset),
      region: [
        originX + (columnOffsetsPx[column] ?? 0),
        originY - thickness,
        width,
        thickness,
      ],
    });
  }

  return regions;
}

// Same shape and placement as `makeSourceRowHeaderRegions`, a distinct id
// namespace for Transform edit mode's own row bulk-apply band.
export function makeTransformRowHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  rowOffset?: number;
}): HeaderRegion[] {
  const { rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    rowOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const rowOffsetsPx = makeOffsets(rowHeights);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let row = 0; row < rows; row += 1) {
    const height = rowHeights[row] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getTransformRowId(row + rowOffset),
      region: [
        originX - thickness,
        originY + (rowOffsetsPx[row] ?? 0),
        thickness,
        height,
      ],
    });
  }

  return regions;
}

// Same shape and placement as `makeSourceColumnHeaderRegions`, a distinct id
// namespace for Split edit mode's own column bulk-apply band.
export function makeSplitColumnHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  columnOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  columnOffset?: number;
}): HeaderRegion[] {
  const { columns } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    columnOffset,
  });
  const columnWidths = makeColumnWidths({
    document,
    columns,
    columnOffset,
  });
  const columnOffsetsPx = makeOffsets(columnWidths);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    const width = columnWidths[column] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getSplitColumnId(column + columnOffset),
      region: [
        originX + (columnOffsetsPx[column] ?? 0),
        originY - thickness,
        width,
        thickness,
      ],
    });
  }

  return regions;
}

// Same shape and placement as `makeSourceRowHeaderRegions`, a distinct id
// namespace for Split edit mode's own row bulk-apply band.
export function makeSplitRowHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  document,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  rowOffset?: number;
}): HeaderRegion[] {
  const { rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    document,
    rowOffset,
  });
  const rowHeights = makeRowHeights({ document, rows, rowOffset });
  const rowOffsetsPx = makeOffsets(rowHeights);
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  const regions: HeaderRegion[] = [];

  for (let row = 0; row < rows; row += 1) {
    const height = rowHeights[row] ?? pixelsPerMinecraftUnit;
    regions.push({
      id: getSplitRowId(row + rowOffset),
      region: [
        originX - thickness,
        originY + (rowOffsetsPx[row] ?? 0),
        thickness,
        height,
      ],
    });
  }

  return regions;
}

// A third bulk-apply tier unique to Split mode (matching the reference's own
// `makeAllSplitRegions`): one small band in the page's top-left corner
// margin, bulk-toggling every face on that page at once. Keyed by the
// page's own rowOffset, same as a row id.
export function makeSplitPageHeaderRegions({
  originX,
  originY,
  document,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  document: DioramaDocument;
  rowOffset?: number;
}): HeaderRegion[] {
  const thickness = getEdgeThickness(getFaceCellSize(document.preset));
  return [
    {
      id: getSplitPageId(rowOffset),
      region: [originX - thickness, originY - thickness, thickness, thickness],
    },
  ];
}

// Walks the same per-page row-fitting `getGridDimensions` uses, page by
// page, to find the total row count spanned by `pageCount` pages — needed
// once row heights can vary, since a page's row count is no longer a
// constant `rowsPerPage` multiplied by the page index.
export function getTotalRowsAcrossPages({
  pageWidth,
  pageHeight,
  document,
  pageCount,
}: {
  pageWidth: number;
  pageHeight: number;
  document: DioramaDocument;
  pageCount: number;
}): number {
  let rowOffset = 0;
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const { rows } = getGridDimensions({
      pageWidth,
      pageHeight,
      document,
      rowOffset,
    });
    rowOffset += rows;
  }
  return rowOffset;
}

// The line where drawTab's own fold sits for a given orientation — matches
// drawTab.ts's actual fold-line placement (North's fold is at the bottom of
// its rectangle, South's is at the top), not the orientation label's
// compass name, so this stays correct regardless of which physical strip a
// given orientation is used to render.
export function getEdgeBoundaryLine(
  orientation: EdgeDirection,
  [x, y, width, height]: [number, number, number, number]
): [[number, number], [number, number]] {
  switch (orientation) {
    case "North":
      return [
        [x, y + height],
        [x + width, y + height],
      ];
    case "South":
      return [
        [x, y],
        [x + width, y],
      ];
    case "East":
      return [
        [x, y],
        [x, y + height],
      ];
    case "West":
      return [
        [x + width, y],
        [x + width, y + height],
      ];
  }
}
