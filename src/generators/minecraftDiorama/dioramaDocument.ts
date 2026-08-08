import {
  makeNextFlip,
  type Flip,
  type Rotation,
  type SelectedTexture,
  type TabShape,
} from "@genroot/builder";

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

export type FaceTransform = {
  rotation: Rotation;
  flip: Flip;
};

export const defaultFaceTransform: FaceTransform = {
  rotation: "Rot0",
  flip: "None",
};

export const rotations: Rotation[] = ["Rot0", "Rot90", "Rot180", "Rot270"];

export const flips: Flip[] = ["None", "Horizontal", "Vertical"];

export function isRotation(value: string): value is Rotation {
  return (rotations as string[]).includes(value);
}

export function isFlip(value: string): value is Flip {
  return (flips as string[]).includes(value);
}

export function isDefaultTransform(transform: FaceTransform): boolean {
  return transform.rotation === "Rot0" && transform.flip === "None";
}

export type DioramaDocument = {
  preset: BlockPreset;
  faceTextures: Record<FaceId, SelectedTexture[]>;
  sources: Record<FaceId, Region>;
  destinationColumns: Record<number, number>;
  destinationRows: Record<number, number>;
  transforms: Record<FaceId, FaceTransform>;
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
    transforms: {},
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

// Transform column/row headers are their own id namespace too, same reasons
// as Destination's above.
export function getTransformColumnId(column: number): string {
  return `TransformColumn${column}`;
}

export function getTransformRowId(row: number): string {
  return `TransformRow${row}`;
}

const transformColumnIdPattern = /^TransformColumn(-?\d+)$/;
const transformRowIdPattern = /^TransformRow(-?\d+)$/;

export function parseTransformColumnId(id: string): number | null {
  const match = transformColumnIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

export function parseTransformRowId(id: string): number | null {
  const match = transformRowIdPattern.exec(id);
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

export function getFaceTransform(
  document: DioramaDocument,
  faceId: FaceId
): FaceTransform {
  return document.transforms[faceId] ?? defaultFaceTransform;
}

// A default transform is removed rather than stored explicitly, matching
// `setColumnWidth`/`setRowHeight`'s own minimal-document convention.
export function setFaceTransform(
  document: DioramaDocument,
  faceId: FaceId,
  transform: FaceTransform
): DioramaDocument {
  const transforms = { ...document.transforms };
  if (isDefaultTransform(transform)) {
    delete transforms[faceId];
  } else {
    transforms[faceId] = transform;
  }
  return { ...document, transforms };
}

export function setFaceTransformForFaces(
  document: DioramaDocument,
  faceIds: FaceId[],
  transform: FaceTransform
): DioramaDocument {
  const transforms = { ...document.transforms };
  faceIds.forEach((faceId) => {
    if (isDefaultTransform(transform)) {
      delete transforms[faceId];
    } else {
      transforms[faceId] = transform;
    }
  });
  return { ...document, transforms };
}

function addRotations(base: Rotation, extra: Rotation): Rotation {
  const baseIndex = rotations.indexOf(base);
  const extraIndex = rotations.indexOf(extra);
  return rotations[(baseIndex + extraIndex) % rotations.length] ?? "Rot0";
}

// Composes a face's own Transform mode adjustment onto a texture's own
// rotation/flip (set independently, at placement time, in the texture
// picker). The face's rotation adds directly — a pure additional rotation
// composes by simple addition regardless of any existing flip. The face's
// flip is then applied as a further flip on top of the now-rotated result,
// reusing the same `makeNextFlip` the texture picker's own flip button goes
// through — proven correct by that function's own matrix-model test
// (`flip.test.ts`) for exactly this "apply one more flip on top of an
// existing rotation+flip state" composition.
export function applyFaceTransform(
  texture: SelectedTexture,
  transform: FaceTransform
): SelectedTexture {
  if (isDefaultTransform(transform)) {
    return texture;
  }
  const rotatedRotation = addRotations(texture.rotation, transform.rotation);
  const [flip, rotation] = makeNextFlip(
    texture.flip,
    transform.flip,
    rotatedRotation
  );
  return { ...texture, rotation, flip };
}
