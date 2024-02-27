// https://github.com/rpdasilva/print-html-element

declare module "print-html-element" {
  type Options = {
    printMode: string;
    pageTitle: string;
    templateString: string;
    popupProperties: string;
    stylesheets: string | string[];
    styles: string | string[];
  };

  export function printElement(element: Element, options?: Options): void;
  export function printHtml(html: string, options?: Options): void;
}
