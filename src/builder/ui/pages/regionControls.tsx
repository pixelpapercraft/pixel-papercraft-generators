import type { CSSProperties } from "react";
import { type Model } from "@/builder/modules/model";
import {
  type Control,
  type RegionControl,
} from "@/builder/modules/modelControls";
import { A4 } from "@/builder/modules/modelPage";
import { px, pageBorderWidth } from "./utils";

/** [x, y, w, h] */
type Region = [number, number, number, number];

function scaleNumber(value: number, scale: number): number {
  return Math.round(value * scale);
}

function scaleRegion([x, y, w, h]: Region, actualWidth: number): Region {
  const scale = actualWidth / A4.px.width;
  return [
    scaleNumber(x, scale),
    scaleNumber(y, scale),
    scaleNumber(w, scale),
    scaleNumber(h, scale),
  ];
}

export function RegionControls({
  model,
  currentPageId,
  containerWidth,
  onClick,
}: {
  model: Model;
  currentPageId: string;
  containerWidth: number;
  onClick: (callback: () => void) => void;
}) {
  const regionControls = model.controls.reduce(
    (acc: RegionControl[], control: Control) => {
      if (control.kind === "Region" && control.pageId === currentPageId) {
        acc.push(control);
      }
      return acc;
    },
    []
  );

  if (regionControls.length === 0) {
    return null;
  }

  return (
    <div>
      {regionControls.map((regionControl, i) => {
        const [x, y, w, h] = scaleRegion(regionControl.region, containerWidth);
        const style: CSSProperties = {
          top: px(y + pageBorderWidth),
          left: px(x + pageBorderWidth),
          width: px(w),
          height: px(h),
        };
        return (
          <div
            key={i}
            className="absolute border-4 border-transparent hover:border-blue-500"
            style={style}
            onClick={() => onClick(regionControl.onClick)}
          />
        );
      })}
    </div>
  );
}
