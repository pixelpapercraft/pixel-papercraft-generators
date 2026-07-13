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
import quadrants from "@genroot/generators/testApiDrawingTextures/fixtures/quadrants.png";

const id = "test-api-controls";

const name = "Test API: Controls";

const history: HistoryDef = [];

const instructions: InstructionsDef = `
Generator API coverage board for sidebar control definitions.

This first slice covers Boolean, Select, Range, Text, Button and Custom String
controls, including the defaults returned by the three \`defineAndGet*\` methods.
Later slices add region, texture/atlas, and Minecraft-skin controls.
`;

const images: ImageDef[] = [{ id: "QuadrantsFixture", url: quadrants.src }];

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

  generator.defineTextureInput("Uploaded Texture", {
    standardWidth: 4,
    standardHeight: 4,
    choices: [],
    label: "Uploaded Texture",
  });
  generator.defineAtlasInput("Uploaded Atlas", {
    standardWidth: 4,
    standardHeight: 4,
    choices: [],
    label: "Uploaded Atlas",
  });

  // The same four-quadrant bitmap used by Drawing makes both upload paths
  // observable without a separate test-only asset.
  generator.usePage("Uploads");
  if (generator.hasTexture("Uploaded Texture")) {
    generator.drawTexture("Uploaded Texture", [0, 0, 4, 4], [20, 20, 40, 40]);
  }
  if (generator.hasTexture("Uploaded Atlas")) {
    generator.drawTexture("Uploaded Atlas", [0, 0, 4, 4], [80, 20, 40, 40]);
  }

  // Region controls belong to their current page. The callback advances a
  // marker, making its registration and click path observable alongside the
  // overlay's independently tested geometry.
  generator.usePage("Region");
  const regionClicks = generator.getNumberVariable("Region Clicks") ?? 0;
  generator.fillRectangle([16, 16, 256, 256], "#dddddd");
  generator.defineRegionInput(
    [16, 16, 256, 256],
    () => generator.setNumberVariable("Region Clicks", regionClicks + 1),
    "ControlRegion"
  );
  generator.fillRectangle([32 + regionClicks * 20, 32, 10, 10], "#ff00ff");
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
