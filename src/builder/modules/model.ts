import {
  type ImageWithCanvas,
  makeImageWithCanvasFromImage,
} from "./imageWithCanvas";
import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";
import {
  type Texture,
  type Flip,
  type Rotate,
  type Blend,
  draw,
} from "./texture";
import { type Page, makePage } from "./page";
import { type Input } from "./input";

export type Variable =
  | { kind: "Integer"; value: number }
  | { kind: "String"; value: string }
  | { kind: "Float"; value: number }
  | { kind: "Boolean"; value: boolean };

export type PageRegion = {
  pageId: string;
  region: [number, number, number, number];
};

export type Values = {
  images: Record<string, ImageWithCanvas>;
  textures: Record<string, Texture>;
  booleans: Record<string, boolean>;
  selects: Record<string, string>;
  ranges: Record<string, number>;
  strings: Record<string, string>;
  variables: Record<string, Variable>;
};

export type Model = {
  inputs: Input[];
  pages: Page[];
  currentPage: Page | null;
  values: Values;
};

export function makeModel(): Model {
  return {
    inputs: [],
    pages: [],
    currentPage: null,
    values: {
      images: {},
      textures: {},
      booleans: {},
      selects: {},
      ranges: {},
      strings: {},
      variables: {},
    },
  };
}

// let findPage = (model: Model.t, id) => model.pages->Js.Array2.find(page => page.id === id)

export function findPage(model: Model, id: string): Page | null {
  return model.pages.find((page) => page.id === id) ?? null;
}

// let getCanvasWithContextPixelColor = (canvasWithContext: Generator_CanvasWithContext.t, x, y) => {
//   let {width, height, contextWithAlpha} = canvasWithContext
//   let data = Dom2.Context2d.getImageData(contextWithAlpha, 0, 0, width, height).data
//   let pixelIndex = y * width + x
//   let arrayIndex = pixelIndex * 4
//   let r = Belt.Array.get(data, arrayIndex)
//   let g = Belt.Array.get(data, arrayIndex + 1)
//   let b = Belt.Array.get(data, arrayIndex + 2)
//   let a = Belt.Array.get(data, arrayIndex + 3)
//   switch (r, g, b, a) {
//   | (Some(r), Some(g), Some(b), Some(a)) => Some((r, g, b, a))
//   | _ => None
//   }
// }

export function getCanvasWithContextPixelColor(
  canvasWithContext: CanvasWithContext,
  x: number,
  y: number
): [number, number, number, number] | null {
  const { width, height, contextWithAlpha } = canvasWithContext;
  const data = contextWithAlpha.getImageData(0, 0, width, height).data;
  const pixelIndex = y * width + x;
  const arrayIndex = pixelIndex * 4;
  const r = data[arrayIndex];
  const g = data[arrayIndex + 1];
  const b = data[arrayIndex + 2];
  const a = data[arrayIndex + 3];
  if (
    r !== undefined &&
    g !== undefined &&
    b !== undefined &&
    a !== undefined
  ) {
    return [r, g, b, a];
  }
  return null;
}

// let getTexturePixelColor = (model: Model.t, textureId, x, y) => {
//   let texture = Js.Dict.get(model.values.textures, textureId)
//   switch texture {
//   | None => None
//   | Some(texture) => getCanvasWithContextPixelColor(texture.imageWithCanvas.canvasWithContext, x, y)
//   }
// }

export function getTexturePixelColor(
  model: Model,
  textureId: string,
  x: number,
  y: number
): [number, number, number, number] | null {
  const texture = model.values.textures[textureId];
  if (texture) {
    return getCanvasWithContextPixelColor(
      texture.imageWithCanvas.canvasWithContext,
      x,
      y
    );
  }
  return null;
}

// let getImagePixelColor = (model: Model.t, imageId, x, y) => {
//   let imageWithCanvas = Js.Dict.get(model.values.images, imageId)
//   switch imageWithCanvas {
//   | None => None
//   | Some(imageWithCanvas) => getCanvasWithContextPixelColor(imageWithCanvas.canvasWithContext, x, y)
//   }
// }

export function getImagePixelColor(
  model: Model,
  imageId: string,
  x: number,
  y: number
): [number, number, number, number] | null {
  const imageWithCanvas = model.values.images[imageId];
  if (imageWithCanvas) {
    return getCanvasWithContextPixelColor(
      imageWithCanvas.canvasWithContext,
      x,
      y
    );
  }
  return null;
}

// let getPagePixelColor = (model: Model.t, pageId, x, y) => {
//   let page = findPage(model, pageId)
//   switch page {
//   | None => None
//   | Some(page) => getCanvasWithContextPixelColor(page.canvasWithContext, x, y)
//   }
// }

export function getPagePixelColor(
  model: Model,
  pageId: string,
  x: number,
  y: number
): [number, number, number, number] | null {
  const page = findPage(model, pageId);
  if (page) {
    return getCanvasWithContextPixelColor(page.canvasWithContext, x, y);
  }
  return null;
}

// let getCurrentPagePixelColor = (model: Model.t, x, y) => {
//   switch model.currentPage {
//   | None => None
//   | Some(page) => getCanvasWithContextPixelColor(page.canvasWithContext, x, y)
//   }
// }

export function getCurrentPagePixelColor(
  model: Model,
  x: number,
  y: number
): [number, number, number, number] | null {
  if (model.currentPage) {
    return getCanvasWithContextPixelColor(
      model.currentPage.canvasWithContext,
      x,
      y
    );
  }
  return null;
}

// let setVariable = (model: Model.t, id: string, value: Model.Variable.t) => {
//   let variables = Js.Dict.fromArray(Js.Dict.entries(model.values.variables))
//   Js.Dict.set(variables, id, value)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       variables,
//     },
//   }
// }

export function setVariable(model: Model, id: string, value: Variable): Model {
  const variables: Record<string, Variable> = { ...model.values.variables };
  variables[id] = value;
  return {
    ...model,
    values: {
      ...model.values,
      variables,
    },
  };
}

// let getVariable = (model: Model.t, id: string) => {
//   Js.Dict.get(model.values.variables, id)
// }

export function getVariable(model: Model, id: string): Variable | null {
  return model.values.variables[id] ?? null;
}

// let getVariableMap = (model: Model.t, id: string, fn) => {
//   switch getVariable(model, id) {
//   | None => None
//   | Some(value) => fn(value)
//   }
// }

// export function getVariableMap(
//   model: Model,
//   id: string,
//   fn: (value: Variable) => any
// ): any | null {
//   const variable = getVariable(model, id);
//   if (variable) {
//     return fn(variable);
//   }
//   return null;
// }

// let setStringVariable = (model: Model.t, id: string, value: string) => {
//   setVariable(model, id, #String(value))
// }

export function setStringVariable(
  model: Model,
  id: string,
  value: string
): Model {
  return setVariable(model, id, { kind: "String", value });
}

// let getStringVariable = (model: Model.t, id: string): option<string> => {
//   getVariableMap(model, id, Model.Variable.toString)
// }

export function getStringVariable(model: Model, id: string): string | null {
  const variable = getVariable(model, id);
  if (variable && variable.kind === "String") {
    return variable.value;
  }
  return null;
}

// let setIntegerVariable = (model: Model.t, id: string, value: int) => {
//   setVariable(model, id, #Integer(value))
// }

export function setIntegerVariable(
  model: Model,
  id: string,
  value: number
): Model {
  return setVariable(model, id, { kind: "Integer", value });
}

// let getFloatVariable = (model: Model.t, id: string): option<float> => {
//   getVariableMap(model, id, Model.Variable.toFloat)
// }

export function getFloatVariable(model: Model, id: string): number | null {
  const variable = getVariable(model, id);
  if (variable && variable.kind === "Float") {
    return variable.value;
  }
  return null;
}

// let setFloatVariable = (model: Model.t, id: string, value: float) => {
//   setVariable(model, id, #Float(value))
// }

export function setFloatVariable(
  model: Model,
  id: string,
  value: number
): Model {
  return setVariable(model, id, { kind: "Float", value });
}

// let getIntegerVariable = (model: Model.t, id: string): option<int> => {
//   getVariableMap(model, id, Model.Variable.toInteger)
// }

export function getIntegerVariable(model: Model, id: string): number | null {
  const variable = getVariable(model, id);
  if (variable && variable.kind === "Integer") {
    return variable.value;
  }
  return null;
}

// let setBooleanVariable = (model: Model.t, id: string, value: bool) => {
//   setVariable(model, id, #Boolean(value))
// }

export function setBooleanVariable(
  model: Model,
  id: string,
  value: boolean
): Model {
  return setVariable(model, id, { kind: "Boolean", value });
}

// let getBooleanVariable = (model: Model.t, id: string): option<bool> => {
//   getVariableMap(model, id, Model.Variable.toBoolean)
// }

export function getBooleanVariable(model: Model, id: string): boolean | null {
  const variable = getVariable(model, id);
  if (variable && variable.kind === "Boolean") {
    return variable.value;
  }
  return null;
}

// let hasInput = (model: Model.t, idToFind: string) => {
//   Js.Array2.find(model.inputs, input => {
//     let id = switch input {
//     | Text(id, _) => id
//     | RegionInput(_, _, _) => ""
//     | CustomStringInput(id, _) => id
//     | TextureInput(id, _) => id
//     | BooleanInput(id) => id
//     | SelectInput(id, _) => id
//     | RangeInput(id, _) => id
//     | ButtonInput(id, _) => id
//     }
//     id === idToFind
//   })
// }

export function hasInput(model: Model, idToFind: string): boolean {
  return model.inputs.some((input) => {
    switch (input.kind) {
      case "Text":
        return input.id === idToFind;
      case "RegionInput":
        return false;
      case "CustomStringInput":
        return input.id === idToFind;
      case "TextureInput":
        return input.id === idToFind;
      case "BooleanInput":
        return input.id === idToFind;
      case "SelectInput":
        return input.id === idToFind;
      case "RangeInput":
        return input.id === idToFind;
      case "ButtonInput":
        return input.id === idToFind;
    }
  });
}

// let clearStringInputValues = (model: Model.t) => {
//   {
//     ...model,
//     values: {
//       ...model.values,
//       strings: Js.Dict.empty(),
//     },
//   }
// }

export function clearStringInputValues(model: Model): Model {
  return {
    ...model,
    values: {
      ...model.values,
      strings: {},
    },
  };
}

// let setStringInputValue = (model: Model.t, id: string, value: string) => {
//   let strings = Js.Dict.fromArray(Js.Dict.entries(model.values.strings))
//   Js.Dict.set(strings, id, value)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       strings,
//     },
//   }
// }

export function setStringInputValue(
  model: Model,
  id: string,
  value: string
): Model {
  const strings: Record<string, string> = { ...model.values.strings };
  strings[id] = value;
  return {
    ...model,
    values: {
      ...model.values,
      strings,
    },
  };
}

// let getStringInputValue = (model: Model.t, id: string) => {
//   let value = Js.Dict.get(model.values.strings, id)
//   switch value {
//   | None => ""
//   | Some(value) => value
//   }
// }

export function getStringInputValue(model: Model, id: string): string {
  return model.values.strings[id] ?? "";
}

// let setBooleanInputValue = (model: Model.t, id: string, value: bool) => {
//   let booleans = Js.Dict.fromArray(Js.Dict.entries(model.values.booleans))
//   Js.Dict.set(booleans, id, value)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       booleans,
//     },
//   }
// }

export function setBooleanInputValue(
  model: Model,
  id: string,
  value: boolean
): Model {
  const booleans: Record<string, boolean> = { ...model.values.booleans };
  booleans[id] = value;
  return {
    ...model,
    values: {
      ...model.values,
      booleans,
    },
  };
}

// let getBooleanInputValue = (model: Model.t, id: string) => {
//   let value = Js.Dict.get(model.values.booleans, id)
//   switch value {
//   | None => false
//   | Some(value) => value
//   }
// }

export function getBooleanInputValue(model: Model, id: string): boolean {
  return model.values.booleans[id] ?? false;
}

// let getBooleanInputValueWithDefault = (model: Model.t, id: string, default: bool) => {
//   let value = Js.Dict.get(model.values.booleans, id)
//   switch value {
//   | None => default
//   | Some(value) => value
//   }
// }

export function getBooleanInputValueWithDefault(
  model: Model,
  id: string,
  defaultValue: boolean
): boolean {
  return model.values.booleans[id] ?? defaultValue;
}

// let setSelectInputValue = (model: Model.t, id: string, value: string) => {
//   let selects = Js.Dict.fromArray(Js.Dict.entries(model.values.selects))
//   Js.Dict.set(selects, id, value)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       selects,
//     },
//   }
// }

export function setSelectInputValue(
  model: Model,
  id: string,
  value: string
): Model {
  const selects: Record<string, string> = { ...model.values.selects };
  selects[id] = value;
  return {
    ...model,
    values: {
      ...model.values,
      selects,
    },
  };
}

// let getSelectInputValue = (model: Model.t, id: string) => {
//   let value = Js.Dict.get(model.values.selects, id)
//   switch value {
//   | None => ""
//   | Some(value) => value
//   }
// }

export function getSelectInputValue(model: Model, id: string): string {
  return model.values.selects[id] ?? "";
}

// let setRangeInputValue = (model: Model.t, id: string, value: int) => {
//   let ranges = Js.Dict.fromArray(Js.Dict.entries(model.values.ranges))
//   Js.Dict.set(ranges, id, value)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       ranges,
//     },
//   }
// }

export function setRangeInputValue(
  model: Model,
  id: string,
  value: number
): Model {
  const ranges: Record<string, number> = { ...model.values.ranges };
  ranges[id] = value;
  return {
    ...model,
    values: {
      ...model.values,
      ranges,
    },
  };
}

// let getRangeInputValue = (model: Model.t, id: string): int => {
//   let value = Js.Dict.get(model.values.ranges, id)
//   switch value {
//   | None => 0
//   | Some(value) => value
//   }
// }

export function getRangeInputValue(model: Model, id: string): number {
  return model.values.ranges[id] ?? 0;
}

// let hasBooleanValue = (model: Model.t, id: string) => {
//   switch Js.Dict.get(model.values.booleans, id) {
//   | None => false
//   | Some(_) => true
//   }
// }

export function hasBooleanValue(model: Model, id: string): boolean {
  return model.values.booleans[id] !== undefined;
}

// let hasSelectValue = (model: Model.t, id: string) => {
//   switch Js.Dict.get(model.values.selects, id) {
//   | None => false
//   | Some(_) => true
//   }
// }

export function hasSelectValue(model: Model, id: string): boolean {
  return model.values.selects[id] !== undefined;
}

// let hasRangeValue = (model: Model.t, id: string) => {
//   switch Js.Dict.get(model.values.ranges, id) {
//   | None => false
//   | Some(_) => true
//   }
// }

export function hasRangeValue(model: Model, id: string): boolean {
  return model.values.ranges[id] !== undefined;
}

// let usePage = (model: Model.t, id) => {
//   let page = findPage(model, id)
//   switch page {
//   | Some(page) => {
//       ...model,
//       currentPage: Some(page),
//     }
//   | None => {
//       let page = Generator_Page.make(id)
//       let pages = Js.Array2.concat(model.pages, [page])
//       {
//         ...model,
//         pages,
//         currentPage: Some(page),
//       }
//     }
//   }
// }

export function selectPage(model: Model, id: string): Model {
  const page = findPage(model, id);
  if (page) {
    return {
      ...model,
      currentPage: page,
    };
  }
  const newPage = makePage(id);
  return {
    ...model,
    pages: [...model.pages, newPage],
    currentPage: newPage,
  };
}

// let getDefaultPageId = () => "Page"

export function getDefaultPageId(): string {
  return "Page";
}

// let getCurrentPageId = (model: Model.t) => {
//   switch model.currentPage {
//   | None => getDefaultPageId()
//   | Some(page) => page.id
//   }
// }

export function getCurrentPageId(model: Model): string {
  return model.currentPage ? model.currentPage.id : getDefaultPageId();
}

// let ensureCurrentPage = (model: Model.t) => {
//   switch model.currentPage {
//   | None => usePage(model, getDefaultPageId())
//   | Some(_) => model
//   }
// }

export function ensureCurrentPage(model: Model): Model {
  if (!model.currentPage) {
    return selectPage(model, getDefaultPageId());
  }
  return model;
}

// let defineRegionInput = (model: Model.t, region: (int, int, int, int), callback) => {
//   let pageId = getCurrentPageId(model)
//   let inputs = Js.Array2.concat(model.inputs, [Input.RegionInput(pageId, region, callback)])
//   {...model, inputs}
// }

export function defineRegionInput(
  model: Model,
  region: [number, number, number, number],
  onClick: () => void
): Model {
  const pageId = getCurrentPageId(model);
  const inputs: Input[] = [
    ...model.inputs,
    { kind: "RegionInput", pageId, region, onClick },
  ];
  return {
    ...model,
    inputs,
  };
}

// let defineCustomStringInput = (
//   model: Model.t,
//   id: string,
//   fn: (string => unit) => React.element,
// ) => {
//   let inputs = Js.Array2.concat(model.inputs, [Input.CustomStringInput(id, fn)])
//   {...model, inputs}
// }

export function defineCustomStringInput(
  model: Model,
  id: string,
  render: (callback: (value: string) => void) => React.ReactNode
): Model {
  const inputs: Input[] = [
    ...model.inputs,
    { kind: "CustomStringInput", id, render },
  ];
  return {
    ...model,
    inputs,
  };
}

// let defineBooleanInput = (model: Model.t, id: string, initial: bool) => {
//   let inputs = Js.Array2.concat(model.inputs, [Input.BooleanInput(id)])
//   let newModel = {...model, inputs}
//   if !hasBooleanValue(model, id) {
//     setBooleanInputValue(newModel, id, initial)
//   } else {
//     newModel
//   }
// }

export function defineBooleanInput(
  model: Model,
  id: string,
  initial: boolean
): Model {
  const inputs: Input[] = [...model.inputs, { kind: "BooleanInput", id }];
  const newModel: Model = {
    ...model,
    inputs,
  };
  if (!hasBooleanValue(model, id)) {
    return setBooleanInputValue(newModel, id, initial);
  }
  return newModel;
}

// let defineButtonInput = (model: Model.t, id: string, onClick) => {
//   let inputs = Js.Array2.concat(model.inputs, [Input.ButtonInput(id, onClick)])
//   let newModel = {...model, inputs}
//   newModel
// }

export function defineButtonInput(
  model: Model,
  id: string,
  onClick: () => void
): Model {
  const inputs: Input[] = [
    ...model.inputs,
    { kind: "ButtonInput", id, onClick },
  ];
  return {
    ...model,
    inputs,
  };
}

// let defineSelectInput = (model: Model.t, id: string, options: array<string>) => {
//   let inputs = Js.Array2.concat(model.inputs, [Input.SelectInput(id, options)])
//   let newModel = {...model, inputs}
//   if !hasSelectValue(model, id) {
//     let value = Belt.Option.getWithDefault(options[0], "")
//     setSelectInputValue(newModel, id, value)
//   } else {
//     newModel
//   }
// }

export function defineSelectInput(
  model: Model,
  id: string,
  options: string[]
): Model {
  const inputs: Input[] = [
    ...model.inputs,
    { kind: "SelectInput", id, options },
  ];
  const newModel: Model = {
    ...model,
    inputs,
  };
  if (!hasSelectValue(model, id)) {
    const value = options[0] ?? "";
    return setSelectInputValue(newModel, id, value);
  }
  return newModel;
}

// let defineRangeInput = (model: Model.t, id: string, rangeArgs: Input.rangeArgs) => {
//   let inputs = Js.Array2.concat(model.inputs, [Input.RangeInput(id, rangeArgs)])
//   let newModel = {...model, inputs}
//   if !hasRangeValue(model, id) {
//     setRangeInputValue(newModel, id, rangeArgs.value)
//   } else {
//     newModel
//   }
// }

export function defineRangeInput(
  model: Model,
  id: string,
  min: number,
  max: number,
  value: number,
  step: number
): Model {
  const inputs: Input[] = [
    ...model.inputs,
    { kind: "RangeInput", id, min, max, value, step },
  ];
  const newModel: Model = {
    ...model,
    inputs,
  };
  if (!hasRangeValue(model, id)) {
    return setRangeInputValue(newModel, id, value);
  }
  return newModel;
}

// let defineTextureInput = (model: Model.t, id, options) => {
//   let input = Input.TextureInput(id, options)
//   let inputs = Js.Array2.concat(model.inputs, [input])
//   {
//     ...model,
//     inputs,
//   }
// }

export function defineTextureInput(
  model: Model,
  id: string,
  standardWidth: number,
  standardHeight: number,
  choices: string[]
): Model {
  const input: Input = {
    kind: "TextureInput",
    id,
    standardWidth,
    standardHeight,
    choices,
  };
  const inputs: Input[] = [...model.inputs, input];
  return {
    ...model,
    inputs,
  };
}

// let defineText = (model: Model.t, text: string) => {
//   let isText = input =>
//     switch input {
//     | Input.Text(_) => true
//     | _ => false
//     }
//   let textCount = model.inputs->Js.Array2.filter(isText)->Js.Array2.length
//   let id = "text-" ++ Js.Int.toString(textCount + 1)
//   let input = Input.Text(id, text)
//   let inputs = Js.Array2.concat(model.inputs, [input])
//   {
//     ...model,
//     inputs,
//   }
// }

export function defineText(model: Model, text: string): Model {
  const isText = (input: Input): boolean => input.kind === "Text";
  const textCount = model.inputs.filter(isText).length;
  const id = `text-${textCount + 1}`;
  const input: Input = { kind: "Text", id, text };
  const inputs: Input[] = [...model.inputs, input];
  return {
    ...model,
    inputs,
  };
}

// let fillBackgroundColor = (model: Model.t, color: string) => {
//   switch model.currentPage {
//   | None => model
//   | Some(currentPage) => {
//       let currentPage = findPage(model, currentPage.id)
//       switch currentPage {
//       | None => model
//       | Some(currentPage) => {
//           let {width, height} = currentPage.canvasWithContext
//           let newCanvas = Generator_CanvasWithContext.make(width, height)
//           let previousFillStyle = newCanvas.context->Context2d.getFillStyle
//           newCanvas.context->Context2d.setFillStyle(color)
//           newCanvas.context->Context2d.fillRect(0, 0, width, height)
//           newCanvas.context->Context2d.drawCanvasXY(currentPage.canvasWithContext.canvas, 0, 0)
//           newCanvas.context->Context2d.setFillStyle(previousFillStyle)

//           let newCurrentPage = {
//             ...currentPage,
//             canvasWithContext: newCanvas,
//           }

//           let newPages = Belt.Array.map(model.pages, page => {
//             page.id === newCurrentPage.id ? newCurrentPage : page
//           })

//           let newModel = {
//             ...model,
//             pages: newPages,
//             currentPage: Some(newCurrentPage),
//           }

//           newModel
//         }
//       }
//     }
//   }
// }

export function fillBackgroundColor(model: Model, color: string): Model {
  if (!model.currentPage) {
    return model;
  }
  const currentPage = findPage(model, model.currentPage.id);
  if (!currentPage) {
    return model;
  }
  const { width, height } = currentPage.canvasWithContext;
  const newCanvas = makeCanvasWithContext(width, height);
  const previousFillStyle = newCanvas.context.fillStyle;
  newCanvas.context.fillStyle = color;
  newCanvas.context.fillRect(0, 0, width, height);
  newCanvas.context.drawImage(currentPage.canvasWithContext.canvas, 0, 0);
  newCanvas.context.fillStyle = previousFillStyle;
  const newCurrentPage: Page = {
    ...currentPage,
    canvasWithContext: newCanvas,
  };
  const newPages: Page[] = model.pages.map((page) =>
    page.id === newCurrentPage.id ? newCurrentPage : page
  );
  return {
    ...model,
    pages: newPages,
    currentPage: newCurrentPage,
  };
}

// let fillRect = (model: Model.t, dest: rectangle, color: string) => {
//   let (x, y, w, h) = dest

//   switch model.currentPage {
//   | None => model
//   | Some(currentPage) => {
//       let context = currentPage.canvasWithContext.context
//       context->Context2d.setFillStyle(color)
//       context->Context2d.fillRect(x, y, w, h)

//       model
//     }
//   }
// }

export function fillRect(
  model: Model,
  dest: [number, number, number, number],
  color: string
): Model {
  const [x, y, w, h] = dest;
  if (!model.currentPage) {
    return model;
  }
  const context = model.currentPage.canvasWithContext.context;
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
  return model;
}

// let getOffset = ((x1, y1): position, (x2, y2): position) => {
//   let x1 = Belt.Int.toFloat(x1)
//   let y1 = Belt.Int.toFloat(y1)
//   let x2 = Belt.Int.toFloat(x2)
//   let y2 = Belt.Int.toFloat(y2)

//   let w = x2 -. x1
//   let h = y2 -. y1

//   /* When a line is drawn and its start and end coords are integer values, the
//   resulting line is drawn in between to rows of pixels, resulting in a line
//   that is two pixels wide and half transparent. To fix this, the line's start
//   and end positions need to be offset 0.5 pixels in the direction normal to the
//   line. The following code gets the angle of the line, and gets the components
//   for a translation in the direction perpendicular to the angle using vector
//   resolution: https://physics.info/vector-components/summary.shtml This results
//   in a fully opaque line with the correct width if the line is vertical or
//   horizontal, but antialiasing may still affect lines at other angles.
//  */
//   let angle = Js.Math.atan2(~y=h, ~x=w, ())
//   let ox = Js.Math.sin(angle) *. 0.5
//   let oy = Js.Math.cos(angle) *. 0.5

//   (ox, oy)
// }

export function getOffset(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): [number, number] {
  const w = x2 - x1;
  const h = y2 - y1;

  /* When a line is drawn and its start and end coords are integer values, the
  resulting line is drawn in between to rows of pixels, resulting in a line
  that is two pixels wide and half transparent. To fix this, the line's start
  and end positions need to be offset 0.5 pixels in the direction normal to the
  line. The following code gets the angle of the line, and gets the components
  for a translation in the direction perpendicular to the angle using vector
  resolution: https://physics.info/vector-components/summary.shtml This results
  in a fully opaque line with the correct width if the line is vertical or
  horizontal, but antialiasing may still affect lines at other angles.
 */

  const angle = Math.atan2(h, w);
  const ox = Math.sin(angle) * 0.5;
  const oy = Math.cos(angle) * 0.5;
  return [ox, oy];
}

// let drawLine = (
//   model: Model.t,
//   (x1, y1): position,
//   (x2, y2): position,
//   ~color: string,
//   ~width: int,
//   ~pattern: array<int>,
//   ~offset: int,
// ) => {
//   let (ox, oy) = getOffset((x1, y1), (x2, y2))

//   switch model.currentPage {
//   | None => model
//   | Some(currentPage) => {
//       let context = currentPage.canvasWithContext.context
//       context->Context2d.beginPath
//       context->Context2d.strokeStyle(color)
//       context->Context2d.lineWidth(width)
//       context->Context2d.setLineDash(pattern)
//       context->Context2d.lineDashOffset(offset)
//       context->Context2d.moveTo(Belt.Int.toFloat(x1) +. ox, Belt.Int.toFloat(y1) +. oy)
//       context->Context2d.lineTo(Belt.Int.toFloat(x2) +. ox, Belt.Int.toFloat(y2) +. oy)
//       context->Context2d.stroke

//       model
//     }
//   }
// }

export function drawLine(
  model: Model,
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  {
    color,
    width,
    pattern,
    offset,
  }: {
    color: string;
    width: number;
    pattern: number[];
    offset: number;
  }
): Model {
  const [ox, oy] = getOffset([x1, y1], [x2, y2]);
  if (!model.currentPage) {
    return model;
  }
  const context = model.currentPage.canvasWithContext.context;
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.setLineDash(pattern);
  context.lineDashOffset = offset;
  context.moveTo(x1 + ox, y1 + oy);
  context.lineTo(x2 + ox, y2 + oy);
  context.stroke();
  return model;
}

// let drawImage = (model: Model.t, id: string, (x, y): position) => {
//   let model = ensureCurrentPage(model)
//   let currentPage = model.currentPage
//   let image = Js.Dict.get(model.values.images, id)
//   switch (currentPage, image) {
//   | (Some(page), Some(imageWithCanvas)) =>
//     Context2d.drawImageXY(page.canvasWithContext.context, imageWithCanvas.image, x, y)
//   | _ => ()
//   }
//   model
// }

export function drawImage(
  model: Model,
  id: string,
  [x, y]: [number, number]
): Model {
  const modelWithPage = ensureCurrentPage(model);
  const currentPage = modelWithPage.currentPage;
  const image = modelWithPage.values.images[id];
  if (currentPage && image) {
    const context = currentPage.canvasWithContext.context;
    context.drawImage(image.image, x, y);
  }
  return modelWithPage;
}

// let addImage = (model: Model.t, id: string, image: Image.t) => {
//   let imageWithCanvas = Generator_ImageWithCanvas.makeFromImage(image)
//   let images = Js.Dict.fromArray(Js.Dict.entries(model.values.images))
//   Js.Dict.set(images, id, imageWithCanvas)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       images,
//     },
//   }
// }

export function addImage(
  model: Model,
  id: string,
  image: HTMLImageElement
): Model {
  const imageWithCanvas = makeImageWithCanvasFromImage(image);
  const images: Record<string, ImageWithCanvas> = {
    ...model.values.images,
  };
  images[id] = imageWithCanvas;
  return {
    ...model,
    values: {
      ...model.values,
      images,
    },
  };
}

// let addTexture = (model: Model.t, id: string, texture: Generator_Texture.t) => {
//   let textures = Js.Dict.fromArray(Js.Dict.entries(model.values.textures))
//   Js.Dict.set(textures, id, texture)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       textures,
//     },
//   }
// }

export function addTexture(model: Model, id: string, texture: Texture): Model {
  const textures: Record<string, Texture> = {
    ...model.values.textures,
  };
  textures[id] = texture;
  return {
    ...model,
    values: {
      ...model.values,
      textures,
    },
  };
}

// let clearTexture = (model: Model.t, id: string) => {
//   let entries =
//     Js.Dict.entries(model.values.textures)->Js.Array2.filter(((textureId, _)) => textureId !== id)
//   let textures = Js.Dict.fromArray(entries)
//   {
//     ...model,
//     values: {
//       ...model.values,
//       textures,
//     },
//   }
// }

export function clearTexture(model: Model, id: string): Model {
  // Unsafe types, consider coverting to Maps
  const entries = Object.entries(model.values.textures).filter(
    ([textureId]) => textureId !== id
  );
  const textures: Record<string, Texture> = Object.fromEntries(entries);
  return {
    ...model,
    values: {
      ...model.values,
      textures,
    },
  };
}

// let drawTexture = (
//   model: Model.t,
//   id: string,
//   (sx, sy, sw, sh): rectangle,
//   (dx, dy, dw, dh): rectangle,
//   ~flip: Generator_Texture.flip,
//   ~rotate: Generator_Texture.rotate,
//   ~blend: Generator_Texture.blend,
//   ~pixelate: bool,
//   (),
// ) => {
//   let model = ensureCurrentPage(model)
//   let currentPage = model.currentPage
//   let texture = Js.Dict.get(model.values.textures, id)
//   switch (currentPage, texture) {
//   | (Some(page), Some(texture)) =>
//     Generator_Texture.draw(
//       texture,
//       page,
//       sx,
//       sy,
//       sw,
//       sh,
//       dx,
//       dy,
//       dw,
//       dh,
//       ~flip,
//       ~rotate,
//       ~blend,
//       ~pixelate,
//       (),
//     )
//   | _ => ()
//   }
//   model
// }

export function drawTexture(
  model: Model,
  id: string,
  [sx, sy, sw, sh]: [number, number, number, number],
  [dx, dy, dw, dh]: [number, number, number, number],
  {
    flip,
    rotate,
    blend,
    pixelate,
  }: {
    flip: Flip;
    rotate: Rotate;
    blend: Blend;
    pixelate: boolean;
  }
): Model {
  const modelWithPage = ensureCurrentPage(model);
  const currentPage = modelWithPage.currentPage;
  const texture = modelWithPage.values.textures[id];
  if (currentPage && texture) {
    draw(
      texture,
      currentPage.canvasWithContext,
      [sx, sy, sw, sh],
      [dx, dy, dw, dh],
      {
        flip,
        rotate,
        blend,
        pixelate,
      }
    );
  }
  return modelWithPage;
}

// let hasImage = (model: Model.t, id: string) => {
//   let image = Js.Dict.get(model.values.images, id)
//   switch image {
//   | None => false
//   | Some(_) => true
//   }
// }

// let hasTexture = (model: Model.t, id: string) => {
//   let texture = Js.Dict.get(model.values.textures, id)
//   switch texture {
//   | None => false
//   | Some(_) => true
//   }
// }

// let drawText = (model: Model.t, text: string, position: position, size: int) => {
//   let model = ensureCurrentPage(model)
//   switch model.currentPage {
//   | None => ()
//   | Some(currentPage) => {
//       let (x, y) = position
//       let font = Belt.Int.toString(size) ++ "px sans-serif"
//       currentPage.canvasWithContext.context->Context2d.font(font)
//       currentPage.canvasWithContext.context->Context2d.fillText(text, x, y)
//     }
//   }
//   model
// }
