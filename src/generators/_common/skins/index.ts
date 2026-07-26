import alexWide from "./wide/alex.png";
import ariWide from "./wide/ari.png";
import defaultWide from "./wide/default.png";
import efeWide from "./wide/efe.png";
import kaiWide from "./wide/kai.png";
import makenaWide from "./wide/makena.png";
import noorWide from "./wide/noor.png";
import steveWide from "./wide/steve.png";
import sunnyWide from "./wide/sunny.png";
import zuriWide from "./wide/zuri.png";

import alexSlim from "./slim/alex.png";
import ariSlim from "./slim/ari.png";
import defaultSlim from "./slim/default.png";
import efeSlim from "./slim/efe.png";
import kaiSlim from "./slim/kai.png";
import makenaSlim from "./slim/makena.png";
import noorSlim from "./slim/noor.png";
import steveSlim from "./slim/steve.png";
import sunnySlim from "./slim/sunny.png";
import zuriSlim from "./slim/zuri.png";
import type { MinecraftModelType } from "@genroot/builder/engine/minecraftSkinInputValue";

export const defaultSkinNames = [
  "Alex",
  "Ari",
  "Efe",
  "Kai",
  "Makena",
  "Noor",
  "Steve",
  "Sunny",
  "Zuri",
  "Default",
];

const SKIN_MAP: Record<string, { wide: string; slim: string }> = {
  Alex: { wide: alexWide.src, slim: alexSlim.src },
  Ari: { wide: ariWide.src, slim: ariSlim.src },
  Default: { wide: defaultWide.src, slim: defaultSlim.src },
  Efe: { wide: efeWide.src, slim: efeSlim.src },
  Kai: { wide: kaiWide.src, slim: kaiSlim.src },
  Makena: { wide: makenaWide.src, slim: makenaSlim.src },
  Noor: { wide: noorWide.src, slim: noorSlim.src },
  Steve: { wide: steveWide.src, slim: steveSlim.src },
  Sunny: { wide: sunnyWide.src, slim: sunnySlim.src },
  Zuri: { wide: zuriWide.src, slim: zuriSlim.src },
};

export function getSkinUrl(
  name: string,
  modelType: MinecraftModelType
): string {
  const entry = SKIN_MAP[name];
  if (!entry) {
    // fallback to default wide
    return defaultWide.src;
  }

  // Treat anything with 'Slim' as slim, otherwise wide
  const wantsSlim = modelType === "Slim";
  return wantsSlim ? entry.slim : entry.wide;
}
