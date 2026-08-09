import { describe, expect, it } from "vitest";
import type { SelectedTexture } from "@genroot/builder";
import {
  addFaceTexture,
  applyFaceTransform,
  clampSourceRegion,
  cycleTab,
  defaultFaceTransform,
  defaultSplitSize,
  eraseFaceTexture,
  fullSourceRegion,
  getBaseFaceId,
  getColumnWidth,
  getDefaultSourceForFace,
  getDestinationColumnId,
  getDestinationRowId,
  getEdgeId,
  getFaceId,
  getFaceSource,
  getFaceSplit,
  getFaceTransform,
  getRowHeight,
  getSourceColumnId,
  getSourceRowId,
  getSplitColumnId,
  getSplitFaceId,
  getSplitPageId,
  getSplitPartFaceIds,
  getSplitPartFromFaceId,
  getSplitRowId,
  getTransformColumnId,
  getTransformRowId,
  getWorldUnitsForPreset,
  isDefaultTransform,
  makeEmptyDioramaDocument,
  parseDestinationColumnId,
  parseDestinationRowId,
  parseFaceId,
  parseSourceColumnId,
  parseSourceRowId,
  parseSplitColumnId,
  parseSplitPageId,
  parseSplitRowId,
  parseTransformColumnId,
  parseTransformRowId,
  resizeSplitFace,
  sanitizeSplitDimension,
  setColumnWidth,
  setFaceSource,
  setFaceSourceForFaces,
  setFaceTransform,
  setFaceTransformForFaces,
  setPreset,
  setRowHeight,
  splitFace,
  toggleFold,
  toggleSplitFace,
  toggleSplitForFaces,
  unsplitFace,
  type DioramaDocument,
  type FaceTransform,
  type Region,
  type SplitSize,
} from "./dioramaDocument";

function makeTexture(textureDefId: string): SelectedTexture {
  const texture: SelectedTexture = {
    textureDefId,
    frame: {
      id: "frame",
      label: "frame",
      rectangle: [0, 0, 16, 16],
      crop: [0, 0, 16, 16],
    },
    rotation: "Rot0",
    flip: "None",
    blend: null,
  };
  return texture;
}

describe("makeEmptyDioramaDocument", () => {
  it("defaults to Full Blocks with empty state", () => {
    expect(makeEmptyDioramaDocument()).toEqual<DioramaDocument>({
      preset: "Full Blocks",
      faceTextures: {},
      sources: {},
      destinationColumns: {},
      destinationRows: {},
      transforms: {},
      tabs: {},
      folds: {},
      splits: {},
    });
  });

  it("accepts an explicit preset", () => {
    expect(makeEmptyDioramaDocument("Quarter Blocks")).toEqual<DioramaDocument>(
      {
        preset: "Quarter Blocks",
        faceTextures: {},
        sources: {},
        destinationColumns: {},
        destinationRows: {},
        transforms: {},
        tabs: {},
        folds: {},
        splits: {},
      }
    );
  });
});

describe("getFaceId / getEdgeId", () => {
  it("formats a face id from its column and row", () => {
    expect(getFaceId(2, -1)).toBe("BlockFace2 -1");
  });

  it("formats an edge id from its direction, column, and row", () => {
    expect(getEdgeId("North", 2, -1)).toBe("North2 -1");
  });
});

describe("setPreset", () => {
  it("changes only the preset", () => {
    const document = makeEmptyDioramaDocument();
    const next = setPreset(document, "Quarter Blocks");
    expect(next).toEqual<DioramaDocument>({
      ...document,
      preset: "Quarter Blocks",
    });
  });
});

describe("addFaceTexture / eraseFaceTexture", () => {
  it("appends a texture to an empty face's stack", () => {
    const document = makeEmptyDioramaDocument();
    const texture = makeTexture("stone");
    const next = addFaceTexture(document, getFaceId(0, 0), texture);
    expect(next.faceTextures).toEqual<DioramaDocument["faceTextures"]>({
      "BlockFace0 0": [texture],
    });
  });

  it("stacks multiple textures on the same face in click order", () => {
    const first = makeTexture("stone");
    const second = makeTexture("dirt");
    const faceId = getFaceId(0, 0);
    const document = addFaceTexture(
      addFaceTexture(makeEmptyDioramaDocument(), faceId, first),
      faceId,
      second
    );
    expect(document.faceTextures[faceId]).toEqual<SelectedTexture[]>([
      first,
      second,
    ]);
  });

  it("leaves other faces untouched", () => {
    const document = makeEmptyDioramaDocument();
    const next = addFaceTexture(document, getFaceId(0, 0), makeTexture("x"));
    expect(next.faceTextures[getFaceId(1, 0)]).toBeUndefined();
  });

  it("erases the most recently placed texture first", () => {
    const first = makeTexture("stone");
    const second = makeTexture("dirt");
    const faceId = getFaceId(0, 0);
    const stacked = addFaceTexture(
      addFaceTexture(makeEmptyDioramaDocument(), faceId, first),
      faceId,
      second
    );
    const erased = eraseFaceTexture(stacked, faceId);
    expect(erased.faceTextures[faceId]).toEqual<SelectedTexture[]>([first]);
  });

  it("removes the face key entirely once its stack is empty", () => {
    const faceId = getFaceId(0, 0);
    const document = addFaceTexture(
      makeEmptyDioramaDocument(),
      faceId,
      makeTexture("stone")
    );
    const erased = eraseFaceTexture(document, faceId);
    expect(Object.keys(erased.faceTextures)).toEqual<string[]>([]);
  });

  it("erasing an already-empty face is a no-op", () => {
    const document = makeEmptyDioramaDocument();
    const erased = eraseFaceTexture(document, getFaceId(0, 0));
    expect(erased).toBe(document);
  });
});

describe("cycleTab", () => {
  it("cycles None -> Full -> Left -> Middle -> Right -> None", () => {
    const edgeId = getEdgeId("North", 0, 0);
    const expected: DioramaDocument["tabs"][string][] = [
      "Full",
      "Left",
      "Middle",
      "Right",
    ];

    let document = makeEmptyDioramaDocument();
    for (const expectedTab of expected) {
      document = cycleTab(document, edgeId);
      expect(document.tabs[edgeId]).toBe(expectedTab);
    }

    document = cycleTab(document, edgeId);
    expect(document.tabs[edgeId]).toBeUndefined();
  });

  it("leaves other edges untouched", () => {
    const document = cycleTab(
      makeEmptyDioramaDocument(),
      getEdgeId("North", 0, 0)
    );
    expect(document.tabs[getEdgeId("South", 0, 0)]).toBeUndefined();
  });
});

describe("toggleFold", () => {
  it("enables a fold on the first toggle", () => {
    const edgeId = getEdgeId("North", 0, 0);
    const document = toggleFold(makeEmptyDioramaDocument(), edgeId);
    expect(document.folds).toEqual<DioramaDocument["folds"]>({
      [edgeId]: true,
    });
  });

  it("removes the fold key on the second toggle", () => {
    const edgeId = getEdgeId("North", 0, 0);
    const once = toggleFold(makeEmptyDioramaDocument(), edgeId);
    const twice = toggleFold(once, edgeId);
    expect(twice.folds).toEqual<DioramaDocument["folds"]>({});
  });
});

describe("parseFaceId", () => {
  it("recovers the column and row from a formatted id", () => {
    expect(parseFaceId(getFaceId(3, -2))).toEqual({ column: 3, row: -2 });
  });

  it("returns null for a non-face id", () => {
    expect(parseFaceId("North0 0")).toBeNull();
    expect(parseFaceId("not a face id")).toBeNull();
  });
});

describe("getDefaultSourceForFace", () => {
  it("is the full 16x16 texture for Full Blocks, regardless of position", () => {
    const document = makeEmptyDioramaDocument("Full Blocks");
    expect(getDefaultSourceForFace(document, getFaceId(0, 0))).toEqual(
      fullSourceRegion
    );
    expect(getDefaultSourceForFace(document, getFaceId(3, 5))).toEqual(
      fullSourceRegion
    );
  });

  it("picks one of the 4 quadrants for Quarter Blocks, by column/row parity", () => {
    const document = makeEmptyDioramaDocument("Quarter Blocks");
    expect(getDefaultSourceForFace(document, getFaceId(0, 0))).toEqual([
      0, 0, 8, 8,
    ]);
    expect(getDefaultSourceForFace(document, getFaceId(1, 0))).toEqual([
      8, 0, 8, 8,
    ]);
    expect(getDefaultSourceForFace(document, getFaceId(0, 1))).toEqual([
      0, 8, 8, 8,
    ]);
    expect(getDefaultSourceForFace(document, getFaceId(1, 1))).toEqual([
      8, 8, 8, 8,
    ]);
    // Parity repeats every 2 columns/rows, so a 2-away neighbor matches.
    expect(getDefaultSourceForFace(document, getFaceId(2, 2))).toEqual([
      0, 0, 8, 8,
    ]);
  });
});

describe("getFaceSource", () => {
  it("falls back to the preset default when no explicit source is set", () => {
    const document = makeEmptyDioramaDocument("Quarter Blocks");
    expect(getFaceSource(document, getFaceId(1, 0))).toEqual([8, 0, 8, 8]);
  });

  it("returns the explicit source once one has been set", () => {
    const faceId = getFaceId(0, 0);
    const document = setFaceSource(
      makeEmptyDioramaDocument(),
      faceId,
      [4, 4, 8, 8]
    );
    expect(getFaceSource(document, faceId)).toEqual([4, 4, 8, 8]);
  });
});

describe("clampSourceRegion", () => {
  it("rounds each value to the nearest half unit", () => {
    expect(clampSourceRegion([1.2, 1.24, 8.26, 8.3])).toEqual<Region>([
      1, 1, 8.5, 8.5,
    ]);
  });

  it("clamps x/y into [0, 16 - minimum size] and width/height to stay in bounds", () => {
    expect(clampSourceRegion([-4, 20, 16, 16])).toEqual<Region>([
      0, 15.5, 16, 0.5,
    ]);
  });

  it("floors width/height at the minimum size of 0.5", () => {
    expect(clampSourceRegion([0, 0, 0, -1])).toEqual<Region>([0, 0, 0.5, 0.5]);
  });
});

describe("setFaceSource / setFaceSourceForFaces", () => {
  it("sets a clamped source for a single face without touching others", () => {
    const document = setFaceSource(
      makeEmptyDioramaDocument(),
      getFaceId(0, 0),
      [20, 0, 8, 8]
    );
    expect(document.sources).toEqual<DioramaDocument["sources"]>({
      "BlockFace0 0": [15.5, 0, 0.5, 8],
    });
  });

  it("sets the same clamped source across every given face", () => {
    const faceIds = [getFaceId(0, 0), getFaceId(1, 0), getFaceId(2, 1)];
    const document = setFaceSourceForFaces(
      makeEmptyDioramaDocument(),
      faceIds,
      [0, 0, 8, 8]
    );
    faceIds.forEach((faceId) => {
      expect(document.sources[faceId]).toEqual<Region>([0, 0, 8, 8]);
    });
  });
});

describe("getSourceColumnId / getSourceRowId round-trip", () => {
  it("parses a column id back to its column number", () => {
    expect(parseSourceColumnId(getSourceColumnId(3))).toBe(3);
  });

  it("parses a row id back to its row number", () => {
    expect(parseSourceRowId(getSourceRowId(-2))).toBe(-2);
  });

  it("returns null for ids from the other namespace or an unrelated id", () => {
    expect(parseSourceColumnId(getSourceRowId(0))).toBeNull();
    expect(parseSourceRowId(getSourceColumnId(0))).toBeNull();
    expect(parseSourceColumnId(getFaceId(0, 0))).toBeNull();
  });
});

describe("getWorldUnitsForPreset", () => {
  it("is 16 for Full Blocks and 8 for Quarter Blocks", () => {
    expect(getWorldUnitsForPreset("Full Blocks")).toBe(16);
    expect(getWorldUnitsForPreset("Quarter Blocks")).toBe(8);
  });
});

describe("getColumnWidth / getRowHeight", () => {
  it("falls back to the preset default when no override is set", () => {
    const document = makeEmptyDioramaDocument("Full Blocks");
    expect(getColumnWidth(document, 0)).toBe(16);
    expect(getRowHeight(document, 0)).toBe(16);
  });

  it("uses the Quarter Blocks default when that preset is active", () => {
    const document = makeEmptyDioramaDocument("Quarter Blocks");
    expect(getColumnWidth(document, 0)).toBe(8);
    expect(getRowHeight(document, 0)).toBe(8);
  });

  it("returns an explicit override once one is set", () => {
    const document = setColumnWidth(makeEmptyDioramaDocument(), 2, 24);
    expect(getColumnWidth(document, 2)).toBe(24);
    expect(getColumnWidth(document, 0)).toBe(16);
  });
});

describe("setColumnWidth / setRowHeight", () => {
  it("rounds to the nearest whole Minecraft unit", () => {
    const document = setColumnWidth(makeEmptyDioramaDocument(), 0, 10.6);
    expect(getColumnWidth(document, 0)).toBe(11);
  });

  it("floors at a minimum of 1 unit", () => {
    const document = setRowHeight(makeEmptyDioramaDocument(), 0, -5);
    expect(getRowHeight(document, 0)).toBe(1);
  });

  it("removes the override when set back to the preset default", () => {
    const resized = setColumnWidth(makeEmptyDioramaDocument(), 0, 24);
    expect(resized.destinationColumns).toEqual({ 0: 24 });

    const reset = setColumnWidth(resized, 0, 16);
    expect(reset.destinationColumns).toEqual({});
  });

  it("leaves other columns/rows untouched", () => {
    const document = setColumnWidth(makeEmptyDioramaDocument(), 0, 24);
    expect(getColumnWidth(document, 1)).toBe(16);
  });
});

describe("getDestinationColumnId / getDestinationRowId round-trip", () => {
  it("parses a column id back to its column number", () => {
    expect(parseDestinationColumnId(getDestinationColumnId(3))).toBe(3);
  });

  it("parses a row id back to its row number", () => {
    expect(parseDestinationRowId(getDestinationRowId(-2))).toBe(-2);
  });

  it("returns null for ids from another namespace", () => {
    expect(parseDestinationColumnId(getDestinationRowId(0))).toBeNull();
    expect(parseDestinationRowId(getDestinationColumnId(0))).toBeNull();
    expect(parseDestinationColumnId(getSourceColumnId(0))).toBeNull();
    expect(parseDestinationColumnId(getFaceId(0, 0))).toBeNull();
  });
});

describe("getTransformColumnId / getTransformRowId round-trip", () => {
  it("parses a column id back to its column number", () => {
    expect(parseTransformColumnId(getTransformColumnId(3))).toBe(3);
  });

  it("parses a row id back to its row number", () => {
    expect(parseTransformRowId(getTransformRowId(-2))).toBe(-2);
  });

  it("returns null for ids from another namespace", () => {
    expect(parseTransformColumnId(getTransformRowId(0))).toBeNull();
    expect(parseTransformRowId(getTransformColumnId(0))).toBeNull();
    expect(parseTransformColumnId(getDestinationColumnId(0))).toBeNull();
    expect(parseTransformColumnId(getFaceId(0, 0))).toBeNull();
  });
});

describe("isDefaultTransform", () => {
  it("is true only for Rot0/None", () => {
    expect(isDefaultTransform(defaultFaceTransform)).toBe(true);
    expect(isDefaultTransform({ rotation: "Rot90", flip: "None" })).toBe(false);
    expect(isDefaultTransform({ rotation: "Rot0", flip: "Horizontal" })).toBe(
      false
    );
  });
});

describe("getFaceTransform", () => {
  it("falls back to the default (identity) transform when none is set", () => {
    const document = makeEmptyDioramaDocument();
    expect(getFaceTransform(document, getFaceId(0, 0))).toEqual(
      defaultFaceTransform
    );
  });

  it("returns the explicit transform once one has been set", () => {
    const faceId = getFaceId(0, 0);
    const transform: FaceTransform = { rotation: "Rot90", flip: "Horizontal" };
    const document = setFaceTransform(
      makeEmptyDioramaDocument(),
      faceId,
      transform
    );
    expect(getFaceTransform(document, faceId)).toEqual(transform);
  });
});

describe("setFaceTransform / setFaceTransformForFaces", () => {
  it("sets a transform for a single face without touching others", () => {
    const transform: FaceTransform = { rotation: "Rot180", flip: "None" };
    const document = setFaceTransform(
      makeEmptyDioramaDocument(),
      getFaceId(0, 0),
      transform
    );
    expect(document.transforms).toEqual<DioramaDocument["transforms"]>({
      "BlockFace0 0": transform,
    });
  });

  it("removes the override when set back to the default transform", () => {
    const faceId = getFaceId(0, 0);
    const rotated = setFaceTransform(makeEmptyDioramaDocument(), faceId, {
      rotation: "Rot90",
      flip: "None",
    });
    expect(rotated.transforms).toEqual({
      [faceId]: { rotation: "Rot90", flip: "None" },
    });

    const reset = setFaceTransform(rotated, faceId, defaultFaceTransform);
    expect(reset.transforms).toEqual({});
  });

  it("sets the same transform across every given face", () => {
    const faceIds = [getFaceId(0, 0), getFaceId(1, 0), getFaceId(2, 1)];
    const transform: FaceTransform = { rotation: "Rot270", flip: "Vertical" };
    const document = setFaceTransformForFaces(
      makeEmptyDioramaDocument(),
      faceIds,
      transform
    );
    faceIds.forEach((faceId) => {
      expect(document.transforms[faceId]).toEqual(transform);
    });
  });
});

describe("applyFaceTransform", () => {
  function makeTexture(
    overrides: Partial<SelectedTexture> = {}
  ): SelectedTexture {
    return {
      textureDefId: "stone",
      frame: {
        id: "frame",
        label: "frame",
        rectangle: [0, 0, 16, 16],
        crop: [0, 0, 16, 16],
      },
      rotation: "Rot0",
      flip: "None",
      blend: null,
      ...overrides,
    };
  }

  it("returns the same texture unchanged for the default (identity) transform", () => {
    const texture = makeTexture({ rotation: "Rot90", flip: "Horizontal" });
    expect(applyFaceTransform(texture, defaultFaceTransform)).toBe(texture);
  });

  it("adds a pure rotation directly to an unflipped, unrotated texture", () => {
    const texture = makeTexture();
    const result = applyFaceTransform(texture, {
      rotation: "Rot90",
      flip: "None",
    });
    expect(result.rotation).toBe("Rot90");
    expect(result.flip).toBe("None");
  });

  it("applies a pure flip directly to an unflipped, unrotated texture", () => {
    const texture = makeTexture();
    const result = applyFaceTransform(texture, {
      rotation: "Rot0",
      flip: "Horizontal",
    });
    expect(result.rotation).toBe("Rot0");
    expect(result.flip).toBe("Horizontal");
  });

  it("cancels out when the same flip is applied twice", () => {
    const texture = makeTexture({ rotation: "Rot0", flip: "Horizontal" });
    const result = applyFaceTransform(texture, {
      rotation: "Rot0",
      flip: "Horizontal",
    });
    expect(result).toEqual({ ...texture, rotation: "Rot0", flip: "None" });
  });

  it("composes a horizontal flip followed by a vertical flip into a pure 180-degree rotation", () => {
    // Flipping about both axes in turn is geometrically the same as a
    // half-turn: nothing ends up mirrored, everything ends up upside down.
    const texture = makeTexture({ rotation: "Rot0", flip: "Horizontal" });
    const result = applyFaceTransform(texture, {
      rotation: "Rot0",
      flip: "Vertical",
    });
    expect(result).toEqual({ ...texture, rotation: "Rot180", flip: "None" });
  });

  it("adds rotation on top of an already-rotated texture, wrapping at 360", () => {
    const texture = makeTexture({ rotation: "Rot180", flip: "None" });
    const result = applyFaceTransform(texture, {
      rotation: "Rot270",
      flip: "None",
    });
    // Rot180 + Rot270 = 450 degrees = 90 degrees.
    expect(result.rotation).toBe("Rot90");
    expect(result.flip).toBe("None");
  });
});

describe("sanitizeSplitDimension", () => {
  it("rounds to the nearest half unit", () => {
    expect(sanitizeSplitDimension(4.24)).toBe(4);
    expect(sanitizeSplitDimension(4.26)).toBe(4.5);
  });

  it("clamps into [0.5, 15.5]", () => {
    expect(sanitizeSplitDimension(-3)).toBe(0.5);
    expect(sanitizeSplitDimension(99)).toBe(15.5);
  });
});

describe("getSplitFaceId / getBaseFaceId / getSplitPartFromFaceId", () => {
  it("formats a split part id from its base and part", () => {
    expect(getSplitFaceId(getFaceId(2, 3), "A")).toBe("BlockFace2 3A");
  });

  it("resolves a base face id unchanged", () => {
    expect(getBaseFaceId(getFaceId(2, 3))).toBe("BlockFace2 3");
  });

  it("resolves a split part id back to its base", () => {
    expect(getBaseFaceId("BlockFace2 3A")).toBe("BlockFace2 3");
    expect(getBaseFaceId("BlockFace2 3D")).toBe("BlockFace2 3");
  });

  it("returns null for an id that is neither a base nor a split part id", () => {
    expect(getBaseFaceId("not a face id")).toBeNull();
    expect(getBaseFaceId("North2 3")).toBeNull();
  });

  it("recovers the part from a split face id, and null from a base id", () => {
    expect(getSplitPartFromFaceId("BlockFace2 3A")).toBe("A");
    expect(getSplitPartFromFaceId(getFaceId(2, 3))).toBeNull();
  });

  it("lists all 4 part ids for a base face", () => {
    expect(getSplitPartFaceIds(getFaceId(0, 0))).toEqual([
      "BlockFace0 0A",
      "BlockFace0 0B",
      "BlockFace0 0C",
      "BlockFace0 0D",
    ]);
  });
});

describe("getEdgeId with a split part", () => {
  it("appends the part letter", () => {
    expect(getEdgeId("North", 2, 3, "A")).toBe("North2 3A");
  });

  it("matches the plain id when no part is given", () => {
    expect(getEdgeId("North", 2, 3)).toBe("North2 3");
  });
});

describe("getSplitColumnId / getSplitRowId / getSplitPageId round-trip", () => {
  it("parses a column id back to its column number", () => {
    expect(parseSplitColumnId(getSplitColumnId(3))).toBe(3);
  });

  it("parses a row id back to its row number", () => {
    expect(parseSplitRowId(getSplitRowId(-2))).toBe(-2);
  });

  it("parses a page id back to its rowOffset", () => {
    expect(parseSplitPageId(getSplitPageId(16))).toBe(16);
  });

  it("returns null for ids from another namespace", () => {
    expect(parseSplitColumnId(getSplitRowId(0))).toBeNull();
    expect(parseSplitRowId(getSplitColumnId(0))).toBeNull();
    expect(parseSplitPageId(getSplitColumnId(0))).toBeNull();
    expect(parseSplitColumnId(getTransformColumnId(0))).toBeNull();
    expect(parseSplitColumnId(getFaceId(0, 0))).toBeNull();
  });
});

describe("splitFace", () => {
  const baseFaceId = getFaceId(2, 3);
  const split: SplitSize = { width: 4, height: 12 };

  it("records the split size, retrievable via getFaceSplit", () => {
    const document = splitFace(makeEmptyDioramaDocument(), baseFaceId, split);
    expect(getFaceSplit(document, baseFaceId)).toEqual(split);
    expect(getFaceSplit(document, getFaceId(0, 0))).toBeNull();
  });

  it("copies the base's texture stack verbatim into all 4 parts", () => {
    const texture = makeTexture("stone");
    const withTexture = addFaceTexture(
      makeEmptyDioramaDocument(),
      baseFaceId,
      texture
    );
    const document = splitFace(withTexture, baseFaceId, split);

    getSplitPartFaceIds(baseFaceId).forEach((partFaceId) => {
      expect(document.faceTextures[partFaceId]).toEqual([texture]);
    });
    // The base's own (now dormant) entry is left in place, not deleted.
    expect(document.faceTextures[baseFaceId]).toEqual([texture]);
  });

  it("does not overwrite a part that already has its own texture", () => {
    const baseTexture = makeTexture("stone");
    const partTexture = makeTexture("dirt");
    const partFaceId = getSplitFaceId(baseFaceId, "A");
    const seeded = addFaceTexture(
      addFaceTexture(makeEmptyDioramaDocument(), baseFaceId, baseTexture),
      partFaceId,
      partTexture
    );
    const document = splitFace(seeded, baseFaceId, split);
    expect(document.faceTextures[partFaceId]).toEqual([partTexture]);
  });

  it("quarters the base's effective source across the 4 parts using the split fractions", () => {
    const withSource = setFaceSource(
      makeEmptyDioramaDocument(),
      baseFaceId,
      [0, 0, 16, 16]
    );
    const document = splitFace(withSource, baseFaceId, split);

    // split = { width: 4, height: 12 } out of a 16-unit source -> left
    // quarter is 1/4 wide, top is 3/4 tall.
    expect(document.sources[getSplitFaceId(baseFaceId, "A")]).toEqual([
      0, 0, 4, 12,
    ]);
    expect(document.sources[getSplitFaceId(baseFaceId, "B")]).toEqual([
      4, 0, 12, 12,
    ]);
    expect(document.sources[getSplitFaceId(baseFaceId, "C")]).toEqual([
      0, 12, 4, 4,
    ]);
    expect(document.sources[getSplitFaceId(baseFaceId, "D")]).toEqual([
      4, 12, 12, 4,
    ]);
  });

  it("does not overwrite a part that already has its own source", () => {
    const partFaceId = getSplitFaceId(baseFaceId, "A");
    const seeded = setFaceSource(
      makeEmptyDioramaDocument(),
      partFaceId,
      [1, 1, 2, 2]
    );
    const document = splitFace(seeded, baseFaceId, split);
    expect(document.sources[partFaceId]).toEqual([1, 1, 2, 2]);
  });

  it("copies a non-default base transform verbatim into missing parts only", () => {
    const transform: FaceTransform = { rotation: "Rot90", flip: "Horizontal" };
    const withTransform = setFaceTransform(
      makeEmptyDioramaDocument(),
      baseFaceId,
      transform
    );
    const document = splitFace(withTransform, baseFaceId, split);

    getSplitPartFaceIds(baseFaceId).forEach((partFaceId) => {
      expect(document.transforms[partFaceId]).toEqual(transform);
    });
  });

  it("leaves parts untouched when the base transform is the default", () => {
    const document = splitFace(makeEmptyDioramaDocument(), baseFaceId, split);
    getSplitPartFaceIds(baseFaceId).forEach((partFaceId) => {
      expect(document.transforms[partFaceId]).toBeUndefined();
    });
  });

  it("seeds each part's two true outer edges from the base's matching direction", () => {
    let withEdges = makeEmptyDioramaDocument();
    withEdges = cycleTab(withEdges, getEdgeId("North", 2, 3)); // -> "Full"
    withEdges = toggleFold(withEdges, getEdgeId("West", 2, 3));
    const document = splitFace(withEdges, baseFaceId, split);

    // North belongs to the top row: A and B.
    expect(document.tabs[getEdgeId("North", 2, 3, "A")]).toBe("Full");
    expect(document.tabs[getEdgeId("North", 2, 3, "B")]).toBe("Full");
    // West belongs to the left column: A and C.
    expect(document.folds[getEdgeId("West", 2, 3, "A")]).toBe(true);
    expect(document.folds[getEdgeId("West", 2, 3, "C")]).toBe(true);
    // South/East were never set on the base, so B/D's South and A/C's East
    // stay unset — this also proves East does NOT inherit from A/C (the
    // reference's buggy pairing), since West was the only edge seeded.
    expect(document.tabs[getEdgeId("South", 2, 3, "C")]).toBeUndefined();
    expect(document.tabs[getEdgeId("East", 2, 3, "B")]).toBeUndefined();
  });

  it("leaves every internal seam edge unset", () => {
    let withEdges = makeEmptyDioramaDocument();
    withEdges = cycleTab(withEdges, getEdgeId("North", 2, 3));
    withEdges = cycleTab(withEdges, getEdgeId("South", 2, 3));
    withEdges = cycleTab(withEdges, getEdgeId("East", 2, 3));
    withEdges = cycleTab(withEdges, getEdgeId("West", 2, 3));
    withEdges = toggleFold(withEdges, getEdgeId("North", 2, 3));
    withEdges = toggleFold(withEdges, getEdgeId("South", 2, 3));
    withEdges = toggleFold(withEdges, getEdgeId("East", 2, 3));
    withEdges = toggleFold(withEdges, getEdgeId("West", 2, 3));
    const document = splitFace(withEdges, baseFaceId, split);

    // Internal seams: A.East/B.West (A|B), A.South/C.North (A|C),
    // B.South/D.North (B|D), C.East/D.West (C|D).
    const internalEdges: [string, "East" | "South" | "West" | "North"][] = [
      ["A", "East"],
      ["B", "West"],
      ["A", "South"],
      ["C", "North"],
      ["B", "South"],
      ["D", "North"],
      ["C", "East"],
      ["D", "West"],
    ];
    internalEdges.forEach(([part, direction]) => {
      const edgeId = getEdgeId(direction, 2, 3, part as never);
      expect(document.tabs[edgeId]).toBeUndefined();
      expect(document.folds[edgeId]).toBeUndefined();
    });
  });
});

describe("resizeSplitFace", () => {
  const baseFaceId = getFaceId(2, 3);

  it("updates only the split size, leaving part data untouched", () => {
    const texture = makeTexture("stone");
    const split = splitFace(
      addFaceTexture(makeEmptyDioramaDocument(), baseFaceId, texture),
      baseFaceId,
      defaultSplitSize
    );
    const resized = resizeSplitFace(split, baseFaceId, { width: 2, height: 2 });

    expect(getFaceSplit(resized, baseFaceId)).toEqual({
      width: 2,
      height: 2,
    });
    expect(resized.faceTextures[getSplitFaceId(baseFaceId, "A")]).toEqual([
      texture,
    ]);
  });

  it("is a no-op when the face isn't split", () => {
    const document = makeEmptyDioramaDocument();
    expect(resizeSplitFace(document, baseFaceId, defaultSplitSize)).toBe(
      document
    );
  });
});

describe("unsplitFace", () => {
  const baseFaceId = getFaceId(2, 3);

  it("is a no-op when the face isn't split", () => {
    const document = makeEmptyDioramaDocument();
    expect(unsplitFace(document, baseFaceId)).toBe(document);
  });

  it("restores the base from part A's current texture/source/transform", () => {
    const split = splitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    const aFaceId = getSplitFaceId(baseFaceId, "A");
    const aTexture = makeTexture("emerald");
    const transform: FaceTransform = { rotation: "Rot270", flip: "Vertical" };
    const edited = setFaceTransform(
      setFaceSource(
        addFaceTexture(split, aFaceId, aTexture),
        aFaceId,
        [1, 2, 3, 4]
      ),
      aFaceId,
      transform
    );

    const merged = unsplitFace(edited, baseFaceId);

    expect(merged.faceTextures[baseFaceId]).toEqual([aTexture]);
    expect(merged.sources[baseFaceId]).toEqual([1, 2, 3, 4]);
    expect(merged.transforms[baseFaceId]).toEqual(transform);
    expect(getFaceSplit(merged, baseFaceId)).toBeNull();
  });

  it("clears all 4 parts' texture/source/transform and all 16 edge slots", () => {
    const split = splitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    const aFaceId = getSplitFaceId(baseFaceId, "A");
    const bFaceId = getSplitFaceId(baseFaceId, "B");
    const seeded = setFaceTransform(
      setFaceSource(
        addFaceTexture(split, aFaceId, makeTexture("emerald")),
        bFaceId,
        [0, 0, 4, 4]
      ),
      bFaceId,
      { rotation: "Rot90", flip: "None" }
    );
    const merged = unsplitFace(seeded, baseFaceId);

    getSplitPartFaceIds(baseFaceId).forEach((partFaceId) => {
      expect(merged.faceTextures[partFaceId]).toBeUndefined();
      expect(merged.sources[partFaceId]).toBeUndefined();
      expect(merged.transforms[partFaceId]).toBeUndefined();
    });
    (["North", "South", "East", "West"] as const).forEach((direction) => {
      (["A", "B", "C", "D"] as const).forEach((part) => {
        const edgeId = getEdgeId(direction, 2, 3, part);
        expect(merged.tabs[edgeId]).toBeUndefined();
        expect(merged.folds[edgeId]).toBeUndefined();
      });
    });
  });

  it("falls back to the owning part's outer edge when the base has no explicit value", () => {
    let withEdges = splitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    // Directly seed the parts' own edges (bypassing splitFace's own
    // base->part seeding) to isolate unsplit's fallback direction.
    withEdges = {
      ...withEdges,
      tabs: {
        ...withEdges.tabs,
        [getEdgeId("North", 2, 3, "A")]: "Full",
        [getEdgeId("South", 2, 3, "C")]: "Left",
        [getEdgeId("West", 2, 3, "A")]: "Middle",
        [getEdgeId("East", 2, 3, "B")]: "Right",
      },
    };

    const merged = unsplitFace(withEdges, baseFaceId);

    expect(merged.tabs[getEdgeId("North", 2, 3)]).toBe("Full");
    expect(merged.tabs[getEdgeId("South", 2, 3)]).toBe("Left");
    expect(merged.tabs[getEdgeId("West", 2, 3)]).toBe("Middle");
    expect(merged.tabs[getEdgeId("East", 2, 3)]).toBe("Right");
  });

  it("keeps the base's own explicit edge over a part's value", () => {
    let withEdges = splitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    withEdges = cycleTab(withEdges, getEdgeId("North", 2, 3)); // base -> "Full"
    withEdges = {
      ...withEdges,
      tabs: {
        ...withEdges.tabs,
        [getEdgeId("North", 2, 3, "A")]: "Right",
      },
    };

    const merged = unsplitFace(withEdges, baseFaceId);
    expect(merged.tabs[getEdgeId("North", 2, 3)]).toBe("Full");
  });
});

describe("toggleSplitFace", () => {
  const baseFaceId = getFaceId(2, 3);

  it("splits an unsplit face", () => {
    const document = toggleSplitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    expect(getFaceSplit(document, baseFaceId)).toEqual(defaultSplitSize);
  });

  it("unsplits when the current split matches the existing size", () => {
    const split = toggleSplitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    const toggled = toggleSplitFace(split, baseFaceId, defaultSplitSize);
    expect(getFaceSplit(toggled, baseFaceId)).toBeNull();
  });

  it("resizes when the current split differs from the existing size", () => {
    const split = toggleSplitFace(
      makeEmptyDioramaDocument(),
      baseFaceId,
      defaultSplitSize
    );
    const resized = toggleSplitFace(split, baseFaceId, {
      width: 2,
      height: 2,
    });
    expect(getFaceSplit(resized, baseFaceId)).toEqual({
      width: 2,
      height: 2,
    });
  });
});

describe("toggleSplitForFaces", () => {
  it("splits every distinct base face exactly once, resolving part ids to their base", () => {
    const baseFaceId = getFaceId(2, 3);
    const otherFaceId = getFaceId(0, 0);
    const document = toggleSplitForFaces(
      makeEmptyDioramaDocument(),
      [baseFaceId, getSplitFaceId(baseFaceId, "B"), otherFaceId],
      defaultSplitSize
    );

    expect(getFaceSplit(document, baseFaceId)).toEqual(defaultSplitSize);
    expect(getFaceSplit(document, otherFaceId)).toEqual(defaultSplitSize);
  });

  it("ignores ids that resolve to neither a base nor a split part", () => {
    const document = toggleSplitForFaces(
      makeEmptyDioramaDocument(),
      ["not a face id"],
      defaultSplitSize
    );
    expect(document.splits).toEqual({});
  });
});
