import { describe, expect, it } from "vitest";
import { makeFakeGenerator } from "@genroot/builder/modules/generator.fake";
import { Model } from "@genroot/builder/modules/model";
import { Values } from "@genroot/builder/modules/modelValues";
import { RenderContextAdapter } from "./renderContextAdapter";

describe("RenderContextAdapter", () => {
  it("delegates getNumberVariable/setNumberVariable to the wrapped generator", () => {
    const generator = makeFakeGenerator();
    const model = new Model(new Values());
    const ctx = new RenderContextAdapter(generator, model, undefined);

    expect(ctx.getNumberVariable("tabSize")).toBeNull();

    ctx.setNumberVariable("tabSize", 10);

    expect(ctx.getNumberVariable("tabSize")).toBe(10);
    expect(generator.getNumberVariable("tabSize")).toBe(10);
  });
});
