import { TexturePicker as BuilderTexturePicker } from "@genroot/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TintSelector } from "@genroot/generators/_common/tintSelector/tintSelector";
import { defaultTintChoiceGroups } from "@genroot/generators/_common/tintSelector/tints";
import { type VersionEntry } from "./customTextureVersionV2";

// Takes an already-resolved version entry rather than a `versionId`, so
// this component never needs to look one up itself — the caller can source
// it from any `TextureVersionRegistry` instance.
export function TexturePickerV2({
  textureVersion,
  onBlendSelected,
  onTextureSelected,
  blend,
}: {
  textureVersion: VersionEntry | null;
  onTextureSelected: (texture: SelectedTexture) => void;
  onBlendSelected: (blend: string | null) => void;
  blend?: string | null;
}): JSX.Element | null {
  if (!textureVersion) {
    return null;
  }
  const { textureDef, frames } = textureVersion;
  return (
    <div>
      <div className="mb-8">
        <BuilderTexturePicker
          key={textureDef.id}
          textureDef={textureDef}
          frames={frames}
          onSelect={onTextureSelected}
          blend={blend ?? null}
        />
      </div>
      <div className="mb-4">
        <TintSelector
          value={blend ?? null}
          choiceGroups={defaultTintChoiceGroups}
          onChange={onBlendSelected}
        />
      </div>
    </div>
  );
}
