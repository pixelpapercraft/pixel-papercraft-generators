import { type Texture } from "@genroot/builder/engine/texture";

// Runtime textures an author produced from user interaction (a skin picker's
// upload/preset/fetch), keyed by the id the `render` function draws them with.
//
// Authors pass this shape straight to `<GeneratorRenderer dynamicTextures={…}>`.
// Values may be absent (`null`/`undefined`) — the renderer skips those — so a
// generator writes `{ Skin: skin, Eyes: eyes }` with no per-entry null checks,
// no `new Map<string, Texture>()` typing, and no `useMemo`. A Map is accepted
// too, so state that is already a `Map<string, Texture | null>` (e.g. Armor's
// per-control textures) can be handed over as-is.
export type DynamicTextures = DynamicTextureMap<Texture>;

// The value-generic form. Kept generic so the pure filtering logic below can be
// unit-tested with plain stand-in values, no `Texture`/canvas construction.
export type DynamicTextureMap<T> =
  | Map<string, T | null | undefined>
  | Record<string, T | null | undefined>;

// Flatten either input shape to the present entries, in insertion order,
// dropping absent (`null`/`undefined`) values. Order is preserved so a caller
// that relies on later entries overriding earlier ones keeps that behaviour.
export function normalizeDynamicTextures<T>(
  input: DynamicTextureMap<T> | undefined
): Array<[string, T]> {
  if (!input) {
    return [];
  }

  const entries =
    input instanceof Map ? Array.from(input) : Object.entries(input);

  const present: Array<[string, T]> = [];
  for (const [id, value] of entries) {
    if (value != null) {
      present.push([id, value]);
    }
  }
  return present;
}
