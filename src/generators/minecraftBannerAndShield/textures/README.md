# Banner and Shield Texture Versions

Generated banner and shield atlas files for this generator should live here.

The intended generated files are paired by Minecraft version:

- `texture_minecraft_<version>_banner_patterns.png`
- `texture_minecraft_<version>_banner_patterns.ts`
- `texture_minecraft_<version>_shield_patterns.png`
- `texture_minecraft_<version>_shield_patterns.ts`

Each `.ts` file should export a `TextureData` object named `data`, matching the
shape used by the shared Minecraft block/item texture outputs.

After generating a pair, import both files in `textureVersions.ts` and add one
entry to `generatedBannerShieldDefinitions`.
