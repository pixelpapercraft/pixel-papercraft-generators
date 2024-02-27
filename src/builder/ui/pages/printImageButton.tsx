import React from "react";
import { A4 } from "@/builder/modules/page";
import { printElement } from "../utils/printHtmlElement";

export function PrintImageButton({ dataUrl }: { dataUrl: string }) {
  const onClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const imageEl = new Image();

    imageEl.onload = () => {
      // onLoad is called twice for some reason, so clear it here
      imageEl.onload = null;

      // We subtract 1mm from the width and height to prevent
      // Chrome trying to print onto two pages.
      const styles = `
        @media print {
          html, body, img {
            margin: 0;
            padding: 0;
            width: ${A4.mm.width - 1}mm;
            height: ${A4.mm.height - 1}mm;
          }
        }
      `;
      printElement(imageEl, { styles });
      window.print();
    };

    imageEl.src = dataUrl;
  };

  return (
    <a href="#" onClick={onClick}>
      {"Print"}
    </a>
  );
}
