"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  InstructionsDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import {
  type Generator,
  type TexturePlugin,
} from "@genroot/builder/modules/generator";
import { A4 } from "@genroot/builder/modules/modelPage";
import {
  type Flip,
  makeNextFlip,
} from "@genroot/builder/ui/texturePicker/flip";
import { rotationToDegrees } from "@genroot/builder/ui/texturePicker/rotation";
import {
  type SelectedTexture,
  encodeSelectedTexture,
  decodeSelectedTexture,
  encodeSelectedTextures,
  decodeSelectedTextures,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
import {
  allTextureDefs,
  versionIdsItemsFirst,
  findVersion,
} from "../_common/textures/textureVersions";
import { TexturePicker } from "../_common/plugins/texturePicker/texturePicker";
import { itemTintChoiceGroups } from "../_common/tintSelector/tints";
import {
  defineGlintControls,
  itemGlintTextureDefs,
} from "../_common/plugins/glint";
import {
  parseAtlas,
  updateCustomTextureAtlas,
  updateCustomTextureUrl,
} from "../_common/textures/customTextureVersion";
import {
  type Rectangle,
  getItemDimensions,
  getItemLayers,
  getItemLayout,
  getLayerHalfDestination,
} from "./itemLayout";

import thumnbailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import titleImage from "./images/Title.png";
import centerFoldTexture from "./textures/CenterFold.png";

const id = "minecraft-item";

const name = "Minecraft Item";

const history: HistoryDef = [
  "26 Jan 2022 lostminer - First release.",
  "05 Feb 2022 NinjolasNJM - Added fold lines and gap removal feature.",
];

const thumbnail: ThumbnailDef = {
  url: thumnbailImage.src,
};

const instructions: InstructionsDef = `
## How to use the Minecraft Item Generator?

### Selecting and Adding Item Textures
* Click in the texture picker to select an item texture. 
* Item textures can be rotated, flipped, and tinted different colors.
* Click the "Add Item" button to add the selected texture as a new item on the page.
* Click the "Overlay Item button to add the selected texture on top of the last placed item. This can be used to create items that use multiple textures, such as potions or dyed leather armor.
* Click the "Remove Item" button to remove the last placed texture from the page.
* Textures from different versions can be selected from the "Versions" dropdown menu. Custom textures can also be added from files.

### Item Sizes

The generator supports four standard sizes:

* **Medium** - Good for general items (400% scale)
* **Large** - Good for weapons and tools (700% scale)
* **Extra Large** - Good for spears and oversized items (1400% scale)
* **Small** - Good for blocks as items (200% scale)

You can also choose a custom scale from 100% to 1600%.
Multiple items of different sizes can be added to the same page.

#### Enchant Items
  - Select either from the drop down menu or from "Choose file" to choose the enchanted glint texture.
  - Adjust the sliders to choose the opacity, x and y offsets of the enchanted glint texture.
  - Click on each item on the page to enable the enchanted glint effect per item.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title", url: titleImage.src },
];

const textures: TextureDef[] = [
  ...allTextureDefs,
  ...itemGlintTextureDefs,
  {
    id: "CenterFold",
    url: centerFoldTexture.src,
    standardWidth: 2,
    standardHeight: 512,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const drawItemHalf = (
    selectedTexture: SelectedTexture,
    rectangle: Rectangle,
    destX: number,
    y: number,
    width: number,
    height: number,
    appliedFlip: Flip = "None",
    plugin?: TexturePlugin
  ) => {
    const { textureDefId, rotation, flip, blend } = selectedTexture;
    const [nextFlip, nextRotation] = makeNextFlip(flip, appliedFlip, rotation);
    generator.drawTexture(textureDefId, rectangle, [destX, y, width, height], {
      flip: nextFlip,
      rotate: rotationToDegrees(nextRotation),
      blend: blend ? { kind: "MultiplyHex", hex: blend } : undefined,
      plugin,
    });
  };

  const pageMargin = 30;
  const itemMargin = 5;
  const innerPageWidth = A4.px.width - pageMargin * 2;
  const innerPageHeight = A4.px.height - pageMargin * 2;
  const defaultItemScale = 4;

  type SkylineNode = { x: number; y: number; width: number };

  const getSkylineY = (
    skyline: SkylineNode[],
    startIndex: number,
    requiredWidth: number
  ) => {
    let coveredWidth = 0;
    let y = skyline[startIndex]!.y;
    let index = startIndex;

    while (coveredWidth < requiredWidth) {
      if (index >= skyline.length) {
        return Infinity;
      }
      const node = skyline[index]!;
      y = Math.max(y, node.y);
      coveredWidth += node.width;
      index += 1;
    }

    return y;
  };

  const mergeSkyline = (skyline: SkylineNode[]) => {
    for (let index = 0; index < skyline.length - 1; index += 1) {
      const current = skyline[index]!;
      const next = skyline[index + 1]!;

      if (current.y === next.y) {
        current.width += next.width;
        skyline.splice(index + 1, 1);
        index -= 1;
      }
    }
  };

  const addSkylineNode = (
    skyline: SkylineNode[],
    x: number,
    y: number,
    width: number
  ) => {
    const right = x + width;
    let index = 0;

    while (index < skyline.length) {
      const node = skyline[index]!;
      const nodeRight = node.x + node.width;

      if (nodeRight <= x) {
        index += 1;
        continue;
      }

      if (node.x >= right) {
        break;
      }

      if (node.x < x) {
        const leftWidth = x - node.x;
        const rightWidth = nodeRight - right;
        node.width = leftWidth;

        if (rightWidth > 0) {
          skyline.splice(index + 1, 0, {
            x: right,
            y: node.y,
            width: rightWidth,
          });
        }
        index += 1;
        continue;
      }

      if (nodeRight > right) {
        const remainingWidth = nodeRight - right;
        skyline.splice(index, 1, {
          x: right,
          y: node.y,
          width: remainingWidth,
        });
        break;
      }

      skyline.splice(index, 1);
    }

    const insertIndex = skyline.findIndex((node) => node.x > x);
    const newNode: SkylineNode = { x, y, width };

    if (insertIndex === -1) {
      skyline.push(newNode);
    } else {
      skyline.splice(insertIndex, 0, newNode);
    }

    mergeSkyline(skyline);
  };

  const placeRect = (
    skyline: SkylineNode[],
    requiredWidth: number,
    requiredHeight: number
  ) => {
    let bestX = -1;
    let bestY = Infinity;
    let bestIndex = -1;

    for (let index = 0; index < skyline.length; index += 1) {
      const node = skyline[index]!;
      const rectRight = node.x + requiredWidth;

      if (rectRight > pageMargin + innerPageWidth) {
        continue;
      }

      const y = getSkylineY(skyline, index, requiredWidth);
      if (y + requiredHeight > pageMargin + innerPageHeight) {
        continue;
      }

      if (y < bestY || (y === bestY && node.x < bestX)) {
        bestX = node.x;
        bestY = y;
        bestIndex = index;
      }
    }

    if (bestIndex === -1) {
      return null;
    }

    addSkylineNode(skyline, bestX, bestY + requiredHeight, requiredWidth);
    return { x: bestX, y: bestY };
  };

  const drawItems = (
    selectedTextureFrames: SelectedTexture[],
    showFolds: boolean,
    onToggleItemEnchantment: (itemIndex: number) => void,
    getGlintPlugin: (enabled: boolean) => TexturePlugin | undefined
  ) => {
    const makeNewPageSkyline = (): SkylineNode[] => [
      { x: pageMargin, y: pageMargin, width: innerPageWidth },
    ];

    const pages: Array<{
      id: string;
      placements: Array<{
        selectedTextureFrame: SelectedTexture;
        selectedTextureFrameIndex: number;
        x: number;
        y: number;
        leftHalfWidth: number;
        width: number;
        height: number;
      }>;
    }> = [];

    let currentPage = {
      id: "Page 1",
      placements: [] as Array<{
        selectedTextureFrame: SelectedTexture;
        selectedTextureFrameIndex: number;
        x: number;
        y: number;
        leftHalfWidth: number;
        width: number;
        height: number;
      }>,
    };
    let skyline = makeNewPageSkyline();

    const pushPage = () => {
      pages.push(currentPage);
      const nextPageIndex = pages.length + 1;
      currentPage = {
        id: `Page ${nextPageIndex}`,
        placements: [],
      };
      skyline = makeNewPageSkyline();
    };

    selectedTextureFrames.forEach(
      (selectedTextureFrame, selectedTextureFrameIndex) => {
        const { leftHalfWidth, width, height } = getItemDimensions(
          selectedTextureFrame,
          selectedTextureFrame.itemScale ?? defaultItemScale
        );
        const requiredWidth = width + itemMargin * 2;
        const requiredHeight = height + itemMargin * 2;
        let placement = placeRect(skyline, requiredWidth, requiredHeight);

        if (!placement && currentPage.placements.length > 0) {
          pushPage();
          placement = placeRect(skyline, requiredWidth, requiredHeight);
        }

        if (!placement) {
          placement = { x: pageMargin, y: pageMargin };
        }

        currentPage.placements.push({
          selectedTextureFrame,
          selectedTextureFrameIndex,
          x: placement.x + itemMargin,
          y: placement.y + itemMargin,
          leftHalfWidth,
          width,
          height,
        });
      }
    );

    if (currentPage.placements.length > 0 || pages.length === 0) {
      pages.push(currentPage);
    }

    pages.forEach((page) => {
      generator.usePage(page.id);
      generator.drawImage("Background", [0, 0]);
      page.placements.forEach((placement) => {
        const {
          selectedTextureFrame,
          selectedTextureFrameIndex,
          x,
          y,
          leftHalfWidth,
          width,
          height,
        } = placement;
        const layers = getItemLayers(selectedTextureFrame);
        const itemScale = selectedTextureFrame.itemScale ?? defaultItemScale;
        const glintPlugin = getGlintPlugin(
          selectedTextureFrame.enchanted ?? false
        );
        const itemLayout = getItemLayout(layers);

        layers.forEach((layer) => {
          const leftDestination = getLayerHalfDestination(
            itemLayout.leftBounds,
            itemLayout.minY,
            layer,
            x,
            y,
            itemScale,
            "None"
          );
          const rightDestination = getLayerHalfDestination(
            itemLayout.rightBounds,
            itemLayout.minY,
            layer,
            x + leftHalfWidth,
            y,
            itemScale,
            "Horizontal"
          );

          drawItemHalf(
            layer,
            leftDestination.source,
            leftDestination.x,
            leftDestination.y,
            leftDestination.width,
            leftDestination.height,
            "None",
            glintPlugin
          );
          drawItemHalf(
            layer,
            rightDestination.source,
            rightDestination.x,
            rightDestination.y,
            rightDestination.width,
            rightDestination.height,
            "Horizontal",
            glintPlugin
          );
        });
        if (showFolds) {
          generator.drawTexture(
            "CenterFold",
            [0, 0, 2, height],
            [x + leftHalfWidth - 1, y, 2, height]
          );
        }
        generator.defineRegionInput(
          [x, y, width, height],
          () => onToggleItemEnchantment(selectedTextureFrameIndex),
          `Item ${selectedTextureFrameIndex + 1}`
        );
      });
      generator.drawImage("Title", [0, 0]);
    });
  };

  const sizeMedium = "Medium (400%)";
  const sizeLarge = "Large (700%)";
  const sizeExtraLarge = "Extra Large (1400%)";
  const sizeSmall = "Small (200%)";
  const sizeCustom = "Custom";
  const sizes = [sizeMedium, sizeLarge, sizeExtraLarge, sizeSmall, sizeCustom];
  const scaleBySize = new Map([
    [sizeMedium, 4],
    [sizeLarge, 7],
    [sizeExtraLarge, 14],
    [sizeSmall, 2],
  ]);

  // Show a drop down of different texture versions

  generator.defineSelectInput("Version", versionIdsItemsFirst);

  const versionId = generator.getSelectInputValue("Version") ?? "";

  if (versionId === "custom") {
    generator.defineAtlasInput("custom", {
      label: "Custom",
      standardWidth: 32,
      standardHeight: 32,
      choices: [],
    });

    const customAtlas = parseAtlas(
      generator.getStringInputValue("custom Frames")
    );
    const customTexture = generator.getTexture("custom");
    if (customTexture) {
      const textureUrl = customTexture.imageWithCanvas.image.src;
      if (customAtlas && customAtlas.frames.length > 0) {
        updateCustomTextureAtlas(textureUrl, customAtlas);
      } else {
        updateCustomTextureUrl(textureUrl);
      }
    }
  }

  // Get the current selected version

  const textureVersion = findVersion(versionId);

  // Show a drop down of sizes

  generator.defineSelectInput("Item Size", sizes);

  const selectedItemSize =
    generator.getSelectInputValue("Item Size") ?? sizeMedium;
  const selectedCustomScalePercent =
    generator.getNumberVariable("Custom Scale (%)") ?? 400;

  if (selectedItemSize === sizeCustom) {
    generator.defineRangeInput("Custom Scale (%)", {
      min: 100,
      max: 1600,
      value: selectedCustomScalePercent,
      step: 100,
      showValue: true,
    });
  }

  const selectedItemScale =
    selectedItemSize === sizeCustom
      ? selectedCustomScalePercent / 100
      : scaleBySize.get(selectedItemSize) ?? defaultItemScale;

  // Decode the current selected texture

  const currentTextureJson = generator.getStringInputValue(
    "SelectedTextureFrame"
  );
  const currentTexture: SelectedTexture | null = currentTextureJson
    ? decodeSelectedTexture(currentTextureJson)
    : null;
  if (currentTexture !== null && currentTexture.textureDefId !== versionId) {
    // Clear stale selections when the active texture version changes.
    generator.setStringInputValue("SelectedTextureFrame", "");
  }
  const resolvedCurrentTextureJson = generator.getStringInputValue(
    "SelectedTextureFrame"
  );
  const resolvedCurrentTexture: SelectedTexture | null =
    resolvedCurrentTextureJson
      ? decodeSelectedTexture(resolvedCurrentTextureJson)
      : null;

  // Show the Texture Picker
  // When a texture is selected, we need to encode it into a string variable

  generator.defineCustomStringInput("SelectedTextureFrame", (onChange) => {
    if (!textureVersion) {
      return null;
    }
    return (
      <TexturePicker
        versionId={versionId}
        selectedTexture={resolvedCurrentTexture}
        tintChoiceGroups={itemTintChoiceGroups}
        enableErase={false}
        onChange={(selectedTexture) => {
          onChange(encodeSelectedTexture(selectedTexture));
        }}
      />
    );
  });

  // Define the Show Folds Variable

  generator.defineBooleanInput("Show Folds", true);

  const showFolds = generator.getBooleanInputValueWithDefault(
    "Show Folds",
    true
  );

  // Decode the selected texture

  const selectedTextureFrame: SelectedTexture | null = resolvedCurrentTexture;

  // Decode the added textures

  const selectedTextureFramesJson = generator.getStringInputValue(
    "SelectedTextureFrames"
  );
  const selectedTextureFrames: SelectedTexture[] = selectedTextureFramesJson
    ? decodeSelectedTextures(selectedTextureFramesJson)
    : [];

  const getItemLayersForItem = (item: SelectedTexture) =>
    item.itemLayers ?? [item];

  const addSelectedTextureFrame = (textureFrame: SelectedTexture) => [
    ...selectedTextureFrames,
    textureFrame,
  ];

  const toggleItemEnchantment = (itemIndex: number) => {
    generator.setStringInputValue(
      "SelectedTextureFrames",
      encodeSelectedTextures(
        selectedTextureFrames.map((textureFrame, index) =>
          index === itemIndex
            ? {
                ...textureFrame,
                enchanted: !(textureFrame.enchanted ?? false),
              }
            : textureFrame
        )
      )
    );
  };

  // Show a button which adds the selected texture to the page

  generator.defineButtonInput(
    "Add Item",
    () => {
      if (selectedTextureFrame) {
        const newSelectedTextureFrame: SelectedTexture = {
          ...selectedTextureFrame,
          itemScale: selectedItemScale,
          itemLayers: undefined,
          enchanted: false,
        };
        generator.setStringInputValue(
          "SelectedTextureFrames",
          encodeSelectedTextures(
            addSelectedTextureFrame(newSelectedTextureFrame)
          )
        );
      }
    },
    "Blue"
  );

  // Show a button which overlays the selected texture onto the last added texture

  generator.defineButtonInput(
    "Overlay Item",
    () => {
      if (selectedTextureFrame) {
        const previousItem = selectedTextureFrames.at(-1);
        const overlayItemScale = previousItem?.itemScale ?? selectedItemScale;
        const newLayer: SelectedTexture = {
          ...selectedTextureFrame,
          itemScale: overlayItemScale,
          itemLayers: undefined,
          enchanted: undefined,
        };
        const newSelectedTextureFrames: SelectedTexture[] = previousItem
          ? [
              ...selectedTextureFrames.slice(0, -1),
              {
                ...newLayer,
                itemScale: overlayItemScale,
                enchanted: previousItem.enchanted ?? false,
                itemLayers: [...getItemLayersForItem(previousItem), newLayer],
              },
            ]
          : addSelectedTextureFrame({ ...newLayer, enchanted: false });
        generator.setStringInputValue(
          "SelectedTextureFrames",
          encodeSelectedTextures(newSelectedTextureFrames)
        );
      }
    },
    "Green"
  );

  // Show a button which removes the last placed item or top overlay layer

  generator.defineButtonInput(
    "Remove Item",
    () => {
      const previousItem = selectedTextureFrames.at(-1);
      if (!previousItem) {
        return;
      }

      const previousLayers = getItemLayersForItem(previousItem);
      const newSelectedTextureFrames: SelectedTexture[] =
        previousLayers.length > 1
          ? [
              ...selectedTextureFrames.slice(0, -1),
              {
                ...previousItem,
                itemLayers: previousLayers.slice(0, -1),
              },
            ]
          : selectedTextureFrames.slice(0, -1);

      generator.setStringInputValue(
        "SelectedTextureFrames",
        encodeSelectedTextures(newSelectedTextureFrames)
      );
    },
    "Red"
  );

  // Show a button which allows the items to be cleared

  generator.defineText("");

  generator.defineButtonInput(
    "Clear",
    () => {
      generator.setStringInputValue(
        "SelectedTextureFrames",
        encodeSelectedTextures([])
      );
      if (selectedTextureFrame) {
        generator.setStringInputValue(
          "SelectedTextureFrame",
          encodeSelectedTexture({ ...selectedTextureFrame, blend: null })
        );
      }
    },
    "Red"
  );

  const glint = defineGlintControls(generator);

  // Show a blank page initially

  if (selectedTextureFrames.length === 0) {
    generator.usePage("Page 1");
    generator.drawImage("Background", [0, 0]);
    generator.drawImage("Title", [0, 0]);
  }

  drawItems(
    selectedTextureFrames,
    showFolds,
    toggleItemEnchantment,
    glint.getPlugin
  );
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video: null,
  instructions,
  images,
  textures,
  script,
};
