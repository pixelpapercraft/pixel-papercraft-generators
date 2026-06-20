import { afterEach, describe, expect, it, vi } from "vitest";
import { Model } from "./model";
import { Values } from "./modelValues";

function stubDocument() {
  vi.stubGlobal("document", {
    createElement: () => ({
      width: 0,
      height: 0,
      getContext: () => ({}),
    }),
  });
}

describe("Model", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("replaces a page when its orientation changes", () => {
    stubDocument();

    const model = new Model(new Values());
    model.usePage("Page", { orientation: "portrait" });
    const portraitPage = model.getCurrentPage();

    model.usePage("Page", { orientation: "landscape" });
    const landscapePage = model.getCurrentPage();

    expect(model.pages).toHaveLength(1);
    expect(landscapePage).not.toBe(portraitPage);
    expect(landscapePage.orientation).toBe("landscape");
    expect(landscapePage.sizes.px).toEqual({ width: 842, height: 595 });
  });

  it("reuses a page when its size and orientation match", () => {
    stubDocument();

    const model = new Model(new Values());
    model.usePage("Page", { orientation: "landscape" });
    const firstPage = model.getCurrentPage();

    model.usePage("Page", { orientation: "landscape" });

    expect(model.pages).toHaveLength(1);
    expect(model.getCurrentPage()).toBe(firstPage);
  });
});
