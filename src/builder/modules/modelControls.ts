/** [x, y, width, height] */
export type Region = [number, number, number, number];

export type TextControl = {
  kind: "Text";
  id: string;
  text: string;
};

export type CustomInputControl = {
  kind: "Custom";
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
};

export type TextureInputControl = {
  kind: "Texture";
  id: string;
  props: TextureInputControlProps;
};

export type BooleanInputControl = {
  kind: "Boolean";
  id: string;
  initialValue: boolean;
};

export type SelectInputControl = {
  kind: "Select";
  id: string;
  options: string[];
};

export type RangeInputControl = {
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
  | RangeInputControl
  | ButtonControl;
