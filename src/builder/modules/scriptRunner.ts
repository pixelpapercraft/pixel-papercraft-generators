import { type ScriptDef } from "./generatorDef";
import { Model } from "./model";
import { Generator } from "./generator";

export function runScript(script: ScriptDef, model: Model): Promise<Model> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newModel = new Model(model.values);
      const generator = new Generator(newModel);
      script(generator);
      resolve(generator.model);
    }, 1);
  });
}
