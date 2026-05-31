import { describe, expect, it } from "vitest";
import {
  decodeSelectedTexture,
  encodeSelectedTexture,
  type SelectedTexture,
} from "./selectedTexture";

describe("selectedTexture", () => {
  it("round-trips the shared selected texture payload", () => {
    const selectedTexture: SelectedTexture = {
      textureDefId: "minecraft-26.1.2-items",
      frame: {
        id: "sword",
        label: "sword",
        rectangle: [0, 0, 16, 16],
        crop: [0, 0, 16, 16],
      },
      rotation: "Rot90" as const,
      flip: "Horizontal" as const,
      blend: "#ffffff",
      itemScale: 1.5,
      itemLayers: [],
      enchanted: true,
    };

    expect(decodeSelectedTexture(encodeSelectedTexture(selectedTexture))).toEqual(
      selectedTexture
    );
  });
});
