import type { SelectedTexture, TabShape } from "@genroot/builder";

export type BlockPreset = "Full Blocks" | "Quarter Blocks";

export const blockPresets: BlockPreset[] = ["Full Blocks", "Quarter Blocks"];

export const defaultPreset: BlockPreset = "Full Blocks";

export function isBlockPreset(value: string): value is BlockPreset {
  return value === "Full Blocks" || value === "Quarter Blocks";
}

export type TabType = "None" | TabShape;

const tabCycle: TabType[] = ["None", "Full", "Left", "Middle", "Right"];

export function isTabShape(tabType: TabType | undefined): tabType is TabShape {
  return tabType !== undefined && tabType !== "None";
}

export type EdgeDirection = "North" | "South" | "East" | "West";

export type FaceId = string;

export type EdgeId = string;

export type DioramaDocument = {
  preset: BlockPreset;
  faceTextures: Record<FaceId, SelectedTexture[]>;
  tabs: Record<EdgeId, TabType>;
  folds: Record<EdgeId, true>;
};

export function makeEmptyDioramaDocument(
  preset: BlockPreset = defaultPreset
): DioramaDocument {
  const document: DioramaDocument = {
    preset,
    faceTextures: {},
    tabs: {},
    folds: {},
  };
  return document;
}

export function getFaceId(column: number, row: number): FaceId {
  return `BlockFace${column} ${row}`;
}

export function getEdgeId(
  direction: EdgeDirection,
  column: number,
  row: number
): EdgeId {
  return `${direction}${column} ${row}`;
}

export function setPreset(
  document: DioramaDocument,
  preset: BlockPreset
): DioramaDocument {
  return { ...document, preset };
}

export function addFaceTexture(
  document: DioramaDocument,
  faceId: FaceId,
  texture: SelectedTexture
): DioramaDocument {
  const stack = document.faceTextures[faceId] ?? [];
  return {
    ...document,
    faceTextures: {
      ...document.faceTextures,
      [faceId]: [...stack, texture],
    },
  };
}

export function eraseFaceTexture(
  document: DioramaDocument,
  faceId: FaceId
): DioramaDocument {
  const stack = document.faceTextures[faceId];
  if (!stack || stack.length === 0) {
    return document;
  }

  const nextStack = stack.slice(0, -1);
  const faceTextures = { ...document.faceTextures };
  if (nextStack.length === 0) {
    delete faceTextures[faceId];
  } else {
    faceTextures[faceId] = nextStack;
  }

  return { ...document, faceTextures };
}

export function cycleTab(
  document: DioramaDocument,
  edgeId: EdgeId
): DioramaDocument {
  const current = document.tabs[edgeId] ?? "None";
  const currentIndex = tabCycle.indexOf(current);
  const next = tabCycle[(currentIndex + 1) % tabCycle.length] ?? "None";
  const tabs = { ...document.tabs };
  if (next === "None") {
    delete tabs[edgeId];
  } else {
    tabs[edgeId] = next;
  }

  return { ...document, tabs };
}

export function toggleFold(
  document: DioramaDocument,
  edgeId: EdgeId
): DioramaDocument {
  const folds = { ...document.folds };
  if (folds[edgeId]) {
    delete folds[edgeId];
  } else {
    folds[edgeId] = true;
  }

  return { ...document, folds };
}
