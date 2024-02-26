import {
  type ImageWithCanvas,
  makeImageWithCanvasFromImage,
} from "./imageWithCanvas";
import { makeImageFromUrl } from "./imageFactory";
import { makeCanvas } from "./canvasFactory";
import { type Page } from "./page";

// open Dom2

// type t = {
//   standardWidth: int,
//   standardHeight: int,
//   imageWithCanvas: Generator_ImageWithCanvas.t,
// }

export type Texture = {
  standardWidth: number;
  standardHeight: number;
  imageWithCanvas: ImageWithCanvas;
};

// let make = (image, standardWidth, standardHeight): t => {
//   let imageWithCanvas = Generator_ImageWithCanvas.makeFromImage(image)
//   let texture = {
//     standardWidth,
//     standardHeight,
//     imageWithCanvas,
//   }
//   texture
// }

export function makeTextureFromImage(
  image: HTMLImageElement,
  standardWidth: number,
  standardHeight: number
): Texture {
  const imageWithCanvas = makeImageWithCanvasFromImage(image);
  return {
    standardWidth,
    standardHeight,
    imageWithCanvas,
  };
}

// let makeFromUrl = (url, standardWidth, standardHeight) =>
//   Generator_ImageFactory.makeFromUrl(url)->Promise.thenResolve(image =>
//     make(image, standardWidth, standardHeight)
//   )

export async function makeTextureFromUrl(
  url: string,
  standardWidth: number,
  standardHeight: number
): Promise<Texture> {
  const image = await makeImageFromUrl(url);
  const texture = makeTextureFromImage(image, standardWidth, standardHeight);
  return texture;
}

// type flip = [#None | #Horizontal | #Vertical]

export type Flip =
  | { kind: "None" }
  | { kind: "Horizontal" }
  | { kind: "Vertical" };

// type rotate = [#None | #Corner(float) | #Center(float)]

export type Rotate =
  | { kind: "None" }
  | { kind: "Corner"; degrees: number }
  | { kind: "Center"; degrees: number };

// type blend = [#None | #MultiplyHex(string) | #MultiplyRGB(int, int, int)]

export type Blend =
  | { kind: "None" }
  | { kind: "MultiplyHex"; hex: string }
  | { kind: "MultiplyRGB"; r: number; g: number; b: number };

// type drawNearestNeighborOptions = {rotate: rotate, flip: flip, blend: blend, pixelate: bool}

export type DrawNearestNeighborOptions = {
  rotate: Rotate;
  flip: Flip;
  blend: Blend;
  pixelate: boolean;
};

// @val external parseInt: (string, int) => float = "parseInt"

// let parseHex = (hex: string) => {
//   let hex = if Js.String2.startsWith(hex, "#") {
//     Js.String2.substr(hex, ~from=1)
//   } else {
//     hex
//   }
//   if Js.String2.length(hex) == 6 {
//     let f = parseInt(hex, 16)
//     if Js.Float.isNaN(f) {
//       None
//     } else {
//       let i = Belt.Float.toInt(f)
//       Some(i)
//     }
//   } else {
//     None
//   }
// }

function parseHex(value: string): number | null {
  const hex = value.startsWith("#") ? value.slice(1) : value;
  if (hex.length === 6) {
    const f = parseInt(hex, 16);
    if (isNaN(f)) {
      return null;
    }
    return Math.floor(f);
  }
  return null;
}

// let shift: (int, int) => int = %raw(`
//     function shift(value, shift) {
//       return value >> shift & 255
//     }
//   `)

function shift(value: number, shift: number): number {
  return (value >> shift) & 255;
}

// let hexToRGB = (hex: string) => {
//   switch parseHex(hex) {
//   | None => None
//   | Some(value) => {
//       let r = shift(value, 16)
//       let g = shift(value, 8)
//       let b = shift(value, 0)
//       Some((r, g, b))
//     }
//   }
// }

function hexToRGB(hex: string): [number, number, number] | null {
  const value = parseHex(hex);
  if (value === null) {
    return null;
  }
  const r = shift(value, 16);
  const g = shift(value, 8);
  const b = shift(value, 0);
  return [r, g, b];
}

// let blendColors = (r1: int, g1: int, b1: int, r2: int, g2: int, b2: int) => (
//   (Belt.Int.toFloat(r1) *. Belt.Int.toFloat(r2) /. 255.0)->Belt.Float.toInt,
//   (Belt.Int.toFloat(g1) *. Belt.Int.toFloat(g2) /. 255.0)->Belt.Float.toInt,
//   (Belt.Int.toFloat(b1) *. Belt.Int.toFloat(b2) /. 255.0)->Belt.Float.toInt,
// )

function blendColors(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): [number, number, number] {
  return [
    Math.floor((r1 * r2) / 255),
    Math.floor((g1 * g2) / 255),
    Math.floor((b1 * b2) / 255),
  ];
}

// // Scale (dw, dh) so it fits inside (sw, sh)
// let fit = (sw, sh, dw, dh) => {
//   let wScale = Belt.Int.toFloat(sw) /. Belt.Int.toFloat(dw)
//   let hScale = Belt.Int.toFloat(sh) /. Belt.Int.toFloat(dh)
//   let scale = Js.Math.min_float(wScale, hScale)
//   let (w, h) = if scale < 1.0 {
//     (Belt.Int.toFloat(dw) *. scale, Belt.Int.toFloat(dh) *. scale)
//   } else {
//     (Belt.Int.toFloat(dw), Belt.Int.toFloat(dh))
//   }
//   (Js.Math.ceil_int(w), Js.Math.ceil_int(h))
// }

function fit(sw: number, sh: number, dw: number, dh: number): [number, number] {
  const wScale = sw / dw;
  const hScale = sh / dh;
  const scale = Math.min(wScale, hScale);
  const [w, h] = scale < 1 ? [dw * scale, dh * scale] : [dw, dh];
  return [Math.ceil(w), Math.ceil(h)];
}

// let preparePixelationCanvas = (sourceCanvas, sx, sy, sw, sh, dw, dh) => {
//   let (sw2, sh2) = fit(sw, sh, dw, dh)
//   let canvas = Generator_CanvasFactory.make(sw2, sh2)
//   let context = Canvas.getContext2d(canvas)
//   context->Context2d.setImageSmoothingEnabled(false)
//   context->Context2d.drawCanvas(sourceCanvas, sx, sy, sw, sh, 0, 0, sw2, sh2)
//   canvas
// }

function preparePixelationCanvas(
  sourceCanvas: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): HTMLCanvasElement {
  const [sw2, sh2] = fit(sw, sh, dw, dh);
  const canvas = makeCanvas(sw2, sh2);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to get 2d context from canvas");
  }
  context.imageSmoothingEnabled = false;
  context.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw2, sh2);
  return canvas;
}

// let drawNearestNeighbor = (
//   texture: Texture,
//   page: Generator_Page.t,
//   sx,
//   sy,
//   sw,
//   sh,
//   dx,
//   dy,
//   dw,
//   dh,
//   options: drawNearestNeighborOptions,
// ) => {
//   let (canvas, sx, sy, sw, sh, dx, dy, dw, dh) = if options.pixelate {
//     let canvas = preparePixelationCanvas(
//       texture.imageWithCanvas.canvasWithContext.canvas,
//       sx,
//       sy,
//       sw,
//       sh,
//       dw,
//       dh,
//     )
//     (canvas, 0, 0, Canvas.getWidth(canvas), Canvas.getHeight(canvas), dx, dy, dw, dh)
//   } else {
//     (texture.imageWithCanvas.canvasWithContext.canvas, sx, sy, sw, sh, dx, dy, dw, dh)
//   }

//   if sw > 0 && sh > 0 && dw > 0 && dh > 0 {
//     let imageData = Context2d.getImageData(Canvas.getContext2d(canvas), sx, sy, sw, sh)
//     let pix = imageData.data

//     let tempCanvas = Generator_CanvasFactory.make(dw, dh)
//     let tempContext = Canvas.getContext2d(tempCanvas)

//     let deltax = Belt.Int.toFloat(dw) /. Belt.Int.toFloat(sw)
//     let deltay = Belt.Int.toFloat(dh) /. Belt.Int.toFloat(sh)

//     let pixw = Js.Math.floor(deltax)
//     let pixh = Js.Math.floor(deltay)

//     let pixw = Belt.Int.toFloat(pixw) < deltax ? pixw + 1 : pixw
//     let pixh = Belt.Int.toFloat(pixh) < deltay ? pixh + 1 : pixh

//     let blend = switch options.blend {
//     | #None => None
//     | #MultiplyHex(hex) => hexToRGB(hex)
//     | #MultiplyRGB(r, g, b) => Some(r, g, b)
//     }

//     for y in 0 to sh - 1 {
//       for x in 0 to sw - 1 {
//         let tx = Belt.Int.toFloat(x) *. deltax
//         let ty = Belt.Int.toFloat(y) *. deltay

//         // Source pixel
//         let i = (y * sw + x) * 4

//         let r = Belt.Option.getWithDefault(pix[i + 0], 0)
//         let g = Belt.Option.getWithDefault(pix[i + 1], 0)
//         let b = Belt.Option.getWithDefault(pix[i + 2], 0)
//         let a = Belt.Int.toFloat(Belt.Option.getWithDefault(pix[i + 3], 0)) /. 255.0

//         let (r, g, b) = switch blend {
//         | None => (r, g, b)
//         | Some((r2, g2, b2)) => blendColors(r, g, b, r2, g2, b2)
//         }

//         Context2d.setFillStyleRGBA(tempContext, r, g, b, a)
//         Context2d.fillRect(tempContext, Js.Math.floor(tx), Js.Math.floor(ty), pixw, pixh)
//       }
//     }

//     let context = page.canvasWithContext.context

//     // Save the current state of the page
//     Context2d.save(context)

//     // Move to the destination coordinate
//     Context2d.translate(context, Belt.Int.toFloat(dx), Belt.Int.toFloat(dy))

//     switch options.rotate {
//     | #None => ()
//     | #Corner(degrees) => {
//         let radians = degrees *. Js.Math._PI /. 180.0
//         Context2d.rotate(context, radians)
//       }
//     | #Center(degrees) => {
//         let radians = degrees *. Js.Math._PI /. 180.0
//         Context2d.translate(context, Belt.Int.toFloat(dw) /. 2.0, Belt.Int.toFloat(dh) /. 2.0)
//         Context2d.rotate(context, radians)
//         Context2d.translate(context, Belt.Int.toFloat(dw) /. -2.0, Belt.Int.toFloat(dh) /. -2.0)
//       }
//     }

//     switch options.flip {
//     | #None => ()
//     | #Horizontal => {
//         Context2d.translate(context, Belt.Int.toFloat(dw), 0.0)
//         Context2d.scale(context, -1, 1)
//       }
//     | #Vertical => {
//         Context2d.translate(context, 0.0, Belt.Int.toFloat(dh))
//         Context2d.scale(context, 1, -1)
//       }
//     }

//     Context2d.drawCanvasXY(context, tempCanvas, 0, 0)

//     Context2d.restore(context)
//   }
// }

type Coordinates = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

function makeInitialValues(
  texture: Texture,
  coordinates: Coordinates,
  options: DrawNearestNeighborOptions
) {
  if (options.pixelate) {
    const canvas = preparePixelationCanvas(
      texture.imageWithCanvas.canvasWithContext.canvas,
      coordinates.sx,
      coordinates.sy,
      coordinates.sw,
      coordinates.sh,
      coordinates.dw,
      coordinates.dh
    );
    const sx = 0;
    const sy = 0;
    const sw = canvas.width;
    const sh = canvas.height;
    const { dx, dy, dw, dh } = coordinates;
    return { canvas, sx, sy, sw, sh, dx, dy, dw, dh };
  }

  const canvas = texture.imageWithCanvas.canvasWithContext.canvas;
  const { sx, sy, sw, sh, dx, dy, dw, dh } = coordinates;
  return { canvas, sx, sy, sw, sh, dx, dy, dw, dh };
}

function drawNearestNeighbor(
  texture: Texture,
  page: Page,
  coordinates: Coordinates,
  options: DrawNearestNeighborOptions
): void {
  const { canvas, sx, sy, sw, sh, dx, dy, dw, dh } = makeInitialValues(
    texture,
    coordinates,
    options
  );

  if (sw > 0 && sh > 0 && dw > 0 && dh > 0) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get 2d context from canvas");
    }

    const imageData = context.getImageData(sx, sy, sw, sh);

    if (!imageData) {
      throw new Error("Failed to get image data");
    }
    const pix = imageData.data;

    const tempCanvas = makeCanvas(dw, dh);

    const tempContext = tempCanvas.getContext("2d");

    if (!tempContext) {
      throw new Error("Failed to get 2d context from canvas");
    }

    const deltax = dw / sw;
    const deltay = dh / sh;

    const pixwInitial = Math.floor(deltax);
    const pixhInitial = Math.floor(deltay);

    const pixw = pixwInitial < deltax ? pixwInitial + 1 : pixwInitial;
    const pixh = pixhInitial < deltay ? pixhInitial + 1 : pixhInitial;

    const blend =
      options.blend.kind === "MultiplyHex"
        ? hexToRGB(options.blend.hex)
        : options.blend.kind === "MultiplyRGB"
        ? [options.blend.r, options.blend.g, options.blend.b]
        : null;

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const tx = x * deltax;
        const ty = y * deltay;

        // Source pixel
        const i = (y * sw + x) * 4;

        const r = pix[i + 0] ?? 0;
        const g = pix[i + 1] ?? 0;
        const b = pix[i + 2] ?? 0;
        const a = (pix[i + 3] ?? 0) / 255;

        const [red, green, blue] = blend
          ? blendColors(r, g, b, blend[0], blend[1], blend[2])
          : [r, g, b];

        tempContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${a})`;
        tempContext.fillRect(Math.floor(tx), Math.floor(ty), pixw, pixh);
      }
    }

    const pageContext = page.canvasWithContext.context;

    // Save the current state of the page
    pageContext.save();

    // Move to the destination coordinate
    pageContext.translate(dx, dy);

    if (options.rotate.kind === "Corner") {
      const radians = (options.rotate.degrees * Math.PI) / 180;
      pageContext.rotate(radians);
    } else if (options.rotate.kind === "Center") {
      const radians = (options.rotate.degrees * Math.PI) / 180;
      pageContext.translate(dw / 2, dh / 2);
      pageContext.rotate(radians);
      pageContext.translate(-dw / 2, -dh / 2);
    }

    if (options.flip.kind === "Horizontal") {
      pageContext.translate(dw, 0);
      pageContext.scale(-1, 1);
    } else if (options.flip.kind === "Vertical") {
      pageContext.translate(0, dh);
      pageContext.scale(1, -1);
    }

    pageContext.drawImage(tempCanvas, 0, 0);

    pageContext.restore();
  }
}

// let draw = (
//   texture: t,
//   page: Generator_Page.t,
//   sx,
//   sy,
//   sw,
//   sh,
//   dx,
//   dy,
//   dw,
//   dh,
//   ~flip: flip,
//   ~rotate: rotate,
//   ~blend: blend,
//   ~pixelate: bool,
//   (),
// ) => {
//   if sh > 0 && dh > 0 && sw > 0 && dw > 0 {
//     let sourceScaleX =
//       Belt.Int.toFloat(texture.imageWithCanvas.width) /. Belt.Int.toFloat(texture.standardWidth)
//     let sourceScaleY =
//       Belt.Int.toFloat(texture.imageWithCanvas.height) /. Belt.Int.toFloat(texture.standardHeight)

//     let sx = Js.Math.floor(Belt.Int.toFloat(sx) *. sourceScaleX)
//     let sy = Js.Math.floor(Belt.Int.toFloat(sy) *. sourceScaleY)
//     let sw = Js.Math.floor(Belt.Int.toFloat(sw) *. sourceScaleX)
//     let sh = Js.Math.floor(Belt.Int.toFloat(sh) *. sourceScaleY)

//     drawNearestNeighbor(
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
//       {rotate, flip, blend, pixelate},
//     )
//   }
// }

export function draw(
  texture: Texture,
  page: Page,
  [sx, sy, sw, sh]: [number, number, number, number],
  [dx, dy, dw, dh]: [number, number, number, number],
  {
    flip,
    rotate,
    blend,
    pixelate,
  }: {
    flip?: Flip;
    rotate?: Rotate;
    blend?: Blend;
    pixelate?: boolean;
  }
): void {
  if (sh > 0 && dh > 0 && sw > 0 && dw > 0) {
    const sourceScaleX = texture.imageWithCanvas.width / texture.standardWidth;
    const sourceScaleY =
      texture.imageWithCanvas.height / texture.standardHeight;

    const sxScaled = Math.floor(sx * sourceScaleX);
    const syScaled = Math.floor(sy * sourceScaleY);
    const swScaled = Math.floor(sw * sourceScaleX);
    const shScaled = Math.floor(sh * sourceScaleY);

    drawNearestNeighbor(
      texture,
      page,
      {
        sx: sxScaled,
        sy: syScaled,
        sw: swScaled,
        sh: shScaled,
        dx,
        dy,
        dw,
        dh,
      },
      {
        rotate: rotate ?? { kind: "None" },
        flip: flip ?? { kind: "None" },
        blend: blend ?? { kind: "None" },
        pixelate: pixelate ?? false,
      }
    );
  }
}
