import { describe, expect, it, vi } from "vitest";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  loadTextureDefinitions,
  type ResourceLoader,
} from "./useLoadedTextures";

const textureDefs: TextureDef[] = [
  { id: "alpha", url: "/alpha.png", standardWidth: 16, standardHeight: 8 },
  { id: "beta", url: "/beta.png", standardWidth: 32, standardHeight: 24 },
];

describe("loadTextures", () => {
  it("loads every definition and keys the runtime textures by id", async () => {
    const alpha = "loaded alpha";
    const beta = "loaded beta";
    const loaded = [alpha, beta];
    const loadTexture: ResourceLoader<string> = vi.fn(async () => {
      const texture = loaded.shift();
      if (!texture) {
        throw new Error("Unexpected texture load");
      }
      return texture;
    });

    const textures = await loadTextureDefinitions(textureDefs, loadTexture);

    expect(Array.from(textures.keys())).toEqual<string[]>(["alpha", "beta"]);
    expect(Array.from(textures.values())).toEqual<string[]>([alpha, beta]);
    expect(loadTexture).toHaveBeenCalledTimes(2);
    expect(loadTexture).toHaveBeenNthCalledWith(1, "/alpha.png", 16, 8);
    expect(loadTexture).toHaveBeenNthCalledWith(2, "/beta.png", 32, 24);
  });

  it("rejects instead of treating a failed load as an empty ready map", async () => {
    const failure = new Error("texture failed");
    const loadTexture: ResourceLoader<string> = vi.fn(async () =>
      Promise.reject(failure)
    );

    await expect(
      loadTextureDefinitions(textureDefs, loadTexture)
    ).rejects.toBe(failure);
  });
});
