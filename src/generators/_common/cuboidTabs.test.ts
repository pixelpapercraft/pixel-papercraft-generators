import { describe, expect, it, vi } from "vitest";
import { makeFakeEngine } from "@genroot/builder/engine/engine.fake";
import { Model } from "@genroot/builder/engine/model";
import { Values } from "@genroot/builder/engine/modelValues";
import { RenderContextAdapter } from "@genroot/builder/renderContextAdapter";
import { type RenderContext } from "@genroot/builder";
import { type Rectangle } from "./cuboid";
import { resolveCuboidFaces, resolveFaceVisualRectangle } from "./minecraft";
import {
  drawCuboidTabs,
  getEdgeTabThickness,
  uniformTabBaseDimensions,
} from "./cuboidTabs";

// Asserts a drawn tab region sits directly outside the given edge of a real
// face rectangle (from `resolveCuboidFaces` — ground truth for where that
// face actually renders), rather than hardcoding the region's own numbers:
// this is what "the tab actually attaches to its face" means geometrically,
// independent of the tab-thickness formula (covered separately below).
function expectTabTouchesFace(
  region: Rectangle,
  edge: "Top" | "Bottom" | "Left" | "Right",
  face: Rectangle
) {
  const [fx, fy, fw, fh] = face;
  const [rx, ry, rw, rh] = region;
  switch (edge) {
    case "Top":
      expect(rx).toBeCloseTo(fx);
      expect(rw).toBeCloseTo(fw);
      expect(ry + rh).toBeCloseTo(fy);
      break;
    case "Bottom":
      expect(rx).toBeCloseTo(fx);
      expect(rw).toBeCloseTo(fw);
      expect(ry).toBeCloseTo(fy + fh);
      break;
    case "Left":
      expect(ry).toBeCloseTo(fy);
      expect(rh).toBeCloseTo(fh);
      expect(rx + rw).toBeCloseTo(fx);
      break;
    case "Right":
      expect(ry).toBeCloseTo(fy);
      expect(rh).toBeCloseTo(fh);
      expect(rx).toBeCloseTo(fx + fw);
      break;
  }
}

// A real RenderContext (RenderContextAdapter over a fake Engine) rather than a
// cast partial object: drawTab ultimately touches a canvas, unavailable under
// Vitest's Node environment, so it's spied and stubbed per test.
function makeRenderContext(): {
  ctx: RenderContext;
  drawTab: ReturnType<typeof vi.spyOn>;
} {
  const engine = makeFakeEngine();
  const drawTab = vi.spyOn(engine, "drawTab").mockImplementation(() => {});
  const ctx = new RenderContextAdapter(
    engine,
    new Model(new Values()),
    undefined
  );
  return { ctx, drawTab };
}

describe("cuboidTabs", () => {
  it("uses the edge tab thickness rule", () => {
    expect(getEdgeTabThickness(168, 168)).toBe(32);
    expect(getEdgeTabThickness(128, 16)).toBe(8);
  });

  it("draws default tabs on the right, left, and back faces", () => {
    const { ctx, drawTab } = makeRenderContext();

    drawCuboidTabs(ctx, [10, 20], [30, 40, 50]);

    expect(drawTab).toHaveBeenCalledTimes(7);
    expect(drawTab).toHaveBeenNthCalledWith(1, [10, 57.5, 50, 12.5], "North", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(2, [10, 110, 50, 12.5], "South", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(3, [-2.5, 70, 12.5, 40], "West", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(6, [140, 57.5, 30, 12.5], "North", {
      showFoldLine: false,
      tabAngle: 45,
    });
  });

  it("keeps small cuboid tabs proportional to their face", () => {
    const { ctx, drawTab } = makeRenderContext();

    drawCuboidTabs(ctx, [10, 20], [4, 8, 4]);

    expect(drawTab).toHaveBeenNthCalledWith(1, [10, 23, 4, 1], "North", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(3, [9, 24, 1, 8], "West", {
      showFoldLine: false,
      tabAngle: 45,
    });
  });

  it("matches tab thickness when a larger base size is provided", () => {
    const { ctx, drawTab } = makeRenderContext();

    drawCuboidTabs(ctx, [10, 20], [30, 40, 50], {
      baseDimensions: [128, 128, 128],
    });

    expect(drawTab).toHaveBeenNthCalledWith(1, [10, 45, 50, 25], "North", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(3, [-15, 70, 25, 40], "West", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(6, [140, 45, 30, 25], "North", {
      showFoldLine: false,
      tabAngle: 45,
    });
  });

  it("uniformTabBaseDimensions makes back's Left/Right tab thickness match right/left's", () => {
    const dimensions: [number, number, number] = [30, 40, 50];

    const withoutUniformBase = makeRenderContext();
    drawCuboidTabs(withoutUniformBase.ctx, [10, 20], dimensions, {
      placements: [
        { face: "right", edge: "Left" },
        { face: "back", edge: "Right" },
      ],
    });
    // Confirms the mismatch actually exists before proving the fix: the
    // two regions' thickness (their non-height dimension) differ.
    const [rightRegionBefore] = withoutUniformBase.drawTab.mock.calls[0];
    const [backRegionBefore] = withoutUniformBase.drawTab.mock.calls[1];
    expect(rightRegionBefore[2]).not.toBeCloseTo(backRegionBefore[2]);

    const withUniformBase = makeRenderContext();
    drawCuboidTabs(withUniformBase.ctx, [10, 20], dimensions, {
      baseDimensions: uniformTabBaseDimensions(dimensions),
      placements: [
        { face: "right", edge: "Left" },
        { face: "back", edge: "Right" },
      ],
    });
    const [rightRegionAfter] = withUniformBase.drawTab.mock.calls[0];
    const [backRegionAfter] = withUniformBase.drawTab.mock.calls[1];
    expect(backRegionAfter[2]).toBeCloseTo(rightRegionAfter[2]);
  });

  it("supports custom placements and tab options", () => {
    const { ctx, drawTab } = makeRenderContext();

    drawCuboidTabs(ctx, [10, 20], [30, 40, 50], {
      placements: [{ face: "back", edge: "Right" }],
      showFoldLine: true,
      tabAngle: 60,
    });

    expect(drawTab).toHaveBeenCalledTimes(1);
    expect(drawTab).toHaveBeenCalledWith([170, 70, 7.5, 40], "East", {
      showFoldLine: true,
      tabAngle: 60,
    });
  });

  it("attaches right/left/back tabs to the real faces for a Right-centered cuboid", () => {
    const { ctx, drawTab } = makeRenderContext();
    const position: [number, number] = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const options = { center: "Right" as const };

    drawCuboidTabs(ctx, position, dimensions, options);

    const dest = resolveCuboidFaces(position, dimensions, options);
    expect(drawTab).toHaveBeenCalledTimes(7);
    expectTabTouchesFace(drawTab.mock.calls[0][0], "Top", dest.right.rectangle);
    expectTabTouchesFace(
      drawTab.mock.calls[1][0],
      "Bottom",
      dest.right.rectangle
    );
    expectTabTouchesFace(
      drawTab.mock.calls[2][0],
      "Left",
      dest.right.rectangle
    );
    expectTabTouchesFace(drawTab.mock.calls[3][0], "Top", dest.left.rectangle);
    expectTabTouchesFace(
      drawTab.mock.calls[4][0],
      "Bottom",
      dest.left.rectangle
    );
    expectTabTouchesFace(drawTab.mock.calls[5][0], "Top", dest.back.rectangle);
    expectTabTouchesFace(
      drawTab.mock.calls[6][0],
      "Bottom",
      dest.back.rectangle
    );
  });

  it("leaves the default West layout unchanged for Front/Back center (identity swap)", () => {
    const front = makeRenderContext();
    drawCuboidTabs(front.ctx, [10, 20], [30, 40, 50], { center: "Front" });

    const noCenter = makeRenderContext();
    drawCuboidTabs(noCenter.ctx, [10, 20], [30, 40, 50]);

    expect(front.drawTab.mock.calls).toEqual(noCenter.drawTab.mock.calls);
  });

  it("leaves the layout unchanged when orientation is omitted (defaults to West)", () => {
    const explicit = makeRenderContext();
    drawCuboidTabs(explicit.ctx, [10, 20], [30, 40, 50], {
      orientation: "West",
    });

    const implicit = makeRenderContext();
    drawCuboidTabs(implicit.ctx, [10, 20], [30, 40, 50]);

    expect(explicit.drawTab.mock.calls).toEqual(implicit.drawTab.mock.calls);
  });

  it("positions the back face below front for North orientation, not to the right", () => {
    const { ctx, drawTab } = makeRenderContext();
    const position: [number, number] = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const options = { orientation: "North" as const };

    drawCuboidTabs(ctx, position, dimensions, options);

    const dest = resolveCuboidFaces(position, dimensions, options);
    expect(drawTab).toHaveBeenCalledTimes(7);
    // right/left faces are unaffected by orientation.
    expectTabTouchesFace(drawTab.mock.calls[0][0], "Top", dest.right.rectangle);
    expectTabTouchesFace(
      drawTab.mock.calls[2][0],
      "Left",
      dest.right.rectangle
    );
    // back sits below front for North (matches minecraft.ts's makeDest and
    // rotateLocalFace's position shift), not to the right of left as the
    // old West-only version assumed. back also carries rotate=180 here, so
    // the tab must be checked against its true visual rectangle, not the
    // raw stored one (see resolveFaceVisualRectangle's own doc comment).
    const backVisual = resolveFaceVisualRectangle(dest.back);
    expectTabTouchesFace(drawTab.mock.calls[5][0], "Top", backVisual);
    expectTabTouchesFace(drawTab.mock.calls[6][0], "Bottom", backVisual);
    expect(drawTab.mock.calls[5][1]).toBe("North");
    expect(drawTab.mock.calls[6][1]).toBe("South");
  });

  it("positions the back face to the left of front for East orientation", () => {
    const { ctx, drawTab } = makeRenderContext();

    drawCuboidTabs(ctx, [10, 20], [30, 40, 50], { orientation: "East" });

    expect(drawTab).toHaveBeenCalledTimes(7);
    expect(drawTab).toHaveBeenNthCalledWith(6, [10, 57.5, 30, 12.5], "North", {
      showFoldLine: false,
      tabAngle: 45,
    });
    expect(drawTab).toHaveBeenNthCalledWith(7, [10, 110, 30, 12.5], "South", {
      showFoldLine: false,
      tabAngle: 45,
    });
  });

  it("attaches all 7 tabs to their real faces for North orientation with Bottom center (the banner crossbar's exact configuration)", () => {
    const { ctx, drawTab } = makeRenderContext();
    const position: [number, number] = [10, 20];
    const dimensions: [number, number, number] = [120, 12, 12];
    const options = {
      orientation: "North" as const,
      center: "Bottom" as const,
    };

    drawCuboidTabs(ctx, position, dimensions, options);

    // right/left/back all carry non-zero rotate under this real config
    // (270/90/180 respectively — see `adjustDestCenter`'s `"Bottom"` case),
    // so every face here must be checked against its true visual rectangle.
    const dest = resolveCuboidFaces(position, dimensions, options);
    const rightVisual = resolveFaceVisualRectangle(dest.right);
    const leftVisual = resolveFaceVisualRectangle(dest.left);
    const backVisual = resolveFaceVisualRectangle(dest.back);
    expect(drawTab).toHaveBeenCalledTimes(7);
    expectTabTouchesFace(drawTab.mock.calls[0][0], "Top", rightVisual);
    expectTabTouchesFace(drawTab.mock.calls[1][0], "Bottom", rightVisual);
    expectTabTouchesFace(drawTab.mock.calls[2][0], "Left", rightVisual);
    expectTabTouchesFace(drawTab.mock.calls[3][0], "Top", leftVisual);
    expectTabTouchesFace(drawTab.mock.calls[4][0], "Bottom", leftVisual);
    expectTabTouchesFace(drawTab.mock.calls[5][0], "Top", backVisual);
    expectTabTouchesFace(drawTab.mock.calls[6][0], "Bottom", backVisual);
  });

  it("positions the back face above front for South orientation", () => {
    const { ctx, drawTab } = makeRenderContext();
    const position: [number, number] = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const options = { orientation: "South" as const };

    drawCuboidTabs(ctx, position, dimensions, options);

    const dest = resolveCuboidFaces(position, dimensions, options);
    const backVisual = resolveFaceVisualRectangle(dest.back);
    expect(drawTab).toHaveBeenCalledTimes(7);
    expectTabTouchesFace(drawTab.mock.calls[5][0], "Top", backVisual);
    expectTabTouchesFace(drawTab.mock.calls[6][0], "Bottom", backVisual);
    expect(drawTab.mock.calls[5][1]).toBe("North");
    expect(drawTab.mock.calls[6][1]).toBe("South");
  });
});
