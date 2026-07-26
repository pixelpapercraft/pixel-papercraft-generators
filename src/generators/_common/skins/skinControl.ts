// The Minecraft skin picker and its input value, for V2 generators.
//
// These are Minecraft-specific, not framework: `@genroot/builder` carries
// only generic controls, so anything that knows what a Minecraft skin is
// belongs with the generators — the same reasoning that already puts
// `_common/tintSelector` and `_common/plugins/glint` here.
//
// Re-exports rather than a move. `builder/engine/engine.ts` and
// `builder/engine/modelControls.ts` still import these same modules out of
// `src/builder`, and relocating the files while they do would invert the
// dependency: the builder framework would import from generator content. When
// `builder/ui` and `builder/engine` retire, the implementations move here and
// these re-exports become the definitions — at which point no generator has to
// change again.
export { MinecraftSkinControl } from "@genroot/builder/ui/controls/minecraftSkinControl";
export {
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
  type MinecraftModelType,
  type MinecraftSkinSelection,
} from "@genroot/builder/engine/minecraftSkinInputValue";
