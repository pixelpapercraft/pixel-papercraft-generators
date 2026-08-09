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

// A/B/C/D = top-left/top-right/bottom-left/bottom-right, matching a split
// face's own [x, y, width, height] quadrant math in `layout.ts`'s
// `makeSplitPartRegions`.
export type SplitPart = "A" | "B" | "C" | "D";

export const splitParts: SplitPart[] = ["A", "B", "C", "D"];

// Where a split face's cross falls within its 16x16-unit cell — width/height
// are the left/top part's own size, not a fraction, matching Source's own
// 0-16 unit convention.
export type SplitSize = { width: number; height: number };

export const defaultSplitSize: SplitSize = { width: 8, height: 8 };

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
  splits: Record<FaceId, SplitSize>;
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
    splits: {},
  };
  return document;
}

export function getFaceId(column: number, row: number): FaceId {
  return `BlockFace${column} ${row}`;
}

export function getEdgeId(
  direction: EdgeDirection,
  column: number,
  row: number,
  part?: SplitPart
): EdgeId {
  return `${direction}${column} ${row}${part ?? ""}`;
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

export function getSplitFaceId(baseFaceId: FaceId, part: SplitPart): FaceId {
  return `${baseFaceId}${part}`;
}

const splitFaceIdPattern = /^(BlockFace-?\d+ -?\d+)([ABCD])$/;

// A base face id passes through unchanged; a split part id (e.g.
// "BlockFace2 3A") resolves to its base ("BlockFace2 3"); anything else
// returns null. Kept separate from `parseFaceId` rather than folding the
// part letter into its return shape, since most callers only ever deal in
// base ids and don't need to carry a part around.
export function getBaseFaceId(faceId: FaceId): FaceId | null {
  if (parseFaceId(faceId)) {
    return faceId;
  }
  const match = splitFaceIdPattern.exec(faceId);
  return match?.[1] ?? null;
}

export function getSplitPartFromFaceId(faceId: FaceId): SplitPart | null {
  const match = splitFaceIdPattern.exec(faceId);
  return (match?.[2] as SplitPart | undefined) ?? null;
}

export function getSplitPartFaceIds(baseFaceId: FaceId): FaceId[] {
  return splitParts.map((part) => getSplitFaceId(baseFaceId, part));
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

// Split column/row headers are their own id namespace too, same reasons as
// Destination/Transform's above. A "page" band (below) is a third tier
// beyond column/row, unique to Split — it bulk-toggles every face on one
// page, keyed by that page's own rowOffset the same way a row id is.
export function getSplitColumnId(column: number): string {
  return `SplitColumn${column}`;
}

export function getSplitRowId(row: number): string {
  return `SplitRow${row}`;
}

export function getSplitPageId(rowOffset: number): string {
  return `SplitPage${rowOffset}`;
}

const splitColumnIdPattern = /^SplitColumn(-?\d+)$/;
const splitRowIdPattern = /^SplitRow(-?\d+)$/;
const splitPageIdPattern = /^SplitPage(-?\d+)$/;

export function parseSplitColumnId(id: string): number | null {
  const match = splitColumnIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

export function parseSplitRowId(id: string): number | null {
  const match = splitRowIdPattern.exec(id);
  return match ? parseInt(match[1] ?? "0", 10) : null;
}

export function parseSplitPageId(id: string): number | null {
  const match = splitPageIdPattern.exec(id);
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

const minimumSplitDimension = minimumSourceSize;
const maximumSplitDimension = sourceGridSize - minimumSourceSize;

export function sanitizeSplitDimension(value: number): number {
  return Math.max(
    minimumSplitDimension,
    Math.min(maximumSplitDimension, roundToHalf(value))
  );
}

function isSameSplitSize(a: SplitSize, b: SplitSize): boolean {
  return a.width === b.width && a.height === b.height;
}

function sanitizeSplitSize(split: SplitSize): SplitSize {
  return {
    width: sanitizeSplitDimension(split.width),
    height: sanitizeSplitDimension(split.height),
  };
}

const edgeDirections: EdgeDirection[] = ["North", "South", "East", "West"];

// Which two parts truly own a base face's given outer edge once split —
// corrects a direction-pairing bug found in the `pr-34-original` reference
// (its own East/West copies went to the wrong column's parts). Verified
// against that same reference's `makeSplitBlockRegions` geometry, which
// places A/C on the left column and B/D on the right.
const outerEdgeParts: Record<EdgeDirection, [SplitPart, SplitPart]> = {
  North: ["A", "B"],
  South: ["C", "D"],
  West: ["A", "C"],
  East: ["B", "D"],
};

// The single part each outer edge falls back to on unsplit, and the part
// `unsplitFace` treats as the merged face's own restored identity for its
// texture/source/transform. A is the natural primary for North/West (it's
// already the merged identity); South/East pull from A's own vertical (C)
// and horizontal (B) neighbor instead of A itself, since A doesn't touch
// those two edges.
const primaryOuterEdgePart: Record<EdgeDirection, SplitPart> = {
  North: "A",
  South: "C",
  West: "A",
  East: "B",
};

export function getFaceSplit(
  document: DioramaDocument,
  baseFaceId: FaceId
): SplitSize | null {
  return document.splits[baseFaceId] ?? null;
}

function quarterSource(
  [x, y, width, height]: Region,
  split: SplitSize
): Record<SplitPart, Region> {
  const leftWidth = (width * split.width) / sourceGridSize;
  const rightWidth = width - leftWidth;
  const topHeight = (height * split.height) / sourceGridSize;
  const bottomHeight = height - topHeight;

  return {
    A: [x, y, leftWidth, topHeight],
    B: [x + leftWidth, y, rightWidth, topHeight],
    C: [x, y + topHeight, leftWidth, bottomHeight],
    D: [x + leftWidth, y + topHeight, rightWidth, bottomHeight],
  };
}

// Splits a face into 4 independently-editable parts (A/B/C/D). Seeds each
// part's texture (verbatim), source (quartered from the base's own current
// crop, so splitting doesn't change what's shown), transform (verbatim, if
// non-default), and the two outer tab/fold edges it really owns (per
// `outerEdgeParts` above) — but only where that part doesn't already have
// its own explicit value, so re-splitting after a partial edit never
// clobbers it. The two internal seam edges each part also gains (e.g. A's
// East, shared with B) are deliberately left unset rather than inheriting
// an unrelated base edge — they're genuinely new creases with no prior
// state, and the reference's own attempt to seed them (by cross-copying the
// opposite base edge) is the same buggy pairing `outerEdgeParts` corrects.
// The base face's own texture/source/transform/edge entries are left in
// place rather than deleted — harmless, since the split-aware region
// functions in `layout.ts` simply stop emitting a region for the base id
// while it's split, and `unsplitFace` always overwrites the base from A's
// current values rather than restoring anything.
export function splitFace(
  document: DioramaDocument,
  baseFaceId: FaceId,
  rawSplit: SplitSize
): DioramaDocument {
  const split = sanitizeSplitSize(rawSplit);
  const faceTextures = { ...document.faceTextures };
  const baseStack = document.faceTextures[baseFaceId];
  if (baseStack) {
    getSplitPartFaceIds(baseFaceId).forEach((splitFaceId) => {
      faceTextures[splitFaceId] ??= baseStack;
    });
  }

  const sources = { ...document.sources };
  const quarteredSource = quarterSource(
    getFaceSource(document, baseFaceId),
    split
  );
  splitParts.forEach((part) => {
    sources[getSplitFaceId(baseFaceId, part)] ??= quarteredSource[part];
  });

  const transforms = { ...document.transforms };
  const baseTransform = document.transforms[baseFaceId];
  if (baseTransform && !isDefaultTransform(baseTransform)) {
    getSplitPartFaceIds(baseFaceId).forEach((splitFaceId) => {
      transforms[splitFaceId] ??= baseTransform;
    });
  }

  const tabs = { ...document.tabs };
  const folds = { ...document.folds };
  const face = parseFaceId(baseFaceId);
  if (face) {
    edgeDirections.forEach((direction) => {
      const baseEdgeId = getEdgeId(direction, face.column, face.row);
      const baseTab = document.tabs[baseEdgeId];
      const baseFold = document.folds[baseEdgeId];
      outerEdgeParts[direction].forEach((part) => {
        const partEdgeId = getEdgeId(direction, face.column, face.row, part);
        if (baseTab !== undefined) {
          tabs[partEdgeId] ??= baseTab;
        }
        if (baseFold) {
          folds[partEdgeId] ??= true;
        }
      });
    });
  }

  return {
    ...document,
    faceTextures,
    sources,
    transforms,
    tabs,
    folds,
    splits: { ...document.splits, [baseFaceId]: split },
  };
}

// Merges a split face back into one, taking part A's texture/source/
// transform as the merged face's own (matching the reference's intent —
// A is the "identity" going forward once merged) and falling back to the
// remaining outer-edge owner (per `primaryOuterEdgePart`) for any base edge
// that has no explicit value of its own. All 4 parts' texture/source/
// transform and all 16 part-edge slots (4 directions x 4 parts) are cleared
// afterward, so a later re-split reseeds cleanly from the (now restored)
// base rather than resurrecting data from a much earlier split.
export function unsplitFace(
  document: DioramaDocument,
  baseFaceId: FaceId
): DioramaDocument {
  if (!document.splits[baseFaceId]) {
    return document;
  }

  const primaryFaceId = getSplitFaceId(baseFaceId, "A");
  const partFaceIds = getSplitPartFaceIds(baseFaceId);

  const faceTextures = { ...document.faceTextures };
  const primaryStack = faceTextures[primaryFaceId];
  if (primaryStack) {
    faceTextures[baseFaceId] = primaryStack;
  } else {
    delete faceTextures[baseFaceId];
  }
  partFaceIds.forEach((partFaceId) => delete faceTextures[partFaceId]);

  const sources = { ...document.sources };
  const primarySource = sources[primaryFaceId];
  if (primarySource) {
    sources[baseFaceId] = primarySource;
  } else {
    delete sources[baseFaceId];
  }
  partFaceIds.forEach((partFaceId) => delete sources[partFaceId]);

  const transforms = { ...document.transforms };
  const primaryTransform = transforms[primaryFaceId];
  if (primaryTransform) {
    transforms[baseFaceId] = primaryTransform;
  } else {
    delete transforms[baseFaceId];
  }
  partFaceIds.forEach((partFaceId) => delete transforms[partFaceId]);

  const tabs = { ...document.tabs };
  const folds = { ...document.folds };
  const face = parseFaceId(baseFaceId);
  if (face) {
    edgeDirections.forEach((direction) => {
      const baseEdgeId = getEdgeId(direction, face.column, face.row);
      const primaryEdgeId = getEdgeId(
        direction,
        face.column,
        face.row,
        primaryOuterEdgePart[direction]
      );

      if (document.tabs[baseEdgeId] === undefined) {
        const primaryTab = document.tabs[primaryEdgeId];
        if (primaryTab !== undefined) {
          tabs[baseEdgeId] = primaryTab;
        }
      }
      if (!document.folds[baseEdgeId] && document.folds[primaryEdgeId]) {
        folds[baseEdgeId] = true;
      }

      splitParts.forEach((part) => {
        delete tabs[getEdgeId(direction, face.column, face.row, part)];
        delete folds[getEdgeId(direction, face.column, face.row, part)];
      });
    });
  }

  const splits = { ...document.splits };
  delete splits[baseFaceId];

  return {
    ...document,
    faceTextures,
    sources,
    transforms,
    tabs,
    folds,
    splits,
  };
}

// Only updates the split boundary's own position — no part data is touched,
// matching the reference exactly (resizing a split doesn't disturb what's
// already been placed on each part).
export function resizeSplitFace(
  document: DioramaDocument,
  baseFaceId: FaceId,
  rawSplit: SplitSize
): DioramaDocument {
  if (!document.splits[baseFaceId]) {
    return document;
  }
  return {
    ...document,
    splits: {
      ...document.splits,
      [baseFaceId]: sanitizeSplitSize(rawSplit),
    },
  };
}

// Dispatches a Split-mode click on a base face: no existing split -> split;
// an existing split whose size matches the current sliders -> unsplit; an
// existing split whose size differs -> resize to the new sliders.
export function toggleSplitFace(
  document: DioramaDocument,
  baseFaceId: FaceId,
  rawCurrentSplit: SplitSize
): DioramaDocument {
  const currentSplit = sanitizeSplitSize(rawCurrentSplit);
  const existing = document.splits[baseFaceId];
  if (!existing) {
    return splitFace(document, baseFaceId, currentSplit);
  }
  if (isSameSplitSize(existing, currentSplit)) {
    return unsplitFace(document, baseFaceId);
  }
  return resizeSplitFace(document, baseFaceId, currentSplit);
}

// Bulk-apply variant for Split mode's column/row/page header bands. Clicked
// ids may be a mix of base and split-part ids (a part's own region resolves
// back to its base), so they're normalized and deduplicated before
// dispatching one `toggleSplitFace` per distinct base face.
export function toggleSplitForFaces(
  document: DioramaDocument,
  faceIds: FaceId[],
  currentSplit: SplitSize
): DioramaDocument {
  const baseFaceIds = Array.from(
    new Set(
      faceIds.map(getBaseFaceId).filter((id): id is FaceId => id !== null)
    )
  );

  return baseFaceIds.reduce(
    (nextDocument, baseFaceId) =>
      toggleSplitFace(nextDocument, baseFaceId, currentSplit),
    document
  );
}
