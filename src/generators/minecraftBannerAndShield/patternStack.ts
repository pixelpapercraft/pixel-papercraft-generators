export type SelectedPattern = {
  patternId: string;
  blend: string | null;
};

// The stack's always-present first entry, present even before the user has
// placed anything. `pr-35-head`'s `face.ts` names this same pattern id/tint
// pair `defaultPatternId`/`defaultPatternTint`, shared by both its banner
// and shield targets. The hex is Minecraft's actual "White" dye color, not
// pure white.
export const defaultPatternId = "base";
export const defaultPatternTint = "#F9FFFE";

export function defaultPatternStack(): SelectedPattern[] {
  return [{ patternId: defaultPatternId, blend: defaultPatternTint }];
}

// Applies the pattern picker's currently-armed selection to a target's
// pattern stack: arming a pattern (`selectedPatternId` set) pushes a new
// layer; arming erase (`selectedPatternId` null) pops the last layer, but
// never below the seeded default entry so a target can't be cleared back to
// bare fabric/plate. Shared by both the banner flag and the shield plate —
// a genuinely bare shield (no banner attached at all) is a separate mode,
// toggled independently of this stack, matching the real game's rule that a
// banner is never attached without at least its own base color.
export function applyPatternSelection(
  current: SelectedPattern[],
  selectedPatternId: string | null,
  tint: string | null
): SelectedPattern[] {
  if (selectedPatternId === null) {
    return current.length > 1 ? current.slice(0, -1) : current;
  }
  return current.concat([{ patternId: selectedPatternId, blend: tint }]);
}
