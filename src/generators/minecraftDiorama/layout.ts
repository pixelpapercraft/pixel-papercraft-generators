import {
  getEdgeId,
  getFaceId,
  getSourceColumnId,
  getSourceRowId,
  type BlockPreset,
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

export function getFaceCellSize(preset: BlockPreset): number {
  const worldUnits = preset === "Quarter Blocks" ? 8 : 16;
  return worldUnits * pixelsPerMinecraftUnit;
}

export function getGridDimensions({
  pageWidth,
  pageHeight,
  preset,
}: {
  pageWidth: number;
  pageHeight: number;
  preset: BlockPreset;
}): { columns: number; rows: number } {
  const cellSize = getFaceCellSize(preset);
  return {
    columns: Math.max(1, Math.floor(pageWidth / cellSize)),
    rows: Math.max(1, Math.floor(pageHeight / cellSize)),
  };
}

export function makeFaceRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  preset,
  columnOffset = 0,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  preset: BlockPreset;
  columnOffset?: number;
  rowOffset?: number;
}): FaceRegion[] {
  const cellSize = getFaceCellSize(preset);
  const { columns, rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    preset,
  });
  const regions: FaceRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const faceRegion: FaceRegion = {
        id: getFaceId(column + columnOffset, row + rowOffset),
        region: [
          originX + column * cellSize,
          originY + row * cellSize,
          cellSize,
          cellSize,
        ],
      };
      regions.push(faceRegion);
    }
  }

  return regions;
}

export function getEdgeThickness(cellSize: number): number {
  return cellSize / 4;
}

// A face's own North/South/East/West edge strips, one set per face rather
// than one shared strip per boundary — matching the `pr-34-original`
// reference's per-face `EdgeId` convention that `dioramaDocument.ts`'s
// `getEdgeId` already follows. Two adjacent faces' facing edges (e.g. one
// face's South and the next row's North) sit right on the same boundary
// line but stay independently addressable.
export function makeEdgeRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  preset,
  columnOffset = 0,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  preset: BlockPreset;
  columnOffset?: number;
  rowOffset?: number;
}): EdgeRegion[] {
  const cellSize = getFaceCellSize(preset);
  const thickness = getEdgeThickness(cellSize);
  const { columns, rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    preset,
  });
  const regions: EdgeRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const x = originX + column * cellSize;
      const y = originY + row * cellSize;
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
          region: [x, y, cellSize, thickness],
        },
        {
          id: getEdgeId("South", faceColumn, faceRow),
          orientation: "North",
          region: [x, y + cellSize - thickness, cellSize, thickness],
        },
        {
          id: getEdgeId("East", faceColumn, faceRow),
          orientation: "East",
          region: [x, y, thickness, cellSize],
        },
        {
          id: getEdgeId("West", faceColumn, faceRow),
          orientation: "West",
          region: [x + cellSize - thickness, y, thickness, cellSize],
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
// these ids can never collide with a real face's own edge ids.
export function makeBoundaryEdgeRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  preset,
  columnOffset = 0,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  preset: BlockPreset;
  columnOffset?: number;
  rowOffset?: number;
}): EdgeRegion[] {
  const cellSize = getFaceCellSize(preset);
  const thickness = getEdgeThickness(cellSize);
  const { columns, rows } = getGridDimensions({
    pageWidth,
    pageHeight,
    preset,
  });
  const regions: EdgeRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    const faceColumn = column + columnOffset;
    const x = originX + column * cellSize;

    regions.push(
      {
        id: getEdgeId("North", faceColumn, rowOffset - 1),
        orientation: "North",
        region: [x, originY - thickness, cellSize, thickness],
      },
      {
        id: getEdgeId("South", faceColumn, rowOffset + rows),
        orientation: "South",
        region: [x, originY + rows * cellSize, cellSize, thickness],
      }
    );
  }

  for (let row = 0; row < rows; row += 1) {
    const faceRow = row + rowOffset;
    const y = originY + row * cellSize;

    regions.push(
      {
        id: getEdgeId("West", columnOffset - 1, faceRow),
        orientation: "West",
        region: [originX - thickness, y, thickness, cellSize],
      },
      {
        id: getEdgeId("East", columnOffset + columns, faceRow),
        orientation: "East",
        region: [originX + columns * cellSize, y, thickness, cellSize],
      }
    );
  }

  return regions;
}

export type SourceHeaderRegion = {
  id: string;
  region: [number, number, number, number];
};

// A thin click band above each column, in the page margin just above the
// grid's top row — bulk-applies the current source crop to every face in
// that column, across every page (a column is one continuous vertical strip
// of the document's world grid, so this isn't scoped to a single page the
// way `makeSourceRowHeaderRegions` is). Callers render this only once, on
// the first page, to avoid one redundant band per page.
export function makeSourceColumnHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  preset,
  columnOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  preset: BlockPreset;
  columnOffset?: number;
}): SourceHeaderRegion[] {
  const cellSize = getFaceCellSize(preset);
  const thickness = getEdgeThickness(cellSize);
  const { columns } = getGridDimensions({ pageWidth, pageHeight, preset });
  const regions: SourceHeaderRegion[] = [];

  for (let column = 0; column < columns; column += 1) {
    regions.push({
      id: getSourceColumnId(column + columnOffset),
      region: [
        originX + column * cellSize,
        originY - thickness,
        cellSize,
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
// rows.
export function makeSourceRowHeaderRegions({
  originX,
  originY,
  pageWidth,
  pageHeight,
  preset,
  rowOffset = 0,
}: {
  originX: number;
  originY: number;
  pageWidth: number;
  pageHeight: number;
  preset: BlockPreset;
  rowOffset?: number;
}): SourceHeaderRegion[] {
  const cellSize = getFaceCellSize(preset);
  const thickness = getEdgeThickness(cellSize);
  const { rows } = getGridDimensions({ pageWidth, pageHeight, preset });
  const regions: SourceHeaderRegion[] = [];

  for (let row = 0; row < rows; row += 1) {
    regions.push({
      id: getSourceRowId(row + rowOffset),
      region: [
        originX - thickness,
        originY + row * cellSize,
        thickness,
        cellSize,
      ],
    });
  }

  return regions;
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
