import { expect, test } from "vitest";
import {
  cycleTab,
  emptyDioramaDocument,
  toggleFold,
  updateFaceTextures,
} from "./dioramaDocument";

const eraseTexture = {
  textureDefId: "",
  frame: {
    id: "erase",
    label: "Erase",
    rectangle: [0, 0, 0, 0],
    crop: [0, 0, 0, 0],
  },
  rotation: "Rot0",
  flip: "None",
  blend: null,
} satisfies Parameters<typeof updateFaceTextures>[2];

const stoneTexture = {
  textureDefId: "stone",
  frame: {
    id: "stone",
    label: "Stone",
    rectangle: [0, 0, 16, 16],
    crop: [0, 0, 16, 16],
  },
  rotation: "Rot0",
  flip: "None",
  blend: null,
} satisfies Parameters<typeof updateFaceTextures>[2];

test("diorama document appends textures and erases only the latest layer", () => {
  const document = emptyDioramaDocument();
  const withStone = updateFaceTextures(document, "face:0:0", stoneTexture);
  const erased = updateFaceTextures(withStone, "face:0:0", eraseTexture);

  expect(withStone.faceTextures["face:0:0"]).toEqual<
    (typeof withStone.faceTextures)["face:0:0"]
  >([stoneTexture]);
  expect(erased.faceTextures["face:0:0"]).toEqual<
    (typeof erased.faceTextures)["face:0:0"]
  >([]);
});

test("diorama document cycles tabs and toggles folds independently", () => {
  const document = emptyDioramaDocument();
  const tabbed = cycleTab(document, "edge:North:0:0");
  const folded = toggleFold(tabbed, "edge:North:0:0");

  expect(tabbed.tabs["edge:North:0:0"]).toBe(1);
  expect(folded.folds["edge:North:0:0"]).toBe(true);
});
