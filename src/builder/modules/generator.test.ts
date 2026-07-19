import { describe, expect, it } from "vitest";
import { makeFakeGenerator } from "./generator.fake";
import {
  getMinecraftSkinInputValueKey,
  serializeMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "./minecraftSkinInputValue";
import { type MinecraftSkinInputControlProps } from "./modelControls";

describe("Generator input values", () => {
  it("returns Wide for an unknown Minecraft skin input", () => {
    const generator = makeFakeGenerator();

    expect(generator.getMinecraftSkinInputModelType("missing")).toBe("Wide");
  });

  it("uses the stored Minecraft skin model type and falls back for invalid values", () => {
    const generator = makeFakeGenerator();
    const props: MinecraftSkinInputControlProps = {
      standardWidth: 64,
      standardHeight: 64,
      options: [],
      showModelType: true,
    };
    const value: MinecraftSkinInputValue = {
      modelType: "Slim",
      selection: { kind: "none" },
    };

    generator.defineMinecraftSkinInput("Skin", props);
    generator.setStringInputValue(
      getMinecraftSkinInputValueKey("Skin"),
      serializeMinecraftSkinInputValue(value)
    );

    expect(generator.getMinecraftSkinInputModelType("Skin")).toBe("Slim");

    generator.setStringInputValue(
      getMinecraftSkinInputValueKey("Skin"),
      "invalid"
    );

    expect(generator.getMinecraftSkinInputModelType("Skin")).toBe("Wide");
  });

  it("sets, gets, and supplies a default for boolean inputs", () => {
    const generator = makeFakeGenerator();

    expect(generator.getBooleanInputValue("Enabled")).toBeNull();
    expect(generator.getBooleanInputValueWithDefault("Enabled", true)).toBe(
      true
    );

    generator.setBooleanInputValue("Enabled", false);

    expect(generator.getBooleanInputValue("Enabled")).toBe(false);
    expect(generator.getBooleanInputValueWithDefault("Enabled", true)).toBe(
      false
    );
  });

  it("sets, gets, and supplies a default for string inputs", () => {
    const generator = makeFakeGenerator();

    expect(generator.getStringInputValue("Name")).toBeNull();
    expect(generator.getStringInputValueWithDefault("Name", "Default")).toBe(
      "Default"
    );

    generator.setStringInputValue("Name", "Alex");

    expect(generator.getStringInputValue("Name")).toBe("Alex");
    expect(generator.getStringInputValueWithDefault("Name", "Default")).toBe(
      "Alex"
    );
  });

  it("gets and sets select values through string state", () => {
    const generator = makeFakeGenerator();

    expect(generator.getSelectInputValue("Material")).toBeNull();

    generator.setSelectInputValue("Material", "Gold");

    expect(generator.getSelectInputValue("Material")).toBe("Gold");
    expect(generator.getStringInputValue("Material")).toBe("Gold");
  });

  it("gets the zero fallback and sets number variables", () => {
    const generator = makeFakeGenerator();

    expect(generator.getRangeInputValue("Scale")).toBe(0);
    expect(generator.getNumberVariable("Scale")).toBeNull();

    generator.setNumberVariable("Scale", 1.5);

    expect(generator.getRangeInputValue("Scale")).toBe(1.5);
    expect(generator.getNumberVariable("Scale")).toBe(1.5);
  });

  it("clears boolean, string, and number variables together", () => {
    const generator = makeFakeGenerator();

    generator.setBooleanInputValue("Enabled", true);
    generator.setStringInputValue("Name", "Alex");
    generator.setNumberVariable("Scale", 1.5);
    generator.clearAllVariables();

    expect(generator.getBooleanInputValue("Enabled")).toBeNull();
    expect(generator.getStringInputValue("Name")).toBeNull();
    expect(generator.getNumberVariable("Scale")).toBeNull();
  });
});
