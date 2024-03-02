import { TexturePicker as BuilderTexturePicker } from "@/builder/ui/texturePicker/texturePicker";
import { type SelectedTexture } from "@/builder/ui/texturePicker/selectedTexture";
import { type TextureVersion } from "./textureVersions";

export function TexturePicker(props: {
  textureVersion: TextureVersion;
  onSelect: (texture: SelectedTexture) => void;
}): JSX.Element {
  const { textureDef, frames } = props.textureVersion;
  return (
    <div className="mb-4">
      <BuilderTexturePicker
        textureDef={textureDef}
        frames={frames}
        onSelect={props.onSelect}
        enableRotation={false}
      />
    </div>
  );
}
