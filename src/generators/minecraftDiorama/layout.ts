import {
  getColumnWidth,
  getDestinationColumnId,
  getDestinationRowId,
  getEdgeId,
  getFaceId,
  getRowHeight,
  getSourceColumnId,
  getSourceRowId,
  getWorldUnitsForPreset,
  type BlockPreset,
  type DioramaDocument,
  type EdgeDirection,
  type EdgeId,
  type FaceId,
} from "./dioramaDocument";

export type FaceRegion = {
  id: FaceId;
  region: [number, number, number, number];
};

export type EdgeRegion = {
  id: EdgeId;
  region: [number, number, number, number];
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

      regions.push(
        // North/South's drawTab orientation is swapped relative to the
        // strip's own position: drawTab's "North" puts its fold at the
        // bottom of the rectangle it's given, "South" puts it at the top.
        // The fold needs to land on each strip's true face-boundary edge
        // (touching the neighboring face, not the strip's own face
        // interior) — matching the reference's own rotation-derived
        // orientation (rotation 2 on the North-id region, rotation 0 on the
        // South-id region), confirmed by pixel-sampling both apps' rendered
        // tabs. East/West need no such swap.
        {
          id: getEdgeId("North", faceColumn, faceRow),
          orientation: "South",
          region: [x, y, width, thickness],
        },
        {
          id: getEdgeId("South", faceColumn, faceRow),
          orientation: "North",
          region: [x, y + height - thickness, width, thickness],
        },
        {
          id: getEdgeId("East", faceColumn, faceRow),
          orientation: "East",
          region: [x, y, thickness, height],
        },
        {
          id: getEdgeId("West", faceColumn, faceRow),
          orientation: "West",
          region: [x + width - thickness, y, thickness, height],
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

  for (let column = 0; column < columns; column += 1) {
    const faceColumn = column + columnOffset;
    const x = originX + (columnOffsetsPx[column] ?? 0);
    const width = columnWidths[column] ?? pixelsPerMinecraftUnit;

    regions.push(
      {
        id: getEdgeId("North", faceColumn, rowOffset - 1),
        orientation: "North",
        region: [x, originY - thickness, width, thickness],
      },
      {
        id: getEdgeId("South", faceColumn, rowOffset + rows),
        orientation: "South",
        region: [x, originY + totalHeight, width, thickness],
      }
    );
  }

  for (let row = 0; row < rows; row += 1) {
    const faceRow = row + rowOffset;
    const y = originY + (rowOffsetsPx[row] ?? 0);
    const height = rowHeights[row] ?? pixelsPerMinecraftUnit;

    regions.push(
      {
        id: getEdgeId("West", columnOffset - 1, faceRow),
        orientation: "West",
        region: [originX - thickness, y, thickness, height],
      },
      {
        id: getEdgeId("East", columnOffset + columns, faceRow),
        orientation: "East",
        region: [originX + totalWidth, y, thickness, height],
      }
    );
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
