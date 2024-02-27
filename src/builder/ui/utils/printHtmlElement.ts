import {
  printElement as printElement_UNSAFE,
  printHtml as printHtml_UNSAFE,
} from "./printHtmlElementLib";

type Options = {
  printMode?: string;
  pageTitle?: string;
  templateString?: string;
  popupProperties?: string;
  stylesheets?: string | string[];
  styles?: string | string[];
};

type PrintElement = (element: Element, options?: Options) => void;
type PrintHtml = (html: string, options?: Options) => void;

export const printElement: PrintElement = printElement_UNSAFE;
export const printHtml: PrintHtml = printHtml_UNSAFE;
