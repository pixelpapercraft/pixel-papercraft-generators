import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";

export type PageSize = { width: number; height: number };

export type PageSizes = { px: PageSize; mm: PageSize };

export const A4: PageSizes = {
  px: { width: 595, height: 842 },
  mm: { width: 210, height: 297 },
};

export type Page = {
  id: string;
  canvasWithContext: CanvasWithContext;
};

export function makePage(id: string): Page {
  const canvasWithContext = makeCanvasWithContext(A4.px.width, A4.px.height);
  return { id, canvasWithContext };
}
