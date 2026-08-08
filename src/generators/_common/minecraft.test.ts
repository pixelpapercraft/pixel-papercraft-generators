import { describe, expect, it, vi } from "vitest";
import { makeFakeEngine } from "@genroot/builder/engine/engine.fake";
import { Model } from "@genroot/builder/engine/model";
import { Values } from "@genroot/builder/engine/modelValues";
import { RenderContextAdapter } from "@genroot/builder/renderContextAdapter";
import { type Rectangle } from "./cuboid";
import { makeCuboid } from "./cuboid";
import {
  Minecraft,
  resolveFaceVisualRectangle,
  rotateLocalFace,
  type Face,
  type RotationDegrees,
} from "./minecraft";

describe("Minecraft", () => {
  describe("drawCuboid", () => {
    it("draws all six faces via the generator's drawTexture", () => {
      const generator = makeFakeEngine();
      // drawTexture ultimately touches a canvas, unavailable under Vitest's
      // Node environment (Playwright covers real pixel output) — stub it out
      // so this test can assert purely on delegation.
      const drawTexture = vi
        .spyOn(generator, "drawTexture")
        .mockImplementation(() => {});
      const minecraft = new Minecraft(generator);

      minecraft.drawCuboid(
        "Skin",
        makeCuboid([64, 64, 64]),
        [0, 0],
        [64, 64, 64]
      );

      expect(drawTexture).toHaveBeenCalledTimes(6);
      drawTexture.mock.calls.forEach(([id]) => {
        expect(id).toBe("Skin");
      });
    });
  });

  describe("tab size", () => {
    it("falls back to the default tab size when unset", () => {
      const generator = makeFakeEngine();
      const minecraft = new Minecraft(generator);

      expect(minecraft.getTabSize()).toBe(24);
    });

    it("stores and retrieves a custom tab size via the generator's number variable", () => {
      const generator = makeFakeEngine();
      const setNumberVariable = vi.spyOn(generator, "setNumberVariable");
      const minecraft = new Minecraft(generator);

      minecraft.setTabSize(10);

      expect(setNumberVariable).toHaveBeenCalledWith("tabSize", 10);
      expect(minecraft.getTabSize()).toBe(10);
    });
  });

  describe("with a v2 RenderContext in place of a v1 Engine", () => {
    it("draws all six faces through a RenderContextAdapter", () => {
      const generator = makeFakeEngine();
      const drawTexture = vi
        .spyOn(generator, "drawTexture")
        .mockImplementation(() => {});
      const ctx = new RenderContextAdapter(
        generator,
        new Model(new Values()),
        undefined
      );
      const minecraft = new Minecraft(ctx);

      minecraft.drawCuboid(
        "Skin",
        makeCuboid([64, 64, 64]),
        [0, 0],
        [64, 64, 64]
      );

      expect(drawTexture).toHaveBeenCalledTimes(6);
    });
  });

  describe("drawFaceTab / drawFaceTabs", () => {
    it("draws a tab on the given side via the generator's drawTab", () => {
      const generator = makeFakeEngine();
      const drawTab = vi
        .spyOn(generator, "drawTab")
        .mockImplementation(() => {});
      const minecraft = new Minecraft(generator);

      minecraft.drawFaceTab([10, 20, 30, 40], "East");

      expect(drawTab).toHaveBeenCalledWith([40, 20, 24, 40], "East", {
        showFoldLine: true,
        tabAngle: undefined,
      });
    });

    it("draws a tab for every requested side", () => {
      const generator = makeFakeEngine();
      const drawTab = vi
        .spyOn(generator, "drawTab")
        .mockImplementation(() => {});
      const minecraft = new Minecraft(generator);

      minecraft.drawFaceTabs(
        [10, 20, 30, 40],
        ["North", "East", "South", "West"],
        false
      );

      expect(drawTab).toHaveBeenCalledTimes(4);
      expect(drawTab.mock.calls.map(([, side]) => side)).toEqual([
        "North",
        "East",
        "South",
        "West",
      ]);
    });
  });
});

describe("resolveFaceVisualRectangle", () => {
  const rectangle: Rectangle = [100, 50, 80, 20];

  function makeTestFace(rotate: RotationDegrees): Face {
    return {
      rectangle,
      flip: "None",
      rotate,
      blend: { kind: "None" },
      plugin: null,
    };
  }

  it("returns the stored rectangle unchanged for rotate=0", () => {
    expect(resolveFaceVisualRectangle(makeTestFace(0))).toEqual<Rectangle>([
      100, 50, 80, 20,
    ]);
  });

  it("shifts by (-height, 0) and swaps width/height for rotate=90", () => {
    expect(resolveFaceVisualRectangle(makeTestFace(90))).toEqual<Rectangle>([
      80, 50, 20, 80,
    ]);
  });

  it("shifts by (-width, -height) for rotate=180", () => {
    expect(resolveFaceVisualRectangle(makeTestFace(180))).toEqual<Rectangle>([
      20, 30, 80, 20,
    ]);
  });

  it("shifts by (0, -width) and swaps width/height for rotate=270", () => {
    expect(resolveFaceVisualRectangle(makeTestFace(270))).toEqual<Rectangle>([
      100, -30, 20, 80,
    ]);
  });

  // `rotateLocalFace` pre-shifts a face's stored rectangle so that
  // `drawTexture`'s corner-pivot rotation lands the visual render back at
  // the face's real net position — so undoing that shift with
  // `resolveFaceVisualRectangle` must always reproduce the exact rectangle
  // `rotateLocalFace` started from, for every rotation. This is the
  // algebraic proof that the two functions are exact inverses of each
  // other, independent of the direct value assertions above.
  const rotations: RotationDegrees[] = [0, 90, 180, 270];
  it.each(rotations)(
    "round-trips through rotateLocalFace for rotate=%i",
    (rotate) => {
      const original = makeTestFace(rotate);

      const shifted = rotateLocalFace(original);

      expect(resolveFaceVisualRectangle(shifted)).toEqual<Rectangle>(rectangle);
    }
  );
});
