import { jsPDF } from "jspdf";
import { type Model } from "@genroot/builder/engine/model";
import { type Page, pxToMm } from "@genroot/builder/engine/modelPage";
import { type GeneratorDef } from "@genroot/builder/engine/generatorDef";
import { type CanvasWithContext } from "@genroot/builder/engine/canvasWithContext";
import { Button } from "../button/button";

export type PdfPageSpec = {
  format: [number, number];
  orientation: "portrait" | "landscape";
};

// jsPDF (4.2.1, verified empirically) only swaps an explicit `format: [w, h]`
// array when `orientation` contradicts its own shape. `orientation` here is
// always derived from that same `width`/`height` comparison, so it never
// contradicts and the array is used as given.
export function getPdfPageSpec({
  width,
  height,
}: Pick<CanvasWithContext, "width" | "height">): PdfPageSpec {
  const mmWidth = pxToMm(width);
  const mmHeight = pxToMm(height);
  return {
    format: [mmWidth, mmHeight],
    orientation: mmWidth > mmHeight ? "landscape" : "portrait",
  };
}

export function SaveAsPDFButton({
  model,
  generatorDef,
}: {
  model: Model;
  generatorDef: GeneratorDef;
}) {
  const onSavePDF = () => {
    const [firstPage, ...restPages] = model.pages;
    if (!firstPage) {
      return;
    }

    const addPageImage = (page: Page, spec: PdfPageSpec, doc: jsPDF) => {
      const dataUrl = page.canvasWithContext.canvas.toDataURL("image/png");
      doc.addImage(dataUrl, "PNG", 0, 0, spec.format[0], spec.format[1]);
    };

    const firstSpec = getPdfPageSpec(firstPage.canvasWithContext);
    const doc = new jsPDF({
      orientation: firstSpec.orientation,
      unit: "mm",
      format: firstSpec.format,
    });
    addPageImage(firstPage, firstSpec, doc);

    restPages.forEach((page) => {
      const spec = getPdfPageSpec(page.canvasWithContext);
      doc.addPage(spec.format, spec.orientation);
      addPageImage(page, spec, doc);
    });

    doc.save(generatorDef.name);
  };

  return (
    <Button
      title="Save all pages as PDF"
      state="Ready"
      color="Blue"
      size="Medium"
      onClick={onSavePDF}
    >
      <span className="sm:hidden">PDF</span>
      <span className="hidden sm:inline">Save as PDF</span>
    </Button>
  );
}
