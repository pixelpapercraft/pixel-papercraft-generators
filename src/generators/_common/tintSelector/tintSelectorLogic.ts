import {
  type SelectOption,
  type SelectOptionGroup,
  type SelectOptionOrGroup,
} from "@genroot/builder/ui/form/select";
import {
  defaultTintChoiceGroups,
  type TintChoice,
  type TintChoiceGroup,
} from "./tints";

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

export const noneChoice: SelectOption = { id: "None", label: "No tint" };

export const customChoice: SelectOption = {
  id: "Custom",
  label: "Custom tint",
};

export function flattenTintChoiceGroups(
  choiceGroups: TintChoiceGroup[]
): TintChoice[] {
  return choiceGroups.flatMap((group) => group.options);
}

export function makeTintChoiceGroups(
  choiceGroups: TintChoiceGroup[]
): SelectOptionGroup[] {
  return choiceGroups.map((group) => ({
    id: group.id,
    label: group.label,
    options: group.options.map((tint) => ({
      id: tint.id,
      label: tint.label,
    })),
  }));
}

export function makeTintChoices(
  choiceGroups: TintChoiceGroup[] = defaultTintChoiceGroups,
  includeNoTint = true
): SelectOptionOrGroup[] {
  return [
    ...(includeNoTint ? [noneChoice] : []),
    customChoice,
    ...makeTintChoiceGroups(choiceGroups),
  ];
}

export function getTintFromOption(
  option: SelectOption,
  tintChoices: TintChoice[]
): SelectedTint {
  switch (option.id) {
    case "None":
      return { kind: "NoTint" };
    case "Custom":
      return { kind: "CustomTint", hex: null };
    default: {
      const tint = tintChoices.find((tint) => tint.id === option.id);
      if (!tint) {
        return { kind: "NoTint" };
      }

      return { kind: "SelectedTint", hex: tint.color };
    }
  }
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

export function getTintChoiceValue(
  value: string,
  tintChoices: TintChoice[]
): string | null {
  const normalizedValue = value.trim().toLowerCase();
  const tint = tintChoices.find(
    (tint) =>
      tint.id.toLowerCase() === normalizedValue ||
      tint.label.toLowerCase() === normalizedValue
  );
  return tint?.color ?? null;
}

function getCustomTintInput(value: string | null): string {
  return value?.replace(/^#/, "") ?? "";
}

export function getTintInputValue(
  storedValue: string | null,
  defaultValue: string | null,
  tintChoices: TintChoice[] = flattenTintChoiceGroups(defaultTintChoiceGroups)
): string | null {
  if (storedValue === null) {
    return defaultValue;
  }

  if (storedValue.trim().length === 0) {
    return null;
  }

  return (
    getTintChoiceValue(storedValue, tintChoices) ??
    normalizeTint(storedValue) ??
    storedValue
  );
}

type TintSelectorState = {
  selectedOption: SelectOption;
  selectedTint: SelectedTint;
  customTintInput: string;
  color: string | null;
};

export function getTintSelectorStateFromValue(
  value: string | null,
  tintChoices: TintChoice[]
): TintSelectorState {
  if (value === null) {
    return {
      selectedOption: noneChoice,
      selectedTint: { kind: "NoTint" },
      customTintInput: "",
      color: null,
    };
  }

  const normalizedValue = normalizeHexForComparison(value);
  const tint = tintChoices.find(
    (tint) => normalizeHexForComparison(tint.color) === normalizedValue
  );
  if (tint) {
    return {
      selectedOption: { id: tint.id, label: tint.label },
      selectedTint: { kind: "SelectedTint", hex: tint.color },
      customTintInput: "",
      color: tint.color,
    };
  }

  return {
    selectedOption: customChoice,
    selectedTint: { kind: "CustomTint", hex: value },
    customTintInput: getCustomTintInput(value),
    color: value,
  };
}
