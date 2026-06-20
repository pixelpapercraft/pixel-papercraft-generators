import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import { type Flip } from "@genroot/builder/modules/renderers/drawTexture";

export type EditMode =
  | "Blocks"
  | "Tabs"
  | "Folds"
  | "Source"
  | "Destination"
  | "Transform"
  | "Split";

export type DestinationSize = {
  width: number;
  height: number;
};

export type FaceRotation = 0 | 90 | 180 | 270;

export type FaceTransform = {
  rotate: FaceRotation;
  flip: Flip;
};

export type BlockPreset = "Full Blocks" | "Quarter Blocks";

export type SplitSize = {
  width: number;
  height: number;
};

export type SplitPart = "A" | "B" | "C" | "D";

export type SplitConfig = SplitSize & {
  source: Region;
};

export type DioramaDocument = {
  preset: BlockPreset;
  sources: Record<string, Region>;
  destinationColumns: Record<string, number>;
  destinationRows: Record<string, number>;
  transforms: Record<string, FaceTransform>;
  splits: Record<string, SplitConfig>;
};

export type DioramaOptions = {
  ox: number;
  oy: number;
  width: number;
  height: number;
  columns: number;
  rows: number;
  worldColumnOffset: number;
  worldRowOffset: number;
  editMode: EditMode | string | null;
  showEditRegions: boolean;
  document: DioramaDocument;
  currentSource: Region;
  currentDestination: DestinationSize;
  currentTransform: FaceTransform;
  currentSplit: SplitSize;
};

export type RegionDef = {
  id: string;
  region: Region;
  rotation: 0 | 1 | 2 | 3;
};

const dioramaDocumentInputId = "DioramaDocument";

export const defaultSource: Region = [0, 0, 16, 16];
export const defaultDestination: DestinationSize = { width: 16, height: 16 };
export const defaultTransform: FaceTransform = { rotate: 0, flip: "None" };
export const defaultSplit: SplitSize = { width: 8, height: 8 };
export const defaultPreset: BlockPreset = "Full Blocks";
export const blockPresets: BlockPreset[] = ["Full Blocks", "Quarter Blocks"];
const maxEdgeRegionThickness = (16 * 800) / 100 / 4;
const minimumSourceSize = 0.5;
const splitParts: SplitPart[] = ["A", "B", "C", "D"];

export function getFaceId(column: number, row: number): string {
  return `BlockFace${column} ${row}`;
}

function encodeDioramaDocument(document: DioramaDocument): string {
  return JSON.stringify(document);
}

function decodeDioramaDocument(json: string | null): DioramaDocument {
  if (!json) {
    return makeEmptyDioramaDocument();
  }

  try {
    const parsed = JSON.parse(json) as Partial<DioramaDocument>;
    const preset = sanitizePreset(parsed.preset);
    return {
      preset,
      sources: sanitizeSources(parsed.sources),
      destinationColumns: sanitizeDestinations(
        parsed.destinationColumns,
        getDefaultDestinationForPreset(preset).width
      ),
      destinationRows: sanitizeDestinations(
        parsed.destinationRows,
        getDefaultDestinationForPreset(preset).height
      ),
      transforms: sanitizeTransforms(parsed.transforms),
      splits: sanitizeSplits(parsed.splits, preset),
    };
  } catch {
    return makeEmptyDioramaDocument();
  }
}

export function makeEmptyDioramaDocument(
  preset: BlockPreset = defaultPreset
): DioramaDocument {
  return {
    preset,
    sources: {},
    destinationColumns: {},
    destinationRows: {},
    transforms: {},
    splits: {},
  };
}

export function sanitizePreset(preset: unknown): BlockPreset {
  return preset === "Quarter Blocks" ? "Quarter Blocks" : defaultPreset;
}

function sanitizeSources(
  sources: Partial<DioramaDocument>["sources"]
): DioramaDocument["sources"] {
  return Object.fromEntries(
    Object.entries(sources ?? {}).map(([id, source]) => [
      id,
      sanitizeSource(Array.isArray(source) ? source : defaultSource),
    ])
  );
}

export function sanitizeSource([x, y, width, height]: Region): Region {
  const sourceX = sanitizeNumber(x, defaultSource[0]);
  const sourceY = sanitizeNumber(y, defaultSource[1]);
  const sourceWidth = sanitizeNumber(width, defaultSource[2]);
  const sourceHeight = sanitizeNumber(height, defaultSource[3]);
  const clampedX = Math.max(0, Math.min(15.5, roundToHalf(sourceX)));
  const clampedY = Math.max(0, Math.min(15.5, roundToHalf(sourceY)));

  return [
    clampedX,
    clampedY,
    Math.max(
      minimumSourceSize,
      Math.min(roundToHalf(sourceWidth), 16 - clampedX)
    ),
    Math.max(
      minimumSourceSize,
      Math.min(roundToHalf(sourceHeight), 16 - clampedY)
    ),
  ];
}

function sanitizeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function sanitizeDestinations(
  destinations:
    | Partial<DioramaDocument>["destinationColumns"]
    | Partial<DioramaDocument>["destinationRows"],
  defaultValue: number
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(destinations ?? {})
      .map(([id, destination]) => [
        id,
        Math.max(1, Math.round(sanitizeNumber(destination, 16))),
      ])
      .filter(([, destination]) => destination !== defaultValue)
  );
}

function sanitizeTransforms(
  transforms: Partial<DioramaDocument>["transforms"]
): DioramaDocument["transforms"] {
  return Object.fromEntries(
    Object.entries(transforms ?? {})
      .map(([id, transform]): [string, FaceTransform] => [
        id,
        sanitizeTransform(transform),
      ])
      .filter(([, transform]) => !isDefaultTransform(transform))
  );
}

function sanitizeSplits(
  splits: Partial<DioramaDocument>["splits"],
  preset: BlockPreset
): DioramaDocument["splits"] {
  return Object.fromEntries(
    Object.entries(splits ?? {})
      .map(([id, split]) => {
        const baseFaceId = getBaseFaceId(id);
        if (!baseFaceId || baseFaceId !== id) {
          return null;
        }
        const defaultDocument = makeEmptyDioramaDocument(preset);
        return [
          id,
          sanitizeSplitConfig(
            split,
            getDefaultSourceForFace(defaultDocument, baseFaceId)
          ),
        ] as const;
      })
      .filter((entry): entry is readonly [string, SplitConfig] => !!entry)
  );
}

function sanitizeSplitConfig(
  split: unknown,
  defaultSplitSource: Region
): SplitConfig {
  if (!split || typeof split !== "object") {
    return { ...defaultSplit, source: defaultSplitSource };
  }

  const candidate = split as Partial<SplitConfig>;
  return {
    width: sanitizeSplitDimension(candidate.width, defaultSplit.width),
    height: sanitizeSplitDimension(candidate.height, defaultSplit.height),
    source: sanitizeSource(
      Array.isArray(candidate.source) ? candidate.source : defaultSplitSource
    ),
  };
}

export function sanitizeSplitDimension(
  value: unknown,
  fallback: number = defaultSplit.width
): number {
  return Math.max(
    minimumSourceSize,
    Math.min(
      16 - minimumSourceSize,
      roundToHalf(sanitizeNumber(value, fallback))
    )
  );
}

function sanitizeTransform(transform: unknown): FaceTransform {
  if (!transform || typeof transform !== "object") {
    return defaultTransform;
  }

  const candidate = transform as Partial<FaceTransform>;
  return {
    rotate: sanitizeFaceRotation(candidate.rotate),
    flip: sanitizeFlip(candidate.flip),
  };
}

function sanitizeFaceRotation(rotation: unknown): FaceRotation {
  switch (rotation) {
    case 90:
      return 90;
    case 180:
      return 180;
    case 270:
      return 270;
    case 0:
    default:
      return 0;
  }
}

function sanitizeFlip(flip: unknown): Flip {
  switch (flip) {
    case "Horizontal":
      return "Horizontal";
    case "Vertical":
      return "Vertical";
    case "None":
    default:
      return "None";
  }
}

export function isDefaultTransform(transform: FaceTransform): boolean {
  return (
    transform.rotate === defaultTransform.rotate &&
    transform.flip === defaultTransform.flip
  );
}

export function getDioramaDocument(generator: Generator): DioramaDocument {
  return decodeDioramaDocument(
    generator.getStringInputValue(dioramaDocumentInputId)
  );
}

export function setDioramaDocument(
  generator: Generator,
  document: DioramaDocument
): void {
  generator.setStringInputValue(
    dioramaDocumentInputId,
    encodeDioramaDocument(document)
  );
}

export function makeBlockRegions({
  ox,
  oy,
  width,
  height,
  columns,
  rows,
  worldColumnOffset,
  worldRowOffset,
  document,
}: DioramaOptions): RegionDef[] {
  const regions: RegionDef[] = [];
  const columnWidths = makeColumnWidths({
    width,
    columns,
    worldColumnOffset,
    document,
  });
  const rowHeights = makeRowHeights({
    height,
    rows,
    worldRowOffset,
    document,
  });
  const columnOffsets = makeOffsets(columnWidths);
  const rowOffsets = makeOffsets(rowHeights);

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const columnOffset = columnOffsets[column] ?? 0;
      const rowOffset = rowOffsets[row] ?? 0;
      const columnWidth = columnWidths[column] ?? width;
      const rowHeight = rowHeights[row] ?? height;
      const baseFaceId = getFaceId(
        column + worldColumnOffset,
        row + worldRowOffset
      );
      const region: Region = [
        ox + columnOffset,
        oy + rowOffset,
        columnWidth,
        rowHeight,
      ];
      const split = document.splits[baseFaceId];

      if (split) {
        regions.push(...makeSplitBlockRegions(baseFaceId, region, split));
        continue;
      }

      regions.push({
        id: baseFaceId,
        region,
        rotation: 0,
      });
    }
  }
  return regions;
}

function makeSplitBlockRegions(
  baseFaceId: string,
  [x, y, width, height]: Region,
  split: SplitConfig
): RegionDef[] {
  const leftWidth = (width * split.width) / 16;
  const rightWidth = width - leftWidth;
  const topHeight = (height * split.height) / 16;
  const bottomHeight = height - topHeight;

  return [
    {
      id: getSplitFaceId(baseFaceId, "A"),
      region: [x, y, leftWidth, topHeight],
      rotation: 0,
    },
    {
      id: getSplitFaceId(baseFaceId, "B"),
      region: [x + leftWidth, y, rightWidth, topHeight],
      rotation: 0,
    },
    {
      id: getSplitFaceId(baseFaceId, "C"),
      region: [x, y + topHeight, leftWidth, bottomHeight],
      rotation: 0,
    },
    {
      id: getSplitFaceId(baseFaceId, "D"),
      region: [x + leftWidth, y + topHeight, rightWidth, bottomHeight],
      rotation: 0,
    },
  ];
}

export function makeEdgeRegions({
  ox,
  oy,
  width,
  height,
  columns,
  rows,
  worldColumnOffset,
  worldRowOffset,
  document,
}: DioramaOptions): RegionDef[] {
  const blockRegions = makeBlockRegions({
    ox,
    oy,
    width,
    height,
    columns,
    rows,
    worldColumnOffset,
    worldRowOffset,
    document,
  } as DioramaOptions);
  const blockRegionMap = new Map(
    blockRegions.map(({ id, region }) => [id, region])
  );
  const regions = blockRegions.flatMap(({ id, region }) =>
    makeFaceEdgeRegions(id, region, width, height, getEdgeTabThickness)
  );
  const columnWidths = makeColumnWidths({
    width,
    columns,
    worldColumnOffset,
    document,
  });
  const rowHeights = makeRowHeights({
    height,
    rows,
    worldRowOffset,
    document,
  });
  const columnOffsets = makeOffsets(columnWidths);
  const rowOffsets = makeOffsets(rowHeights);
  const getColumnSize = (column: number) =>
    columnWidths[Math.max(0, Math.min(columns - 1, column))] ?? width;
  const getRowSize = (row: number) =>
    rowHeights[Math.max(0, Math.min(rows - 1, row))] ?? height;
  const getTabWidth = (column: number) =>
    getEdgeTabThickness(width, getColumnSize(column));
  const getTabHeight = (row: number) =>
    getEdgeTabThickness(height, getRowSize(row));
  const getColumnOffset = (column: number) => {
    if (column < 0) {
      return -getTabWidth(column);
    }
    if (column >= columns) {
      return getTotalSize(columnWidths);
    }
    return columnOffsets[column] ?? 0;
  };
  const getRowOffset = (row: number) => {
    if (row < 0) {
      return -getTabHeight(row);
    }
    if (row >= rows) {
      return getTotalSize(rowHeights);
    }
    return rowOffsets[row] ?? 0;
  };

  const makeNorth = (column: number, row: number): RegionDef => ({
    id: `North${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      ox + getColumnOffset(column),
      oy + getRowOffset(row),
      getColumnSize(column),
      getTabHeight(row),
    ],
    rotation: 2,
  });
  const makeSouth = (column: number, row: number): RegionDef => ({
    id: `South${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      ox + getColumnOffset(column),
      row < 0
        ? oy - getTabHeight(row)
        : oy + getRowOffset(row) + getRowSize(row) - getTabHeight(row),
      getColumnSize(column),
      getTabHeight(row),
    ],
    rotation: 0,
  });
  const makeEast = (column: number, row: number): RegionDef => ({
    id: `East${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      ox + getColumnOffset(column),
      oy + getRowOffset(row),
      getTabWidth(column),
      getRowSize(row),
    ],
    rotation: 1,
  });
  const makeWest = (column: number, row: number): RegionDef => ({
    id: `West${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      column < 0
        ? ox - getTabWidth(column)
        : ox +
          getColumnOffset(column) +
          getColumnSize(column) -
          getTabWidth(column),
      oy + getRowOffset(row),
      getTabWidth(column),
      getRowSize(row),
    ],
    rotation: 3,
  });
  const makeTopOutsideEdges = (column: number): RegionDef[] =>
    makeOutsideTopSplitEdgeRegions({
      baseFaceId: getFaceId(column + worldColumnOffset, worldRowOffset),
      edgeColumn: column + worldColumnOffset,
      edgeRow: worldRowOffset - 1,
      baseHeight: height,
      blockRegionMap,
      getThickness: getEdgeTabThickness,
      fallback: makeSouth(column, -1),
    });
  const makeLeftOutsideEdges = (row: number): RegionDef[] =>
    makeOutsideLeftSplitEdgeRegions({
      baseFaceId: getFaceId(worldColumnOffset, row + worldRowOffset),
      edgeColumn: worldColumnOffset - 1,
      edgeRow: row + worldRowOffset,
      baseWidth: width,
      blockRegionMap,
      getThickness: getEdgeTabThickness,
      fallback: makeWest(-1, row),
    });

  for (let column = 0; column < columns; column += 1) {
    regions.push(makeNorth(column, rows), ...makeTopOutsideEdges(column));
  }
  for (let row = 0; row < rows; row += 1) {
    regions.push(makeEast(columns, row), ...makeLeftOutsideEdges(row));
  }

  return regions;
}

export function makeEdgeControlRegions({
  ox,
  oy,
  width,
  height,
  columns,
  rows,
  worldColumnOffset,
  worldRowOffset,
  document,
}: DioramaOptions): RegionDef[] {
  const blockRegions = makeBlockRegions({
    ox,
    oy,
    width,
    height,
    columns,
    rows,
    worldColumnOffset,
    worldRowOffset,
    document,
  } as DioramaOptions);
  const blockRegionMap = new Map(
    blockRegions.map(({ id, region }) => [id, region])
  );
  const regions = blockRegions.flatMap(({ id, region }) =>
    makeFaceEdgeRegions(id, region, width, height, (_, faceSize) =>
      getEdgeControlThickness(faceSize)
    )
  );
  const columnWidths = makeColumnWidths({
    width,
    columns,
    worldColumnOffset,
    document,
  });
  const rowHeights = makeRowHeights({
    height,
    rows,
    worldRowOffset,
    document,
  });
  const columnOffsets = makeOffsets(columnWidths);
  const rowOffsets = makeOffsets(rowHeights);
  const getColumnSize = (column: number) =>
    columnWidths[Math.max(0, Math.min(columns - 1, column))] ?? width;
  const getRowSize = (row: number) =>
    rowHeights[Math.max(0, Math.min(rows - 1, row))] ?? height;
  const getTabWidth = (column: number) =>
    getEdgeControlThickness(getColumnSize(column));
  const getTabHeight = (row: number) =>
    getEdgeControlThickness(getRowSize(row));
  const getColumnOffset = (column: number) => {
    if (column < 0) {
      return -getTabWidth(column);
    }
    if (column >= columns) {
      return getTotalSize(columnWidths);
    }
    return columnOffsets[column] ?? 0;
  };
  const getRowOffset = (row: number) => {
    if (row < 0) {
      return -getTabHeight(row);
    }
    if (row >= rows) {
      return getTotalSize(rowHeights);
    }
    return rowOffsets[row] ?? 0;
  };

  const makeNorth = (column: number, row: number): RegionDef => ({
    id: `North${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      ox + getColumnOffset(column),
      oy + getRowOffset(row),
      getColumnSize(column),
      getTabHeight(row),
    ],
    rotation: 2,
  });
  const makeSouth = (column: number, row: number): RegionDef => ({
    id: `South${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      ox + getColumnOffset(column),
      row < 0
        ? oy - getTabHeight(row)
        : oy + getRowOffset(row) + getRowSize(row) - getTabHeight(row),
      getColumnSize(column),
      getTabHeight(row),
    ],
    rotation: 0,
  });
  const makeEast = (column: number, row: number): RegionDef => ({
    id: `East${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      ox + getColumnOffset(column),
      oy + getRowOffset(row),
      getTabWidth(column),
      getRowSize(row),
    ],
    rotation: 1,
  });
  const makeWest = (column: number, row: number): RegionDef => ({
    id: `West${column + worldColumnOffset} ${row + worldRowOffset}`,
    region: [
      column < 0
        ? ox - getTabWidth(column)
        : ox +
          getColumnOffset(column) +
          getColumnSize(column) -
          getTabWidth(column),
      oy + getRowOffset(row),
      getTabWidth(column),
      getRowSize(row),
    ],
    rotation: 3,
  });
  const makeTopOutsideEdges = (column: number): RegionDef[] =>
    makeOutsideTopSplitEdgeRegions({
      baseFaceId: getFaceId(column + worldColumnOffset, worldRowOffset),
      edgeColumn: column + worldColumnOffset,
      edgeRow: worldRowOffset - 1,
      baseHeight: height,
      blockRegionMap,
      getThickness: (_, faceSize) => getEdgeControlThickness(faceSize),
      fallback: makeSouth(column, -1),
    });
  const makeLeftOutsideEdges = (row: number): RegionDef[] =>
    makeOutsideLeftSplitEdgeRegions({
      baseFaceId: getFaceId(worldColumnOffset, row + worldRowOffset),
      edgeColumn: worldColumnOffset - 1,
      edgeRow: row + worldRowOffset,
      baseWidth: width,
      blockRegionMap,
      getThickness: (_, faceSize) => getEdgeControlThickness(faceSize),
      fallback: makeWest(-1, row),
    });

  for (let column = 0; column < columns; column += 1) {
    regions.push(makeNorth(column, rows), ...makeTopOutsideEdges(column));
  }
  for (let row = 0; row < rows; row += 1) {
    regions.push(makeEast(columns, row), ...makeLeftOutsideEdges(row));
  }

  return regions;
}

function makeFaceEdgeRegions(
  faceId: string,
  [x, y, width, height]: Region,
  baseWidth: number,
  baseHeight: number,
  getThickness: (baseSize: number, faceSize: number) => number
): RegionDef[] {
  const tabWidth = getThickness(baseWidth, width);
  const tabHeight = getThickness(baseHeight, height);

  return [
    {
      id: getEdgeId("North", faceId),
      region: [x, y, width, tabHeight],
      rotation: 2,
    },
    {
      id: getEdgeId("South", faceId),
      region: [x, y + height - tabHeight, width, tabHeight],
      rotation: 0,
    },
    {
      id: getEdgeId("East", faceId),
      region: [x, y, tabWidth, height],
      rotation: 1,
    },
    {
      id: getEdgeId("West", faceId),
      region: [x + width - tabWidth, y, tabWidth, height],
      rotation: 3,
    },
  ];
}

function makeOutsideTopSplitEdgeRegions({
  baseFaceId,
  edgeColumn,
  edgeRow,
  baseHeight,
  blockRegionMap,
  getThickness,
  fallback,
}: {
  baseFaceId: string;
  edgeColumn: number;
  edgeRow: number;
  baseHeight: number;
  blockRegionMap: Map<string, Region>;
  getThickness: (baseSize: number, faceSize: number) => number;
  fallback: RegionDef;
}): RegionDef[] {
  const topLeftRegion = blockRegionMap.get(getSplitFaceId(baseFaceId, "A"));
  const topRightRegion = blockRegionMap.get(getSplitFaceId(baseFaceId, "B"));

  if (!topLeftRegion || !topRightRegion) {
    return [fallback];
  }

  return [
    makeOutsideTopSplitEdge(
      "A",
      edgeColumn,
      edgeRow,
      topLeftRegion,
      baseHeight,
      getThickness
    ),
    makeOutsideTopSplitEdge(
      "B",
      edgeColumn,
      edgeRow,
      topRightRegion,
      baseHeight,
      getThickness
    ),
  ];
}

function makeOutsideTopSplitEdge(
  part: SplitPart,
  edgeColumn: number,
  edgeRow: number,
  [x, y, width, height]: Region,
  baseHeight: number,
  getThickness: (baseSize: number, faceSize: number) => number
): RegionDef {
  const tabHeight = getThickness(baseHeight, height);

  return {
    id: `South${edgeColumn} ${edgeRow}${part}`,
    region: [x, y - tabHeight, width, tabHeight],
    rotation: 0,
  };
}

function makeOutsideLeftSplitEdgeRegions({
  baseFaceId,
  edgeColumn,
  edgeRow,
  baseWidth,
  blockRegionMap,
  getThickness,
  fallback,
}: {
  baseFaceId: string;
  edgeColumn: number;
  edgeRow: number;
  baseWidth: number;
  blockRegionMap: Map<string, Region>;
  getThickness: (baseSize: number, faceSize: number) => number;
  fallback: RegionDef;
}): RegionDef[] {
  const topLeftRegion = blockRegionMap.get(getSplitFaceId(baseFaceId, "A"));
  const bottomLeftRegion = blockRegionMap.get(getSplitFaceId(baseFaceId, "C"));

  if (!topLeftRegion || !bottomLeftRegion) {
    return [fallback];
  }

  return [
    makeOutsideLeftSplitEdge(
      "A",
      edgeColumn,
      edgeRow,
      topLeftRegion,
      baseWidth,
      getThickness
    ),
    makeOutsideLeftSplitEdge(
      "C",
      edgeColumn,
      edgeRow,
      bottomLeftRegion,
      baseWidth,
      getThickness
    ),
  ];
}

function makeOutsideLeftSplitEdge(
  part: SplitPart,
  edgeColumn: number,
  edgeRow: number,
  [x, y, width, height]: Region,
  baseWidth: number,
  getThickness: (baseSize: number, faceSize: number) => number
): RegionDef {
  const tabWidth = getThickness(baseWidth, width);

  return {
    id: `West${edgeColumn} ${edgeRow}${part}`,
    region: [x - tabWidth, y, tabWidth, height],
    rotation: 3,
  };
}

export function drawRectangleButton(generator: Generator, region: Region) {
  generator.drawRectangle(region, {
    color: "#2d9cdb",
    lineDash: [2, 2],
    lineDashOffset: 3,
    width: 1,
  });
}

export function getRegionUnion(regions: Region[]): Region | null {
  if (regions.length === 0) {
    return null;
  }

  const left = Math.min(...regions.map(([x]) => x));
  const top = Math.min(...regions.map(([, y]) => y));
  const right = Math.max(...regions.map(([x, , width]) => x + width));
  const bottom = Math.max(...regions.map(([, y, , height]) => y + height));

  return [left, top, right - left, bottom - top];
}

export function getEdgeControlThickness(faceSize: number): number {
  return Math.min(faceSize / 4, maxEdgeRegionThickness);
}

function getEdgeTabThickness(baseSize: number, faceSize: number): number {
  const minimumSourcePixelThickness = baseSize / 16;
  return Math.max(
    minimumSourcePixelThickness,
    Math.min(baseSize / 4, maxEdgeRegionThickness, faceSize / 2)
  );
}

export function getColumnWidth(
  options: Pick<DioramaOptions, "width" | "document">,
  column: number
): number {
  return makeDestinationPixels(
    options.width,
    options.document.destinationColumns[column] ??
      getDefaultDestinationForPreset(options.document.preset).width
  );
}

export function getRowHeight(
  options: Pick<DioramaOptions, "height" | "document">,
  row: number
): number {
  return makeDestinationPixels(
    options.height,
    options.document.destinationRows[row] ??
      getDefaultDestinationForPreset(options.document.preset).height
  );
}

export function getSourceForFace(
  document: DioramaDocument,
  faceId: string
): Region {
  const explicitSource = document.sources[faceId];
  if (explicitSource) {
    return explicitSource;
  }

  const splitFace = getSplitFaceParts(faceId);
  if (splitFace) {
    const split = document.splits[splitFace.baseFaceId];
    if (split) {
      return getSplitSource(split, splitFace.part);
    }
  }

  return getDefaultSourceForFace(document, faceId);
}

export function getTransformForFace(
  document: DioramaDocument,
  faceId: string
): FaceTransform {
  const explicitTransform = document.transforms[faceId];
  if (explicitTransform) {
    return explicitTransform;
  }

  const baseFaceId = getBaseFaceId(faceId);
  if (baseFaceId && baseFaceId !== faceId) {
    if (document.splits[baseFaceId]) {
      return defaultTransform;
    }

    return document.transforms[baseFaceId] ?? defaultTransform;
  }

  return defaultTransform;
}

export function getDefaultDestinationForPreset(
  preset: BlockPreset
): DestinationSize {
  return preset === "Quarter Blocks"
    ? { width: 8, height: 8 }
    : defaultDestination;
}

function getDefaultSourceForFace(
  document: DioramaDocument,
  faceId: string
): Region {
  if (document.preset !== "Quarter Blocks") {
    return defaultSource;
  }

  const position = getFacePosition(faceId);
  if (!position) {
    return defaultSource;
  }

  return [(position.column % 2) * 8, (position.row % 2) * 8, 8, 8];
}

function getFacePosition(
  faceId: string
): { column: number; row: number } | null {
  return parseFaceId(faceId);
}

export function parseFaceId(
  faceId: string
): { column: number; row: number; splitPart: SplitPart | null } | null {
  const match = /^BlockFace(-?\d+) (-?\d+)([ABCD])?$/.exec(faceId);
  if (!match) {
    return null;
  }

  return {
    column: parseInt(match[1] ?? "0", 10),
    row: parseInt(match[2] ?? "0", 10),
    splitPart: sanitizeSplitPart(match[3]),
  };
}

export function getBaseFaceId(faceId: string): string | null {
  const face = parseFaceId(faceId);
  return face ? getFaceId(face.column, face.row) : null;
}

export function getSplitFaceId(baseFaceId: string, part: SplitPart): string {
  return `${baseFaceId}${part}`;
}

export function getSplitFaceParts(
  faceId: string
): { baseFaceId: string; part: SplitPart } | null {
  const face = parseFaceId(faceId);
  if (!face?.splitPart) {
    return null;
  }

  return {
    baseFaceId: getFaceId(face.column, face.row),
    part: face.splitPart,
  };
}

export function getSplitPartFaceIds(baseFaceId: string): string[] {
  return splitParts.map((part) => getSplitFaceId(baseFaceId, part));
}

export function getSplitParts(): SplitPart[] {
  return splitParts;
}

function getSplitSource(split: SplitConfig, part: SplitPart): Region {
  const [x, y, width, height] = split.source;
  const leftWidth = (width * split.width) / 16;
  const rightWidth = width - leftWidth;
  const topHeight = (height * split.height) / 16;
  const bottomHeight = height - topHeight;

  switch (part) {
    case "A":
      return [x, y, leftWidth, topHeight];
    case "B":
      return [x + leftWidth, y, rightWidth, topHeight];
    case "C":
      return [x, y + topHeight, leftWidth, bottomHeight];
    case "D":
      return [x + leftWidth, y + topHeight, rightWidth, bottomHeight];
  }
}

function sanitizeSplitPart(part: string | undefined): SplitPart | null {
  return part === "A" || part === "B" || part === "C" || part === "D"
    ? part
    : null;
}

function getEdgeId(direction: string, faceId: string): string {
  const face = parseFaceId(faceId);
  if (!face) {
    return `${direction}${faceId}`;
  }

  return `${direction}${face.column} ${face.row}${face.splitPart ?? ""}`;
}

export function getColumnCountThatFits({
  baseWidth,
  width,
  document,
}: Pick<DioramaOptions, "width" | "document"> & {
  baseWidth: number;
}): number {
  return getCountThatFits(baseWidth, (column) =>
    getColumnWidth({ width, document }, column)
  );
}

export function getRowCountThatFits({
  baseHeight,
  height,
  document,
}: Pick<DioramaOptions, "height" | "document"> & {
  baseHeight: number;
}): number {
  return getCountThatFits(baseHeight, (row) =>
    getRowHeight({ height, document }, row)
  );
}

function makeColumnWidths({
  width,
  columns,
  worldColumnOffset = 0,
  document,
}: Pick<DioramaOptions, "width" | "columns" | "document"> & {
  worldColumnOffset?: number;
}): number[] {
  return Array.from({ length: columns }, (_, column) =>
    getColumnWidth({ width, document }, column + worldColumnOffset)
  );
}

function makeRowHeights({
  height,
  rows,
  worldRowOffset = 0,
  document,
}: Pick<DioramaOptions, "height" | "rows" | "document"> & {
  worldRowOffset?: number;
}): number[] {
  return Array.from({ length: rows }, (_, row) =>
    getRowHeight({ height, document }, row + worldRowOffset)
  );
}

function makeDestinationPixels(baseSize: number, destinationSize: number) {
  return Math.max(1, Math.round((baseSize * destinationSize) / 16));
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

function getCountThatFits(
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
