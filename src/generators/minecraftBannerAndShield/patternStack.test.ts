import { describe, expect, test } from "vitest";
import {
  applyPatternSelection,
  defaultPatternStack,
  defaultPatternId,
  defaultPatternTint,
} from "./patternStack";

describe("applyPatternSelection", () => {
  test("pushes a new layer when a pattern is armed", () => {
    const result = applyPatternSelection(
      defaultPatternStack(),
      "border",
      "#ff0000"
    );

    expect(result).toEqual([
      { patternId: defaultPatternId, blend: defaultPatternTint },
      { patternId: "border", blend: "#ff0000" },
    ]);
  });

  test("pops the last layer when erase is armed", () => {
    const stack = [
      { patternId: defaultPatternId, blend: defaultPatternTint },
      { patternId: "border", blend: "#ff0000" },
    ];

    expect(applyPatternSelection(stack, null, null)).toEqual([
      { patternId: defaultPatternId, blend: defaultPatternTint },
    ]);
  });

  test("erase can't reduce the stack below one layer", () => {
    const result = applyPatternSelection(defaultPatternStack(), null, null);

    expect(result).toEqual(defaultPatternStack());
  });
});
