import { type GeneratorDef } from "./generatorDef";
import { Model } from "./model";
import { Generator } from "./generator";

export function run(generatorDef: GeneratorDef, model: Model): Promise<Model> {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      const newModel = new Model(model.values);
      const generator = new Generator(newModel);
      generatorDef.script(generator);
      resolve(generator.model);
    }, 1);
  });
}
