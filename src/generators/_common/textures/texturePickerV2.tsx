import { TexturePicker as BuilderTexturePicker } from "@genroot/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TintSelector } from "@genroot/generators/_common/tintSelector/tintSelector";
import { defaultTintChoiceGroups } from "@genroot/generators/_common/tintSelector/tints";
import { type VersionEntry } from "./customTextureVersionV2";

// Same picker as `_common/block/texturePicker.tsx`, except the caller
// resolves the version entry (e.g. via a `TextureVersionRegistry`'s
// `findVersion`) and passes it in directly, instead of this component
// resolving a `versionId` through a module-level import. That's what lets a
// generator adopt an instance-based registry without this component ever
// reaching for shared state itself.
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
