import { CanvasWithContext } from "./canvasWithContext";
import { selectPage, type Model } from "./model";
import {
  type Texture,
  type Flip,
  type Rotate,
  type Blend,
  draw,
} from "./texture";
import { type Input } from "./input";

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

export function fillBackgroundColor(model: Model, color: string) {
  const currentPage = model.currentPage;
  if (!currentPage) return;
  const newCanvas = document.createElement("canvas");
  newCanvas.width = currentPage.canvasWithContext.canvas.width;
  newCanvas.height = currentPage.canvasWithContext.canvas.height;
  const newContext = newCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!newContext) return;
  newContext.fillStyle = color;
  newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
  newContext.drawImage(currentPage.canvasWithContext.canvas, 0, 0);
  const newCanvasWithContext = {
    canvas: newCanvas,
    context: newContext,
  };
  const newPages = model.pages.map((page) =>
    page.id === currentPage.id
      ? { ...page, canvasWithContext: newCanvasWithContext }
      : page
  );
  return {
    ...model,
    pages: newPages,
    currentPage: { ...currentPage, canvasWithContext: newCanvasWithContext },
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
  [x, y, w, h]: [number, number, number, number],
  color: string
) {
  const currentPage = model.currentPage;
  if (!currentPage) return;
  const context = currentPage.canvasWithContext.context;
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
) {
  const w = x2 - x1;
  const h = y2 - y1;
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
) {
  const currentPage = model.currentPage;
  if (!currentPage) return;
  const context = currentPage.canvasWithContext.context;
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.setLineDash(pattern);
  context.lineDashOffset = offset;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
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
  let currModel = model;

  const currentPage = currModel.currentPage;

  if (!currentPage) {
    return currModel;
  }

  const imageWithCanvas = model.values.images[id];

  if (!imageWithCanvas) {
    return currModel;
  }

  currentPage.canvasWithContext.context.drawImage(imageWithCanvas.image, x, y);

  return currModel;
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

function addImage(model: Model, id: string, image: HTMLImageElement) {
  const images = { ...model.values.images, [id]: image };
  return { ...model, values: { ...model.values, images } };
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

function addTexture(model: Model, id: string, texture: Texture) {
  const textures = { ...model.values.textures, [id]: texture };
  return { ...model, values: { ...model.values, textures } };
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

export function clearTexture(model: Model, id: string) {
  const textures = Object.fromEntries(
    Object.entries(model.values.textures).filter(
      ([textureId]) => textureId !== id
    )
  );
  return { ...model, values: { ...model.values, textures } };
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
  texture: Texture,
  page: CanvasWithContext,
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
): void {
  draw(texture, page, [sx, sy, sw, sh], [dx, dy, dw, dh], {
    flip,
    rotate,
    blend,
    pixelate,
  });
}

// let hasImage = (model: Model.t, id: string) => {
//   let image = Js.Dict.get(model.values.images, id)
//   switch image {
//   | None => false
//   | Some(_) => true
//   }
// }

function hasImage(model: Model, id: string) {
  return model.values.images[id] !== undefined;
}

// let hasTexture = (model: Model.t, id: string) => {
//   let texture = Js.Dict.get(model.values.textures, id)
//   switch texture {
//   | None => false
//   | Some(_) => true
//   }
// }

function hasTexture(model: Model, id: string) {
  return model.values.textures[id] !== undefined;
}

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

export function drawText(
  model: Model,
  text: string,
  position: [number, number],
  size: number
) {
  const currentPage = model.currentPage;
  if (!currentPage) return;
  const [x, y] = position;
  const font = `${size}px sans-serif`;
  currentPage.canvasWithContext.context.font = font;
  currentPage.canvasWithContext.context.fillText(text, x, y);
  return model;
}
