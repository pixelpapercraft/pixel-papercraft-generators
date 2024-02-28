import { jsPDF } from "jspdf";
import { type Model } from "@/builder/modules/model";
import { type GeneratorDef } from "@/builder/modules/generatorDef";
import { A4 } from "@/builder/modules/page";
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
    <Button state="Ready" color="Blue" size="Small" onClick={onSavePDF}>
      Save as PDF
    </Button>
  );
}
