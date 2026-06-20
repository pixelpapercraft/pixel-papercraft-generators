import { TexturePicker as BuilderTexturePicker } from "@genroot/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TintSelector } from "@genroot/generators/_common/tintSelector/tintSelector";
import { type TintChoiceGroup } from "@genroot/generators/_common/tintSelector/tints";
import { findVersion } from "../../textures/textureVersions";

export function TexturePicker({
  versionId,
  selectedTexture,
  tintChoiceGroups,
  onChange,
  enableErase = true,
}: {
  versionId: string;
  selectedTexture: SelectedTexture | null;
  tintChoiceGroups: TintChoiceGroup[];
  onChange: (texture: SelectedTexture) => void;
  enableErase?: boolean;
}): JSX.Element | null {
  const textureVersion = findVersion(versionId);
  if (!textureVersion) {
    return null;
  }

  const { textureDef, frames } = textureVersion;
  const blend = selectedTexture?.blend ?? null;

  return (
    <div>
      <div className="mb-8">
        <BuilderTexturePicker
          key={textureDef.id}
          textureDef={textureDef}
          frames={frames}
          onSelect={onChange}
          enableErase={enableErase}
          blend={blend}
        />
      </div>
      <div className="mb-4">
        <TintSelector
          value={blend}
          choiceGroups={tintChoiceGroups}
          onChange={(nextBlend) => {
            if (!selectedTexture) {
              return;
            }

            onChange({
              ...selectedTexture,
              blend: nextBlend,
            });
          }}
        />
      </div>
    </div>
  );
}
