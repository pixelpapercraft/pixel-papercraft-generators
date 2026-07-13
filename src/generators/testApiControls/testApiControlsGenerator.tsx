"use client";

import React from "react";

import type {
  GeneratorDef,
  HistoryDef,
  ImageDef,
  InstructionsDef,
  ScriptDef,
  TextureDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";

const id = "test-api-controls";

const name = "Test API: Controls";

const history: HistoryDef = [];

const instructions: InstructionsDef = `
Generator API coverage board for sidebar control definitions.

This first slice covers Boolean, Select, Range, Text, Button and Custom String
controls, including the defaults returned by the three \`defineAndGet*\` methods.
Later slices add region, texture/atlas, and Minecraft-skin controls.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

const script: ScriptDef = (generator: Generator) => {
  // The three define-and-get methods register their controls AND supply these
  // values to the script. The rectangles make those returned defaults visible
  // without making the board depend on a texture fixture.
  const enabled = generator.defineAndGetBooleanInput("Enabled", true);
  generator.fillRectangle([20, 20, 30, 30], enabled ? "#00aa00" : "#aa0000");

  const material = generator.defineAndGetSelectInput("Material", [
    "Amber",
    "Blue",
  ]);
  generator.fillRectangle(
    [60, 20, 30, 30],
    material === "Blue" ? "#0000ff" : "#ffbf00"
  );

  const scale = generator.defineAndGetRangeInput("Scale", {
    min: 1,
    max: 4,
    value: 2.5,
    step: 0.5,
  });
  generator.fillRectangle([100, 20, scale * 10, 30], "#800080");

  // Definition-only controls have their own stable DOM contracts.
  generator.defineBooleanInput("Visible", false);
  generator.defineSelectInput("Shape", ["Square", "Circle"]);
  generator.defineRangeInput("Opacity", {
    min: 0,
    max: 1,
    value: 0.5,
    step: 0.1,
    showValue: true,
  });
  generator.defineText("Control definition reference text.");

  // The callback mutates model state and Controls triggers a rerender after it
  // runs. Its purple marker therefore moves right exactly once per click.
  const buttonClicks = generator.getNumberVariable("Button Clicks") ?? 0;
  generator.defineButtonInput(
    "Advance marker",
    () => generator.setNumberVariable("Button Clicks", buttonClicks + 1),
    "Green"
  );
  generator.fillRectangle([20 + buttonClicks * 20, 70, 10, 10], "#800080");

  generator.defineCustomStringInput("Custom note", (onChange) => (
    <label>
      Custom note
      <input
        aria-label="Custom note"
        type="text"
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  ));
};

export const generator: GeneratorDef = {
  id,
  name,
  thumbnail: null,
  video: null,
  instructions,
  history,
  images,
  textures,
  script,
};
