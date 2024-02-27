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

export type Control_Texture = {
  kind: "Texture";
  id: string;
  standardWidth: number;
  standardHeight: number;
  choices: string[];
};

export type Control_Boolean = {
  kind: "Boolean";
  id: string;
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
  id: string;
  value: number;
};

export type Variable_String = {
  kind: "String";
  id: string;
  value: string;
};

export type Variable_Boolean = {
  kind: "Boolean";
  id: string;
  value: boolean;
};

export type Variable = Variable_Number | Variable_String | Variable_Boolean;

export type Values = {
  images: Map<string, ImageWithCanvas>;
  textures: Map<string, Texture>;
  variables: Variable[];
};

export type Model = {
  controls: Control[];
  pages: Page[];
  currentPage: Page | null;
  values: Values;
};

export function makeModel(): Model {
  return {
    controls: [],
    pages: [],
    currentPage: null,
    values: {
      images: new Map(),
      textures: new Map(),
      variables: [],
    },
  };
}

export function makeModelWithValues(values: Values): Model {
  return {
    controls: [],
    pages: [],
    currentPage: null,
    values,
  };
}

export function addControl(model: Model, control: Control) {
  return {
    ...model,
    controls: [...model.controls, control],
  };
}

export function addTextControl(model: Model, id: string, text: string) {
  return addControl(model, {
    kind: "Text",
    id,
    text,
  });
}

export function addCustomControl(
  model: Model,
  id: string,
  render: (onChange: (value: string) => void) => React.ReactNode
) {
  return addControl(model, {
    kind: "Custom",
    id,
    render,
  });
}

export function addRegionControl(
  model: Model,
  pageId: string,
  region: Region,
  onClick: () => void
) {
  return addControl(model, {
    kind: "Region",
    pageId,
    region,
    onClick,
  });
}

export function addTextureControl(
  model: Model,
  id: string,
  standardWidth: number,
  standardHeight: number,
  choices: string[]
) {
  return addControl(model, {
    kind: "Texture",
    id,
    standardWidth,
    standardHeight,
    choices,
  });
}

export function addBooleanControl(model: Model, id: string) {
  return addControl(model, {
    kind: "Boolean",
    id,
  });
}

export function addSelectControl(model: Model, id: string, options: string[]) {
  return addControl(model, {
    kind: "Select",
    id,
    options,
  });
}

export function addRangeControl(
  model: Model,
  id: string,
  min: number,
  max: number,
  value: number,
  step: number
) {
  return addControl(model, {
    kind: "Range",
    id,
    min,
    max,
    value,
    step,
  });
}

export function addButtonControl(
  model: Model,
  id: string,
  onClick: () => void
) {
  return addControl(model, {
    kind: "Button",
    id,
    onClick,
  });
}

export function addPage(model: Model, page: Page) {
  return {
    ...model,
    pages: [...model.pages, page],
  };
}

export function findPage(model: Model, id: string): Page | null {
  return model.pages.find((curr) => curr.id === id) || null;
}

export function addImage(model: Model, id: string, image: ImageWithCanvas) {
  return {
    ...model,
    values: {
      ...model.values,
      images: new Map(model.values.images).set(id, image),
    },
  };
}

export function findImage(model: Model, id: string): ImageWithCanvas | null {
  return model.values.images.get(id) ?? null;
}

export function addTexture(model: Model, id: string, texture: Texture) {
  return {
    ...model,
    values: {
      ...model.values,
      textures: new Map(model.values.textures).set(id, texture),
    },
  };
}

export function findTexture(model: Model, id: string): Texture | null {
  return model.values.textures.get(id) ?? null;
}

export function setVariable(model: Model, variable: Variable) {
  const currVariables = model.values.variables.filter(
    (curr) => curr.id !== variable.id
  );
  return {
    ...model,
    values: {
      ...model.values,
      variables: [...currVariables, variable],
    },
  };
}

export function getStringVariable(model: Model, id: string): string | null {
  const variable = model.values.variables.find((curr) => curr.id === id);
  return variable && variable.kind === "String" ? variable.value : null;
}

export function getNumberVariable(model: Model, id: string): number | null {
  const variable = model.values.variables.find((curr) => curr.id === id);
  return variable && variable.kind === "Number" ? variable.value : null;
}

export function getBooleanVariable(model: Model, id: string): boolean | null {
  const variable = model.values.variables.find((curr) => curr.id === id);
  return variable && variable.kind === "Boolean" ? variable.value : null;
}
