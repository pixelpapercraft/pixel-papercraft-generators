import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import { LoadedTextureControlV2 } from "./loadedTextureControlV2";

const definitions: TextureDef[] = [
  { id: "Red", url: "/red.png", standardWidth: 64, standardHeight: 64 },
];

describe("LoadedTextureControlV2", () => {
  it("owns the unavailable loading state for a controlled value", () => {
    const markup = renderToStaticMarkup(
      createElement(LoadedTextureControlV2, {
        id: "Skin",
        definitions,
        choices: ["Red"],
        standardWidth: 64,
        standardHeight: 64,
        value: { kind: "Preset", id: "Red" },
        onValueChange: vi.fn(),
        onChange: vi.fn(),
      })
    );

    expect(markup.match(/disabled=""/g)?.length).toBe(2);
    expect(markup).toContain("Loading texture choices…");
  });
});
