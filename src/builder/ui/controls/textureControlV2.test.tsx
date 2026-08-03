import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TextureControlV2 } from "./textureControlV2";

describe("TextureControlV2", () => {
  it("renders the supplied preset as the controlled dropdown value", () => {
    const markup = renderToStaticMarkup(
      createElement(TextureControlV2, {
        id: "Skin",
        choices: ["Red"],
        standardWidth: 64,
        standardHeight: 64,
        value: { kind: "Preset", id: "Red" },
        onValueChange: vi.fn(),
        onChange: vi.fn(),
      })
    );

    expect(markup).toContain('<option value="Red" selected="">Red</option>');
  });

  it("renders None when a controlled fallback preset is not a visible choice", () => {
    const markup = renderToStaticMarkup(
      createElement(TextureControlV2, {
        id: "Skin",
        choices: ["Red"],
        standardWidth: 64,
        standardHeight: 64,
        value: { kind: "Preset", id: "Default Skin" },
        onValueChange: vi.fn(),
        onChange: vi.fn(),
      })
    );

    expect(markup).toContain('<option value="" selected="">None</option>');
  });
});
