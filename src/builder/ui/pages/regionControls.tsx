import type { CSSProperties } from "react";
import { type Model } from "@genroot/builder/modules/model";
import {
  type Control,
  type RegionControl,
} from "@genroot/builder/modules/modelControls";
import { type PageSize } from "@genroot/builder/modules/modelPage";
import { type ElementSize } from "./useElementSizeListener";
import { px, pageBorderWidth } from "./utils";

/** [x, y, w, h] */
type Region = [number, number, number, number];

function scaleNumber(value: number, scale: number): number {
  return Math.round(value * scale);
}

function scaleRegion(
  [x, y, w, h]: Region,
  actualSize: ElementSize,
  pageSize: PageSize
): Region {
  const scaleX = actualSize.width / pageSize.width;
  const scaleY = actualSize.height / pageSize.height;
  return [
    scaleNumber(x, scaleX),
    scaleNumber(y, scaleY),
    scaleNumber(w, scaleX),
    scaleNumber(h, scaleY),
  ];
}

export function RegionControls({
  model,
  currentPageId,
  pageElementSize,
  pageSize,
  onClick,
}: {
  model: Model;
  currentPageId: string;
  pageElementSize: ElementSize;
  pageSize: PageSize;
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
        const [x, y, w, h] = scaleRegion(
          regionControl.region,
          pageElementSize,
          pageSize
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
            onContextMenu={(event) => {
              if (!regionControl.onRightClick) {
                return;
              }

              event.preventDefault();
              onClick(regionControl.onRightClick);
            }}
          />
        );
      })}
    </div>
  );
}
