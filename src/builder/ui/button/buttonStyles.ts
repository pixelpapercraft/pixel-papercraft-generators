export type ButtonSize = "Medium" | "Small";
export type ButtonColor = "Gray" | "Blue" | "Red" | "Green";

function makeButtonSizeClassNames(size: ButtonSize): string {
  return size === "Medium" ? "px-10 py-3 " : "px-8 py-2 ";
}

function makeButtonColorClassNames(color: ButtonColor): string {
  switch (color) {
    case "Gray":
      return (
        "bg-gray-400 text-white " +
        "hover:bg-gray-300 " +
        "focus-visible:outline-gray-400 " +
        "active:bg-gray-400 " +
        "aria-disabled:bg-gray-300 "
      );
    case "Blue":
      return (
        "bg-blue-500 text-white " +
        "hover:bg-blue-400 " +
        "focus-visible:outline-blue-500 " +
        "active:bg-blue-500 " +
        "aria-disabled:bg-blue-400 "
      );
    case "Red":
      return (
        "bg-red-600 text-white " +
        "hover:bg-red-500 " +
        "focus-visible:outline-red-600 " +
        "active:bg-red-600 " +
        "aria-disabled:bg-red-500 "
      );
    case "Green":
      return (
        "bg-green-600 text-white " +
        "hover:bg-green-500 " +
        "focus-visible:outline-green-600 " +
        "active:bg-green-600 " +
        "aria-disabled:bg-green-500 "
      );
  }
}

export function makeButtonClassNames({
  size,
  color,
}: {
  size: ButtonSize;
  color: ButtonColor;
}) {
  const sizeClassNames = makeButtonSizeClassNames(size);
  const colorClassNames = makeButtonColorClassNames(color);
  return (
    sizeClassNames +
    colorClassNames +
    "flex-inline relative items-center " +
    "rounded-lg " +
    "text-nowrap " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "aria-disabled:cursor-not-allowed "
  );
}
