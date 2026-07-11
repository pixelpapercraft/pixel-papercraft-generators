import { type Generator } from "@genroot/builder/modules/generator";
import { makePatternFaceId } from "./face";

export function cloneTemplatePatterns(
  generator: Generator,
  fromTemplateId: string,
  toTemplateId: string
): void {
  const sourcePatternJson =
    generator.getStringInputValue(makePatternFaceId(fromTemplateId)) ?? "";
  generator.setStringInputValue(
    makePatternFaceId(toTemplateId),
    sourcePatternJson
  );
}

export function clonePattern1To2(
  generator: Generator,
  numberOfTemplates: number
): void {
  if (numberOfTemplates < 2) {
    generator.setSelectInputValue("Number of Templates", "2");
    generator.setSelectInputValue("Template 2 Type", "Banner");
  }

  cloneTemplatePatterns(generator, "1", "2");
}

export function clonePattern2To1(
  generator: Generator,
  numberOfTemplates: number
): void {
  if (numberOfTemplates < 2) {
    return;
  }

  cloneTemplatePatterns(generator, "2", "1");
}
