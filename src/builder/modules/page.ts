import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";
import { A4, A3 } from "./pageSize";

export type Page = {
  id: string;
  isLandscape: boolean;
  canvasWithContext: CanvasWithContext;
};

export function makePage(id: string, isLandscape: boolean): Page {
  const canvasWithContext = makeCanvasWithContext(A4.px.width, A4.px.height);
  return { id, isLandscape, canvasWithContext };
}

// For landscape to be as smooth as possible, it may be best for the page
// only to be landscape on the canvas and not when printed, so that PDF
// and other exporting methods are easier, and also use with the diorama
// regions is smoother. In other words, this page shouldn't reference the
// landscape part.
