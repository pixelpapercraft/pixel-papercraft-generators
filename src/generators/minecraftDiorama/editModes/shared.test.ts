import { describe, expect, it } from "vitest";
import {
  defaultSplit,
  getColumnCountThatFits,
  getSourceForFace,
  getTransformForFace,
  makeBlockRegions,
  makeEdgeControlRegions,
  makeEdgeRegions,
  makeEmptyDioramaDocument,
  sanitizeSource,
  type DioramaOptions,
} from "./shared";

function makeOptions(options: Partial<DioramaOptions> = {}): DioramaOptions {
  return {
    ox: 42,
    oy: 41,
    width: 168,
    height: 168,
    columns: 1,
    rows: 1,
    worldColumnOffset: 0,
    worldRowOffset: 0,
    editMode: "Tabs",
    showEditRegions: false,
    document: makeEmptyDioramaDocument(),
    currentSource: [0, 0, 16, 16],
    currentDestination: { width: 16, height: 16 },
    currentTransform: { rotate: 0, flip: "None" },
    currentSplit: defaultSplit,
    ...options,
  };
}

function findRegion(
  regions: ReturnType<typeof makeEdgeRegions>,
  id: string
): [number, number, number, number] {
  const region = regions.find((candidate) => candidate.id === id)?.region;
  if (!region) {
    throw new Error(`Region not found: ${id}`);
  }
  return region;
}

function findBlockRegion(
  regions: ReturnType<typeof makeBlockRegions>,
  id: string
): [number, number, number, number] {
  const region = regions.find((candidate) => candidate.id === id)?.region;
  if (!region) {
    throw new Error(`Region not found: ${id}`);
  }
  return region;
}

describe("diorama edit mode shared helpers", () => {
  it("caps actual tab regions at the 800% tab height", () => {
    const regions = makeEdgeRegions(makeOptions());

    expect(findRegion(regions, "North0 0")).toEqual([42, 41, 168, 32]);
    expect(findRegion(regions, "East0 0")).toEqual([42, 41, 32, 168]);
  });

  it("caps edge control regions at the 800% tab height", () => {
    const regions = makeEdgeControlRegions(makeOptions());

    expect(findRegion(regions, "North0 0")).toEqual([42, 41, 168, 32]);
    expect(findRegion(regions, "East0 0")).toEqual([42, 41, 32, 168]);
  });

  it("keeps small destination tabs proportional to their face", () => {
    const document = makeEmptyDioramaDocument();
    document.destinationColumns = { 0: 2 };
    document.destinationRows = { 0: 2 };

    const regions = makeEdgeRegions(
      makeOptions({
        width: 128,
        height: 128,
        document,
      })
    );

    expect(findRegion(regions, "North0 0")).toEqual([42, 41, 16, 8]);
    expect(findRegion(regions, "East0 0")).toEqual([42, 41, 8, 16]);
  });

  it("keeps one-source-pixel destination tabs at least one scaled source pixel thick", () => {
    const document = makeEmptyDioramaDocument();
    document.destinationColumns = { 0: 1 };
    document.destinationRows = { 0: 1 };

    const regions = makeEdgeRegions(
      makeOptions({
        width: 128,
        height: 128,
        document,
      })
    );

    expect(findRegion(regions, "North0 0")).toEqual([42, 41, 8, 8]);
    expect(findRegion(regions, "East0 0")).toEqual([42, 41, 8, 8]);
  });

  it("keeps saved source regions in normalized 16px face units", () => {
    expect(sanitizeSource([16, 0, 16, 16])).toEqual([15.5, 0, 0.5, 16]);
  });

  it("uses world offsets when reading destination sizes", () => {
    const document = makeEmptyDioramaDocument();
    document.destinationColumns = { 2: 8 };
    document.destinationRows = { 3: 8 };

    const regions = makeEdgeRegions(
      makeOptions({
        width: 128,
        height: 128,
        worldColumnOffset: 2,
        worldRowOffset: 3,
        document,
      })
    );

    expect(findRegion(regions, "North2 3")).toEqual([42, 41, 64, 32]);
    expect(findRegion(regions, "East2 3")).toEqual([42, 41, 32, 64]);
  });

  it("counts only full columns that fit the page", () => {
    const document = makeEmptyDioramaDocument();
    document.destinationColumns = { 1: 8 };

    expect(
      getColumnCountThatFits({
        baseWidth: 320,
        width: 128,
        document,
      })
    ).toBe(3);
  });

  it("splits a face into four destination regions without moving neighbors", () => {
    const document = makeEmptyDioramaDocument();
    document.splits = {
      "BlockFace0 0": { width: 4, height: 12, source: [0, 0, 16, 16] },
    };

    const regions = makeBlockRegions(
      makeOptions({
        width: 160,
        height: 80,
        columns: 2,
        rows: 1,
        document,
      })
    );

    expect(findBlockRegion(regions, "BlockFace0 0A")).toEqual([42, 41, 40, 60]);
    expect(findBlockRegion(regions, "BlockFace0 0B")).toEqual([
      82, 41, 120, 60,
    ]);
    expect(findBlockRegion(regions, "BlockFace0 0C")).toEqual([
      42, 101, 40, 20,
    ]);
    expect(findBlockRegion(regions, "BlockFace0 0D")).toEqual([
      82, 101, 120, 20,
    ]);
    expect(findBlockRegion(regions, "BlockFace1 0")).toEqual([
      202, 41, 160, 80,
    ]);
  });

  it("derives split child sources from the original face source", () => {
    const document = makeEmptyDioramaDocument();
    document.splits = {
      "BlockFace2 3": { width: 4, height: 12, source: [2, 4, 8, 6] },
    };

    expect(getSourceForFace(document, "BlockFace2 3A")).toEqual([2, 4, 2, 4.5]);
    expect(getSourceForFace(document, "BlockFace2 3B")).toEqual([4, 4, 6, 4.5]);
    expect(getSourceForFace(document, "BlockFace2 3C")).toEqual([
      2, 8.5, 2, 1.5,
    ]);
    expect(getSourceForFace(document, "BlockFace2 3D")).toEqual([
      4, 8.5, 6, 1.5,
    ]);
  });

  it("adds edge regions for split children so internal tabs and folds can be edited", () => {
    const document = makeEmptyDioramaDocument();
    document.splits = {
      "BlockFace0 0": { width: 8, height: 8, source: [0, 0, 16, 16] },
    };

    const regions = makeEdgeRegions(
      makeOptions({
        width: 128,
        height: 128,
        document,
      })
    );

    expect(findRegion(regions, "West0 0A")).toEqual([74, 41, 32, 64]);
    expect(findRegion(regions, "East0 0B")).toEqual([106, 41, 32, 64]);
    expect(findRegion(regions, "South0 0A")).toEqual([42, 73, 64, 32]);
    expect(findRegion(regions, "North0 0C")).toEqual([42, 105, 64, 32]);
  });

  it("splits top and left outside edge regions when the touching edge face is split", () => {
    const document = makeEmptyDioramaDocument();
    document.splits = {
      "BlockFace0 0": { width: 8, height: 8, source: [0, 0, 16, 16] },
    };

    const regions = makeEdgeRegions(
      makeOptions({
        width: 128,
        height: 128,
        document,
      })
    );

    expect(findRegion(regions, "South0 -1A")).toEqual([42, 9, 64, 32]);
    expect(findRegion(regions, "South0 -1B")).toEqual([106, 9, 64, 32]);
    expect(findRegion(regions, "West-1 0A")).toEqual([10, 41, 32, 64]);
    expect(findRegion(regions, "West-1 0C")).toEqual([10, 105, 32, 64]);
  });

  it("does not fall back to full-frame transforms for split child frames", () => {
    const document = makeEmptyDioramaDocument();
    document.splits = {
      "BlockFace0 0": { width: 8, height: 8, source: [0, 0, 16, 16] },
    };
    document.transforms = {
      "BlockFace0 0": { rotate: 180, flip: "Horizontal" },
    };

    expect(getTransformForFace(document, "BlockFace0 0")).toEqual({
      rotate: 180,
      flip: "Horizontal",
    });
    expect(getTransformForFace(document, "BlockFace0 0A")).toEqual({
      rotate: 0,
      flip: "None",
    });
  });
});
