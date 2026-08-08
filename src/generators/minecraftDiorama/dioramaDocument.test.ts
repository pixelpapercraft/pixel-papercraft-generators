import { describe, expect, it } from "vitest";
import type { SelectedTexture } from "@genroot/builder";
import {
  addFaceTexture,
  cycleTab,
  eraseFaceTexture,
  getEdgeId,
  getFaceId,
  makeEmptyDioramaDocument,
  setPreset,
  toggleFold,
  type DioramaDocument,
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
      tabs: {},
      folds: {},
    });
  });

  it("accepts an explicit preset", () => {
    expect(makeEmptyDioramaDocument("Quarter Blocks")).toEqual<DioramaDocument>(
      {
        preset: "Quarter Blocks",
        faceTextures: {},
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
