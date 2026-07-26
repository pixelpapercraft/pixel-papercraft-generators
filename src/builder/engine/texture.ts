import {
  type ImageWithCanvas,
  makeImageWithCanvasFromImage,
} from "./imageWithCanvas";
import { makeImageFromUrl } from "./image";

export type Texture = {
  standardWidth: number;
  standardHeight: number;
  imageWithCanvas: ImageWithCanvas;
};

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

export async function makeTextureFromUrl(
  url: string,
  standardWidth: number,
  standardHeight: number
): Promise<Texture> {
  const image = await makeImageFromUrl(url);
  const texture = makeTextureFromImage(image, standardWidth, standardHeight);
  return texture;
}
