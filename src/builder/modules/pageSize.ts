// type size = {width: int, height: int}

export type Size = { width: number; height: number };
export type PageSizes = { px: Size; mm: Size };

export const A4: PageSizes = {
  px: { width: 595, height: 842 },
  mm: { width: 210, height: 297 },
};

export const A3: PageSizes = {
  px: { width: 842, height: 1190 },
  mm: { width: 297, height: 420 },
};
