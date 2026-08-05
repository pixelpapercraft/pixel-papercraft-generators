import { TexturePicker as BuilderTexturePicker } from "@genroot/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TintSelector } from "@genroot/generators/_common/tintSelectorV2/tintSelector";
import { blockTintSwatchGroups } from "@genroot/generators/_common/tintSelectorV2/tints";
import { type VersionEntry } from "./customTextureVersionV2";

// The eventual successor to `texturePickerV2.tsx` (still tintSelectorV1
// under the hood) and `_common/item/texturePicker.tsx` (its own separate
// V1-tint copy) — both migrate onto this once V3 has been proven out on
// Diorama, and get deleted then. Until that migration, this is Diorama-only.
export function TexturePickerV3({
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
          label="Tint"
          swatchGroups={blockTintSwatchGroups}
          onChange={onBlendSelected}
        />
      </div>
    </div>
  );
}
