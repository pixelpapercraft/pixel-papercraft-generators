"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  rotationToDegrees,
  type Generator,
  type GeneratorDefV2,
  type HistoryDef,
  type ImageDef,
  type InstructionsDef,
  type Region,
  type RegionClickHandler,
  type RenderContext,
  type SelectedTexture,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder";
import {
  parseAtlas,
  updateCustomTextureAtlas,
  updateCustomTextureUrl,
} from "@genroot/generators/_common/textures/customTextureVersion";
import {
  allTextureDefs,
  versionIdsBlocksFirst,
} from "@genroot/generators/_common/textures/textureVersions";
import { TexturePicker } from "@genroot/generators/_common/block/texturePicker";
import {
  cycleTab,
  edgeId,
  emptyDioramaDocument,
  faceId,
  toggleFold,
  type DioramaDocument,
  type DioramaPreset,
  updateFaceTextures,
} from "./dioramaDocument";

import backgroundImage from "./images/Background.png";
import titlePortraitImage from "./images/TitlePortrait.png";
import thumbnailImage from "./thumbnail/v3-thumbnail-256.png";

const id = "minecraft-diorama";
const name = "Minecraft Diorama";
const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const history: HistoryDef = [
  "24 Jan 2024 NinjolasNJM - Initial ReScript version.",
  "Jul 2026 NinjolasNJM and lostminer - Rebuilt as a V2 generator.",
];

const instructions: InstructionsDef = `
## Diorama grid editor

Choose a Minecraft texture, then use **Blocks** mode to place it on the grid.
The texture picker’s erase selection removes the latest layer from a face.

Use **Tabs** and **Folds** modes to click an edge. Tabs cycle through four
sizes; folds toggle independently. **Show Edit Regions** makes the active
clickable regions visible.

This V2 foundation supports a multi-page portrait grid. Advanced source,
destination, transform, split, landscape, and file import/export tools will be
added in follow-up work.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title", url: titlePortraitImage.src },
];

const textures: TextureDef[] = allTextureDefs;
const editModes = ["Blocks", "Tabs", "Folds"] as const;
type EditMode = (typeof editModes)[number];

type DioramaProps = {
  document: DioramaDocument;
  preset: DioramaPreset;
  sizePercent: number;
  pageCount: number;
  editMode: EditMode;
  showEditRegions: boolean;
};

type GridLayout = {
  faceSize: number;
  columns: number;
  rows: number;
};

const pageOrigin: [number, number] = [42, 41];
const pageWidth = 512;
const pageHeight = 768;

const options = (values: readonly string[]) =>
  values.map((value) => ({ id: value, label: value }));

function getGridLayout(props: DioramaProps): GridLayout {
  const presetScale = props.preset === "Quarter Blocks" ? 0.5 : 1;
  const faceSize = Math.max(
    8,
    Math.round((props.sizePercent * 16 * presetScale) / 100)
  );

  return {
    faceSize,
    columns: Math.max(1, Math.floor(pageWidth / faceSize)),
    rows: Math.max(1, Math.floor(pageHeight / faceSize)),
  };
}

function drawSelectedTexture(
  ctx: RenderContext,
  selectedTexture: SelectedTexture,
  destination: Region
): void {
  if (selectedTexture.textureDefId === "") return;

  const blend = selectedTexture.blend
    ? { kind: "MultiplyHex" as const, hex: selectedTexture.blend }
    : undefined;
  ctx.drawTexture(
    selectedTexture.textureDefId,
    selectedTexture.frame.rectangle,
    destination,
    {
      rotate: rotationToDegrees(selectedTexture.rotation),
      flip: selectedTexture.flip,
      blend,
    }
  );
}

function drawEdge(
  ctx: RenderContext,
  props: DioramaProps,
  id: string,
  direction: "North" | "South" | "East" | "West",
  region: Region
): void {
  const tabValue = props.document.tabs[id] ?? 0;
  const showFold = props.document.folds[id] ?? false;

  if (tabValue > 0) {
    ctx.drawTab(region, direction, showFold, 30 + tabValue * 10);
  } else if (showFold) {
    const [x, y, width, height] = region;
    switch (direction) {
      case "North":
      case "South":
        ctx.drawFoldLine([x, y + height / 2], [x + width, y + height / 2]);
        return;
      case "East":
      case "West":
        ctx.drawFoldLine([x + width / 2, y], [x + width / 2, y + height]);
        return;
      default:
        return direction satisfies never;
    }
  }

  if (props.editMode === "Tabs" || props.editMode === "Folds") {
    ctx.defineRegion(region, id);
    if (props.showEditRegions) {
      ctx.drawRectangle(region, {
        color: "#2d9cdb",
        lineDash: [3, 3],
        width: 1,
      });
    }
  }
}

function render(ctx: RenderContext, props: DioramaProps): void {
  const layout = getGridLayout(props);
  const edgeThickness = Math.max(4, layout.faceSize / 4);

  for (let pageIndex = 0; pageIndex < props.pageCount; pageIndex += 1) {
    ctx.usePage(`Page ${pageIndex + 1}`);
    ctx.fillBackgroundColorWithWhite();
    ctx.drawImage("Background", [0, 0]);

    for (let row = 0; row < layout.rows; row += 1) {
      for (let column = 0; column < layout.columns; column += 1) {
        const worldColumn = column;
        const worldRow = pageIndex * layout.rows + row;
        const faceRegion: Region = [
          pageOrigin[0] + column * layout.faceSize,
          pageOrigin[1] + row * layout.faceSize,
          layout.faceSize,
          layout.faceSize,
        ];
        const currentFaceId = faceId(worldColumn, worldRow);
        const faceTextures = props.document.faceTextures[currentFaceId] ?? [];
        faceTextures.forEach((selectedTexture) =>
          drawSelectedTexture(ctx, selectedTexture, faceRegion)
        );

        if (props.editMode === "Blocks") {
          ctx.defineRegion(faceRegion, currentFaceId);
          if (props.showEditRegions) {
            ctx.drawRectangle(faceRegion, {
              color: "#2d9cdb",
              lineDash: [3, 3],
              width: 1,
            });
          }
        }

        const [x, y, width, height] = faceRegion;
        drawEdge(ctx, props, edgeId("North", worldColumn, worldRow), "North", [
          x,
          y - edgeThickness,
          width,
          edgeThickness,
        ]);
        drawEdge(ctx, props, edgeId("South", worldColumn, worldRow), "South", [
          x,
          y + height,
          width,
          edgeThickness,
        ]);
        drawEdge(ctx, props, edgeId("East", worldColumn, worldRow), "East", [
          x + width,
          y,
          edgeThickness,
          height,
        ]);
        drawEdge(ctx, props, edgeId("West", worldColumn, worldRow), "West", [
          x - edgeThickness,
          y,
          edgeThickness,
          height,
        ]);
      }
    }

    ctx.drawImage("Title", [0, 0]);
  }
}

const minecraftDioramaGenerator: Generator<DioramaProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [versionId, setVersionId] = React.useState(
    versionIdsBlocksFirst[0] ?? ""
  );
  const [selectedTexture, setSelectedTexture] =
    React.useState<SelectedTexture | null>(null);
  const [customTexture, setCustomTexture] = React.useState<Texture | null>(
    null
  );
  const [document, setDocument] =
    React.useState<DioramaDocument>(emptyDioramaDocument);
  const [preset, setPreset] = React.useState<DioramaPreset>("Full Blocks");
  const [sizePercent, setSizePercent] = React.useState(800);
  const [pageCount, setPageCount] = React.useState(1);
  const [editMode, setEditMode] = React.useState<EditMode>("Blocks");
  const [showEditRegions, setShowEditRegions] = React.useState(true);

  const dynamicTextures = new Map<string, Texture>();
  if (customTexture) dynamicTextures.set("custom", customTexture);

  const props: DioramaProps = {
    document,
    preset,
    sizePercent,
    pageCount,
    editMode,
    showEditRegions,
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

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    const [kind] = regionId.split(":");
    switch (kind) {
      case "face":
        if (editMode === "Blocks" && selectedTexture) {
          setDocument((current) =>
            updateFaceTextures(current, regionId, selectedTexture)
          );
        }
        return;
      case "edge":
        if (editMode === "Tabs")
          setDocument((current) => cycleTab(current, regionId));
        if (editMode === "Folds")
          setDocument((current) => toggleFold(current, regionId));
        return;
      default:
        return;
    }
  };

  const clear = () => {
    setDocument(emptyDioramaDocument());
    setPreset("Full Blocks");
    setSizePercent(800);
    setPageCount(1);
    setEditMode("Blocks");
    setShowEditRegions(true);
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
            <GeneratorUI.Instructions markdown={instructions} />
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
                onTextureSelected={(texture) => {
                  setSelectedTexture({
                    ...texture,
                    blend:
                      texture.textureDefId === ""
                        ? null
                        : selectedTexture?.blend ?? null,
                  });
                  setEditMode("Blocks");
                }}
                onBlendSelected={(blend) =>
                  setSelectedTexture((current) =>
                    current ? { ...current, blend } : null
                  )
                }
              />
            ) : null}
            <GeneratorUI.SelectControl
              label="Block Preset"
              options={options(["Full Blocks", "Quarter Blocks"])}
              value={preset}
              onValueChange={(value) =>
                setPreset(
                  value === "Quarter Blocks" ? "Quarter Blocks" : "Full Blocks"
                )
              }
            />
            <GeneratorUI.RangeControl
              label="Diorama Size"
              min={200}
              max={800}
              step={200}
              value={sizePercent}
              showValue
              onValueChange={setSizePercent}
            />
            <GeneratorUI.SelectControl
              label="Edit Mode"
              options={options(editModes)}
              value={editMode}
              onValueChange={(value) => {
                if (value === "Tabs" || value === "Folds") setEditMode(value);
                else setEditMode("Blocks");
              }}
            />
            <GeneratorUI.BooleanControl
              label="Show Edit Regions"
              checked={showEditRegions}
              onCheckedChange={setShowEditRegions}
            />
            <GeneratorUI.ButtonControl
              label="Add Page"
              onClick={() =>
                setPageCount((current) => Math.min(current + 1, 32))
              }
              color="Green"
            />
            <GeneratorUI.ButtonControl
              label="Remove Page"
              onClick={() =>
                setPageCount((current) => Math.max(1, current - 1))
              }
              color="Red"
            />
            <GeneratorUI.ButtonControl
              label="Clear"
              onClick={clear}
              color="Red"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftDioramaGenerator}
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
