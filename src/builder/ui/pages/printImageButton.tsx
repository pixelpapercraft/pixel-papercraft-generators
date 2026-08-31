import React from "react";
import { type PageSize, pxToMm } from "@genroot/builder/engine/modelPage";
import { Button } from "../button/button";
import { printElement } from "../utils/printHtmlElement";

export function getPrintPageSizeMm(size: PageSize): PageSize {
  return { width: pxToMm(size.width), height: pxToMm(size.height) };
}

// `@page { size }` tells the print engine the physical paper
// size/orientation to use — without it, a landscape-shaped page still prints
// onto a default portrait sheet, overflows the printable width, and the
// browser tiles the overflow onto a second page.
export function getPrintStyles(size: PageSize): string {
  const { width, height } = getPrintPageSizeMm(size);
  return `
    @page {
      size: ${width}mm ${height}mm;
    }
    @media print {
      html, body, img {
        margin: 0;
        padding: 0;
        width: ${width}mm;
        height: ${height}mm;
      }
    }
  `;
}

export function PrintImageButton({
  dataUrl,
  size,
}: {
  dataUrl: string;
  size: PageSize;
}) {
  const onClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const imageEl = new Image();

    imageEl.onload = () => {
      printElement(imageEl, { styles: getPrintStyles(size) });
    };

    imageEl.src = dataUrl;
  };

  return (
    <Button title="Print page" state="Ready" size="Medium" onClick={onClick}>
      <span className="sm:hidden">Print</span>
      <span className="hidden sm:inline">Print page</span>
    </Button>
  );
}
