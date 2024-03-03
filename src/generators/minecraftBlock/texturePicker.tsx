import { TexturePicker as BuilderTexturePicker } from "@genroot/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TintSelector } from "./tintSelector";
import { findVersion } from "./textureVersions";

export function TexturePicker({
  versionId,
  onBlendSelected,
  onTextureSelected,
}: {
  versionId: string;
  onTextureSelected: (texture: SelectedTexture) => void;
  onBlendSelected: (blend: string | null) => void;
}): JSX.Element | null {
  const textureVersion = findVersion(versionId);
  if (!textureVersion) {
    return null;
  }
  const { textureDef, frames } = textureVersion;
  return (
    <div>
      <div className="mb-8">
        <BuilderTexturePicker
          textureDef={textureDef}
          frames={frames}
          onSelect={onTextureSelected}
          enableRotation={true}
        />
      </div>
      <div className="mb-4">
        <TintSelector onChange={onBlendSelected} />
      </div>
    </div>
  );
}
