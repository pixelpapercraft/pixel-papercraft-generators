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
};

export type TextureInputControlProps = {
  standardWidth: number;
  standardHeight: number;
  choices: string[];
  enableMinecraftSkinInput?: boolean;
};

export type TextureInputControl = {
  kind: "TextureInput";
  id: string;
  props: TextureInputControlProps;
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
};

export type ButtonControl = {
  kind: "Button";
  id: string;
  onClick: () => void;
};

export type Control =
  | TextControl
  | CustomInputControl
  | RegionControl
  | TextureInputControl
  | BooleanInputControl
  | SelectInputControl
  | RangeControl
  | ButtonControl;
