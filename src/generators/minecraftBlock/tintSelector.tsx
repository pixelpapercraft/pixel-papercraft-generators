import React from "react";
import { type Tint, tintGroups, tints } from "./tints";
import { hexToRGB } from "@genroot/builder/modules/renderers/drawTexture";
import {
  type SelectOptionGroup,
  type SelectOption,
  type SelectOptionOrGroup,
  Select,
} from "@genroot/builder/ui/form/select";

type SelectedTint =
  | { kind: "NoTint" }
  | { kind: "CustomTint"; hex: string | null }
  | { kind: "SelectedTint"; hex: string };

function makeOptions(tints: Tint[]): SelectOption[] {
  return tints.map((tint) => {
    const choice: SelectOption = { id: tint.id, label: tint.biome };
    return choice;
  });
}

function isValidTint(tint: string): boolean {
  const value = hexToRGB(tint);
  return value !== null;
}

function normalizeTint(tint: string): string | null {
  const trimmed = tint.trim();
  if (trimmed.length === 0) {
    return null;
  } else {
    const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (isValidTint(normalized)) {
      return normalized;
    } else {
      return null;
    }
  }
}

const noneChoice: SelectOption = { id: "None", label: "No tint" };

const customChoice: SelectOption = { id: "Custom", label: "Custom tint" };

const grassChoices: SelectOptionGroup = {
  id: "Grass",
  label: "Grass",
  options: makeOptions(tintGroups.grass),
};
const foliageChoices: SelectOptionGroup = {
  id: "Foliage",
  label: "Foliage",
  options: makeOptions(tintGroups.foliage),
};
const waterChoices: SelectOptionGroup = {
  id: "Water",
  label: "Water",
  options: makeOptions(tintGroups.water),
};

const choices: SelectOptionOrGroup[] = [
  noneChoice,
  customChoice,
  grassChoices,
  foliageChoices,
  waterChoices,
];

function getTintFromOption(option: SelectOption): SelectedTint {
  switch (option.id) {
    case "None":
      return { kind: "NoTint" };
    case "Custom":
      return { kind: "CustomTint", hex: null };
    default: {
      const tint = tints.find((tint) => tint.id === option.id);
      if (!tint) {
        return { kind: "NoTint" };
      }
      return { kind: "SelectedTint", hex: tint.color };
    }
  }
}

function getColorFromSelectedTint(selectedTint: SelectedTint): string | null {
  switch (selectedTint.kind) {
    case "NoTint":
      return null;
    case "CustomTint":
      return selectedTint.hex;
    case "SelectedTint":
      return selectedTint.hex;
  }
}

type TintSelectorState = {
  selectedOption: SelectOption;
  selectedTint: SelectedTint;
  color: string | null;
};

export function TintSelector({
  onChange,
}: {
  onChange: (hex: string | null) => void;
}) {
  const [state, setState] = React.useState<TintSelectorState>({
    selectedOption: noneChoice,
    selectedTint: { kind: "NoTint" },
    color: null,
  });

  const { selectedTint, selectedOption, color } = state;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const color = normalizeTint(value);
    const selectedOption = customChoice;
    const selectedTint: SelectedTint = { kind: "CustomTint", hex: color };
    setState({ selectedOption, selectedTint, color });
    if (color) {
      onChange(color);
    }
  };

  return (
    <div>
      <div className="font-bold mb-1">Tint</div>
      <div className="flex space-x-4">
        <Select
          choices={choices}
          value={selectedOption}
          onChange={(selectedOption) => {
            const selectedTint = getTintFromOption(selectedOption);
            if (selectedTint) {
              const color = getColorFromSelectedTint(selectedTint);
              setState({ selectedOption, selectedTint, color });
              onChange(color);
            }
          }}
        />

        {selectedTint.kind === "CustomTint" ? (
          <div>
            <span className="mr-1">#</span>
            <input
              placeholder="Enter hex color"
              className="p-2 border border-gray-300"
              onChange={onInputChange}
            />
          </div>
        ) : null}

        {color ? (
          <div className="border bg-white p-1">
            <div className="w-8 h-8" style={{ backgroundColor: color }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
