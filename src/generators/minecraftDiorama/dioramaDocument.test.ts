import { describe, expect, it } from "vitest";
import type { SelectedTexture } from "@genroot/builder";
import {
  addFaceTexture,
  clampSourceRegion,
  cycleTab,
  eraseFaceTexture,
  fullSourceRegion,
  getDefaultSourceForFace,
  getEdgeId,
  getFaceId,
  getFaceSource,
  getSourceColumnId,
  getSourceRowId,
  makeEmptyDioramaDocument,
  parseFaceId,
  parseSourceColumnId,
  parseSourceRowId,
  setFaceSource,
  setFaceSourceForFaces,
  setPreset,
  toggleFold,
  type DioramaDocument,
  type Region,
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
      tabs: {},
      folds: {},
    });
  });

  it("accepts an explicit preset", () => {
    expect(makeEmptyDioramaDocument("Quarter Blocks")).toEqual<DioramaDocument>(
      {
        preset: "Quarter Blocks",
        faceTextures: {},
        sources: {},
        tabs: {},
        folds: {},
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
