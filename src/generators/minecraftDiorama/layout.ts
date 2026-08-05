import {
  getEdgeId,
  getFaceId,
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
        {
          id: getEdgeId("North", faceColumn, faceRow),
          orientation: "North",
          region: [x, y, cellSize, thickness],
        },
        {
          id: getEdgeId("South", faceColumn, faceRow),
          orientation: "South",
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

// The line where a face's edge strip meets its own interior — the physical
// crease `drawFoldLine`/the edit-mode dashed guide gets drawn along.
export function getEdgeBoundaryLine(
  orientation: EdgeDirection,
  [x, y, width, height]: [number, number, number, number]
): [[number, number], [number, number]] {
  switch (orientation) {
    case "North":
      return [
        [x, y],
        [x + width, y],
      ];
    case "South":
      return [
        [x, y + height],
        [x + width, y + height],
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
