import React from "react";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { type TextureFrame } from "@genroot/builder/modules/textureData";
import {
  EraseButton,
  Search,
  TileButton,
  TextureFramePreview,
  type TexturePreviewSourceFrame,
  makeTileBaseStyle,
} from "@genroot/builder/ui/texturePicker/texturePicker";
import { TintSelector } from "@genroot/generators/_common/tintSelector/tintSelector";
import { type TintChoiceGroup } from "@genroot/generators/_common/tintSelector/tints";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";
import {
  type BannerShieldPattern,
  type SelectedBannerShieldPattern,
} from "./types";

type PreviewPattern = {
  pattern: BannerShieldPattern;
  textureDef: TextureDef;
  frame: TextureFrame;
};

const bannerFrontSource = [1, 1, 20, 40] as const;
const bannerFrontPreviewSource: TexturePreviewSourceFrame = {
  rectangle: bannerFrontSource,
  logicalFrameSize: 64,
};

export function PatternTexturePicker({
  versionId,
  selectedPattern,
  tintChoiceGroups,
  onChange,
  enableErase = true,
  defaultTint = null,
  includeNoTint = true,
}: {
  versionId: string;
  selectedPattern: SelectedBannerShieldPattern | null;
  tintChoiceGroups: TintChoiceGroup[];
  onChange: (pattern: SelectedBannerShieldPattern) => void;
  enableErase?: boolean;
  defaultTint?: string | null;
  includeNoTint?: boolean;
}): JSX.Element | null {
  const textureVersion = findBannerShieldTextureVersion(versionId);
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(
    selectedPattern?.patternId ?? null
  );

  React.useEffect(() => {
    setSelectedId(selectedPattern?.patternId ?? null);
  }, [selectedPattern, versionId]);

  if (!textureVersion) {
    return null;
  }

  const blend = selectedPattern?.blend ?? defaultTint;
  const previewPatterns = textureVersion.patterns.flatMap((pattern) => {
    const preview = makePreviewPattern(pattern, textureVersion);
    return preview ? [preview] : [];
  });
  const searchLower = search.toLowerCase();
  const filteredPatterns = searchLower
    ? previewPatterns.filter(({ pattern }) =>
        pattern.label.toLowerCase().includes(searchLower)
      )
    : previewPatterns;
  const selectedPreview =
    previewPatterns.find(({ pattern }) => pattern.id === selectedId) ?? null;

  const emit = ({
    patternId = selectedId,
    nextBlend = blend,
  }: {
    patternId?: string | null;
    nextBlend?: string | null;
  }) => {
    onChange({
      versionId,
      patternId: patternId ?? "",
      blend: nextBlend,
    });
  };

  return (
    <div>
      <Search
        value={search}
        onChange={(value) => {
          setSearch(value);
        }}
        onClear={() => {
          setSearch("");
        }}
      />
      <div className="mb-8 flex">
        <div className="h-60 w-full overflow-y-auto">
          {filteredPatterns.map(({ pattern, textureDef, frame }) => (
            <TileButton
              key={pattern.id}
              title={pattern.label}
              textureDef={textureDef}
              frame={frame}
              isSelected={selectedId === pattern.id}
              previewSize={64}
              blend={blend}
              sourceFrame={bannerFrontPreviewSource}
              onClick={() => {
                setSelectedId(pattern.id);
                onChange({
                  versionId,
                  patternId: pattern.id,
                  blend,
                });
              }}
            />
          ))}
        </div>
        <div className="w-24 shrink-0">
          <SelectedPatternPreview
            selectedPreview={selectedPreview}
            blend={blend}
          />
          <div className="mt-3 flex justify-around">
            {enableErase ? (
              <EraseButton
                onClick={() => {
                  setSelectedId(null);
                  onChange({
                    versionId,
                    patternId: "",
                    blend: null,
                  });
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <TintSelector
          value={blend}
          choiceGroups={tintChoiceGroups}
          includeNoTint={includeNoTint}
          onChange={(nextBlend) => {
            emit({ nextBlend });
          }}
        />
      </div>
    </div>
  );
}

function makePreviewPattern(
  pattern: BannerShieldPattern,
  textureVersion: NonNullable<ReturnType<typeof findBannerShieldTextureVersion>>
): PreviewPattern | null {
  if (pattern.bannerFrame) {
    return {
      pattern,
      textureDef: textureVersion.bannerTextureDef,
      frame: pattern.bannerFrame,
    };
  }
  if (pattern.shieldFrame) {
    return {
      pattern,
      textureDef: textureVersion.shieldTextureDef,
      frame: pattern.shieldFrame,
    };
  }
  return null;
}

function SelectedPatternPreview({
  selectedPreview,
  blend,
}: {
  selectedPreview: PreviewPattern | null;
  blend: string | null;
}) {
  return (
    <div className="flex flex-col items-center" style={{ width: "96px" }}>
      <div
        className="flex items-center justify-center bg-white"
        style={{
          ...makeTileBaseStyle(false, getPreviewWidth(128), 128),
        }}
      >
        {selectedPreview ? (
          <TextureFramePreview
            textureDef={selectedPreview.textureDef}
            frame={selectedPreview.frame}
            size={128}
            blend={blend}
            sourceFrame={bannerFrontPreviewSource}
          />
        ) : null}
      </div>
      <div className="max-w-full p-2 pt-0 text-center text-gray-500">
        {selectedPreview?.pattern.label ?? ""}
      </div>
    </div>
  );
}

function getPreviewWidth(height: number): number {
  const [, , sourceWidth, sourceHeight] = bannerFrontSource;
  return (sourceWidth / sourceHeight) * height;
}
