import { describe, expect, it, vi } from "vitest";

import { Model } from "./model";
import { Values } from "./modelValues";
import {
  encodeProjectSave,
  exportProjectSave,
  importProjectSave,
} from "./projectSave";
import { type Texture } from "./texture";

function makeTexture(id: string): Texture {
  return {
    standardWidth: 16,
    standardHeight: 16,
    imageWithCanvas: {
      image: { src: id } as HTMLImageElement,
      width: 16,
      height: 16,
      canvasWithContext: {
        canvas: {
          toDataURL: vi.fn(() => `data:image/png;base64,${id}`),
        } as unknown as HTMLCanvasElement,
      },
    } as Texture["imageWithCanvas"],
  };
}

describe("project save import/export", () => {
  it("round trips variables and built-in texture references", async () => {
    const builtInTexture = makeTexture("stone");
    const source = new Model(new Values());
    source.addTexture("stone", builtInTexture);
    source.addTexture("Block", builtInTexture);
    source.addTextureControl("Block", {
      choices: ["stone"],
      standardWidth: 16,
      standardHeight: 16,
    });
    source.setStringVariable("State", "saved");

    const target = new Model(new Values());
    target.addTexture("stone", builtInTexture);
    target.addTextureControl("Block", {
      choices: ["stone"],
      standardWidth: 16,
      standardHeight: 16,
    });

    const result = await importProjectSave(
      target,
      encodeProjectSave(exportProjectSave(source, "testing"))
    );

    expect(result.ok).toBe(true);
    expect(target.getStringVariable("State")).toBe("saved");
    expect(target.findTexture("Block")).toBe(builtInTexture);
  });

  it("exports uploaded texture inputs as embedded textures", () => {
    const model = new Model(new Values());
    model.addTextureControl("Block", {
      choices: ["stone"],
      standardWidth: 16,
      standardHeight: 16,
    });
    model.addTexture("Block", makeTexture("uploaded"));

    const save = exportProjectSave(model, "testing");

    expect(save.textures?.Block).toEqual({
      kind: "embedded",
      url: "data:image/png;base64,uploaded",
      standardWidth: 16,
      standardHeight: 16,
    });
  });

  it("leaves the current state alone when imported JSON is invalid", async () => {
    const model = new Model(new Values());
    model.setStringVariable("State", "saved");

    const result = await importProjectSave(model, "not json");

    expect(result.ok).toBe(false);
    expect(model.getStringVariable("State")).toBe("saved");
  });
});
