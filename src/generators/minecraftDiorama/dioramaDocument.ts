import type { SelectedTexture, TabShape } from "@genroot/builder";

export type BlockPreset = "Full Blocks" | "Quarter Blocks";

export const blockPresets: BlockPreset[] = ["Full Blocks", "Quarter Blocks"];

export const defaultPreset: BlockPreset = "Full Blocks";

export function isBlockPreset(value: string): value is BlockPreset {
  return value === "Full Blocks" || value === "Quarter Blocks";
}

export type TabType = "None" | TabShape;

const tabCycle: TabType[] = ["None", "Full", "Left", "Middle", "Right"];

export function isTabShape(tabType: TabType | undefined): tabType is TabShape {
  return tabType !== undefined && tabType !== "None";
}

export type EdgeDirection = "North" | "South" | "East" | "West";

export type FaceId = string;

export type EdgeId = string;

// [x, y, width, height] in Minecraft texture-pixel units (0-16, matching a
// standard block texture's own 16x16 frame), not page pixels.
export type Region = [number, number, number, number];

export type DioramaDocument = {
  preset: BlockPreset;
  faceTextures: Record<FaceId, SelectedTexture[]>;
  sources: Record<FaceId, Region>;
  destinationColumns: Record<number, number>;
  destinationRows: Record<number, number>;
  tabs: Record<EdgeId, TabType>;
  folds: Record<EdgeId, true>;
};

export function makeEmptyDioramaDocument(
  preset: BlockPreset = defaultPreset
): DioramaDocument {
  const document: DioramaDocument = {
    preset,
    faceTextures: {},
    sources: {},
    destinationColumns: {},
    destinationRows: {},
    tabs: {},
    folds: {},
  };
  return document;
}

export function getFaceId(column: number, row: number): FaceId {
  return `BlockFace${column} ${row}`;
}

export function getEdgeId(
  direction: EdgeDirection,
  column: number,
  row: number
): EdgeId {
  return `${direction}${column} ${row}`;
}

const faceIdPattern = /^BlockFace(-?\d+) (-?\d+)$/;

export function parseFaceId(
  faceId: FaceId
): { column: number; row: number } | null {
  const match = faceIdPattern.exec(faceId);
  if (!match) {
    return null;
  }
  return {
    column: parseInt(match[1] ?? "0", 10),
    row: parseInt(match[2] ?? "0", 10),
  };
}

// A source column/row header is a bulk-apply control, not a face — its id
// deliberately falls outside `faceIdPattern`/edge id shapes so it can never
// collide with a real face or edge id.
export function getSourceColumnId(column: number): string {
  return `SourceColumn${column}`;
}

export function getSourceRowId(row: number): string {
  return `SourceRow${row}`;
}

const sourceColumnIdPattern = /^SourceColumn(-?\d+)$/;
const sourceRowIdPattern = /^SourceRow(-?\d+)$/;

export function parseSourceColumnId(id: string): number | null {
  const match = sourceColumnIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

export function parseSourceRowId(id: string): number | null {
  const match = sourceRowIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

// Destination column/row headers are their own id namespace, distinct from
// Source's, even though both are bulk-apply bands — keeping them separate
// avoids ever needing to reason about which edit mode a shared id belongs to.
export function getDestinationColumnId(column: number): string {
  return `DestinationColumn${column}`;
}

export function getDestinationRowId(row: number): string {
  return `DestinationRow${row}`;
}

const destinationColumnIdPattern = /^DestinationColumn(-?\d+)$/;
const destinationRowIdPattern = /^DestinationRow(-?\d+)$/;

export function parseDestinationColumnId(id: string): number | null {
  const match = destinationColumnIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

export function parseDestinationRowId(id: string): number | null {
  const match = destinationRowIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

export function setPreset(
  document: DioramaDocument,
  preset: BlockPreset
): DioramaDocument {
  return { ...document, preset };
}

export function addFaceTexture(
  document: DioramaDocument,
  faceId: FaceId,
  texture: SelectedTexture
): DioramaDocument {
  const stack = document.faceTextures[faceId] ?? [];
  return {
    ...document,
    faceTextures: {
      ...document.faceTextures,
      [faceId]: [...stack, texture],
    },
  };
}

export function eraseFaceTexture(
  document: DioramaDocument,
  faceId: FaceId
): DioramaDocument {
  const stack = document.faceTextures[faceId];
  if (!stack || stack.length === 0) {
    return document;
  }

  const nextStack = stack.slice(0, -1);
  const faceTextures = { ...document.faceTextures };
  if (nextStack.length === 0) {
    delete faceTextures[faceId];
  } else {
    faceTextures[faceId] = nextStack;
  }

  return { ...document, faceTextures };
}

export const fullSourceRegion: Region = [0, 0, 16, 16];

const sourceGridSize = 16;
const minimumSourceSize = 0.5;

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function clampSourceRegion([x, y, width, height]: Region): Region {
  const clampedX = Math.max(
    0,
    Math.min(roundToHalf(x), sourceGridSize - minimumSourceSize)
  );
  const clampedY = Math.max(
    0,
    Math.min(roundToHalf(y), sourceGridSize - minimumSourceSize)
  );

  return [
    clampedX,
    clampedY,
    Math.max(
      minimumSourceSize,
      Math.min(roundToHalf(width), sourceGridSize - clampedX)
    ),
    Math.max(
      minimumSourceSize,
      Math.min(roundToHalf(height), sourceGridSize - clampedY)
    ),
  ];
}

// Quarter Blocks has no explicit source until a face is edited, so each of
// the four cells sharing one source texture defaults to its own quadrant —
// (column parity, row parity) picks one of the 4 8x8 quadrants — rather than
// all four repeating the same full 16x16 texture shrunk to a quarter-size
// cell. Matches the `pr-34-original` reference's `getDefaultSourceForFace`,
// confirmed by Kevan as intentional reference behavior (see todo.md).
export function getDefaultSourceForFace(
  document: DioramaDocument,
  faceId: FaceId
): Region {
  if (document.preset !== "Quarter Blocks") {
    return fullSourceRegion;
  }

  const position = parseFaceId(faceId);
  if (!position) {
    return fullSourceRegion;
  }

  return [(position.column % 2) * 8, (position.row % 2) * 8, 8, 8];
}

export function getFaceSource(
  document: DioramaDocument,
  faceId: FaceId
): Region {
  return document.sources[faceId] ?? getDefaultSourceForFace(document, faceId);
}

export function setFaceSource(
  document: DioramaDocument,
  faceId: FaceId,
  source: Region
): DioramaDocument {
  return {
    ...document,
    sources: { ...document.sources, [faceId]: clampSourceRegion(source) },
  };
}

export function setFaceSourceForFaces(
  document: DioramaDocument,
  faceIds: FaceId[],
  source: Region
): DioramaDocument {
  const clamped = clampSourceRegion(source);
  const sources = { ...document.sources };
  faceIds.forEach((faceId) => {
    sources[faceId] = clamped;
  });
  return { ...document, sources };
}

// The size (in Minecraft units) of a column/row that hasn't been resized —
// 16 units for a Full Blocks cell, 8 for Quarter Blocks, matching
// `layout.ts`'s `getFaceCellSize`'s own worldUnits mapping.
export function getWorldUnitsForPreset(preset: BlockPreset): number {
  return preset === "Quarter Blocks" ? 8 : 16;
}

const minimumDestinationSize = 1;

function clampDestinationSize(value: number): number {
  return Math.max(minimumDestinationSize, Math.round(value));
}

export function getColumnWidth(
  document: DioramaDocument,
  column: number
): number {
  return (
    document.destinationColumns[column] ??
    getWorldUnitsForPreset(document.preset)
  );
}

export function getRowHeight(document: DioramaDocument, row: number): number {
  return (
    document.destinationRows[row] ?? getWorldUnitsForPreset(document.preset)
  );
}

// Setting a column/row back to its preset default removes the override
// rather than storing it explicitly, keeping the document minimal — matches
// the `pr-34-original` reference's own `setDestinationValue`.
export function setColumnWidth(
  document: DioramaDocument,
  column: number,
  width: number
): DioramaDocument {
  const destinationColumns = { ...document.destinationColumns };
  const clamped = clampDestinationSize(width);
  if (clamped === getWorldUnitsForPreset(document.preset)) {
    delete destinationColumns[column];
  } else {
    destinationColumns[column] = clamped;
  }
  return { ...document, destinationColumns };
}

export function setRowHeight(
  document: DioramaDocument,
  row: number,
  height: number
): DioramaDocument {
  const destinationRows = { ...document.destinationRows };
  const clamped = clampDestinationSize(height);
  if (clamped === getWorldUnitsForPreset(document.preset)) {
    delete destinationRows[row];
  } else {
    destinationRows[row] = clamped;
  }
  return { ...document, destinationRows };
}

export function cycleTab(
  document: DioramaDocument,
  edgeId: EdgeId
): DioramaDocument {
  const current = document.tabs[edgeId] ?? "None";
  const currentIndex = tabCycle.indexOf(current);
  const next = tabCycle[(currentIndex + 1) % tabCycle.length] ?? "None";
  const tabs = { ...document.tabs };
  if (next === "None") {
    delete tabs[edgeId];
  } else {
    tabs[edgeId] = next;
  }

  return { ...document, tabs };
}

export function toggleFold(
  document: DioramaDocument,
  edgeId: EdgeId
): DioramaDocument {
  const folds = { ...document.folds };
  if (folds[edgeId]) {
    delete folds[edgeId];
  } else {
    folds[edgeId] = true;
  }

  return { ...document, folds };
}
