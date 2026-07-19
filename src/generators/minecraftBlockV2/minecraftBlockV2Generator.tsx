"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  encodeSelectedTextures,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RegionClickHandler,
  type RenderContext,
  type SelectedTexture,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";
import {
  parseAtlas,
  updateCustomTextureAtlas,
  updateCustomTextureUrl,
} from "@genroot/generators/_common/textures/customTextureVersion";
import {
  allTextureDefs,
  versionIdsBlocksFirst,
} from "@genroot/generators/_common/textures/textureVersions";
import { TexturePicker } from "@genroot/generators/minecraftBlock/texturePicker";
import { type BlockRenderContext } from "./blockRenderContext";
import { drawBlock } from "./shapes/block";
import { drawCake } from "./shapes/cake";
import { drawDoor } from "./shapes/door";
import { drawFence } from "./shapes/fence";
import { drawShelf } from "./shapes/shelf";
import { drawSlab } from "./shapes/slab";
import { drawSnow } from "./shapes/snow";
import { drawStair } from "./shapes/stair";
import { drawTrapdoor } from "./shapes/trapdoor";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import titleImage from "./images/Title.png";
import foldsBlockImage from "./images/Folds-Block.png";
import tabsBlockImage from "./images/Tabs-Block.png";
import foldsSlabImage from "./images/Folds-Slab.png";
import tabsSlabImage from "./images/Tabs-Slab.png";
import foldsStairImage from "./images/Folds-Stair.png";
import tabsStairImage from "./images/Tabs-Stair.png";
import foldsFenceImage from "./images/Folds-Fence.png";
import tabsFenceImage from "./images/Tabs-Fence.png";
import foldsDoorImage from "./images/Folds-Door.png";
import tabsDoorImage from "./images/Tabs-Door.png";
import foldsTrapdoorImage from "./images/Folds-Trapdoor.png";
import tabsTrapdoorImage from "./images/Tabs-Trapdoor.png";
import foldsSnowTopImage from "./images/Folds-Snow-Top.png";
import foldsSnowBottomImage from "./images/Folds-Snow-Bottom.png";
import tabsSnowTopImage from "./images/Tabs-Snow-Top.png";
import tabsSnowMiddleImage from "./images/Tabs-Snow-Middle.png";
import tabsSnowBottomImage from "./images/Tabs-Snow-Bottom.png";
import foldsCakeLeftImage from "./images/Folds-Cake-Left.png";
import foldsCakeMiddleImage from "./images/Folds-Cake-Middle.png";
import foldsCakeRightImage from "./images/Folds-Cake-Right.png";
import tabsCakeLeftImage from "./images/Tabs-Cake-Left.png";
import tabsCakeMiddleImage from "./images/Tabs-Cake-Middle.png";
import tabsCakeCornerImage from "./images/Tabs-Cake-Corner.png";
import tabsCakeRightImage from "./images/Tabs-Cake-Right.png";
import foldsShelfImage from "./images/Folds-Shelf.png";
import tabsShelfImage from "./images/Tabs-Shelf.png";

const id = "minecraft-block-v2";
const name = "Minecraft Block";
const history: HistoryDef = [
  "Dec 2021 lostminer - Block generator rewrite.",
  "Dec 2021 NinjolasNJM - Add Stairs, Fence, Door, Trapdoor and Snow.",
  "Jan 2022 NinjolasNJM - Add Cake Block type.",
  "May 2026 NinjolasNJM - Add Shelf Block type.",
  "May 2026 NinjolasNJM - Changed to use new glint and tint input.",
  "Jul 2026 lostminer - Layout refresh.",
];
const thumbnail: ThumbnailDef = { url: thumbnailImage.src };
const image = (imageId: string, importedImage: { src: string }): ImageDef => ({
  id: imageId,
  url: importedImage.src,
});
const images: ImageDef[] = [
  image("Background", backgroundImage),
  image("Title", titleImage),
  image("Folds-Block", foldsBlockImage),
  image("Tabs-Block", tabsBlockImage),
  image("Folds-Slab", foldsSlabImage),
  image("Tabs-Slab", tabsSlabImage),
  image("Folds-Stair", foldsStairImage),
  image("Tabs-Stair", tabsStairImage),
  image("Folds-Fence", foldsFenceImage),
  image("Tabs-Fence", tabsFenceImage),
  image("Folds-Door", foldsDoorImage),
  image("Tabs-Door", tabsDoorImage),
  image("Folds-Trapdoor", foldsTrapdoorImage),
  image("Tabs-Trapdoor", tabsTrapdoorImage),
  image("Folds-Snow-Top", foldsSnowTopImage),
  image("Folds-Snow-Bottom", foldsSnowBottomImage),
  image("Tabs-Snow-Top", tabsSnowTopImage),
  image("Tabs-Snow-Middle", tabsSnowMiddleImage),
  image("Tabs-Snow-Bottom", tabsSnowBottomImage),
  image("Folds-Cake-Left", foldsCakeLeftImage),
  image("Folds-Cake-Middle", foldsCakeMiddleImage),
  image("Folds-Cake-Right", foldsCakeRightImage),
  image("Tabs-Cake-Left", tabsCakeLeftImage),
  image("Tabs-Cake-Middle", tabsCakeMiddleImage),
  image("Tabs-Cake-Corner", tabsCakeCornerImage),
  image("Tabs-Cake-Right", tabsCakeRightImage),
  image("Folds-Shelf", foldsShelfImage),
  image("Tabs-Shelf", tabsShelfImage),
];
const textures: TextureDef[] = allTextureDefs;
const blockTypes = [
  "Block",
  "Slab",
  "Stair",
  "Fence",
  "Door",
  "Trapdoor",
  "Snow Layers",
  "Cake",
  "Shelf",
];
type BlockProps = {
  numberOfBlocks: number;
  blockTypes: string[];
  showFolds: boolean;
  faceTextures: ReadonlyMap<string, SelectedTexture[]>;
  shelfStates: string[];
  snowLevels: string[];
  snowOffsets: boolean[];
  cakeBites: string[];
};

function render(ctx: RenderContext, props: BlockProps): void {
  const adapter: BlockRenderContext = {
    defineSelectInput: () => undefined,
    defineBooleanInput: () => undefined,
    defineRegionInput: (region, _onClick, regionId) =>
      ctx.defineRegion(region, regionId),
    getSelectInputValue: (inputId) => {
      const match = /^Block (\d+) (State|Level|Bites Taken)$/.exec(inputId);
      if (!match) return null;
      const index = Number(match[1]) - 1;
      switch (match[2]) {
        case "State":
          return props.shelfStates[index] ?? "Unpowered";
        case "Level":
          return props.snowLevels[index] ?? "1";
        case "Bites Taken":
          return props.cakeBites[index] ?? "0";
        default:
          return null;
      }
    },
    getBooleanInputValue: (inputId) => {
      const match = /^Block (\d+) Offset for Intermediate Levels$/.exec(
        inputId
      );
      return match ? props.snowOffsets[Number(match[1]) - 1] ?? false : null;
    },
    getStringInputValue: (faceId) =>
      encodeSelectedTextures(props.faceTextures.get(faceId) ?? []),
    setStringInputValue: () => undefined,
    drawImage: (imageId, position) => ctx.drawImage(imageId, position),
    drawTexture: (textureId, source, destination, options) =>
      ctx.drawTexture(textureId, source, destination, options),
  };
  ctx.drawImage("Background", [0, 0]);
  for (let index = 0; index < props.numberOfBlocks; index += 1) {
    const blockId = String(index + 1);
    const ox = 57;
    const oy = 16 + 400 * index;
    switch (props.blockTypes[index] ?? "Block") {
      case "Block":
        drawBlock(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Slab":
        drawSlab(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Stair":
        drawStair(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Fence":
        drawFence(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Door":
        drawDoor(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Trapdoor":
        drawTrapdoor(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Snow Layers":
        drawSnow(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Cake":
        drawCake(adapter, blockId, ox, oy, props.showFolds);
        break;
      case "Shelf":
        drawShelf(adapter, blockId, ox, oy, props.showFolds);
        break;
    }
  }
  ctx.drawImage("Title", [0, 0]);
}

const generatorV2: GeneratorV2<BlockProps> = {
  id,
  name,
  images,
  textures,
  render,
};
const options = (values: string[]) =>
  values.map((value) => ({ id: value, label: value }));

function Component(): JSX.Element {
  const [versionId, setVersionId] = React.useState(
    versionIdsBlocksFirst[0] ?? ""
  );
  const [selectedTexture, setSelectedTexture] =
    React.useState<SelectedTexture | null>(null);
  const [customTexture, setCustomTexture] = React.useState<Texture | null>(
    null
  );
  const [numberOfBlocks, setNumberOfBlocks] = React.useState(1);
  const [selectedBlockTypes, setSelectedBlockTypes] = React.useState([
    "Block",
    "Block",
  ]);
  const [showFolds, setShowFolds] = React.useState(true);
  const [faceTextures, setFaceTextures] = React.useState<
    ReadonlyMap<string, SelectedTexture[]>
  >(new Map());
  const [shelfStates, setShelfStates] = React.useState([
    "Unpowered",
    "Unpowered",
  ]);
  const [snowLevels, setSnowLevels] = React.useState(["1", "1"]);
  const [snowOffsets, setSnowOffsets] = React.useState([false, false]);
  const [cakeBites, setCakeBites] = React.useState(["0", "0"]);
  const dynamicTextures = React.useMemo(
    () =>
      customTexture
        ? new Map([["custom", customTexture]])
        : new Map<string, Texture>(),
    [customTexture]
  );
  const props: BlockProps = {
    numberOfBlocks,
    blockTypes: selectedBlockTypes,
    showFolds,
    faceTextures,
    shelfStates,
    snowLevels,
    snowOffsets,
    cakeBites,
  };
  const updateAt = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    value: T
  ) =>
    setter((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    if (!selectedTexture) return;
    setFaceTextures((current) => {
      const next = new Map(current);
      const stack = next.get(regionId) ?? [];
      next.set(
        regionId,
        selectedTexture.textureDefId === ""
          ? stack.slice(0, -1)
          : [...stack, selectedTexture]
      );
      return next;
    });
  };
  const onAtlasChange = (
    texture: Texture | null,
    framesJson: string | null
  ) => {
    setCustomTexture(texture);
    if (!texture) return;
    const url = texture.imageWithCanvas.image.src;
    const atlas = parseAtlas(framesJson);
    if (atlas && atlas.frames.length > 0) updateCustomTextureAtlas(url, atlas);
    else updateCustomTextureUrl(url);
  };
  const clear = () => {
    const defaultVersionId = versionIdsBlocksFirst[0] ?? "";
    setVersionId(defaultVersionId);
    setSelectedTexture((current) =>
      current?.textureDefId === defaultVersionId ? current : null
    );
    setNumberOfBlocks(1);
    setSelectedBlockTypes(["Block", "Block"]);
    setShowFolds(true);
    setFaceTextures(new Map());
    setShelfStates(["Unpowered", "Unpowered"]);
    setSnowLevels(["1", "1"]);
    setSnowOffsets([false, false]);
    setCakeBites(["0", "0"]);
  };
  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />
      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.SelectControl
              label="Version"
              options={options(versionIdsBlocksFirst)}
              value={versionId}
              onValueChange={(value) => {
                setVersionId(value);
                setSelectedTexture((current) =>
                  current?.textureDefId === value ? current : null
                );
              }}
            />
            {versionId === "custom" ? (
              <GeneratorUI.AtlasControl
                id="custom"
                label="Custom"
                standardWidth={32}
                standardHeight={32}
                choices={[]}
                textures={dynamicTextures}
                onChange={onAtlasChange}
              />
            ) : null}
            {versionId ? (
              <TexturePicker
                versionId={versionId}
                blend={selectedTexture?.blend ?? null}
                onTextureSelected={(texture) =>
                  setSelectedTexture({
                    ...texture,
                    blend:
                      texture.textureDefId === ""
                        ? null
                        : selectedTexture?.blend ?? null,
                  })
                }
                onBlendSelected={(blend) =>
                  setSelectedTexture((current) =>
                    current ? { ...current, blend } : null
                  )
                }
              />
            ) : null}
            <GeneratorUI.SelectControl
              label="Number of Blocks"
              options={options(["1", "2"])}
              value={String(numberOfBlocks)}
              onValueChange={(value) => setNumberOfBlocks(Number(value))}
            />
            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />
            {Array.from({ length: numberOfBlocks }, (_, index) => (
              <React.Fragment key={index}>
                <GeneratorUI.SelectControl
                  label={`Block ${index + 1} Type`}
                  options={options(blockTypes)}
                  value={selectedBlockTypes[index] ?? "Block"}
                  onValueChange={(value) =>
                    updateAt(setSelectedBlockTypes, index, value)
                  }
                />
                {selectedBlockTypes[index] === "Shelf" ? (
                  <GeneratorUI.SelectControl
                    label={`Block ${index + 1} State`}
                    options={options([
                      "Unpowered",
                      "Single",
                      "Left",
                      "Center",
                      "Right",
                    ])}
                    value={shelfStates[index] ?? "Unpowered"}
                    onValueChange={(value) =>
                      updateAt(setShelfStates, index, value)
                    }
                  />
                ) : null}
                {selectedBlockTypes[index] === "Snow Layers" ? (
                  <>
                    <GeneratorUI.SelectControl
                      label={`Block ${index + 1} Level`}
                      options={options([
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                      ])}
                      value={snowLevels[index] ?? "1"}
                      onValueChange={(value) =>
                        updateAt(setSnowLevels, index, value)
                      }
                    />
                    <GeneratorUI.BooleanControl
                      label={`Block ${index + 1} Offset for Intermediate Levels`}
                      checked={snowOffsets[index] ?? false}
                      onCheckedChange={(value) =>
                        updateAt(setSnowOffsets, index, value)
                      }
                    />
                  </>
                ) : null}
                {selectedBlockTypes[index] === "Cake" ? (
                  <GeneratorUI.SelectControl
                    label={`Block ${index + 1} Bites Taken`}
                    options={options(["0", "1", "2", "3", "4", "5", "6"])}
                    value={cakeBites[index] ?? "0"}
                    onValueChange={(value) =>
                      updateAt(setCakeBites, index, value)
                    }
                  />
                ) : null}
              </React.Fragment>
            ))}
            <GeneratorUI.ButtonControl
              label="Clear"
              onClick={clear}
              color="Red"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={generatorV2}
            props={props}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>
      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
