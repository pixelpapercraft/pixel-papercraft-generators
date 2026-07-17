// The Minecraft skin picker and its input value, for V2 generators.
//
// These are Minecraft-specific, not framework: `@genroot/builder/v2` carries
// only generic controls, so anything that knows what a Minecraft skin is
// belongs with the generators — the same reasoning that already puts
// `_common/tintSelector` and `_common/plugins/glint` here.
//
// Re-exports rather than a move. V1's `controls.tsx`, `generator.ts` and
// `modelControls.ts` still import these same modules out of `src/builder`, and
// relocating the files while V1 lives would invert the dependency: the builder
// framework would import from generator content. When `builder/ui` and
// `builder/modules` retire, the implementations move here and these re-exports
// become the definitions — at which point no generator has to change again.
export { MinecraftSkinControl } from "@genroot/builder/ui/controls/minecraftSkinControl";
export {
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
  type MinecraftModelType,
  type MinecraftSkinSelection,
} from "@genroot/builder/modules/minecraftSkinInputValue";
