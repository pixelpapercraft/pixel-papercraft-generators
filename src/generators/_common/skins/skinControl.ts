// The Minecraft skin picker and its input value, for V2 generators.
//
// These are Minecraft-specific, not framework: `@genroot/builder` carries
// only generic controls, so anything that knows what a Minecraft skin is
// belongs with the generators — the same reasoning that already puts
// `_common/tintSelector` and `_common/plugins/glint` here.
//
// Stable named entry point rather than having every generator import the
// sibling files directly, so generator authors have one place to import
// from regardless of how the implementation is split up internally.
export { MinecraftSkinControl } from "./minecraftSkinControl";
export {
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
  type MinecraftModelType,
  type MinecraftSkinSelection,
} from "./minecraftSkinInputValue";
