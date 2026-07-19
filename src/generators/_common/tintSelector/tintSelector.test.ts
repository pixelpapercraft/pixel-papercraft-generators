import { describe, expect, it } from "vitest";
import { getTintInputValue, normalizeTint } from "./tintSelectorLogic";
import { catTintChoiceGroups, itemTintChoiceGroups } from "./tints";

describe("normalizeTint", () => {
  it("normalizes hex values with or without a leading hash", () => {
    expect(normalizeTint("ff00aa")).toBe("#ff00aa");
    expect(normalizeTint("#ff00aa")).toBe("#ff00aa");
  });

  it("rejects invalid or empty input", () => {
    expect(normalizeTint("")).toBe(null);
    expect(normalizeTint("not-a-color")).toBe(null);
  });
});

describe("getTintInputValue", () => {
  it("uses the default value when nothing is stored", () => {
    expect(
      getTintInputValue(
        null,
        "#B02E26",
        itemTintChoiceGroups.flatMap((group) => group.options)
      )
    ).toBe("#B02E26");
  });

  it("resolves a choice label to its tint color", () => {
    expect(
      getTintInputValue(
        "Light Gray",
        null,
        itemTintChoiceGroups.flatMap((group) => group.options)
      )
    ).toBe("#9D9D97");
  });

  it("keeps typeable custom tint values intact", () => {
    expect(
      getTintInputValue(
        "#123abc",
        null,
        catTintChoiceGroups.flatMap((group) => group.options)
      )
    ).toBe("#123abc");
  });

  it("treats a blank stored value as no tint", () => {
    expect(
      getTintInputValue(
        "",
        "#B02E26",
        catTintChoiceGroups.flatMap((group) => group.options)
      )
    ).toBe(null);
  });
});
