/** [x, y, width, height] */
export type Region = [number, number, number, number];

export type TextControl = {
  kind: "Text";
  id: string;
  text: string;
};

export type CustomInputControl = {
  kind: "CustomInput";
  id: string;
  render: (onChange: (value: string) => void) => React.ReactNode;
};

export type RegionControl = {
  kind: "Region";
  pageId: string;
  region: Region;
  onClick: () => void;
  onRightClick?: () => void;
  id?: string;
};

export type TextureInputControlProps = {
  standardWidth: number;
  standardHeight: number;
  choices: string[];
  label?: string;
};

export type TextureInputControl = {
  kind: "TextureInput";
  id: string;
  props: TextureInputControlProps;
};

export type AtlasInputControlProps = TextureInputControlProps;

export type AtlasInputControl = {
  kind: "AtlasInput";
  id: string;
  props: AtlasInputControlProps;
};

export type MinecraftSkinInputControlProps = {
  standardWidth: number;
  standardHeight: number;
  options: MinecraftSkinOption[];
  showModelType: boolean;
};

export type MinecraftSkinOptionPreset = {
  kind: "preset";
  id: string;
  label: string;
  urls: {
    wide: string;
    slim: string;
  };
};

export type MinecraftSkinOptionTexture = {
  kind: "texture";
  id: string;
  label: string;
  textureId: string;
};

export type MinecraftSkinOption =
  | MinecraftSkinOptionPreset
  | MinecraftSkinOptionTexture;

export type MinecraftSkinInputControl = {
  kind: "MinecraftSkinInput";
  id: string;
  props: MinecraftSkinInputControlProps;
};

export type BooleanInputControl = {
  kind: "BooleanInput";
  id: string;
  initialValue: boolean;
};

export type SelectInputControl = {
  kind: "SelectInput";
  id: string;
  options: string[];
};

export type RangeControl = {
  kind: "Range";
  id: string;
  min: number;
  max: number;
  value: number;
  step: number;
  showValue?: boolean;
};

export type ButtonControl = {
  kind: "Button";
  id: string;
  color?: "Gray" | "Blue" | "Red" | "Green";
  onClick: () => void;
};

export type InputRowStartControl = {
  kind: "InputRowStart";
  id: string;
};

export type InputRowEndControl = {
  kind: "InputRowEnd";
  id: string;
};

export type Control =
  | TextControl
  | CustomInputControl
  | RegionControl
  | TextureInputControl
  | AtlasInputControl
  | MinecraftSkinInputControl
  | BooleanInputControl
  | SelectInputControl
  | RangeControl
  | ButtonControl
  | InputRowStartControl
  | InputRowEndControl;

export type {
  MinecraftModelType,
  MinecraftSkinInputValue,
  MinecraftSkinSelection,
} from "./minecraftSkinInputValue";
