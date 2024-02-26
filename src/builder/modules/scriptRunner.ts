import { type GeneratorDef, type Generator } from "./types";
import { type Model, makeModel } from "./model";
import { makeGenerator } from "./generator";

export function run(generatorDef: GeneratorDef, model: Model): Promise<Model> {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      const newModel = {
        ...makeModel(),
        values: model.values,
      };
      const generator = makeGenerator(newModel);
      generatorDef.script(generator);
      resolve(generator.getModel());
    }, 1);
  });
}
