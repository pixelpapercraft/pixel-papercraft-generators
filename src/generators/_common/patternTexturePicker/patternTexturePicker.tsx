import React from "react";
import {
  EraseButton,
  Search,
} from "@genroot/builder/ui/texturePicker/texturePicker";
import {
  type PatternOption,
  filterPatternOptions,
  findSelectedPatternOption,
  makeFrontFacePreviewSize,
  makePatternPreviewStyle,
  makeTileFrameStyle,
  makeTintMaskStyle,
} from "./patternTexturePickerLogic";

const gridTileHeight = 64;
const selectedPreviewHeight = 128;

function PatternTile({
  option,
  isSelected,
  blend,
  onClick,
}: {
  option: PatternOption;
  isSelected: boolean;
  blend: string | null;
  onClick: () => void;
}) {
  const [isHover, setIsHover] = React.useState(false);
  const tintMaskStyle = makeTintMaskStyle(
    option.textureDef,
    option.frame,
    gridTileHeight,
    blend
  );

  return (
    <button
      type="button"
      title={option.pattern.label}
      style={{
        ...makeTileFrameStyle(isSelected || isHover, gridTileHeight),
        ...makePatternPreviewStyle(
          option.textureDef,
          option.frame,
          gridTileHeight
        ),
        position: "relative",
        overflow: "hidden",
        margin: "0 4px 4px 0",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {tintMaskStyle ? <div style={tintMaskStyle} /> : null}
    </button>
  );
}

function SelectedPatternPreview({
  option,
  blend,
}: {
  option: PatternOption | null;
  blend: string | null;
}) {
  const previewSize = makeFrontFacePreviewSize(selectedPreviewHeight);
  const tintMaskStyle = option
    ? makeTintMaskStyle(
        option.textureDef,
        option.frame,
        selectedPreviewHeight,
        blend
      )
    : undefined;

  return (
    <div className="flex flex-col items-center" style={{ width: "96px" }}>
      <div
        className="flex items-center justify-center bg-white"
        style={makeTileFrameStyle(false, selectedPreviewHeight)}
      >
        {option ? (
          <div
            style={{
              position: "relative",
              ...previewSize,
              ...makePatternPreviewStyle(
                option.textureDef,
                option.frame,
                selectedPreviewHeight
              ),
            }}
          >
            {tintMaskStyle ? <div style={tintMaskStyle} /> : null}
          </div>
        ) : null}
      </div>
      <div className="max-w-full p-2 pt-0 text-center text-gray-500">
        {option?.pattern.label ?? ""}
      </div>
    </div>
  );
}

export function PatternTexturePicker({
  patterns,
  selectedPatternId,
  blend,
  onSelectPattern,
}: {
  patterns: PatternOption[];
  selectedPatternId: string | null;
  blend: string | null;
  onSelectPattern: (patternId: string | null) => void;
}) {
  const [search, setSearch] = React.useState("");

  const filteredOptions = filterPatternOptions(patterns, search);
  const selectedOption = findSelectedPatternOption(patterns, selectedPatternId);

  return (
    <div>
      <Search
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />
      <div className="mb-4 flex">
        <div className="h-60 w-full overflow-y-auto">
          {filteredOptions.map((option) => (
            <PatternTile
              key={option.pattern.id}
              option={option}
              isSelected={option.pattern.id === selectedPatternId}
              blend={blend}
              onClick={() => onSelectPattern(option.pattern.id)}
            />
          ))}
        </div>
        <div className="w-24 shrink-0">
          <SelectedPatternPreview option={selectedOption} blend={blend} />
          <div className="mt-3 flex justify-around">
            <EraseButton onClick={() => onSelectPattern(null)} />
          </div>
        </div>
      </div>
    </div>
  );
}
