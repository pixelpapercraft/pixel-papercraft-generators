import { describe, expect, it } from "vitest";
import { normalizeDynamicTextures } from "./dynamicTextures";

// The values are stand-in strings rather than real `Texture`s: the filtering
// logic is value-generic and only cares whether an entry is present, so this
// avoids constructing canvas-backed textures (mirrors useLoadedTextures.test).

describe("normalizeDynamicTextures", () => {
  it("returns no entries for an undefined input", () => {
    expect(normalizeDynamicTextures(undefined)).toEqual([]);
  });

  it("flattens a plain record, keeping insertion order", () => {
    expect(normalizeDynamicTextures({ Skin: "skin", Eyes: "eyes" })).toEqual<
      Array<[string, string]>
    >([
      ["Skin", "skin"],
      ["Eyes", "eyes"],
    ]);
  });

  it("flattens a Map, keeping insertion order", () => {
    const input = new Map<string, string | null>([
      ["Skin", "skin"],
      ["Eyes", "eyes"],
    ]);
    expect(normalizeDynamicTextures(input)).toEqual<Array<[string, string]>>([
      ["Skin", "skin"],
      ["Eyes", "eyes"],
    ]);
  });

  it("drops null and undefined values from a record", () => {
    expect(
      normalizeDynamicTextures({
        Skin: "skin",
        Eyes: null,
        Collar: undefined,
      })
    ).toEqual<Array<[string, string]>>([["Skin", "skin"]]);
  });

  it("drops absent values from a Map", () => {
    const input = new Map<string, string | null | undefined>([
      ["Skin", "skin"],
      ["Eyes", null],
      ["Collar", undefined],
    ]);
    expect(normalizeDynamicTextures(input)).toEqual<Array<[string, string]>>([
      ["Skin", "skin"],
    ]);
  });

  it("returns no entries when every value is absent", () => {
    expect(normalizeDynamicTextures({ Skin: null, Eyes: undefined })).toEqual(
      []
    );
    expect(normalizeDynamicTextures(new Map())).toEqual([]);
  });

  it("keeps falsy-but-present values other than null/undefined", () => {
    // A real Texture is always a truthy object, but the present/absent test is
    // `!= null`, not truthiness — so a value like an empty string is kept.
    expect(normalizeDynamicTextures<string>({ Empty: "" })).toEqual<
      Array<[string, string]>
    >([["Empty", ""]]);
  });
});
