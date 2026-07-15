"use client";

import React from "react";
import { type TexturePlugin } from "@genroot/builder/modules/generator";
import {
  type ImageDef,
  type InstructionsDef,
  type ThumbnailDef,
  type TextureDef,
} from "@genroot/builder/modules/generatorDef";
import { A4 } from "@genroot/builder/modules/modelPage";
import {
  type Texture,
  makeTextureFromUrl,
} from "@genroot/builder/modules/texture";
import {
  type GeneratorDefV2,
  type GeneratorV2,
  type RegionClickHandler,
  type RenderContext,
} from "@genroot/builder/v2/generatorV2";
import { GeneratorRenderer } from "@genroot/builder/v2/generatorRenderer";
import { GeneratorUI } from "@genroot/builder/v2/generatorUI";
import { AtlasControl } from "@genroot/builder/ui/controls/atlasControl";
import { BooleanControl } from "@genroot/builder/ui/controls/booleanControl";
import { ButtonControl } from "@genroot/builder/ui/controls/buttonControl";
import { RangeControl } from "@genroot/builder/ui/controls/rangeControl";
import { TextureControl } from "@genroot/builder/ui/controls/textureControl";
import {
  type Flip,
  makeNextFlip,
} from "@genroot/builder/ui/texturePicker/flip";
import { rotationToDegrees } from "@genroot/builder/ui/texturePicker/rotation";
import { type SelectedTexture } from "@genroot/builder/ui/texturePicker/selectedTexture";
import {
  type GlintPluginOptions,
  itemGlintTextureDefs,
  makeGlintPlugin,
} from "@genroot/generators/_common/plugins/glint";
import {
  parseAtlas,
  updateCustomTextureAtlas,
  updateCustomTextureUrl,
} from "@genroot/generators/_common/textures/customTextureVersion";
import {
  allTextureDefs,
  versionIdsItemsFirst as versionIds,
  findVersion,
} from "@genroot/generators/_common/textures/textureVersions";
import {
  type Rectangle,
  getItemDimensions,
  getItemLayers,
  getItemLayout,
  getLayerHalfDestination,
} from "@genroot/generators/minecraftItem/itemLayout";
import { TexturePicker } from "@genroot/generators/minecraftItem/ui/texturePicker";

import backgroundImage from "./images/Background.png";
import titleImage from "./images/Title.png";
import centerFoldTexture from "./textures/CenterFold.png";
import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";

const id = "minecraft-item-v2";

const name = "Minecraft Item (v2)";

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const instructions: InstructionsDef = `
## Item Sizes

The generator supports four standard sizes:

* **Medium** - Good for general items (400% scale)
* **Large** - Good for weapons and tools (700% scale)
* **Extra Large** - Good for spears and oversized items (1400% scale)
* **Small** - Good for blocks as items (200% scale)

You can also choose a custom scale from 100% to 1600%.
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

const pageMargin = 30;
const itemMargin = 5;
const innerPageWidth = A4.px.width - pageMargin * 2;
const innerPageHeight = A4.px.height - pageMargin * 2;
const defaultItemScale = 4;

const sizeMedium = "Medium (400%)";
const sizeLarge = "Large (700%)";
const sizeExtraLarge = "Extra Large (1400%)";
const sizeSmall = "Small (200%)";
const sizeCustom = "Custom";

const sizes = [sizeMedium, sizeLarge, sizeExtraLarge, sizeSmall, sizeCustom];

const sizeOptions = sizes.map((size) => ({ id: size, label: size }));

const scaleBySize = new Map([
  [sizeMedium, 4],
  [sizeLarge, 7],
  [sizeExtraLarge, 14],
  [sizeSmall, 2],
]);

type SkylineNode = { x: number; y: number; width: number };

type ItemPlacement = {
  selectedTextureFrame: SelectedTexture;
  selectedTextureFrameIndex: number;
  x: number;
  y: number;
  leftHalfWidth: number;
  width: number;
  height: number;
};

type ItemPage = {
  id: string;
  placements: ItemPlacement[];
};

type MinecraftItemProps = {
  selectedTextureFrames: SelectedTexture[];
  showFolds: boolean;
  glintEnabled: boolean;
  glintOpacity: number;
  glintXOffset: number;
  glintYOffset: number;
};

function getSkylineY(
  skyline: SkylineNode[],
  startIndex: number,
  requiredWidth: number
): number {
  const firstNode = skyline[startIndex];
  if (!firstNode) {
    return Infinity;
  }

  let coveredWidth = 0;
  let y = firstNode.y;
  let index = startIndex;

  while (coveredWidth < requiredWidth) {
    const node = skyline[index];
    if (!node) {
      return Infinity;
    }
    y = Math.max(y, node.y);
    coveredWidth += node.width;
    index += 1;
  }

  return y;
}

function mergeSkyline(skyline: SkylineNode[]): void {
  for (let index = 0; index < skyline.length - 1; index += 1) {
    const current = skyline[index];
    const next = skyline[index + 1];

    if (!current || !next) {
      continue;
    }

    if (current.y === next.y) {
      current.width += next.width;
      skyline.splice(index + 1, 1);
      index -= 1;
    }
  }
}

function addSkylineNode(
  skyline: SkylineNode[],
  x: number,
  y: number,
  width: number
): void {
  const right = x + width;
  let index = 0;

  while (index < skyline.length) {
    const node = skyline[index];
    if (!node) {
      break;
    }
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
        const remainingNode: SkylineNode = {
          x: right,
          y: node.y,
          width: rightWidth,
        };
        skyline.splice(index + 1, 0, remainingNode);
      }
      index += 1;
      continue;
    }

    if (nodeRight > right) {
      const remainingNode: SkylineNode = {
        x: right,
        y: node.y,
        width: nodeRight - right,
      };
      skyline.splice(index, 1, remainingNode);
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
}

function placeRect(
  skyline: SkylineNode[],
  requiredWidth: number,
  requiredHeight: number
): { x: number; y: number } | null {
  let bestX = -1;
  let bestY = Infinity;
  let bestIndex = -1;

  for (let index = 0; index < skyline.length; index += 1) {
    const node = skyline[index];
    if (!node) {
      continue;
    }
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
}

function makeItemPages(selectedTextureFrames: SelectedTexture[]): ItemPage[] {
  const makeNewPageSkyline = (): SkylineNode[] => [
    { x: pageMargin, y: pageMargin, width: innerPageWidth },
  ];

  const pages: ItemPage[] = [];
  let currentPage: ItemPage = { id: "Page 1", placements: [] };
  let skyline = makeNewPageSkyline();

  const pushPage = () => {
    pages.push(currentPage);
    currentPage = { id: `Page ${pages.length + 1}`, placements: [] };
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

      const resolvedPlacement = placement ?? {
        x: pageMargin,
        y: pageMargin,
      };
      const itemPlacement: ItemPlacement = {
        selectedTextureFrame,
        selectedTextureFrameIndex,
        x: resolvedPlacement.x + itemMargin,
        y: resolvedPlacement.y + itemMargin,
        leftHalfWidth,
        width,
        height,
      };
      currentPage.placements.push(itemPlacement);
    }
  );

  if (currentPage.placements.length > 0 || pages.length === 0) {
    pages.push(currentPage);
  }

  return pages;
}

function drawItemHalf(
  ctx: RenderContext,
  selectedTexture: SelectedTexture,
  rectangle: Rectangle,
  destX: number,
  y: number,
  width: number,
  height: number,
  appliedFlip: Flip = "None",
  plugin?: TexturePlugin
): void {
  const { textureDefId, rotation, flip, blend } = selectedTexture;
  const [nextFlip, nextRotation] = makeNextFlip(flip, appliedFlip, rotation);
  ctx.drawTexture(textureDefId, rectangle, [destX, y, width, height], {
    flip: nextFlip,
    rotate: rotationToDegrees(nextRotation),
    blend: blend ? { kind: "MultiplyHex", hex: blend } : undefined,
    plugin,
  });
}

function render(ctx: RenderContext, props: MinecraftItemProps): void {
  const glintTexture = ctx.getTexture("Enchanted Glint");
  const glintPluginOptions: GlintPluginOptions = {
    opacity: props.glintOpacity / 255,
    xOffset: props.glintXOffset,
    yOffset: props.glintYOffset,
  };
  const getGlintPlugin = (enabled: boolean): TexturePlugin | undefined =>
    glintTexture && props.glintEnabled && enabled
      ? makeGlintPlugin(glintTexture, glintPluginOptions)
      : undefined;

  makeItemPages(props.selectedTextureFrames).forEach((page) => {
    ctx.usePage(page.id);
    ctx.drawImage("Background", [0, 0]);

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
          ctx,
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
          ctx,
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

      if (props.showFolds) {
        ctx.drawTexture(
          "CenterFold",
          [0, 0, 2, height],
          [x + leftHalfWidth - 1, y, 2, height]
        );
      }

      ctx.defineRegion(
        [x, y, width, height],
        `Item ${selectedTextureFrameIndex + 1}`
      );
    });

    ctx.drawImage("Title", [0, 0]);
  });
}

const minecraftItemGeneratorV2: GeneratorV2<MinecraftItemProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [versionId, setVersionId] = React.useState(versionIds[0] ?? "");
  const [selectedItemSize, setSelectedItemSize] = React.useState(sizeMedium);
  const [customScalePercent, setCustomScalePercent] = React.useState(400);
  const [selectedTexture, setSelectedTexture] =
    React.useState<SelectedTexture | null>(null);
  const [selectedTextureFrames, setSelectedTextureFrames] = React.useState<
    SelectedTexture[]
  >([]);
  const [showFolds, setShowFolds] = React.useState(true);
  const [customTexture, setCustomTexture] = React.useState<Texture | null>(
    null
  );
  const [glintTexture, setGlintTexture] = React.useState<Texture | null>(null);
  const [glintEnabled, setGlintEnabled] = React.useState(true);
  const [glintOpacity, setGlintOpacity] = React.useState(255);
  const [glintXOffset, setGlintXOffset] = React.useState(0);
  const [glintYOffset, setGlintYOffset] = React.useState(0);
  const [glintChoiceTextures, setGlintChoiceTextures] = React.useState<
    Map<string, Texture>
  >(new Map());

  React.useEffect(() => {
    let cancelled = false;

    Promise.all(
      itemGlintTextureDefs.map(async (textureDef) => {
        const texture = await makeTextureFromUrl(
          textureDef.url,
          textureDef.standardWidth,
          textureDef.standardHeight
        );
        return [textureDef.id, texture] satisfies [string, Texture];
      })
    ).then((textureTuples) => {
      if (!cancelled) {
        setGlintChoiceTextures(new Map(textureTuples));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const textureVersion = findVersion(versionId);
  const selectedItemScale =
    selectedItemSize === sizeCustom
      ? customScalePercent / 100
      : scaleBySize.get(selectedItemSize) ?? defaultItemScale;

  const rendererProps: MinecraftItemProps = {
    selectedTextureFrames,
    showFolds,
    glintEnabled,
    glintOpacity,
    glintXOffset,
    glintYOffset,
  };

  const dynamicTextures = React.useMemo(() => {
    const nextTextures = new Map<string, Texture>();
    if (customTexture) {
      nextTextures.set("custom", customTexture);
    }
    if (glintTexture) {
      nextTextures.set("Enchanted Glint", glintTexture);
    }
    return nextTextures;
  }, [customTexture, glintTexture]);

  const onVersionChange = (nextVersionId: string) => {
    setVersionId(nextVersionId);
    setSelectedTexture((currentTexture) =>
      currentTexture?.textureDefId === nextVersionId ? currentTexture : null
    );
  };

  const onAtlasChange = (
    texture: Texture | null,
    framesJson: string | null
  ) => {
    setCustomTexture(texture);
    if (!texture) {
      return;
    }

    const textureUrl = texture.imageWithCanvas.image.src;
    const atlas = parseAtlas(framesJson);
    if (atlas && atlas.frames.length > 0) {
      updateCustomTextureAtlas(textureUrl, atlas);
    } else {
      updateCustomTextureUrl(textureUrl);
    }
  };

  const addItem = () => {
    if (!selectedTexture) {
      return;
    }

    const newItem: SelectedTexture = {
      ...selectedTexture,
      itemScale: selectedItemScale,
      itemLayers: undefined,
      enchanted: false,
    };
    setSelectedTextureFrames((items) => [...items, newItem]);
  };

  const overlayItem = () => {
    if (!selectedTexture) {
      return;
    }

    setSelectedTextureFrames((items) => {
      const previousItem = items.at(-1);
      const overlayItemScale = previousItem?.itemScale ?? selectedItemScale;
      const newLayer: SelectedTexture = {
        ...selectedTexture,
        itemScale: overlayItemScale,
        itemLayers: undefined,
        enchanted: undefined,
      };

      if (!previousItem) {
        return [...items, { ...newLayer, enchanted: false }];
      }

      const overlaidItem: SelectedTexture = {
        ...newLayer,
        itemScale: overlayItemScale,
        enchanted: previousItem.enchanted ?? false,
        itemLayers: [...getItemLayers(previousItem), newLayer],
      };
      return [...items.slice(0, -1), overlaidItem];
    });
  };

  const removeItem = () => {
    setSelectedTextureFrames((items) => {
      const previousItem = items.at(-1);
      if (!previousItem) {
        return items;
      }

      const previousLayers = getItemLayers(previousItem);
      if (previousLayers.length === 1) {
        return items.slice(0, -1);
      }

      const itemWithoutTopLayer: SelectedTexture = {
        ...previousItem,
        itemLayers: previousLayers.slice(0, -1),
      };
      return [...items.slice(0, -1), itemWithoutTopLayer];
    });
  };

  const clearItems = () => {
    setSelectedTextureFrames([]);
    setSelectedTexture((currentTexture) =>
      currentTexture ? { ...currentTexture, blend: null } : null
    );
  };

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    if (!regionId.startsWith("Item ")) {
      return;
    }

    const itemIndex = Number(regionId.slice("Item ".length)) - 1;
    if (!Number.isInteger(itemIndex) || itemIndex < 0) {
      return;
    }

    setSelectedTextureFrames((items) =>
      items.map((item, index) =>
        index === itemIndex
          ? { ...item, enchanted: !(item.enchanted ?? false) }
          : item
      )
    );
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.Instructions markdown={instructions} />

            <GeneratorUI.SelectInput
              label="Version"
              options={versionIds.map((version) => ({
                id: version,
                label: version,
              }))}
              value={versionId}
              onValueChange={onVersionChange}
            />

            {versionId === "custom" ? (
              <AtlasControl
                id="custom"
                label="Custom"
                standardWidth={32}
                standardHeight={32}
                choices={[]}
                textures={dynamicTextures}
                onChange={onAtlasChange}
              />
            ) : null}

            <GeneratorUI.SelectInput
              label="Item Size"
              options={sizeOptions}
              value={selectedItemSize}
              onValueChange={setSelectedItemSize}
            />

            {selectedItemSize === sizeCustom ? (
              <RangeControl
                id="Custom Scale (%)"
                min={100}
                max={1600}
                value={customScalePercent}
                step={100}
                showValue={true}
                onChange={setCustomScalePercent}
              />
            ) : null}

            {textureVersion ? (
              <TexturePicker
                textureVersion={textureVersion}
                blend={selectedTexture?.blend ?? null}
                onSelect={(nextTexture) => {
                  const textureWithBlend: SelectedTexture = {
                    ...nextTexture,
                    blend: selectedTexture?.blend ?? null,
                  };
                  setSelectedTexture(textureWithBlend);
                }}
                onBlendSelected={(blend) => {
                  setSelectedTexture((currentTexture) =>
                    currentTexture ? { ...currentTexture, blend } : null
                  );
                }}
              />
            ) : null}

            <BooleanControl
              id="Show Folds"
              checked={showFolds}
              onChange={setShowFolds}
            />

            <ButtonControl id="Add Item" onClick={addItem} color="Blue" />
            <ButtonControl
              id="Overlay Item"
              onClick={overlayItem}
              color="Green"
            />
            <ButtonControl id="Remove Item" onClick={removeItem} color="Red" />
            <div />
            <ButtonControl id="Clear" onClick={clearItems} color="Red" />

            <TextureControl
              id="Enchanted Glint"
              standardWidth={128}
              standardHeight={128}
              choices={["1.20+", "Pre-1.20"]}
              textures={glintChoiceTextures}
              onChange={(texture) => {
                setGlintTexture(texture);
                setGlintEnabled(texture !== null);
              }}
            />

            <RangeControl
              id="Glint Opacity"
              min={0}
              max={255}
              value={glintOpacity}
              step={1}
              onChange={setGlintOpacity}
            />
            <RangeControl
              id="Glint X Offset"
              min={0}
              max={128}
              value={glintXOffset}
              step={1}
              onChange={setGlintXOffset}
            />
            <RangeControl
              id="Glint Y Offset"
              min={0}
              max={128}
              value={glintYOffset}
              step={1}
              onChange={setGlintYOffset}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftItemGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
