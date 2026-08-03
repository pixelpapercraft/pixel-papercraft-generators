import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  type LoadedTextureControlV2Value,
  type TextureDef,
} from "@genroot/builder";
import { GlintControlV2 } from "./glintControlV2";

const definitions: TextureDef[] = [
  {
    id: "1.20+",
    url: "/enchanted-glint.png",
    standardWidth: 128,
    standardHeight: 128,
  },
];

const value: LoadedTextureControlV2Value = {
  kind: "Preset",
  id: "1.20+",
};

describe("GlintControlV2", () => {
  it("renders a controlled glint version and its shared adjustment controls", () => {
    const markup = renderToStaticMarkup(
      createElement(GlintControlV2, {
        definitions,
        value,
        onValueChange: vi.fn(),
        onTextureChange: vi.fn(),
        opacity: 255,
        onOpacityChange: vi.fn(),
        xOffset: 0,
        onXOffsetChange: vi.fn(),
        yOffset: 0,
        onYOffsetChange: vi.fn(),
      })
    );

    expect(markup).toContain(
      '<option value="1.20+" selected="">1.20+</option>'
    );
    expect(markup).toContain("Glint Opacity");
    expect(markup).toContain("Glint X Offset");
    expect(markup).toContain("Glint Y Offset");
  });
});
