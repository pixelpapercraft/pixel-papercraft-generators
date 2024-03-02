import { TexturePicker as BuilderTexturePicker } from "@/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@/builder/ui/texturePicker/selectedTexture";
import { findVersion } from "./textureVersions";

export function TexturePicker(props: {
  versionId: string;
  onSelect: (texture: SelectedTexture) => void;
}): JSX.Element | null {
  const textureVersion = findVersion(props.versionId);
  if (!textureVersion) {
    return null;
  }
  const { textureDef, frames } = textureVersion;
  return (
    <div className="mb-4">
      <BuilderTexturePicker
        textureDef={textureDef}
        frames={frames}
        onSelect={props.onSelect}
        enableRotation={true}
      />
    </div>
  );
}
