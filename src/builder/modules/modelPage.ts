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

export type PageSizeId = "A4";
export type PageOrientation = "portrait" | "landscape";

export const A4: PageSizes = {
  px: { width: 595, height: 842 },
  mm: { width: 210, height: 297 },
};

const pageSizeDefinitions: Record<PageSizeId, PageSizes> = {
  A4,
};

export type PageOptions = {
  size?: PageSizeId;
  orientation?: PageOrientation;
};

export type Page = {
  id: string;
  size: PageSizeId;
  orientation: PageOrientation;
  sizes: PageSizes;
  canvasWithContext: CanvasWithContext;
};

function orientPageSizes(
  sizes: PageSizes,
  orientation: PageOrientation
): PageSizes {
  if (orientation === "portrait") {
    return sizes;
  }

  return {
    px: {
      width: sizes.px.height,
      height: sizes.px.width,
    },
    mm: {
      width: sizes.mm.height,
      height: sizes.mm.width,
    },
  };
}

export function makePage(id: string, options: PageOptions = {}): Page {
  const size = options.size ?? "A4";
  const orientation = options.orientation ?? "portrait";
  const sizes = orientPageSizes(pageSizeDefinitions[size], orientation);
  const canvasWithContext = makeCanvasWithContext(
    sizes.px.width,
    sizes.px.height
  );

  return { id, size, orientation, sizes, canvasWithContext };
}
