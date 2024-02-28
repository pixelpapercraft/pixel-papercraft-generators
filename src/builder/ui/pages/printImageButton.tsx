import React from "react";
import { A4 } from "@/builder/modules/modelPage";
import { Button } from "../button/button";
import { printElement } from "../utils/printHtmlElement";

export function PrintImageButton({ dataUrl }: { dataUrl: string }) {
  const onClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const imageEl = new Image();

    imageEl.onload = () => {
      const styles = `
        @media print {
          html, body, img {
            margin: 0;
            padding: 0;
            width: ${A4.mm.width}mm;
            height: ${A4.mm.height}mm;
          }
        }
      `;

      printElement(imageEl, { styles });
    };

    imageEl.src = dataUrl;
  };

  return (
    <Button state="Ready" size="Small" onClick={onClick}>
      <span className="sm:hidden">Print</span>
      <span className="hidden sm:inline">Print page</span>
    </Button>
  );
}
