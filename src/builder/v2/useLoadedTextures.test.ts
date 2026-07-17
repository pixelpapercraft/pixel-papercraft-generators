import { describe, expect, it, vi } from "vitest";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  createCachedTextureDefinitionLoader,
  loadTextureDefinitions,
  type ResourceLoader,
} from "./useLoadedTextures";

const alphaDef: TextureDef = {
  id: "alpha",
  url: "/alpha.png",
  standardWidth: 16,
  standardHeight: 8,
};
const betaDef: TextureDef = {
  id: "beta",
  url: "/beta.png",
  standardWidth: 32,
  standardHeight: 24,
};
const textureDefs: TextureDef[] = [alphaDef, betaDef];

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

    const loadDefinition = createCachedTextureDefinitionLoader(loadTexture);
    const textures = await loadTextureDefinitions(textureDefs, loadDefinition);

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
    const loadDefinition = createCachedTextureDefinitionLoader(loadTexture);

    await expect(
      loadTextureDefinitions(textureDefs, loadDefinition)
    ).rejects.toBe(failure);
  });

  it("shares an in-flight and resolved load for the same definition", async () => {
    const loadTexture: ResourceLoader<string> = vi.fn(async (url) => url);
    const loadDefinition = createCachedTextureDefinitionLoader(loadTexture);

    const first = loadDefinition(alphaDef);
    const second = loadDefinition(alphaDef);

    expect(first).toBe(second);
    await expect(first).resolves.toBe("/alpha.png");
    await expect(loadDefinition(alphaDef)).resolves.toBe("/alpha.png");
    expect(loadTexture).toHaveBeenCalledTimes(1);
  });

  it("deduplicates only definitions shared by overlapping controls", async () => {
    const loadTexture: ResourceLoader<string> = vi.fn(async (url) => url);
    const loadDefinition = createCachedTextureDefinitionLoader(loadTexture);

    const firstControl = loadTextureDefinitions(textureDefs, loadDefinition);
    const secondControl = loadTextureDefinitions([betaDef], loadDefinition);

    await Promise.all([firstControl, secondControl]);
    expect(loadTexture).toHaveBeenCalledTimes(2);
  });

  it("evicts a rejected load so a later control can retry", async () => {
    const failure = new Error("temporary failure");
    const loadTexture: ResourceLoader<string> = vi
      .fn()
      .mockRejectedValueOnce(failure)
      .mockResolvedValueOnce("loaded after retry");
    const loadDefinition = createCachedTextureDefinitionLoader(loadTexture);

    await expect(loadDefinition(alphaDef)).rejects.toBe(failure);
    await expect(loadDefinition(alphaDef)).resolves.toBe("loaded after retry");
    expect(loadTexture).toHaveBeenCalledTimes(2);
  });
});
