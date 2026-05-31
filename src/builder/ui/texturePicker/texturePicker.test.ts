import { describe, expect, it } from "vitest";
import { shouldClearSelectedFrame } from "./selectionState";

describe("shouldClearSelectedFrame", () => {
  it("only clears when the selected frame is missing from the current frame list", () => {
    const selectedFrame = {
      id: "frame-a",
      label: "Frame A",
      rectangle: [0, 0, 16, 16] as [number, number, number, number],
      crop: [0, 0, 16, 16] as [number, number, number, number],
    };

    expect(shouldClearSelectedFrame(null, [])).toBe(false);
    expect(shouldClearSelectedFrame(selectedFrame, [selectedFrame])).toBe(
      false
    );
    expect(
      shouldClearSelectedFrame(selectedFrame, [
        {
          ...selectedFrame,
          id: "frame-b",
        },
      ])
    ).toBe(true);
  });
});
