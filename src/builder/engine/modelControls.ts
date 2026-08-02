/** [x, y, width, height] */
export type Region = [number, number, number, number];

export type RegionControl = {
  kind: "Region";
  pageId: string;
  region: Region;
  onClick: () => void;
  id?: string;
};
