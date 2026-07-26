import { type SelectedTexture } from "@genroot/builder";

export type DioramaPreset = "Full Blocks" | "Quarter Blocks";

export type DioramaDocument = {
  faceTextures: Readonly<Record<string, SelectedTexture[]>>;
  tabs: Readonly<Record<string, number>>;
  folds: Readonly<Record<string, boolean>>;
};

export const emptyDioramaDocument = (): DioramaDocument => ({
  faceTextures: {},
  tabs: {},
  folds: {},
});

export const faceId = (column: number, row: number): string =>
  `face:${column}:${row}`;

export const edgeId = (
  direction: "North" | "South" | "East" | "West",
  column: number,
  row: number
): string => `edge:${direction}:${column}:${row}`;

export function updateFaceTextures(
  document: DioramaDocument,
  id: string,
  selectedTexture: SelectedTexture
): DioramaDocument {
  const currentTextures = document.faceTextures[id] ?? [];
  const nextTextures =
    selectedTexture.textureDefId === ""
      ? currentTextures.slice(0, -1)
      : [...currentTextures, selectedTexture];

  return {
    ...document,
    faceTextures: { ...document.faceTextures, [id]: nextTextures },
  };
}

export function cycleTab(
  document: DioramaDocument,
  id: string
): DioramaDocument {
  const currentValue = document.tabs[id] ?? 0;
  const nextValue = currentValue === 4 ? 0 : currentValue + 1;

  return {
    ...document,
    tabs: { ...document.tabs, [id]: nextValue },
  };
}

export function toggleFold(
  document: DioramaDocument,
  id: string
): DioramaDocument {
  return {
    ...document,
    folds: { ...document.folds, [id]: !(document.folds[id] ?? false) },
  };
}
