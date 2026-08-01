import { describe, expect, it } from "vitest";
import {
  getDisplayedSwatchGroup,
  getFirstSwatchColor,
  getGroupSwitchTint,
  getInitialSelectedGroupId,
  getSelectedTintFromValue,
  getTintInputValue,
  noneChoice,
  normalizeTint,
} from "./tintSelectorLogic";
import {
  catTintSwatchGroups,
  dyeTintGroup,
  itemTintSwatchGroups,
  leatherTintGroup,
} from "./tints";

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
        itemTintSwatchGroups.flatMap((group) => group.options)
      )
    ).toBe("#B02E26");
  });

  it("resolves a choice label to its tint color", () => {
    expect(
      getTintInputValue(
        "Light Gray",
        null,
        itemTintSwatchGroups.flatMap((group) => group.options)
      )
    ).toBe("#9D9D97");
  });

  it("keeps typeable custom tint values intact", () => {
    expect(
      getTintInputValue(
        "#123abc",
        null,
        catTintSwatchGroups.flatMap((group) => group.options)
      )
    ).toBe("#123abc");
  });

  it("treats a blank stored value as no tint", () => {
    expect(
      getTintInputValue(
        "",
        "#B02E26",
        catTintSwatchGroups.flatMap((group) => group.options)
      )
    ).toBe(null);
  });
});

describe("getInitialSelectedGroupId", () => {
  // Confirms the dropdown lands on the right entry for each resolved tint
  // kind, without requiring a swatch click first.
  const tintSwatches = catTintSwatchGroups.flatMap((group) => group.options);

  it("resolves to the None entry for an unset (NoTint) value", () => {
    const selectedTint = getSelectedTintFromValue(null, tintSwatches);
    expect(getInitialSelectedGroupId(selectedTint, catTintSwatchGroups)).toBe(
      noneChoice.id
    );
  });

  it("resolves to the first group for a value matching a known swatch", () => {
    const selectedTint = getSelectedTintFromValue("#B02E26", tintSwatches);
    expect(getInitialSelectedGroupId(selectedTint, catTintSwatchGroups)).toBe(
      catTintSwatchGroups[0]?.id
    );
  });

  it("resolves to Custom (null) for a value matching no known swatch", () => {
    const selectedTint = getSelectedTintFromValue("#123abc", tintSwatches);
    expect(
      getInitialSelectedGroupId(selectedTint, catTintSwatchGroups)
    ).toBeNull();
  });
});

describe("getFirstSwatchColor", () => {
  // The helper a consumer (e.g. a generator initializing its own useState)
  // uses instead of hand-writing `group.options[0]?.color ?? null`.
  it("returns the group's first swatch color", () => {
    expect(getFirstSwatchColor(dyeTintGroup)).toBe(
      dyeTintGroup.options[0]?.color
    );
  });

  it("returns null for a group with no swatches", () => {
    expect(
      getFirstSwatchColor({ id: "empty", label: "Empty", options: [] })
    ).toBeNull();
  });
});

describe("getDisplayedSwatchGroup", () => {
  // Confirms the fallback used when a group id doesn't match any group in
  // `swatchGroups`.
  it("returns undefined for the Custom (null) and None entries", () => {
    expect(getDisplayedSwatchGroup(null, itemTintSwatchGroups)).toBeUndefined();
    expect(
      getDisplayedSwatchGroup(noneChoice.id, itemTintSwatchGroups)
    ).toBeUndefined();
  });

  it("returns the matching group for a known group id", () => {
    const target = itemTintSwatchGroups[1];
    expect(
      getDisplayedSwatchGroup(target?.id ?? null, itemTintSwatchGroups)
    ).toBe(target);
  });

  it("falls back to the first group for an id that no longer exists", () => {
    expect(
      getDisplayedSwatchGroup("not-a-real-group-id", itemTintSwatchGroups)
    ).toBe(itemTintSwatchGroups[0]);
  });
});

describe("getGroupSwitchTint", () => {
  // Switching the dropdown to a group should never leave the value pointing
  // at a color that isn't actually in the grid now being shown.
  const dyeFirstSwatch = dyeTintGroup.options[0];
  const dyeOtherSwatch = dyeTintGroup.options[3];

  it("falls back to the group's first swatch when nothing is selected", () => {
    expect(
      getGroupSwitchTint(dyeTintGroup.id, null, itemTintSwatchGroups)
    ).toBe(dyeFirstSwatch?.color);
  });

  it("falls back to the group's first swatch when the current color belongs to a different group", () => {
    expect(
      getGroupSwitchTint(
        dyeTintGroup.id,
        leatherTintGroup.options[0]?.color ?? null,
        itemTintSwatchGroups
      )
    ).toBe(dyeFirstSwatch?.color);
  });

  it("falls back to the group's first swatch when the current color is an arbitrary custom hex", () => {
    expect(
      getGroupSwitchTint(dyeTintGroup.id, "#123ABC", itemTintSwatchGroups)
    ).toBe(dyeFirstSwatch?.color);
  });

  it("makes no change when the current color already belongs to the group", () => {
    expect(
      getGroupSwitchTint(
        dyeTintGroup.id,
        dyeOtherSwatch?.color ?? null,
        itemTintSwatchGroups
      )
    ).toBeNull();
  });

  it("returns null for an unknown group id", () => {
    expect(
      getGroupSwitchTint("not-a-real-group-id", null, itemTintSwatchGroups)
    ).toBeNull();
  });
});
