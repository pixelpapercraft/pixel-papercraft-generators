import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";

export type PageSize = {
  width: number;
  height: number;
};

export type PageSizes = {
  px: PageSize;
  mm: PageSize;
};

export const A4: PageSizes = {
  px: { width: 595, height: 842 },
  mm: { width: 210, height: 297 },
};

export type Page = {
  id: string;
  canvasWithContext: CanvasWithContext;
};

export function makePage(id: string, size: PageSize = A4.px): Page {
  const canvasWithContext = makeCanvasWithContext(size.width, size.height);
  return { id, canvasWithContext };
}

export function swapPageSize({ width, height }: PageSize): PageSize {
  return { width: height, height: width };
}

// A4.px (595x842) is already the standard 72dpi-rounded PDF point size for
// A4.mm (210x297mm), not a 96dpi CSS-pixel size — so mm conversion divides by
// 72, not 96.
export function pxToMm(px: number): number {
  return (px / 72) * 25.4;
}
