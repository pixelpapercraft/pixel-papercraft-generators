import { type Generator } from "@genroot/builder/modules/generator";

export function clearVariablesMatching(
  generator: Generator,
  idPattern: RegExp
): void {
  Array.from(generator.model.values.variables.keys()).forEach((id) => {
    if (idPattern.test(id)) {
      generator.model.values.variables.delete(id);
    }
  });
}
