import React from "react";
import { Select, type SelectOption } from "@genroot/builder/ui/form/select";
import {
  defaultTintChoiceGroups,
  type TintChoice,
  type TintChoiceGroup,
} from "./tints";
import {
  customChoice,
  flattenTintChoiceGroups,
  getColorFromSelectedTint,
  getTintFromOption,
  getTintSelectorStateFromValue,
  makeTintChoices,
  normalizeTint,
  type SelectedTint,
} from "./tintSelectorLogic";

type TintSelectorState = {
  selectedOption: SelectOption;
  selectedTint: SelectedTint;
  customTintInput: string;
  color: string | null;
};

function getStateFromValue(
  value: string | null,
  tintChoices: TintChoice[]
): TintSelectorState {
  return getTintSelectorStateFromValue(value, tintChoices);
}

export function TintSelector({
  value,
  onChange,
  label = "Tint",
  choiceGroups = defaultTintChoiceGroups,
  includeNoTint = true,
}: {
  value?: string | null;
  onChange: (hex: string | null) => void;
  label?: string;
  choiceGroups?: TintChoiceGroup[];
  includeNoTint?: boolean;
}) {
  const tintChoices = React.useMemo(
    () => flattenTintChoiceGroups(choiceGroups),
    [choiceGroups]
  );
  const choices = React.useMemo(
    () => makeTintChoices(choiceGroups, includeNoTint),
    [choiceGroups, includeNoTint]
  );
  const isControlled = value !== undefined;
  const labelId = React.useId();

  const [state, setState] = React.useState<TintSelectorState>(() =>
    getStateFromValue(value ?? null, tintChoices)
  );

  React.useEffect(() => {
    if (isControlled) {
      setState(getStateFromValue(value ?? null, tintChoices));
    }
  }, [isControlled, value, tintChoices]);

  const { selectedTint, selectedOption, customTintInput, color } = state;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customTintInput = e.target.value.replace(/^#/, "");
    const color = normalizeTint(customTintInput);
    const selectedOption = customChoice;
    const selectedTint: SelectedTint = { kind: "CustomTint", hex: color };
    const nextState = {
      selectedOption,
      selectedTint,
      customTintInput,
      color,
    };
    setState(nextState);
    if (color) {
      onChange(color);
    } else if (customTintInput.trim().length === 0) {
      onChange("#");
    }
  };

  return (
    <div>
      <div id={labelId} className="font-bold mb-1">
        {label}
      </div>
      <div className="flex items-center space-x-4">
        <Select
          choices={choices}
          value={selectedOption}
          ariaLabelledBy={labelId}
          onChange={(selectedOption) => {
            const selectedTint = getTintFromOption(selectedOption, tintChoices);
            const color = getColorFromSelectedTint(selectedTint);
            const nextState = {
              selectedOption,
              selectedTint,
              customTintInput: color ? color.replace(/^#/, "") : "",
              color,
            };
            setState(nextState);
            onChange(selectedTint.kind === "CustomTint" ? "#" : color);
          }}
        />

        {selectedTint.kind === "CustomTint" ? (
          <div className="flex shrink-0 items-center">
            <span className="mr-1">#</span>
            <input
              placeholder="Enter hex color"
              className="w-24 p-2 border border-gray-300"
              value={customTintInput}
              onChange={onInputChange}
            />
          </div>
        ) : null}

        {color ? (
          <div className="border bg-white p-1 shrink-0">
            <div className="w-8 h-8" style={{ backgroundColor: color }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
