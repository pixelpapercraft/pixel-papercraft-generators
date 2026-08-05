import { getFaceId, type BlockPreset, type FaceId } from "./dioramaDocument";

export type FaceRegion = {
  id: FaceId;
  region: [number, number, number, number];
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
