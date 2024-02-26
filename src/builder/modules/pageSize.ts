export type PageSize = { width: number; height: number };

export type PageSizes = { px: PageSize; mm: PageSize };

export const A4: PageSizes = {
  px: { width: 595, height: 842 },
  mm: { width: 210, height: 297 },
};
