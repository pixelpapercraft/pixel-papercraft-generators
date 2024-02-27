import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";
import { type Page } from "./page";

export type Region = [number, number, number, number];

export type Control_Text = {
  kind: "Text";
  id: string;
  text: string;
};

export type Control_Custom = {
  kind: "Custom";
  id: string;
  render: (onChange: (value: string) => void) => React.ReactNode;
};

export type Control_Region = {
  kind: "Region";
  pageId: string;
  region: Region;
  onClick: () => void;
};

export type Control_Texture_Props = {
  standardWidth: number;
  standardHeight: number;
  choices: string[];
};

export type Control_Texture = {
  kind: "Texture";
  id: string;
  props: Control_Texture_Props;
};

export type Control_Boolean = {
  kind: "Boolean";
  id: string;
  initialValue: boolean;
};

export type Control_Select = {
  kind: "Select";
  id: string;
  options: string[];
};

export type Control_Range = {
  kind: "Range";
  id: string;
  min: number;
  max: number;
  value: number;
  step: number;
};

export type Control_Button = {
  kind: "Button";
  id: string;
  onClick: () => void;
};

export type Control =
  | Control_Text
  | Control_Custom
  | Control_Region
  | Control_Texture
  | Control_Boolean
  | Control_Select
  | Control_Range
  | Control_Button;

export type Variable_Number = {
  kind: "Number";
  value: number;
};

export type Variable_String = {
  kind: "String";
  value: string;
};

export type Variable_Boolean = {
  kind: "Boolean";
  value: boolean;
};

export type Variable = Variable_Number | Variable_String | Variable_Boolean;

export class Values {
  images: Map<string, ImageWithCanvas>;
  textures: Map<string, Texture>;
  variables: Map<string, Variable>;

  constructor() {
    this.images = new Map();
    this.textures = new Map();
    this.variables = new Map();
  }

  addImage(id: string, image: ImageWithCanvas) {
    this.images.set(id, image);
  }

  addTexture(id: string, texture: Texture) {
    this.textures.set(id, texture);
  }

  removeTexture(id: string) {
    this.textures.delete(id);
  }

  setVariable(id: string, variable: Variable) {
    this.variables.set(id, variable);
  }

  setStringVariable(id: string, value: string): void {
    this.variables.set(id, { kind: "String", value });
  }

  getStringVariable(id: string): string | null {
    const variable = this.variables.get(id);
    return variable && variable.kind === "String" ? variable.value : null;
  }

  setNumberVariable(id: string, value: number): void {
    this.variables.set(id, { kind: "Number", value });
  }

  getNumberVariable(id: string): number | null {
    const variable = this.variables.get(id);
    return variable && variable.kind === "Number" ? variable.value : null;
  }

  setBooleanVariable(id: string, value: boolean): void {
    this.variables.set(id, { kind: "Boolean", value });
  }

  getBooleanVariable(id: string): boolean | null {
    const variable = this.variables.get(id);
    return variable && variable.kind === "Boolean" ? variable.value : null;
  }
}

export class Model {
  controls: Control[];
  pages: Page[];
  currentPage: Page | null;
  values: Values;

  constructor(values: Values) {
    this.controls = [];
    this.pages = [];
    this.currentPage = null;
    this.values = values;
  }

  addControl(control: Control) {
    this.controls.push(control);
  }

  addTextControl(id: string, text: string) {
    this.addControl({
      kind: "Text",
      id,
      text,
    });
  }

  addCustomControl(
    id: string,
    render: (onChange: (value: string) => void) => React.ReactNode
  ) {
    this.addControl({
      kind: "Custom",
      id,
      render,
    });
  }

  addRegionControl(pageId: string, region: Region, onClick: () => void) {
    this.addControl({
      kind: "Region",
      pageId,
      region,
      onClick,
    });
  }

  addTextureControl(id: string, props: Control_Texture_Props) {
    this.addControl({
      kind: "Texture",
      id,
      props,
    });
  }

  addBooleanControl(id: string, initialValue: boolean) {
    this.addControl({
      kind: "Boolean",
      id,
      initialValue,
    });
  }

  addSelectControl(id: string, options: string[]) {
    this.addControl({
      kind: "Select",
      id,
      options,
    });
  }

  addRangeControl(
    id: string,
    min: number,
    max: number,
    value: number,
    step: number
  ) {
    this.addControl({
      kind: "Range",
      id,
      min,
      max,
      value,
      step,
    });
  }

  addButtonControl(id: string, onClick: () => void) {
    this.addControl({
      kind: "Button",
      id,
      onClick,
    });
  }

  addPage(page: Page) {
    this.pages.push(page);
  }

  findPage(id: string): Page | null {
    return this.pages.find((curr) => curr.id === id) || null;
  }

  addImage(id: string, image: ImageWithCanvas) {
    this.values.addImage(id, image);
  }

  findImage(id: string): ImageWithCanvas | null {
    return this.values.images.get(id) || null;
  }

  addTexture(id: string, texture: Texture) {
    this.values.addTexture(id, texture);
  }

  findTexture(id: string): Texture | null {
    return this.values.textures.get(id) || null;
  }

  removeTexture(id: string) {
    this.values.removeTexture(id);
  }

  setVariable(id: string, variable: Variable) {
    this.values.setVariable(id, variable);
  }

  setStringVariable(id: string, value: string): void {
    this.values.setStringVariable(id, value);
  }

  getStringVariable(id: string): string | null {
    return this.values.getStringVariable(id);
  }

  setNumberVariable(id: string, value: number): void {
    this.values.setNumberVariable(id, value);
  }

  getNumberVariable(id: string): number | null {
    return this.values.getNumberVariable(id);
  }

  setBooleanVariable(id: string, value: boolean): void {
    this.values.setBooleanVariable(id, value);
  }

  getBooleanVariable(id: string): boolean | null {
    return this.values.getBooleanVariable(id);
  }

  setCurrentPage(page: Page | null) {
    this.currentPage = page;
  }
}
