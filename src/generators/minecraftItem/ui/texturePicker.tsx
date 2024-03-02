import { type TextureVersion } from "./textureVersions";
import { TexturePicker2 } from "./texturePicker2";
import { type SelectedTexture } from "./selectedTexture";

export function TexturePicker(props: {
  textureVersion: TextureVersion;
  onSelect: (texture: SelectedTexture) => void;
}): JSX.Element {
  const { textureDef, frames } = props.textureVersion;
  return (
    <div className="mb-4">
      <TexturePicker2
        textureDef={textureDef}
        frames={frames}
        onSelect={props.onSelect}
        enableRotation={false}
      />
    </div>
  );
}
