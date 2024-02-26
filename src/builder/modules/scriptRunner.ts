import { type GeneratorDef, type Generator } from "./types";
import { type Model } from "./model";
import { makeGenerator } from "./generator";

export function run(generatorDef: GeneratorDef, model: Model): Promise<Model> {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      const generator = makeGenerator(model);
      generator.setModel(model);
      generatorDef.script(generator);
      resolve(generator.getModel());
    }, 1);
  });
}
