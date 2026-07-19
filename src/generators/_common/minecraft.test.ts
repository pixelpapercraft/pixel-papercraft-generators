import { describe, expect, it, vi } from "vitest";
import { makeFakeGenerator } from "@genroot/builder/modules/generator.fake";
import { Model } from "@genroot/builder/modules/model";
import { Values } from "@genroot/builder/modules/modelValues";
import { RenderContextAdapter } from "@genroot/builder/v2/renderContextAdapter";
import { makeCuboid } from "./cuboid";
import { Minecraft } from "./minecraft";

describe("Minecraft", () => {
  describe("drawCuboid", () => {
    it("draws all six faces via the generator's drawTexture", () => {
      const generator = makeFakeGenerator();
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
      const generator = makeFakeGenerator();
      const minecraft = new Minecraft(generator);

      expect(minecraft.getTabSize()).toBe(24);
    });

    it("stores and retrieves a custom tab size via the generator's number variable", () => {
      const generator = makeFakeGenerator();
      const setNumberVariable = vi.spyOn(generator, "setNumberVariable");
      const minecraft = new Minecraft(generator);

      minecraft.setTabSize(10);

      expect(setNumberVariable).toHaveBeenCalledWith("tabSize", 10);
      expect(minecraft.getTabSize()).toBe(10);
    });
  });

  describe("with a v2 RenderContext in place of a v1 Generator", () => {
    it("draws all six faces through a RenderContextAdapter", () => {
      const generator = makeFakeGenerator();
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
      const generator = makeFakeGenerator();
      const drawTab = vi
        .spyOn(generator, "drawTab")
        .mockImplementation(() => {});
      const minecraft = new Minecraft(generator);

      minecraft.drawFaceTab([10, 20, 30, 40], "East");

      expect(drawTab).toHaveBeenCalledWith(
        [40, 20, 24, 40],
        "East",
        true,
        undefined
      );
    });

    it("draws a tab for every requested side", () => {
      const generator = makeFakeGenerator();
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
