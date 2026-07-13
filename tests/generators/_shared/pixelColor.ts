import type { Locator } from "@playwright/test";

export type Rgba = { r: number; g: number; b: number; a: number };

// Reads the exact colour of a single pixel of a rendered generator page image.
// The page `<img>`'s `src` is a `data:image/png` of the full A4 canvas, so its
// natural pixel coordinates map 1:1 to the coordinates a generator script draws
// at. Drawing it onto an offscreen canvas and reading `getImageData` gives a
// deterministic colour assertion without a golden-file screenshot.
export async function readPixel(
  image: Locator,
  x: number,
  y: number
): Promise<Rgba> {
  return image.evaluate(
    async (img: HTMLImageElement, { x, y }: { x: number; y: number }) => {
      // The data-URL image may not have decoded yet; drawImage on an
      // undecoded image paints nothing.
      if (!img.complete || img.naturalWidth === 0) {
        await img.decode();
      }

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to get 2d context for pixel read");
      }

      context.drawImage(img, 0, 0);
      const data = context.getImageData(x, y, 1, 1).data;

      return {
        r: data[0] ?? 0,
        g: data[1] ?? 0,
        b: data[2] ?? 0,
        a: data[3] ?? 0,
      };
    },
    { x, y }
  );
}

// Reads a horizontal run of `width` pixels starting at (x, y), returning one
// Rgba per pixel. Useful when a contract is about a *pattern* along a line
// (e.g. a dashed fold line has both painted dashes and transparent gaps) rather
// than an exact colour at one coordinate.
export async function readPixelRow(
  image: Locator,
  x: number,
  y: number,
  width: number
): Promise<Rgba[]> {
  return image.evaluate(
    async (
      img: HTMLImageElement,
      { x, y, width }: { x: number; y: number; width: number }
    ) => {
      if (!img.complete || img.naturalWidth === 0) {
        await img.decode();
      }

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to get 2d context for pixel read");
      }

      context.drawImage(img, 0, 0);
      const data = context.getImageData(x, y, width, 1).data;

      const pixels: { r: number; g: number; b: number; a: number }[] = [];
      for (let i = 0; i < width; i++) {
        pixels.push({
          r: data[i * 4] ?? 0,
          g: data[i * 4 + 1] ?? 0,
          b: data[i * 4 + 2] ?? 0,
          a: data[i * 4 + 3] ?? 0,
        });
      }
      return pixels;
    },
    { x, y, width }
  );
}
