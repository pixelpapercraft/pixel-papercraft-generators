import { jsPDF } from "jspdf";
import { type Model } from "@genroot/builder/modules/model";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import { Button } from "../button/button";

export function SaveAsPDFButton({
  model,
  generatorDef,
}: {
  model: Model;
  generatorDef: GeneratorDef;
}) {
  const onSavePDF = () => {
    const [firstPage] = model.pages;
    if (!firstPage) {
      return;
    }

    const doc = new jsPDF({
      orientation: firstPage.orientation,
      unit: "mm",
      format: [firstPage.sizes.mm.width, firstPage.sizes.mm.height],
    });

    model.pages.forEach((page, index) => {
      const dataUrl = page.canvasWithContext.canvas.toDataURL("image/png");
      if (index > 0) {
        doc.addPage(
          [page.sizes.mm.width, page.sizes.mm.height],
          page.orientation
        );
      }
      doc.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        page.sizes.mm.width,
        page.sizes.mm.height
      );
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
