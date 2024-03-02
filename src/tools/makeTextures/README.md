# Minecraft Item Texture Maker

## Creating the texture files

Minecraft asset files can be obtained from https://mcasset.cloud/

Download the version you need and note the directory containing the assets you would like to make textures for.

For example, the Minecraft block textures are in the folder `assets\minecraft\textures\block` and item textures are in `assets\minecraft\textures\item`.

Next run the command:

```sh
npm run makeTextures <TextureId> <SourceDirectory>
```

For example:

```sh
npm run makeTextures minecraft-1.7.10-items ~/Downloads/InventivetalentDev-minecraft-assets-4a457a3/assets/minecraft/textures/items
```

This will generate new files in the `src/textures/items` directory.
