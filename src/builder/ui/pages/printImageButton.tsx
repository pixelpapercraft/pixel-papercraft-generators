import React from "react";
import { type Page } from "@genroot/builder/modules/modelPage";
import { Button } from "../button/button";
import { printElement } from "../utils/printHtmlElement";

export function PrintImageButton({
  dataUrl,
  page,
}: {
  dataUrl: string;
  page: Page;
}) {
  const onClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const imageEl = new Image();

    imageEl.onload = () => {
      const styles = `
        @media print {
          html, body, img {
            margin: 0;
            padding: 0;
            width: ${page.sizes.mm.width}mm;
            height: ${page.sizes.mm.height}mm;
          }
        }
      `;

      printElement(imageEl, { styles });
    };

    imageEl.src = dataUrl;
  };

  return (
    <Button
      title="Print page"
      state="Ready"
      color="Green"
      size="Medium"
      onClick={onClick}
    >
      <span className="sm:hidden">Print</span>
      <span className="hidden sm:inline">Print page</span>
    </Button>
  );
}
