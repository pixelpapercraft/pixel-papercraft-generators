import { describe, expect, it } from "vitest";
import { parseAtlas } from "./customTextureVersion";

describe("parseAtlas", () => {
  it("parses valid atlas data", () => {
    expect(
      parseAtlas(
        JSON.stringify({
          atlasWidth: 32,
          atlasHeight: 16,
          frames: [
            {
              id: "first",
              label: "First",
              rectangle: [0, 0, 16, 16],
              crop: [2, 3, 12, 10],
            },
          ],
        })
      )
    ).toEqual({
      atlasWidth: 32,
      atlasHeight: 16,
      frames: [
        {
          id: "first",
          label: "First",
          rectangle: [0, 0, 16, 16],
          crop: [2, 3, 12, 10],
        },
      ],
    });
  });

  it("rejects invalid atlas data", () => {
    expect(parseAtlas("not json")).toBeNull();
    expect(parseAtlas(JSON.stringify({ atlasWidth: 32 }))).toBeNull();
  });
});
