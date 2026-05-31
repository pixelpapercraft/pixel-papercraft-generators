/* eslint-disable @next/next/no-img-element */

import React from "react";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import { type Model } from "@genroot/builder/modules/model";
import { A4 } from "@genroot/builder/modules/modelPage";

import { RegionControls } from "./regionControls";
import { SaveAsPDFButton } from "./saveAsPDFButton";
import { SaveAsImageButton } from "./saveAsImageButton";
import { PrintImageButton } from "./printImageButton";
import { useElementWidthListener } from "./useElementWidthListener";
import { px, pageBorderWidth } from "./utils";

export function Pages({
  generatorDef,
  model,
  onChange,
}: {
  generatorDef: GeneratorDef;
  model: Model;
  onChange: () => void;
}) {
  const containerElRef = React.useRef<HTMLImageElement | null>(null);
  const containerWidth = useElementWidthListener(containerElRef);

  const showPageIds = model.pages.length > 1;

  return (
    <div>
      {model.pages.map((page, pageIndex) => {
        const dataUrl = page.canvasWithContext.canvas.toDataURL("image/png");

        const fileName =
          model.pages.length > 1
            ? `${generatorDef.name} - ${page.id}`
            : generatorDef.name;

        return (
          <div key={page.id}>
            {showPageIds ? (
              <h1 className="font-bold text-2xl mb-4">{page.id}</h1>
            ) : null}

            <div
              className="mb-6 flex items-center justify-between gap-3"
              style={{ maxWidth: px(A4.px.width) }}
            >
              <div className="flex items-center gap-3">
                <PrintImageButton dataUrl={dataUrl} />
                {pageIndex === 0 ? (
                  <SaveAsPDFButton generatorDef={generatorDef} model={model} />
                ) : null}
              </div>
              <div>
                <SaveAsImageButton dataUrl={dataUrl} download={fileName} />
              </div>
            </div>

            {/* Important: The following div uses absolute positioning for the regions. */}
            <div
              className="relative"
              style={{ maxWidth: px(A4.px.width + pageBorderWidth * 2) }}
            >
              <img
                ref={containerElRef}
                className="border shadow-xl mb-8"
                style={{ imageRendering: "pixelated" }}
                data-testid="generator-page-image"
                src={dataUrl}
                alt=""
              />
              {containerWidth !== null ? (
                <RegionControls
                  containerWidth={containerWidth}
                  model={model}
                  currentPageId={page.id}
                  onClick={(callback) => {
                    callback();
                    onChange();
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
