import React from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { type Generator } from "@genroot/builder/modules/generator";
import { Select, type SelectOption } from "@genroot/builder/ui/form/select";
import { XMarkIcon } from "@genroot/builder/ui/icon";
import {
  defaultTintChoiceGroups,
  type TintChoice,
  type TintChoiceGroup,
} from "./tints";
import {
  customChoice,
  flattenTintChoiceGroups,
  getColorFromSelectedTint,
  getTintInputValue,
  getTintSelectorStateFromValue,
  normalizeTint,
  type SelectedTint,
} from "./tintSelectorLogic";

type TintSelectorState = {
  selectedTint: SelectedTint;
  customTintInput: string;
  color: string | null;
};

const tintHeaderSquareClass = "h-10 w-10";
const tintSwatchButtonClass = "h-12 w-12";
const tintSwatchGridClass =
  "grid max-w-[27.5rem] grid-cols-[repeat(auto-fill,3rem)] gap-2";

function getStateFromValue(
  value: string | null,
  tintChoices: TintChoice[]
): TintSelectorState {
  return getTintSelectorStateFromValue(value, tintChoices);
}

function makeGroupOption(group: TintChoiceGroup): SelectOption {
  return {
    id: group.id,
    label: group.label,
  };
}

function getSelectedGroupOption(
  groupId: string | null,
  choiceGroups: TintChoiceGroup[]
): SelectOption | undefined {
  if (groupId === null) {
    return customChoice;
  }

  const selectedGroup =
    choiceGroups.find((group) => group.id === groupId) ?? choiceGroups[0];
  return selectedGroup ? makeGroupOption(selectedGroup) : undefined;
}

function makeCustomTintChoice(hex: string | null): SelectedTint {
  return { kind: "CustomTint", hex };
}

function getTintLabel(
  selectedTint: SelectedTint,
  tintChoices: TintChoice[]
): string {
  switch (selectedTint.kind) {
    case "NoTint":
      return "No Tint";
    case "CustomTint":
      return selectedTint.hex ? `Custom ${selectedTint.hex}` : "Custom Tint";
    case "SelectedTint":
      return (
        tintChoices.find(
          (tint) => tint.color.toLowerCase() === selectedTint.hex.toLowerCase()
        )?.label ?? selectedTint.hex
      );
  }
}

function NoTintButton({
  isSelected,
  onClick,
}: {
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title="No Tint"
      aria-label="No Tint"
      className={`flex ${tintHeaderSquareClass} items-center justify-center border bg-white p-1 ${
        isSelected ? "border-gray-700" : "border-gray-300"
      }`}
      onClick={onClick}
    >
      <XMarkIcon color="Gray500" />
    </button>
  );
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
  const categoryChoices = React.useMemo(
    () => [...choiceGroups.map(makeGroupOption), customChoice],
    [choiceGroups]
  );
  const isControlled = value !== undefined;
  const labelId = React.useId();
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    () => choiceGroups[0]?.id ?? null
  );

  const [state, setState] = React.useState<TintSelectorState>(() =>
    getStateFromValue(value ?? null, tintChoices)
  );

  React.useEffect(() => {
    if (isControlled) {
      setState(getStateFromValue(value ?? null, tintChoices));
    }
  }, [isControlled, value, tintChoices]);

  const { selectedTint, color } = state;
  const selectedTintLabel = getTintLabel(selectedTint, tintChoices);
  const selectedGroup = React.useMemo(
    () => choiceGroups.find((group) => group.id === selectedGroupId),
    [choiceGroups, selectedGroupId]
  );
  const selectedGroupOption = getSelectedGroupOption(
    selectedGroupId,
    choiceGroups
  );
  const isCustomGroupSelected = selectedGroupId === null;

  React.useEffect(() => {
    if (
      choiceGroups.length > 0 &&
      selectedGroupId !== null &&
      !choiceGroups.some((group) => group.id === selectedGroupId)
    ) {
      setSelectedGroupId(choiceGroups[0]?.id ?? null);
    }
  }, [choiceGroups, selectedGroupId]);

  React.useEffect(() => {
    if (selectedTint.kind === "CustomTint") {
      setSelectedGroupId(null);
    }
  }, [selectedTint.kind]);

  const setTint = (selectedTint: SelectedTint) => {
    const color = getColorFromSelectedTint(selectedTint);
    const nextState = {
      selectedTint,
      customTintInput: color ? color.replace(/^#/, "") : "",
      color,
    };
    setState(nextState);
    onChange(selectedTint.kind === "CustomTint" && !color ? "#" : color);
  };

  const onCustomColorChange = (color: string) => {
    const normalizedColor = normalizeTint(color);
    const selectedTint = makeCustomTintChoice(normalizedColor);
    setState({
      selectedTint,
      customTintInput: normalizedColor ? normalizedColor.replace(/^#/, "") : "",
      color: normalizedColor,
    });
    onChange(normalizedColor ?? "#");
  };

  const onCustomHexChange = (hex: string) => {
    const customTintInput = hex.replace(/^#/, "");
    const nextColor = normalizeTint(customTintInput);
    const selectedTint = makeCustomTintChoice(nextColor);
    setState({
      selectedTint,
      customTintInput,
      color: nextColor,
    });
    if (nextColor) {
      onChange(nextColor);
    } else if (customTintInput.trim().length === 0) {
      onChange("#");
    }
  };

  return (
    <div>
      <div id={labelId} className="font-bold mb-1">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="min-w-0 max-w-full">
          <Select
            choices={categoryChoices}
            value={selectedGroupOption}
            ariaLabelledBy={labelId}
            onChange={(selectedOption) => {
              setSelectedGroupId(
                selectedOption.id === customChoice.id ? null : selectedOption.id
              );
              if (selectedOption.id === customChoice.id) {
                setTint(makeCustomTintChoice(color));
              }
            }}
          />
        </div>

        {includeNoTint ? (
          <NoTintButton
            isSelected={selectedTint.kind === "NoTint"}
            onClick={() => {
              setTint({ kind: "NoTint" });
            }}
          />
        ) : null}

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {isCustomGroupSelected ? (
            <div className="flex min-w-0 items-center">
              <span className="text-sm text-gray-600">#</span>
              <HexColorInput
                color={state.customTintInput || color?.replace(/^#/, "") || ""}
                prefixed={false}
                placeholder="RRGGBB"
                className="h-10 w-[8ch] border border-gray-300 p-2 font-mono"
                onChange={onCustomHexChange}
              />
            </div>
          ) : null}
          <div className="min-w-0 text-sm text-gray-600">
            {selectedTintLabel}
          </div>
          {color ? (
            <div className={`${tintHeaderSquareClass} border bg-white p-1`}>
              <div
                className="h-full w-full"
                style={{ backgroundColor: color }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {selectedGroup ? (
        <div className={tintSwatchGridClass}>
          {selectedGroup.options.map((tint) => {
            const isSelected =
              selectedTint.kind === "SelectedTint" &&
              selectedTint.hex.toLowerCase() === tint.color.toLowerCase();
            return (
              <button
                key={tint.id}
                type="button"
                title={`${tint.label} (${tint.color})`}
                aria-label={`${tint.label} (${tint.color})`}
                className={`${tintSwatchButtonClass} border p-1 ${
                  isSelected ? "border-gray-700" : "border-gray-300"
                }`}
                onClick={() => {
                  setTint({ kind: "SelectedTint", hex: tint.color });
                }}
              >
                <span
                  className="block h-full w-full"
                  style={{ backgroundColor: tint.color }}
                />
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="[&_.react-colorful]:w-full [&_.react-colorful]:max-w-64">
            <HexColorPicker
              color={color ?? "#000000"}
              onChange={onCustomColorChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function defineTintInput(
  generator: Generator,
  id: string,
  {
    defaultValue = null,
    label = id,
    choiceGroups,
    includeNoTint = true,
  }: {
    defaultValue?: string | null;
    label?: string;
    choiceGroups?: TintChoiceGroup[];
    includeNoTint?: boolean;
  } = {}
): string | null {
  const tintChoices = flattenTintChoiceGroups(
    choiceGroups ?? defaultTintChoiceGroups
  );
  const storedValue = generator.getStringInputValue(id);
  const value = getTintInputValue(storedValue, defaultValue, tintChoices);

  generator.defineCustomStringInput(id, (onChange) => (
    <TintSelector
      value={value}
      label={label}
      choiceGroups={choiceGroups}
      includeNoTint={includeNoTint}
      onChange={(hex) => {
        onChange(hex ?? "");
      }}
    />
  ));

  return value;
}
