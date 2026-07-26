import { describe, expect, it, vi } from "vitest";
import type { CanvasWithContext } from "../canvasWithContext";
import type { Texture } from "../texture";
import { drawTexture, type DrawTextureOptions } from "./drawTexture";

type PixelKey = string | null;

type Matrix = [number, number, number, number, number, number];

type FakeCanvas = {
  width: number;
  height: number;
  pixels: PixelKey[];
};

type FakeContext = {
  canvas: FakeCanvas;
  context: FakeContext;
  contextWithAlpha: FakeContext;
  width: number;
  height: number;
  fillStyle: string;
  getImageData: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    data: Uint8ClampedArray;
  };
  fillRect: (x: number, y: number, width: number, height: number) => void;
  drawImage: (canvas: FakeCanvas, dx: number, dy: number) => void;
  save: () => void;
  restore: () => void;
  translate: (x: number, y: number) => void;
  rotate: (radians: number) => void;
  scale: (x: number, y: number) => void;
  getPixels: () => PixelKey[][];
};

function makePixelKey(r: number, g: number, b: number, a: number): PixelKey {
  return `${r},${g},${b},${a}`;
}

function parseRgba(value: string): PixelKey {
  const match = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9]*\.?[0-9]+)\)$/.exec(
    value
  );
  if (!match) {
    return null;
  }

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = Math.round(Number(match[4]) * 255);
  return makePixelKey(r, g, b, a);
}

function keyToRgba(key: PixelKey): [number, number, number, number] {
  if (!key) {
    return [0, 0, 0, 0];
  }

  const [r, g, b, a] = key.split(",").map((value) => Number(value));
  return [r ?? 0, g ?? 0, b ?? 0, a ?? 0];
}

function makeIdentityMatrix(): Matrix {
  return [1, 0, 0, 1, 0, 0];
}

function multiply(a: Matrix, b: Matrix): Matrix {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}

function translateMatrix(matrix: Matrix, x: number, y: number): Matrix {
  return multiply(matrix, [1, 0, 0, 1, x, y]);
}

function rotateMatrix(matrix: Matrix, radians: number): Matrix {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return multiply(matrix, [cos, sin, -sin, cos, 0, 0]);
}

function scaleMatrix(matrix: Matrix, x: number, y: number): Matrix {
  return multiply(matrix, [x, 0, 0, y, 0, 0]);
}

function makeFakeCanvas(width: number, height: number): FakeCanvas {
  return {
    width,
    height,
    pixels: Array.from({ length: width * height }, () => null),
  };
}

function setPixel(
  canvas: FakeCanvas,
  x: number,
  y: number,
  key: PixelKey
): void {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
    return;
  }

  canvas.pixels[y * canvas.width + x] = key;
}

function getPixel(canvas: FakeCanvas, x: number, y: number): PixelKey {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
    return null;
  }

  return canvas.pixels[y * canvas.width + x] ?? null;
}

function makeFakeContext(width: number, height: number): FakeContext {
  const canvas = makeFakeCanvas(width, height);
  const stack: Matrix[] = [];
  let matrix = makeIdentityMatrix();
  let fillStyle = "rgba(0, 0, 0, 0)";

  const context: FakeContext = {
    canvas,
    context: undefined as unknown as FakeContext,
    contextWithAlpha: undefined as unknown as FakeContext,
    width,
    height,
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value: string) {
      fillStyle = value;
    },
    getImageData: (
      x: number,
      y: number,
      dataWidth: number,
      dataHeight: number
    ) => {
      const data = new Uint8ClampedArray(dataWidth * dataHeight * 4);
      let index = 0;
      for (let row = 0; row < dataHeight; row += 1) {
        for (let col = 0; col < dataWidth; col += 1) {
          const key = getPixel(canvas, x + col, y + row);
          const [r, g, b, a] = keyToRgba(key);
          data[index + 0] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = a;
          index += 4;
        }
      }
      return { data };
    },
    fillRect: (x: number, y: number, rectWidth: number, rectHeight: number) => {
      const key = parseRgba(fillStyle);
      for (let row = 0; row < rectHeight; row += 1) {
        for (let col = 0; col < rectWidth; col += 1) {
          setPixel(canvas, x + col, y + row, key);
        }
      }
    },
    drawImage: (sourceCanvas: FakeCanvas, dx: number, dy: number) => {
      for (let sourceY = 0; sourceY < sourceCanvas.height; sourceY += 1) {
        for (let sourceX = 0; sourceX < sourceCanvas.width; sourceX += 1) {
          const key = getPixel(sourceCanvas, sourceX, sourceY);
          if (!key) {
            continue;
          }

          const x = sourceX + dx + 0.5;
          const y = sourceY + dy + 0.5;
          const transformedX = matrix[0] * x + matrix[2] * y + matrix[4];
          const transformedY = matrix[1] * x + matrix[3] * y + matrix[5];
          const destX = Math.round(transformedX - 0.5);
          const destY = Math.round(transformedY - 0.5);
          setPixel(canvas, destX, destY, key);
        }
      }
    },
    save: () => {
      stack.push(matrix);
    },
    restore: () => {
      const previous = stack.pop();
      if (previous) {
        matrix = previous;
      }
    },
    translate: (x: number, y: number) => {
      matrix = translateMatrix(matrix, x, y);
    },
    rotate: (radians: number) => {
      matrix = rotateMatrix(matrix, radians);
    },
    scale: (x: number, y: number) => {
      matrix = scaleMatrix(matrix, x, y);
    },
    getPixels: () =>
      Array.from({ length: height }, (_, row) =>
        Array.from({ length: width }, (_, col) => getPixel(canvas, col, row))
      ),
  };

  context.context = context;
  context.contextWithAlpha = context;
  return context;
}

vi.mock("../canvasWithContext", () => ({
  makeCanvasWithContext: (width: number, height: number) =>
    makeFakeContext(width, height),
}));

function makeSourceTexture(pixels: PixelKey[][]): Texture {
  const height = pixels.length;
  const width = pixels[0]?.length ?? 0;
  const source = makeFakeContext(width, height);

  pixels.forEach((row, y) => {
    row.forEach((key, x) => {
      setPixel(source.canvas, x, y, key);
    });
  });

  return {
    standardWidth: width,
    standardHeight: height,
    imageWithCanvas: {
      image: {} as HTMLImageElement,
      width,
      height,
      canvasWithContext: source as unknown as CanvasWithContext,
    },
  } as Texture;
}

function rotatePixels(
  pixels: PixelKey[][],
  rotation: "Rot0" | "Rot90" | "Rot180" | "Rot270"
): PixelKey[][] {
  switch (rotation) {
    case "Rot0":
      return pixels.map((row) => row.slice());
    case "Rot90":
      return (
        pixels[0]?.map((_, x) =>
          pixels.map((row) => row[x] ?? null).reverse()
        ) ?? []
      );
    case "Rot180":
      return pixels
        .slice()
        .reverse()
        .map((row) => row.slice().reverse());
    case "Rot270":
      return (
        pixels[0]?.map((_, x) =>
          pixels.map((row) => row[row.length - 1 - x] ?? null)
        ) ?? []
      );
  }
}

function flipPixels(
  pixels: PixelKey[][],
  flip: "None" | "Horizontal" | "Vertical"
): PixelKey[][] {
  switch (flip) {
    case "None":
      return pixels.map((row) => row.slice());
    case "Horizontal":
      return pixels.map((row) => row.slice().reverse());
    case "Vertical":
      return pixels
        .slice()
        .reverse()
        .map((row) => row.slice());
  }
}

function expectedPixels(
  pixels: PixelKey[][],
  rotation: "Rot0" | "Rot90" | "Rot180" | "Rot270",
  flip: "None" | "Horizontal" | "Vertical"
): PixelKey[][] {
  return rotatePixels(flipPixels(pixels, flip), rotation);
}

describe("drawTexture", () => {
  const sourcePixels: PixelKey[][] = [
    [makePixelKey(255, 0, 0, 255), makePixelKey(0, 255, 0, 255)],
    [makePixelKey(0, 0, 255, 255), makePixelKey(255, 255, 0, 255)],
  ];

  const texture = makeSourceTexture(sourcePixels);
  const sourceRegion: [number, number, number, number] = [0, 0, 2, 2];
  const destinationRegion: [number, number, number, number] = [0, 0, 2, 2];

  const cases: Array<{
    name: string;
    rotation: "Rot0" | "Rot90" | "Rot180" | "Rot270";
    flip: "None" | "Horizontal" | "Vertical";
  }> = [
    { name: "rot0 none", rotation: "Rot0", flip: "None" },
    { name: "rot0 horizontal", rotation: "Rot0", flip: "Horizontal" },
    { name: "rot0 vertical", rotation: "Rot0", flip: "Vertical" },
    { name: "rot90 none", rotation: "Rot90", flip: "None" },
    { name: "rot90 horizontal", rotation: "Rot90", flip: "Horizontal" },
    { name: "rot90 vertical", rotation: "Rot90", flip: "Vertical" },
    { name: "rot180 none", rotation: "Rot180", flip: "None" },
    { name: "rot180 horizontal", rotation: "Rot180", flip: "Horizontal" },
    { name: "rot180 vertical", rotation: "Rot180", flip: "Vertical" },
    { name: "rot270 none", rotation: "Rot270", flip: "None" },
    { name: "rot270 horizontal", rotation: "Rot270", flip: "Horizontal" },
    { name: "rot270 vertical", rotation: "Rot270", flip: "Vertical" },
  ];

  cases.forEach(({ name, rotation, flip }) => {
    it(`renders the expected pixels for ${name}`, () => {
      const page = makeFakeContext(2, 2);
      const options: DrawTextureOptions = {
        rotate:
          rotation === "Rot0"
            ? 0
            : rotation === "Rot90"
              ? 90
              : rotation === "Rot180"
                ? 180
                : 270,
        flip,
      };

      drawTexture(
        page as unknown as CanvasWithContext,
        texture,
        sourceRegion,
        destinationRegion,
        options
      );

      expect(page.getPixels()).toEqual(
        expectedPixels(sourcePixels, rotation, flip)
      );
    });
  });

  it("changes the output when a horizontal flip is applied after a 90 degree rotation", () => {
    const rotatedOnly = makeFakeContext(2, 2);
    const rotatedAndFlipped = makeFakeContext(2, 2);

    drawTexture(
      rotatedOnly as unknown as CanvasWithContext,
      texture,
      sourceRegion,
      destinationRegion,
      {
        rotate: 90,
        flip: "None",
      }
    );

    drawTexture(
      rotatedAndFlipped as unknown as CanvasWithContext,
      texture,
      sourceRegion,
      destinationRegion,
      {
        rotate: 90,
        flip: "Horizontal",
      }
    );

    expect(rotatedAndFlipped.getPixels()).toEqual(
      expectedPixels(sourcePixels, "Rot90", "Horizontal")
    );
    expect(rotatedAndFlipped.getPixels()).not.toEqual(rotatedOnly.getPixels());
  });
});
