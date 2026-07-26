import { makeImage } from "./image";
import { makeCanvas } from "./canvas";

function hasValidSourceDimensions(width: number, height: number) {
  return width % 64 === 0 && width === height * 2;
}

function copy(
  sourceCanvas: HTMLCanvasElement,
  destCanvas: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  scale: number
) {
  const destContext = destCanvas.getContext("2d");

  if (!destContext) {
    return;
  }

  destContext.drawImage(
    sourceCanvas,
    sx * scale,
    sy * scale,
    sw * scale,
    sh * scale,
    dx * scale,
    dy * scale,
    dw * scale,
    dh * scale
  );
}

function convertCallback(
  source: HTMLImageElement,
  onSuccess: (image: HTMLImageElement) => void,
  onError: (error: unknown) => void
) {
  const sw = source.width;
  const sh = source.height;

  // If the image is already square then nothing to do
  if (sw === sh) {
    onSuccess(source);
    return;
  }

  // Ensure the source has a 2:1 ratio for width:height
  if (!hasValidSourceDimensions(sw, sh)) {
    onError(new Error("Invalid source dimensions"));
    return;
  }

  // The destination image will be a square with the same
  // dimensions as the source width
  const dw = sw;
  const dh = sw;

  // Create the canvas and context
  const sCanvas = makeCanvas(sw, sh);
  const sContext = sCanvas.getContext("2d", { alpha: true });
  const dCanvas = makeCanvas(dw, dh);
  const dContext = dCanvas.getContext("2d", { alpha: true });

  if (!sContext) {
    onError(new Error("Could not get source canvas context"));
    return;
  }

  if (!dContext) {
    onError(new Error("Could not get destination canvas context"));
    return;
  }

  // Draw the source image onto the top left corner of the source canvas
  sContext.drawImage(source, 0, 0);

  // Also draw the source image onto the top left corner of the destination canvas
  dContext.drawImage(source, 0, 0);

  // Determine the multiplication factor for when the source image
  // is a multiple of 64 pixels;
  const scale = sw / 64;

  // Save the current transformation state of the destination canvas
  dContext.save();

  // Flip the destination canvas horizontally
  // so when we draw the new parts they will be flipped
  dContext.translate(dw, 0);
  dContext.scale(-1, 1);

  // Copying: Leg
  copy(sCanvas, dCanvas, 0, 20, 4, 12, 36, 52, 4, 12, scale); // Right
  copy(sCanvas, dCanvas, 4, 20, 4, 12, 40, 52, 4, 12, scale); // Front
  copy(sCanvas, dCanvas, 8, 20, 4, 12, 44, 52, 4, 12, scale); // Left
  copy(sCanvas, dCanvas, 12, 20, 4, 12, 32, 52, 4, 12, scale); // Back
  copy(sCanvas, dCanvas, 4, 16, 4, 4, 40, 48, 4, 4, scale); // Top
  copy(sCanvas, dCanvas, 8, 16, 4, 4, 36, 48, 4, 4, scale); // Bottom

  // Copying: Arm
  copy(sCanvas, dCanvas, 40, 20, 4, 12, 20, 52, 4, 12, scale); // Right
  copy(sCanvas, dCanvas, 44, 20, 4, 12, 24, 52, 4, 12, scale); // Front
  copy(sCanvas, dCanvas, 48, 20, 4, 12, 28, 52, 4, 12, scale); // Left
  copy(sCanvas, dCanvas, 52, 20, 4, 12, 16, 52, 4, 12, scale); // Back
  copy(sCanvas, dCanvas, 44, 16, 4, 4, 24, 48, 4, 4, scale); // Top
  copy(sCanvas, dCanvas, 48, 16, 4, 4, 20, 48, 4, 4, scale); // Bottom

  // Return the destination back to it's original unflipped state
  dContext.restore();

  const dataUrl = dCanvas.toDataURL("image/png");
  const image = makeImage();
  image.onload = () => onSuccess(image);
  image.onerror = (error) => onError(error);
  image.src = dataUrl;
}

export function convertToStandardSkin(
  source: HTMLImageElement
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    convertCallback(source, resolve, reject);
  });
}
