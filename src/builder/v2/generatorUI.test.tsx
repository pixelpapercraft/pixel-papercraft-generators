import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GeneratorUI } from "./generatorUI";

// Every generator's Playwright spec finds its controls with `getByLabel(…)`, so
// the label-to-input association is these controls' real contract — not their
// styling. These tests pin that association, and the id-vs-label distinction
// `SelectControl` exists to support.

// `for="x"` must point at the `id="x"` of a form element in the same markup.
function labelTargetsAControl(markup: string, label: string): boolean {
  const forMatch = markup.match(/for="([^"]+)"/);
  if (!forMatch) {
    return false;
  }
  const target = forMatch[1];
  return (
    markup.includes(`>${label}<`) &&
    new RegExp(`<(input|select)[^>]*id="${target}"`).test(markup)
  );
}

describe("GeneratorUI.BooleanControl", () => {
  it("associates its label with the checkbox", () => {
    const markup = renderToStaticMarkup(
      createElement(GeneratorUI.BooleanControl, {
        label: "Show Folds",
        checked: false,
        onCheckedChange: vi.fn(),
      })
    );

    expect(labelTargetsAControl(markup, "Show Folds")).toBe(true);
    expect(markup).toContain('type="checkbox"');
  });

  it("reflects the checked prop", () => {
    const checked = renderToStaticMarkup(
      createElement(GeneratorUI.BooleanControl, {
        label: "Show Folds",
        checked: true,
        onCheckedChange: vi.fn(),
      })
    );

    expect(checked).toContain("checked=");
  });
});

describe("GeneratorUI.SelectControl", () => {
  it("renders an option whose id differs from its label", () => {
    // Item's "Version" select relies on this: a `custom` id behind a display
    // label. v1's SelectControl takes `string[]` and cannot express it, which
    // is why this control is not delegated to v1.
    const markup = renderToStaticMarkup(
      createElement(GeneratorUI.SelectControl, {
        label: "Version",
        options: [{ id: "custom", label: "Custom Textures" }],
        value: "custom",
        onValueChange: vi.fn(),
      })
    );

    expect(labelTargetsAControl(markup, "Version")).toBe(true);
    expect(markup).toContain('<option value="custom"');
    expect(markup).toContain(">Custom Textures</option>");
  });
});

describe("GeneratorUI.RangeControl", () => {
  it("associates its label with the range input and carries its bounds", () => {
    const markup = renderToStaticMarkup(
      createElement(GeneratorUI.RangeControl, {
        label: "Glint Opacity",
        min: 0,
        max: 255,
        step: 1,
        value: 76,
        onValueChange: vi.fn(),
      })
    );

    expect(labelTargetsAControl(markup, "Glint Opacity")).toBe(true);
    expect(markup).toContain('type="range"');
    expect(markup).toContain('min="0"');
    expect(markup).toContain('max="255"');
  });

  it("shows the current value only when asked", () => {
    const props = {
      label: "Custom Scale (%)",
      min: 0,
      max: 200,
      step: 1,
      value: 150,
      onValueChange: vi.fn(),
    };

    expect(
      renderToStaticMarkup(
        createElement(GeneratorUI.RangeControl, { ...props, showValue: true })
      )
    ).toContain(">150<");
    expect(
      renderToStaticMarkup(createElement(GeneratorUI.RangeControl, props))
    ).not.toContain(">150<");
  });
});

describe("GeneratorUI.ButtonControl", () => {
  it("exposes its label as the accessible name", () => {
    // Block and Item find these with `getByLabel("Add Item")`, which resolves
    // through the button's aria-label rather than a <label> element.
    const markup = renderToStaticMarkup(
      createElement(GeneratorUI.ButtonControl, {
        label: "Add Item",
        onClick: vi.fn(),
      })
    );

    expect(markup).toContain('aria-label="Add Item"');
    expect(markup).toContain(">Add Item<");
  });
});

describe("GeneratorUI.TextControl", () => {
  it("renders its children", () => {
    // JSX rather than createElement: children are this control's only prop, and
    // passing them through createElement's props argument trips
    // react/no-children-prop.
    const markup = renderToStaticMarkup(
      <GeneratorUI.TextControl>Pick a skin to begin.</GeneratorUI.TextControl>
    );

    expect(markup).toContain("<p>Pick a skin to begin.</p>");
  });
});

describe("GeneratorUI deprecated aliases", () => {
  it("are the same components as their new names", () => {
    // These keep the *Input spelling working until every V2 generator is
    // repointed; they must never drift into separate implementations.
    expect(GeneratorUI.BooleanInput).toBe(GeneratorUI.BooleanControl);
    expect(GeneratorUI.SelectInput).toBe(GeneratorUI.SelectControl);
    expect(GeneratorUI.RangeInput).toBe(GeneratorUI.RangeControl);
    expect(GeneratorUI.Text).toBe(GeneratorUI.TextControl);
  });
});
