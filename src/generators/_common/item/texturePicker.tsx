import { TexturePicker as CommonTexturePicker } from "@genroot/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TintSelector } from "@genroot/generators/_common/tintSelector/tintSelector";
import { itemTintChoiceGroups } from "@genroot/generators/_common/tintSelector/tints";
import { type TextureVersion } from "./textureVersions";

export function TexturePicker(props: {
  textureVersion: TextureVersion;
  onSelect: (texture: SelectedTexture) => void;
  onBlendSelected: (blend: string | null) => void;
  blend?: string | null;
}): JSX.Element {
  const { textureDef, frames } = props.textureVersion;
  return (
    <div>
      <div className="mb-8">
        <CommonTexturePicker
          key={textureDef.id}
          textureDef={textureDef}
          frames={frames}
          onSelect={props.onSelect}
          enableErase={false}
          blend={props.blend ?? null}
        />
      </div>
      <div className="mb-4">
        <TintSelector
          value={props.blend ?? null}
          choiceGroups={itemTintChoiceGroups}
          onChange={props.onBlendSelected}
        />
      </div>
    </div>
  );
}
