import type { CSSProperties } from "react";
import { type Model } from "@genroot/builder/engine/model";
import { type Region } from "@genroot/builder/engine/renderers/types";
import { px, pageBorderWidth } from "./utils";

function scaleNumber(value: number, scale: number): number {
  return Math.round(value * scale);
}

function scaleRegion(
  [x, y, w, h]: Region,
  actualWidth: number,
  nativeWidth: number
): Region {
  const scale = actualWidth / nativeWidth;
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
  nativeWidth,
  onClick,
}: {
  model: Model;
  currentPageId: string;
  containerWidth: number;
  nativeWidth: number;
  onClick: (callback: () => void) => void;
}) {
  const regionControls = model.regionControls.filter(
    (control) => control.pageId === currentPageId
  );

  if (regionControls.length === 0) {
    return null;
  }

  return (
    <div>
      {regionControls.map((regionControl, i) => {
        const [x, y, w, h] = scaleRegion(
          regionControl.region,
          containerWidth,
          nativeWidth
        );
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
            data-testid={
              regionControl.id ? `region-${regionControl.id}` : undefined
            }
            onClick={() => onClick(regionControl.onClick)}
          />
        );
      })}
    </div>
  );
}
