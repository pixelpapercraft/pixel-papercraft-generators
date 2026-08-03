import {
  GeneratorUI,
  type Texture,
  type TextureDef,
  type LoadedTextureControlV2Value,
} from "@genroot/builder";

export type GlintVersion = "1.20+" | "Pre-1.20";

export const glintVersions: GlintVersion[] = ["1.20+", "Pre-1.20"];

export type GlintControlV2Props = {
  definitions: TextureDef[];
  value: LoadedTextureControlV2Value;
  onValueChange: (value: LoadedTextureControlV2Value) => void;
  onTextureChange: (texture: Texture | null) => void;
  opacity: number;
  onOpacityChange: (value: number) => void;
  xOffset: number;
  onXOffsetChange: (value: number) => void;
  yOffset: number;
  onYOffsetChange: (value: number) => void;
  loadingMessage?: string;
  errorMessage?: string;
};

// The legacy glint helpers remain available in glint.ts while generators move
// to this controlled UI one at a time. A custom upload is intentionally a
// distinct value: it keeps the preset dropdown blank without clearing its
// uploaded texture when React re-renders.
export function GlintControlV2({
  definitions,
  value,
  onValueChange,
  onTextureChange,
  opacity,
  onOpacityChange,
  xOffset,
  onXOffsetChange,
  yOffset,
  onYOffsetChange,
  loadingMessage,
  errorMessage,
}: GlintControlV2Props): JSX.Element {
  return (
    <>
      <GeneratorUI.LoadedTextureControlV2
        id="Enchanted Glint"
        definitions={definitions}
        choices={glintVersions}
        standardWidth={128}
        standardHeight={128}
        value={value}
        onValueChange={onValueChange}
        loadingMessage={loadingMessage}
        errorMessage={errorMessage}
        onChange={onTextureChange}
      />
      <GeneratorUI.RangeControl
        label="Glint Opacity"
        min={0}
        max={255}
        step={1}
        value={opacity}
        onValueChange={onOpacityChange}
      />
      <GeneratorUI.RangeControl
        label="Glint X Offset"
        min={0}
        max={128}
        step={1}
        value={xOffset}
        onValueChange={onXOffsetChange}
      />
      <GeneratorUI.RangeControl
        label="Glint Y Offset"
        min={0}
        max={128}
        step={1}
        value={yOffset}
        onValueChange={onYOffsetChange}
      />
    </>
  );
}
