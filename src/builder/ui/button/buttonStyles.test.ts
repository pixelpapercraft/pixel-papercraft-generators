import { describe, expect, it } from "vitest";
import { makeButtonClassNames } from "./buttonStyles";

describe("makeButtonClassNames", () => {
  it("keeps the icon button compact", () => {
    expect(
      makeButtonClassNames({
        size: "Icon",
        color: "Blue",
      })
    ).toContain("px-4 py-2 ");
  });

  it("keeps the small button smaller than medium", () => {
    expect(
      makeButtonClassNames({
        size: "Small",
        color: "Blue",
      })
    ).toContain("px-4 py-2 ");
    expect(
      makeButtonClassNames({
        size: "Medium",
        color: "Blue",
      })
    ).toContain("px-6 py-3 ");
  });

  it("uses inline-flex for button alignment", () => {
    expect(
      makeButtonClassNames({
        size: "Medium",
        color: "Blue",
      })
    ).toContain("inline-flex ");
  });
});
