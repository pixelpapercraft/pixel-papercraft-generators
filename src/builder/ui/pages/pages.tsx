/* eslint-disable @next/next/no-img-element */

import React from "react";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import { type Model } from "@genroot/builder/modules/model";

import { RegionControls } from "./regionControls";
import { SaveAsPDFButton } from "./saveAsPDFButton";
import { SaveAsImageButton } from "./saveAsImageButton";
import { PrintImageButton } from "./printImageButton";
import { useElementSizeListener } from "./useElementSizeListener";
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
  const pageElementSize = useElementSizeListener(containerElRef);

  const showPageIds = model.pages.length > 1;

  return (
    <div>
      {model.pages.map((page, pageIndex) => {
        const dataUrl = page.canvasWithContext.canvas.toDataURL("image/png");

        const fileName =
          model.pages.length > 1
            ? `${generatorDef.name} - ${page.id}`
            : generatorDef.name;
        const isFirstPage = pageIndex === 0;

        return (
          <div key={page.id}>
            {showPageIds && !isFirstPage ? (
              <h1 className="font-bold text-2xl mb-4">{page.id}</h1>
            ) : null}

            <div
              className="relative mb-6 flex flex-wrap items-center justify-between gap-2"
              style={{ maxWidth: px(page.sizes.px.width) }}
            >
              {showPageIds && isFirstPage ? (
                <h1 className="absolute -top-10 left-0 font-bold text-2xl">
                  {page.id}
                </h1>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <PrintImageButton dataUrl={dataUrl} page={page} />
                {pageIndex === 0 ? (
                  <SaveAsPDFButton generatorDef={generatorDef} model={model} />
                ) : null}
              </div>
              <div>
                <SaveAsImageButton dataUrl={dataUrl} download={fileName} />
              </div>
            </div>

            <div
              className="relative"
              style={{
                maxWidth: px(page.sizes.px.width + pageBorderWidth * 2),
              }}
            >
              <img
                ref={containerElRef}
                className="mb-8 border shadow-xl"
                style={{
                  imageRendering: "pixelated",
                  width: px(page.sizes.px.width),
                  height: "auto",
                }}
                data-testid="generator-page-image"
                src={dataUrl}
                alt=""
              />
              {pageElementSize !== null ? (
                <RegionControls
                  pageElementSize={pageElementSize}
                  pageSize={page.sizes.px}
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
