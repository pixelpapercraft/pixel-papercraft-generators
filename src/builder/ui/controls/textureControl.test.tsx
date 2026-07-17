import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TextureControl } from "./textureControl";

describe("TextureControl", () => {
  it("disables preset and upload interaction while textures are loading", () => {
    const markup = renderToStaticMarkup(
      createElement(TextureControl, {
        id: "Skin",
        choices: ["Red"],
        standardWidth: 64,
        standardHeight: 64,
        textures: new Map(),
        onChange: vi.fn(),
        disabled: true,
        statusMessage: "Loading skin choices…",
      })
    );

    expect(markup.match(/disabled=""/g)?.length).toBe(2);
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Loading skin choices…");
  });
});
