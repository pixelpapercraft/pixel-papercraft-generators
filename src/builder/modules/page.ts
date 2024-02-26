import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";
import { A4 } from "./pageSize";

export type Page = {
  id: string;
  canvasWithContext: CanvasWithContext;
};

export function makePage(id: string): Page {
  const canvasWithContext = makeCanvasWithContext(A4.px.width, A4.px.height);
  return { id, canvasWithContext };
}
