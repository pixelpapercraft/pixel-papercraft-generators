import { describe, expect, it, vi } from "vitest";
import { type Generator } from "@genroot/builder/modules/generator";
import {
  clonePattern1To2,
  clonePattern2To1,
  cloneTemplatePatterns,
} from "./clonePatterns";
import { makePatternFaceId, makeTemplateBaseInputId } from "./face";

function makeGenerator(values: Record<string, string | null> = {}): Generator {
  return {
    getStringInputValue: vi.fn((id: string) => values[id] ?? null),
    setStringInputValue: vi.fn(),
    setSelectInputValue: vi.fn(),
  } as unknown as Generator;
}

describe("cloneTemplatePatterns", () => {
  it("copies the source template patterns to the target template", () => {
    const patternJson = JSON.stringify([
      { versionId: "minecraft", patternId: "base", blend: "#ffffff" },
      { versionId: "minecraft", patternId: "border", blend: "#000000" },
    ]);
    const generator = makeGenerator({ PatternFace1: patternJson });

    cloneTemplatePatterns(generator, "1", "2");

    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("2"),
      patternJson
    );
  });

  it("copies an implicit default base as an empty pattern value", () => {
    const generator = makeGenerator();

    cloneTemplatePatterns(generator, "1", "2");

    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("2"),
      ""
    );
  });

  it("copies an explicitly empty pattern stack instead of restoring the default", () => {
    const generator = makeGenerator({ PatternFace1: "[]" });

    cloneTemplatePatterns(generator, "1", "2");

    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("2"),
      "[]"
    );
  });

  it("does not copy banner or shield base selections", () => {
    const generator = makeGenerator({
      PatternFace1: "[]",
      [makeTemplateBaseInputId("1", "banner")]: "banner_base",
      [makeTemplateBaseInputId("2", "shield")]: "shield_base_nopattern",
    });

    cloneTemplatePatterns(generator, "1", "2");

    expect(generator.setStringInputValue).toHaveBeenCalledTimes(1);
    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("2"),
      "[]"
    );
  });
});

describe("clonePattern1To2", () => {
  it("adds a second banner template when cloning from one template", () => {
    const generator = makeGenerator({ PatternFace1: "[]" });

    clonePattern1To2(generator, 1);

    expect(generator.setSelectInputValue).toHaveBeenCalledWith(
      "Number of Templates",
      "2"
    );
    expect(generator.setSelectInputValue).toHaveBeenCalledWith(
      "Template 2 Type",
      "Banner"
    );
    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("2"),
      "[]"
    );
  });

  it("keeps the existing second template type when two templates are visible", () => {
    const generator = makeGenerator({ PatternFace1: "[]" });

    clonePattern1To2(generator, 2);

    expect(generator.setSelectInputValue).not.toHaveBeenCalled();
    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("2"),
      "[]"
    );
  });
});

describe("clonePattern2To1", () => {
  it("does nothing when only one template is visible", () => {
    const generator = makeGenerator({ PatternFace2: "[]" });

    clonePattern2To1(generator, 1);

    expect(generator.setSelectInputValue).not.toHaveBeenCalled();
    expect(generator.setStringInputValue).not.toHaveBeenCalled();
  });

  it("copies template 2 patterns to template 1 when two templates are visible", () => {
    const generator = makeGenerator({ PatternFace2: "[]" });

    clonePattern2To1(generator, 2);

    expect(generator.setStringInputValue).toHaveBeenCalledWith(
      makePatternFaceId("1"),
      "[]"
    );
  });
});
