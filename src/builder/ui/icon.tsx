import {
  ArrowDownIcon as HeroArrowDownIcon,
  ArrowPathIcon as HeroArrowPathIcon,
  XMarkIcon as HeroXMarkIcon,
} from "@heroicons/react/24/outline";

export type IconSize = "Small" | "Medium";

export type IconColor = "Black" | "White" | "Gray500";

export function makeSizeClass(size: IconSize) {
  switch (size) {
    case "Small":
      return "w-3 h-3";
    case "Medium":
      return "w-5 h-5";
  }
}

export function makeColorClass(color: IconColor) {
  switch (color) {
    case "Black":
      return "text-black";
    case "White":
      return "text-white";
    case "Gray500":
      return "text-gray-500";
  }
}

export function makeClassName(size: IconSize, color: IconColor) {
  return `inline-block ${makeSizeClass(size)} ${makeColorClass(color)}`;
}

export function ArrowDownIcon({
  size = "Medium",
  color = "Black",
}: {
  size?: IconSize;
  color?: IconColor;
}) {
  return <HeroArrowDownIcon className={makeClassName(size, color)} />;
}

export function ArrowPathIcon({
  size = "Medium",
  color = "Black",
}: {
  size?: IconSize;
  color?: IconColor;
}) {
  return <HeroArrowPathIcon className={makeClassName(size, color)} />;
}

export function XMarkIcon({
  size = "Medium",
  color = "Black",
}: {
  size?: IconSize;
  color?: IconColor;
}) {
  return <HeroXMarkIcon className={makeClassName(size, color)} />;
}
