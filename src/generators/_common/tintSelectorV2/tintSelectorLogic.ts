import { type SelectOption } from "@genroot/builder/ui/form/select";
import { type TintSwatch, type TintSwatchGroup } from "./tints";

export type SelectedTint =
  | { kind: "NoTint" }
  | { kind: "CustomTint"; hex: string | null }
  | { kind: "SelectedTint"; hex: string };

function isValidTint(tint: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(tint);
}

export function normalizeTint(tint: string): string | null {
  const trimmed = tint.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (isValidTint(normalized)) {
    return normalized;
  }

  return null;
}

export const customChoice: SelectOption = {
  id: "Custom",
  label: "Custom Tint",
};

export const noneChoice: SelectOption = {
  id: "None",
  label: "None",
};

// What "Custom Tint" starts from when nothing was previously selected.
export const defaultCustomTint = "#000000";

export function flattenTintSwatchGroups(
  swatchGroups: TintSwatchGroup[]
): TintSwatch[] {
  return swatchGroups.flatMap((group) => group.options);
}

// A group's first swatch color, or null if it has none — the common
// "what should a consumer default to" starting point, e.g. a generator
// initializing its own `useState` from a group it knows it'll show.
export function getFirstSwatchColor(group: TintSwatchGroup): string | null {
  return group.options[0]?.color ?? null;
}

export function getColorFromSelectedTint(
  selectedTint: SelectedTint
): string | null {
  switch (selectedTint.kind) {
    case "NoTint":
      return null;
    case "CustomTint":
      return selectedTint.hex;
    case "SelectedTint":
      return selectedTint.hex;
  }
}

function normalizeHexForComparison(value: string): string {
  return (normalizeTint(value) ?? value).toUpperCase();
}

export function getTintSwatchValue(
  value: string,
  tintSwatches: TintSwatch[]
): string | null {
  const normalizedValue = value.trim().toLowerCase();
  const tint = tintSwatches.find(
    (tint) =>
      tint.id.toLowerCase() === normalizedValue ||
      tint.label.toLowerCase() === normalizedValue
  );
  return tint?.color ?? null;
}

export function getTintInputValue(
  storedValue: string | null,
  defaultValue: string | null,
  tintSwatches: TintSwatch[]
): string | null {
  if (storedValue === null) {
    return defaultValue;
  }

  if (storedValue.trim().length === 0) {
    return null;
  }

  return (
    getTintSwatchValue(storedValue, tintSwatches) ??
    normalizeTint(storedValue) ??
    storedValue
  );
}

// The single source of truth for resolving a raw controlled `value` into a
// tagged `SelectedTint` — everything else the UI needs (the display color,
// the label, which swatch is highlighted) derives from this, so nothing
// else needs to be stored as component state.
export function getSelectedTintFromValue(
  value: string | null,
  tintSwatches: TintSwatch[]
): SelectedTint {
  if (value === null) {
    return { kind: "NoTint" };
  }

  const normalizedValue = normalizeHexForComparison(value);
  const tint = tintSwatches.find(
    (tint) => normalizeHexForComparison(tint.color) === normalizedValue
  );
  if (tint) {
    return { kind: "SelectedTint", hex: tint.color };
  }

  return { kind: "CustomTint", hex: normalizeTint(value) };
}

// The text shown next to the color swatch, summarising the current
// selection.
export function getTintLabel(
  selectedTint: SelectedTint,
  tintSwatches: TintSwatch[]
): string {
  switch (selectedTint.kind) {
    case "NoTint":
      return "None";
    case "CustomTint":
      return selectedTint.hex ? `Custom ${selectedTint.hex}` : "Custom Tint";
    case "SelectedTint":
      return (
        tintSwatches.find(
          (tint) => tint.color.toLowerCase() === selectedTint.hex.toLowerCase()
        )?.label ?? selectedTint.hex
      );
  }
}

// Which category the group dropdown should show as selected, given the
// resolved tint: "None" for NoTint, "Custom Tint" (represented as null,
// matching the dropdown's null-means-custom convention) for CustomTint, and
// the first group for a SelectedTint — this doesn't search for which group
// actually contains the hex, it always lands on the first group.
export function getInitialSelectedGroupId(
  selectedTint: SelectedTint,
  swatchGroups: TintSwatchGroup[]
): string | null {
  switch (selectedTint.kind) {
    case "NoTint":
      return noneChoice.id;
    case "CustomTint":
      return null;
    case "SelectedTint":
      return swatchGroups[0]?.id ?? null;
  }
}

// What to commit (if anything) when the dropdown switches to `groupId`,
// given the currently resolved color: null means no change is needed — the
// current color is already one of this group's swatches, so browsing to it
// just shows it highlighted. Otherwise (nothing was selected, or the
// current color belongs to a different group or is a custom color not in
// this one) falls back to the group's first swatch, so switching a tab
// never leaves the value pointing at a color that isn't actually in the
// grid now being shown.
export function getGroupSwitchTint(
  groupId: string,
  currentColor: string | null,
  swatchGroups: TintSwatchGroup[]
): string | null {
  const group = swatchGroups.find((g) => g.id === groupId);
  if (!group) {
    return null;
  }

  const belongsToGroup =
    currentColor !== null &&
    group.options.some(
      (option) => option.color.toLowerCase() === currentColor.toLowerCase()
    );
  if (belongsToGroup) {
    return null;
  }

  return getFirstSwatchColor(group);
}

export function makeGroupOption(group: TintSwatchGroup): SelectOption {
  return {
    id: group.id,
    label: group.label,
  };
}

// The group whose swatches should actually be rendered for the currently
// selected dropdown entry — undefined for "None"/"Custom" (which have their
// own, non-grid UI). Falls back to the first group if `groupId` refers to a
// group that doesn't exist in `swatchGroups`. Used by both this and
// `getSelectedGroupOption` below, so the dropdown's displayed label and the
// rendered swatch grid can never disagree with each other.
export function getDisplayedSwatchGroup(
  groupId: string | null,
  swatchGroups: TintSwatchGroup[]
): TintSwatchGroup | undefined {
  if (groupId === null || groupId === noneChoice.id) {
    return undefined;
  }
  return swatchGroups.find((group) => group.id === groupId) ?? swatchGroups[0];
}

// The dropdown's own displayed option for the current selection — mirrors
// getDisplayedSwatchGroup's fallback for the group case so the two never
// disagree (see above).
export function getSelectedGroupOption(
  groupId: string | null,
  swatchGroups: TintSwatchGroup[]
): SelectOption | undefined {
  if (groupId === null) {
    return customChoice;
  }
  if (groupId === noneChoice.id) {
    return noneChoice;
  }

  const group = getDisplayedSwatchGroup(groupId, swatchGroups);
  return group ? makeGroupOption(group) : undefined;
}
