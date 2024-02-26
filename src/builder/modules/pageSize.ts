export type Size = { width: number; height: number };

export type PageSizes = { px: Size; mm: Size };

export const A4: PageSizes = {
  px: { width: 595, height: 842 },
  mm: { width: 210, height: 297 },
};
