import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { LoadedTextureControl } from "./loadedTextureControl";

const definitions: TextureDef[] = [
  { id: "Red", url: "/red.png", standardWidth: 64, standardHeight: 64 },
];

describe("LoadedTextureControl", () => {
  it("owns the unavailable loading state without caller plumbing", () => {
    const markup = renderToStaticMarkup(
      createElement(LoadedTextureControl, {
        id: "Skin",
        definitions,
        choices: ["Red"],
        standardWidth: 64,
        standardHeight: 64,
        onChange: vi.fn(),
      })
    );

    expect(markup.match(/disabled=""/g)?.length).toBe(2);
    expect(markup).toContain("Loading texture choices…");
  });
});
