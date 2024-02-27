import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "../canvasWithContext";

export function fillBackgroundColor(page: CanvasWithContext, color: string) {
  const { width, height } = page.canvas;
  const temp = makeCanvasWithContext(width, height);
  temp.context.fillStyle = color;
  temp.context.fillRect(0, 0, width, height);
  temp.context.drawImage(page.canvas, 0, 0);
  page.context.drawImage(temp.canvas, 0, 0);
}
