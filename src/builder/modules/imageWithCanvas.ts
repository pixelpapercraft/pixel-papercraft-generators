import { makeImageFromUrl } from "./image";
import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";

export type ImageWithCanvas = {
  image: HTMLImageElement;
  width: number;
  height: number;
  canvasWithContext: CanvasWithContext;
};

export function makeImageWithCanvasFromImage(
  image: HTMLImageElement
): ImageWithCanvas {
  const width = image.width;
  const height = image.height;
  const canvasWithContext = makeCanvasWithContext(width, height);
  canvasWithContext.context.drawImage(image, 0, 0);
  return {
    image,
    width,
    height,
    canvasWithContext,
  };
}

export async function makeImageWithCanvasFromUrl(
  url: string
): Promise<ImageWithCanvas> {
  return makeImageFromUrl(url).then(makeImageWithCanvasFromImage);
}
