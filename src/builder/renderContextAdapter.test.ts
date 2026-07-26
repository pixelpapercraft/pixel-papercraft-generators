import { describe, expect, it, vi } from "vitest";
import { makeFakeEngine } from "@genroot/builder/engine/engine.fake";
import { type Color } from "@genroot/builder/engine/canvasWithContext";
import { Model } from "@genroot/builder/engine/model";
import { Values } from "@genroot/builder/engine/modelValues";
import { RenderContextAdapter } from "./renderContextAdapter";

describe("RenderContextAdapter", () => {
  it("delegates getNumberVariable/setNumberVariable to the wrapped generator", () => {
    const generator = makeFakeEngine();
    const model = new Model(new Values());
    const ctx = new RenderContextAdapter(generator, model, undefined);

    expect(ctx.getNumberVariable("tabSize")).toBeNull();

    ctx.setNumberVariable("tabSize", 10);

    expect(ctx.getNumberVariable("tabSize")).toBe(10);
    expect(generator.getNumberVariable("tabSize")).toBe(10);
  });

  // `getPagePixelColor` reads a named page's canvas, so the positive case needs
  // a real rendered canvas and lives in the Playwright coverage board. Here the
  // adapter's own job — forwarding both arguments and returning the result
  // unchanged — is pinned with a spy, plus the real null path for a page that
  // does not exist.
  it("forwards getPagePixelColor's page id and position to the wrapped generator", () => {
    const generator = makeFakeEngine();
    const model = new Model(new Values());
    const ctx = new RenderContextAdapter(generator, model, undefined);

    const color: Color = { r: 18, g: 52, b: 86, a: 255 };
    const spy = vi.spyOn(generator, "getPagePixelColor").mockReturnValue(color);

    expect(ctx.getPagePixelColor("Page Pixels", [20, 30])).toEqual<Color>(
      color
    );
    expect(spy).toHaveBeenCalledWith("Page Pixels", [20, 30]);
  });

  it("returns null from getPagePixelColor for a page that does not exist", () => {
    const generator = makeFakeEngine();
    const model = new Model(new Values());
    const ctx = new RenderContextAdapter(generator, model, undefined);

    expect(ctx.getPagePixelColor("missing", [0, 0])).toBeNull();
  });
});
