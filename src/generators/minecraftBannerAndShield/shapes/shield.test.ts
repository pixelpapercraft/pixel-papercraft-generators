import { describe, expect, it, vi } from "vitest";
import {
  type Generator,
  type TexturePlugin,
} from "@genroot/builder/modules/generator";
import {
  type Coordinates,
  type DrawTextureOptions,
} from "@genroot/builder/modules/renderers/drawTexture";
import { type CanvasWithContext } from "@genroot/builder/modules/canvasWithContext";
import { shieldBasePatternId } from "../face";
import { drawShield } from "./shield";

const versionId = "minecraft-26-2-banner-shield";

function makeGenerator() {
  return {
    defineSelectInput: vi.fn(),
    defineRegionInput: vi.fn(),
    drawTexture: vi.fn(),
    drawImage: vi.fn(),
    getBooleanInputValueWithDefault: vi.fn(() => true),
    getSelectInputValue: vi.fn((id: string) => {
      if (id === "Version") {
        return versionId;
      }

      if (id === "Template 1 Shield Base") {
        return shieldBasePatternId;
      }

      return null;
    }),
    getStringInputValue: vi.fn(() => null),
    setBooleanInputValue: vi.fn(),
  } as unknown as Generator;
}

describe("drawShield", () => {
  it("anchors shield glint to page coordinates instead of atlas source coordinates", () => {
    const generator = makeGenerator();
    let glintCoordinates: Coordinates | null = null;
    const glintCanvas = {} as HTMLCanvasElement;
    const glintPlugin: TexturePlugin = (coordinates) => {
      glintCoordinates = coordinates;
      return glintCanvas;
    };

    drawShield(generator, "1", 0, 0, true, {
      getPlugin: () => glintPlugin,
    });

    const firstDrawCall = vi.mocked(generator.drawTexture).mock.calls[0];
    const options = firstDrawCall?.[3] as DrawTextureOptions | undefined;
    expect(options?.plugin).toBeDefined();

    options?.plugin?.(
      {
        sx: 999,
        sy: 888,
        sw: 777,
        sh: 666,
        dx: 240,
        dy: 480,
        dw: 960,
        dh: 1200,
      },
      { canvas: glintCanvas } as CanvasWithContext
    );

    expect(glintCoordinates).toEqual({
      sx: 10,
      sy: 20,
      sw: 40,
      sh: 50,
      dx: 240,
      dy: 480,
      dw: 960,
      dh: 1200,
    });
  });
});
