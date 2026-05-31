import { describe, expect, it, vi } from "vitest";
import type { CanvasWithContext } from "@genroot/builder/modules/canvasWithContext";
import type { Generator } from "@genroot/builder/modules/generator";
import type { Texture } from "@genroot/builder/modules/texture";

type PixelKey = string | null;

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
  globalAlpha: number;
  globalCompositeOperation: GlobalCompositeOperation;
  drawImage: (
    sourceCanvas: FakeCanvas,
    sxOrDx: number,
    syOrDy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ) => void;
  save: () => void;
  restore: () => void;
  getPixels: () => PixelKey[][];
};

const makeCanvasWithContext = vi.hoisted(() => {
  const stack: FakeContext[] = [];

  return vi.fn((width: number, height: number) => {
    const canvas: FakeCanvas = {
      width,
      height,
      pixels: Array.from({ length: width * height }, () => null),
    };

    const context: FakeContext = {
      canvas,
      context: undefined as unknown as FakeContext,
      contextWithAlpha: undefined as unknown as FakeContext,
      width,
      height,
      globalAlpha: 1,
      globalCompositeOperation: "source-over",
      drawImage: (
        sourceCanvas: FakeCanvas,
        sxOrDx: number,
        syOrDy: number,
        sw?: number,
        sh?: number,
        dx?: number,
        dy?: number,
        dw?: number,
        dh?: number
      ) => {
        const sourcePixels = sourceCanvas.pixels;
        const sourceWidth = sourceCanvas.width;
        const sourceHeight = sourceCanvas.height;

        const writePixel = (x: number, y: number, key: PixelKey) => {
          if (x < 0 || y < 0 || x >= width || y >= height) {
            return;
          }

          canvas.pixels[y * width + x] = key;
        };

        const readPixel = (x: number, y: number): PixelKey => {
          if (x < 0 || y < 0 || x >= sourceWidth || y >= sourceHeight) {
            return null;
          }

          return sourcePixels[y * sourceWidth + x] ?? null;
        };

        if (
          sw === undefined ||
          sh === undefined ||
          dx === undefined ||
          dy === undefined ||
          dw === undefined ||
          dh === undefined
        ) {
          if (context.globalCompositeOperation === "destination-in") {
            const maskPixels = sourceCanvas.pixels;
            for (let y = 0; y < height; y += 1) {
              for (let x = 0; x < width; x += 1) {
                if (!maskPixels[y * sourceWidth + x]) {
                  canvas.pixels[y * width + x] = null;
                }
              }
            }
            return;
          }

          for (let y = 0; y < sourceHeight; y += 1) {
            for (let x = 0; x < sourceWidth; x += 1) {
              writePixel(x + sxOrDx, y + syOrDy, readPixel(x, y));
            }
          }
          return;
        }

        for (let y = 0; y < dh; y += 1) {
          for (let x = 0; x < dw; x += 1) {
            const sourceX = sxOrDx + Math.floor((x / Math.max(1, dw)) * sw);
            const sourceY = syOrDy + Math.floor((y / Math.max(1, dh)) * sh);
            writePixel(
              Math.round(dx + x),
              Math.round(dy + y),
              readPixel(sourceX, sourceY)
            );
          }
        }
      },
      save: () => {
        stack.push({
          ...context,
          context: context,
        });
      },
      restore: () => {
        const previous = stack.pop();
        if (!previous) {
          return;
        }

        context.globalAlpha = previous.globalAlpha;
        context.globalCompositeOperation = previous.globalCompositeOperation;
      },
      getPixels: () =>
        Array.from({ length: height }, (_, row) =>
          Array.from({ length: width }, (_, col) =>
            canvas.pixels[row * width + col] ?? null
          )
        ),
    };

    context.context = context;
    context.contextWithAlpha = context;
    return context;
  });
});

vi.mock("@genroot/builder/modules/canvasWithContext", () => ({
  makeCanvasWithContext,
}));

import {
  defineGlintControlInputs,
  getGlintControls,
  makeGlintPlugin,
} from "./glint";

function makePixelKey(r: number, g: number, b: number, a: number): PixelKey {
  return `${r},${g},${b},${a}`;
}

function makeSourceTexture(pixels: PixelKey[][]): Texture {
  const height = pixels.length;
  const width = pixels[0]?.length ?? 0;
  const context = makeCanvasWithContext(width, height) as unknown as FakeContext;

  pixels.forEach((row, y) => {
    row.forEach((key, x) => {
      context.canvas.pixels[y * width + x] = key;
    });
  });

  return {
    standardWidth: width,
    standardHeight: height,
      imageWithCanvas: {
        image: {} as HTMLImageElement,
        width,
        height,
        canvasWithContext: context as unknown as CanvasWithContext,
      },
    } as Texture;
}

describe("defineGlintControlInputs", () => {
  it("defines the shared glint input controls", () => {
    const defineTextureInput = vi.fn();
    const defineAndGetRangeInput = vi.fn();

    defineGlintControlInputs({
      defineTextureInput,
      defineAndGetRangeInput,
    } as unknown as Generator);

    expect(defineTextureInput).toHaveBeenCalledWith("Enchanted Glint", {
      standardWidth: 128,
      standardHeight: 128,
      choices: ["1.20+", "Pre-1.20"],
    });
    expect(defineAndGetRangeInput).toHaveBeenNthCalledWith(1, "Glint Opacity", {
      min: 0,
      max: 255,
      value: 255,
      step: 1,
    });
    expect(defineAndGetRangeInput).toHaveBeenNthCalledWith(2, "Glint X Offset", {
      min: 0,
      max: 128,
      value: 0,
      step: 1,
    });
    expect(defineAndGetRangeInput).toHaveBeenNthCalledWith(3, "Glint Y Offset", {
      min: 0,
      max: 128,
      value: 0,
      step: 1,
    });
  });
});

describe("getGlintControls", () => {
  it("only creates a plugin when the glint texture exists", () => {
    const getNumberVariable = vi.fn((id: string) => {
      switch (id) {
        case "Glint Opacity":
          return 128;
        case "Glint X Offset":
          return 1;
        case "Glint Y Offset":
          return 2;
        default:
          return null;
      }
    });
    const getTexture = vi.fn().mockReturnValue(
      makeSourceTexture([
        [makePixelKey(255, 0, 0, 255), makePixelKey(0, 255, 0, 255)],
        [makePixelKey(0, 0, 255, 255), makePixelKey(255, 255, 0, 255)],
      ])
    );

    const controls = getGlintControls({
      getNumberVariable,
      getTexture,
    } as unknown as Generator);

    expect(controls.getPlugin(true)).toEqual(expect.any(Function));
    expect(controls.getPlugin(false)).toBeUndefined();
  });
});

describe("makeGlintPlugin", () => {
  it("wraps the glint texture and masks the result to the base shape", () => {
    const texture = makeSourceTexture([
      [makePixelKey(255, 0, 0, 255), makePixelKey(0, 255, 0, 255)],
      [makePixelKey(0, 0, 255, 255), makePixelKey(255, 255, 0, 255)],
    ]);
    const base = makeCanvasWithContext(3, 3) as unknown as FakeContext;

    base.canvas.pixels = [
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
      makePixelKey(9, 9, 9, 255),
    ];

    const plugin = makeGlintPlugin(texture, {
      opacity: 0.5,
      xOffset: 1,
      yOffset: 1,
    });

    const output = plugin(
      {
        sx: 0,
        sy: 0,
        sw: 3,
        sh: 3,
        dx: 0,
        dy: 0,
        dw: 3,
        dh: 3,
      },
      base as unknown as CanvasWithContext
    ) as unknown as FakeCanvas;

    expect(output.pixels).toEqual([
      makePixelKey(255, 255, 0, 255),
      makePixelKey(0, 0, 255, 255),
      makePixelKey(255, 255, 0, 255),
      makePixelKey(0, 255, 0, 255),
      makePixelKey(255, 0, 0, 255),
      makePixelKey(0, 255, 0, 255),
      makePixelKey(255, 255, 0, 255),
      makePixelKey(0, 0, 255, 255),
      makePixelKey(255, 255, 0, 255),
    ]);
  });
});
