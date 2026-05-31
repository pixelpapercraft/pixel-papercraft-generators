import { describe, expect, it } from "vitest";
import { type TextureFrame } from "@genroot/builder/modules/textureData";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import { findVersion } from "../_common/textures/textureVersions";
import {
  getFrameLogicalCrop,
  getFrameSourceCrop,
  getItemDimensions,
  getItemLayout,
  getLayerHalfDestination,
} from "./itemLayout";

function makeSelectedTexture(
  overrides: Partial<SelectedTexture> = {}
): SelectedTexture {
  return {
    textureDefId: "test-atlas",
    frame: {
      id: "large-item",
      label: "Large Item",
      rectangle: [100, 200, 32, 32],
      crop: [8, 4, 16, 20],
    },
    rotation: "Rot0",
    flip: "None",
    blend: null,
    ...overrides,
  };
}

function getTextureFrame(versionId: string, frameId: string): TextureFrame {
  const frame = findVersion(versionId)?.frames.find(({ id }) => id === frameId);
  if (!frame) {
    throw new Error(`Missing texture frame ${versionId}:${frameId}`);
  }
  return frame;
}

function makeTextureLayer(
  versionId: string,
  frameId: string,
  overrides: Partial<SelectedTexture> = {}
): SelectedTexture {
  return makeSelectedTexture({
    textureDefId: versionId,
    frame: getTextureFrame(versionId, frameId),
    ...overrides,
  });
}

describe("item texture layout", () => {
  it("uses atlas coordinates for source crop and logical coordinates for layout", () => {
    const selectedTexture = makeSelectedTexture();

    expect(getFrameSourceCrop(selectedTexture.frame)).toEqual([
      108, 204, 16, 20,
    ]);
    expect(getFrameLogicalCrop(selectedTexture.frame)).toEqual([4, 2, 8, 10]);
  });

  it("sizes items from the cropped area instead of the full frame", () => {
    const selectedTexture = makeSelectedTexture();

    expect(getItemDimensions(selectedTexture, 4)).toEqual({
      leftHalfWidth: 32,
      rightHalfWidth: 32,
      width: 64,
      height: 40,
    });
  });

  it("places a cropped layer while still drawing from the cropped atlas source", () => {
    const selectedTexture = makeSelectedTexture();
    const layout = getItemLayout([selectedTexture]);

    expect(
      getLayerHalfDestination(
        layout.leftBounds,
        layout.minY,
        selectedTexture,
        10,
        20,
        4,
        "None"
      )
    ).toEqual({
      source: [108, 204, 16, 20],
      x: 10,
      y: 20,
      width: 32,
      height: 40,
    });
  });

  it("accounts for flipped crops when positioning the mirrored half", () => {
    const selectedTexture = makeSelectedTexture({
      frame: {
        id: "offset-item",
        label: "Offset Item",
        rectangle: [0, 0, 16, 16],
        crop: [2, 3, 8, 9],
      },
    });
    const layout = getItemLayout([selectedTexture]);

    expect(layout.leftBounds).toEqual([2, 3, 8, 9]);
    expect(layout.rightBounds).toEqual([6, 3, 8, 9]);
    expect(
      getLayerHalfDestination(
        layout.rightBounds,
        layout.minY,
        selectedTexture,
        50,
        60,
        2,
        "Horizontal"
      )
    ).toEqual({
      source: [2, 3, 8, 9],
      x: 50,
      y: 60,
      width: 16,
      height: 18,
    });
  });

  it("centers eccentric overlay crops against the widest item layout", () => {
    const layers = [
      makeTextureLayer("minecraft-26.1.2-items", "spyglass_model"),
      makeTextureLayer("minecraft-26.1.2-blocks", "bamboo_singleleaf"),
      makeTextureLayer("minecraft-26.1.2-items", "candle"),
      makeTextureLayer("minecraft-26.1.2-items", "iron_chain"),
      makeTextureLayer("minecraft-26.1.2-items", "bundle_open_back"),
    ];
    const layout = getItemLayout(layers);
    const [spyglassModel, bambooSingleleaf, candle, ironChain] = layers;

    expect(layout.leftBounds).toEqual([0, 0, 16, 16]);
    expect(layout.rightBounds).toEqual([0, 0, 16, 16]);
    expect(
      getLayerHalfDestination(
        layout.leftBounds,
        layout.minY,
        spyglassModel!,
        20,
        40,
        4,
        "None"
      )
    ).toEqual({
      source: [400, 336, 2, 15],
      x: 20,
      y: 40,
      width: 8,
      height: 60,
    });
    expect(
      getLayerHalfDestination(
        layout.leftBounds,
        layout.minY,
        bambooSingleleaf!,
        20,
        40,
        4,
        "None"
      )
    ).toEqual({
      source: [65, 17, 6, 4],
      x: 24,
      y: 44,
      width: 24,
      height: 16,
    });
    expect(
      getLayerHalfDestination(
        layout.leftBounds,
        layout.minY,
        candle!,
        20,
        40,
        4,
        "None"
      )
    ).toEqual({
      source: [389, 33, 7, 15],
      x: 40,
      y: 44,
      width: 28,
      height: 60,
    });
    expect(
      getLayerHalfDestination(
        layout.leftBounds,
        layout.minY,
        ironChain!,
        20,
        40,
        4,
        "None"
      )
    ).toEqual({
      source: [54, 193, 3, 14],
      x: 44,
      y: 44,
      width: 12,
      height: 56,
    });
    expect(
      getLayerHalfDestination(
        layout.rightBounds,
        layout.minY,
        ironChain!,
        84,
        40,
        4,
        "Horizontal"
      )
    ).toEqual({
      source: [54, 193, 3, 14],
      x: 112,
      y: 44,
      width: 12,
      height: 56,
    });
  });
});
