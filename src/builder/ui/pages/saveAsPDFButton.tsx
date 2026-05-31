import { jsPDF } from "jspdf";
import { type Model } from "@genroot/builder/modules/model";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import { A4 } from "@genroot/builder/modules/modelPage";
import { Button } from "../button/button";

export function SaveAsPDFButton({
  model,
  generatorDef,
}: {
  model: Model;
  generatorDef: GeneratorDef;
}) {
  const onSavePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    model.pages.forEach((page, index) => {
      const dataUrl = page.canvasWithContext.canvas.toDataURL("image/png");
      if (index > 0) {
        doc.addPage("a4", "portrait");
      }
      doc.addImage(dataUrl, "PNG", 0, 0, A4.mm.width, A4.mm.height);
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
