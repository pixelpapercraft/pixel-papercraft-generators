import React from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Select } from "@genroot/builder/ui/form/select";
import { type TintSwatchGroup } from "./tints";
import {
  customChoice,
  defaultCustomTint,
  flattenTintSwatchGroups,
  getColorFromSelectedTint,
  getDisplayedSwatchGroup,
  getGroupSwitchTint,
  getInitialSelectedGroupId,
  getSelectedGroupOption,
  getSelectedTintFromValue,
  getTintLabel,
  makeGroupOption,
  noneChoice,
  normalizeTint,
} from "./tintSelectorLogic";

const tintHeaderSquareClass = "h-10 w-10";
const tintSwatchButtonClass = "h-12 w-12";
const tintSwatchGridClass =
  "grid max-w-[27.5rem] grid-cols-[repeat(auto-fill,3rem)] gap-2";

// Only a complete, valid hex commits upward — an in-progress/invalid typed
// value is simply not propagated (matches `HexColorInput`'s own behavior:
// it keeps showing exactly what's typed via its own internal state, only
// calling `onChange` once the text is a complete hex).
function commitHexIfValid(
  hex: string,
  onChange: (hex: string | null) => void
): void {
  const normalized = normalizeTint(hex);
  if (normalized) {
    onChange(normalized);
  }
}

export function TintSelector({
  value,
  onChange,
  label,
  swatchGroups,
  includeNoTint = true,
}: {
  value: string | null;
  onChange: (hex: string | null) => void;
  label: string;
  swatchGroups: TintSwatchGroup[];
  includeNoTint?: boolean;
}) {
  const labelId = React.useId();

  const tintSwatches = flattenTintSwatchGroups(swatchGroups);
  const categoryChoices = [
    ...(includeNoTint ? [noneChoice] : []),
    ...swatchGroups.map(makeGroupOption),
    customChoice,
  ];

  // Everything about the current selection — its kind, the color, the
  // summary label, which swatch (if any) is highlighted — is derived fresh
  // from `value` on every render. Nothing here needs its own state or a
  // `useEffect` to stay in sync with a controlled prop.
  const selectedTint = getSelectedTintFromValue(value, tintSwatches);
  const color = getColorFromSelectedTint(selectedTint);
  const selectedTintLabel = getTintLabel(selectedTint, tintSwatches);

  // Which dropdown entry is being browsed is genuinely independent of
  // `value` — it's "what the user is currently looking at", not a
  // projection of the selected color (browsing the "Potions" group doesn't
  // change the tint until a swatch is actually clicked). It only needs an
  // initial value derived from the starting selection; after that it's
  // driven solely by the dropdown itself.
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    () => getInitialSelectedGroupId(selectedTint, swatchGroups)
  );

  const selectedGroup = getDisplayedSwatchGroup(selectedGroupId, swatchGroups);
  const selectedGroupOption = getSelectedGroupOption(
    selectedGroupId,
    swatchGroups
  );
  const isCustomGroupSelected = selectedGroupId === null;
  const isNoTintSelected = selectedGroupId === noneChoice.id;

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
              // "None" has no further sub-selection, so it's a complete,
              // immediate choice, same as clicking a swatch. Picking
              // "Custom" carries the current color over as-is (any color is
              // valid there), defaulting only if nothing was selected.
              // Picking a group falls back to its first swatch whenever the
              // current color isn't actually one of that group's swatches
              // (nothing selected, a custom color, or a different group's
              // color) — otherwise the grid would show nothing highlighted
              // while the value silently pointed at something not in it.
              if (selectedOption.id === noneChoice.id) {
                setSelectedGroupId(noneChoice.id);
                onChange(null);
              } else if (selectedOption.id === customChoice.id) {
                setSelectedGroupId(null);
                if (selectedTint.kind === "NoTint") {
                  onChange(defaultCustomTint);
                }
              } else {
                setSelectedGroupId(selectedOption.id);
                const nextColor = getGroupSwitchTint(
                  selectedOption.id,
                  color,
                  swatchGroups
                );
                if (nextColor) {
                  onChange(nextColor);
                }
              }
            }}
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {isCustomGroupSelected ? (
            <div className="flex min-w-0 items-center">
              <span className="text-sm text-gray-600">#</span>
              <HexColorInput
                color={color?.replace(/^#/, "") ?? ""}
                prefixed={false}
                placeholder="RRGGBB"
                className="h-10 w-[8ch] border border-gray-300 p-2 font-mono"
                onChange={(hex) => commitHexIfValid(hex, onChange)}
              />
            </div>
          ) : null}
          {color ? (
            <div className={`${tintHeaderSquareClass} border bg-white p-1`}>
              <div
                className="h-full w-full"
                style={{ backgroundColor: color }}
              />
            </div>
          ) : null}
          {isNoTintSelected || isCustomGroupSelected ? null : (
            <div className="min-w-0 text-sm text-gray-600">
              {selectedTintLabel}
            </div>
          )}
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
                onClick={() => onChange(tint.color)}
              >
                <span
                  className="block h-full w-full"
                  style={{ backgroundColor: tint.color }}
                />
              </button>
            );
          })}
        </div>
      ) : isNoTintSelected ? null : (
        <div>
          <div className="[&_.react-colorful]:w-full [&_.react-colorful]:max-w-64">
            <HexColorPicker
              color={color ?? defaultCustomTint}
              onChange={(newColor) => commitHexIfValid(newColor, onChange)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
