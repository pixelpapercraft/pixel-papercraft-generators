"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  rotationToDegrees,
  type Blend,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RegionClickHandler,
  type RenderContext,
  type SelectedTexture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder";
import { makeTextureVersionRegistry } from "@genroot/generators/_common/textures/customTextureVersionV2";
import {
  blockTextureVersions,
  itemTextureVersions,
} from "@genroot/generators/_common/textures/textureVersions";
import { TexturePickerV3 } from "@genroot/generators/_common/textures/texturePickerV3";

import {
  addFaceTexture,
  applyFaceTransform,
  blockPresets,
  cycleTab,
  defaultFaceTransform,
  defaultSplitSize,
  eraseFaceTexture,
  flips,
  fullSourceRegion,
  getBaseFaceId,
  getFaceId,
  getFaceSource,
  getFaceTransform,
  getWorldUnitsForPreset,
  isBlockPreset,
  isFlip,
  isRotation,
  isTabShape,
  makeEmptyDioramaDocument,
  parseDestinationColumnId,
  parseDestinationRowId,
  parseFaceId,
  parseSourceColumnId,
  parseSourceRowId,
  parseSplitColumnId,
  parseSplitPageId,
  parseSplitRowId,
  parseTransformColumnId,
  parseTransformRowId,
  rotations,
  setColumnWidth,
  setFaceSource,
  setFaceSourceForFaces,
  setFaceTransform,
  setFaceTransformForFaces,
  setPreset,
  setRowHeight,
  toggleFold,
  toggleSplitFace,
  toggleSplitForFaces,
  type DioramaDocument,
  type FaceTransform,
  type Region,
  type SplitSize,
} from "./dioramaDocument";
import {
  getEdgeBoundaryLine,
  getGridDimensions,
  getTotalRowsAcrossPages,
  makeBlockFaceRegions,
  makeBoundaryEdgeRegions,
  makeDestinationColumnHeaderRegions,
  makeDestinationRowHeaderRegions,
  makeEdgeRegions,
  makeFaceRegions,
  makeSourceColumnHeaderRegions,
  makeSourceRowHeaderRegions,
  makeSplitColumnHeaderRegions,
  makeSplitPageHeaderRegions,
  makeSplitRowHeaderRegions,
  makeTransformColumnHeaderRegions,
  makeTransformRowHeaderRegions,
} from "./layout";

import thumbnailImage from "./thumbnail/v3-thumbnail-256.png";
import backgroundImage from "./images/Background.png";
import titleLandscapeImage from "./images/TitleLandscape.png";
import titlePortraitImage from "./images/TitlePortrait.png";

const id = "minecraft-diorama";

const name = "Minecraft Diorama";

const gridOriginX = 42;
const gridOriginY = 41;
const gridAreaWidth = 512;
const gridAreaHeight = 768;

const instructions: InstructionsDef = `
## How to use the Minecraft Diorama Generator?
* In "Blocks" edit mode: select a block texture, then click a face on the grid to place it. Multiple textures can be stacked on the same face by clicking again. Select the eraser in the texture picker, then click a face to remove its most recently placed texture. Use the "Block Preset" dropdown to switch between whole blocks and quarter blocks for finer layouts.
* In "Tabs" edit mode: click an edge to cycle its tab.
* In "Folds" edit mode: click an edge to toggle its fold line.
* In "Source" edit mode: set the Source X/Y/Width/Height sliders to the region of the texture's 16x16 grid you want to show, then click a face to crop it to that region. Click the band above a column or to the left of a row to apply the same crop to every face in it (a column applies across every page).
* In "Destination" edit mode: set the Destination Width/Height sliders, then click a face to resize both its column and row, or click the band above a column / to the left of a row to resize just that column's width or that row's height.
* In "Transform" edit mode: set the Face Rotation/Flip selects, then click a face to rotate/flip it (on top of any rotation/flip already set on its texture in the picker), or click the band above a column / to the left of a row to apply the same transform to every face in it.
* In "Split" edit mode: set the Split Width/Height sliders, then click a face to split it into 4 independently-editable parts. Click an already-split face again to unsplit it (if the sliders match its current split) or resize the split (if they differ). Click the band above a column / to the left of a row / in the corner to split or unsplit every face in that column, row, or page.
* Turn on "Show Edit Regions" to see the clickable edges for the current edit mode.
* Use "+ Add Page" / "- Remove Page" to extend the grid downward across additional print sheets.

This is still an early, dev-only build.
`;

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title Landscape", url: titleLandscapeImage.src },
  { id: "Title Portrait", url: titlePortraitImage.src },
];

// Reversing [...items, ...blocks] orders the dropdown blocks-first, each
// group newest-version-first.
const registry = makeTextureVersionRegistry(
  [...itemTextureVersions, ...blockTextureVersions].slice().reverse()
);

const textures: TextureDef[] = registry.allTextureDefs;

type EditMode =
  | "Blocks"
  | "Tabs"
  | "Folds"
  | "Source"
  | "Destination"
  | "Transform"
  | "Split";

const editModes: EditMode[] = [
  "Blocks",
  "Tabs",
  "Folds",
  "Source",
  "Destination",
  "Transform",
  "Split",
];

function isEditMode(value: string): value is EditMode {
  return editModes.includes(value as EditMode);
}

const editModeOptions = editModes.map((mode) => ({ id: mode, label: mode }));

const editRegionOutlineOptions = {
  color: "#2d9cdb",
  lineDash: [2, 2],
  lineDashOffset: 3,
  width: 1,
};

type DioramaProps = {
  document: DioramaDocument;
  editMode: EditMode;
  showEditRegions: boolean;
  pageCount: number;
};

function drawFaceTexture(
  ctx: RenderContext,
  texture: SelectedTexture,
  source: Region,
  destination: [number, number, number, number]
): void {
  if (texture.textureDefId === "") {
    return;
  }

  const blend: Blend | undefined = texture.blend
    ? { kind: "MultiplyHex", hex: texture.blend }
    : undefined;

  // The face's own source crop (0-16 units) maps onto the texture's actual
  // frame rectangle by the frame's own scale — almost always 1:1 since block
  // textures are 16x16, but this stays correct for a differently-sized
  // custom atlas frame too.
  const [frameX, frameY, frameWidth, frameHeight] = texture.frame.rectangle;
  const scaleX = frameWidth / 16;
  const scaleY = frameHeight / 16;
  const [sourceX, sourceY, sourceWidth, sourceHeight] = source;
  const croppedSource: [number, number, number, number] = [
    frameX + sourceX * scaleX,
    frameY + sourceY * scaleY,
    sourceWidth * scaleX,
    sourceHeight * scaleY,
  ];

  ctx.drawTexture(texture.textureDefId, croppedSource, destination, {
    rotate: rotationToDegrees(texture.rotation),
    flip: texture.flip,
    blend,
  });
}

const render = (ctx: RenderContext, props: DioramaProps): void => {
  // Each page fits as many rows as its own row heights allow, starting from
  // wherever the previous page left off — no longer a constant rowsPerPage,
  // since a resized row changes how many rows fit on the page it's on.
  let rowOffset = 0;

  for (let pageIndex = 0; pageIndex < props.pageCount; pageIndex += 1) {
    ctx.usePage(`Page ${pageIndex + 1}`);
    ctx.fillBackgroundColorWithWhite();
    ctx.drawImage("Background", [0, 0]);

    const { rows: rowsThisPage } = getGridDimensions({
      pageWidth: gridAreaWidth,
      pageHeight: gridAreaHeight,
      document: props.document,
      rowOffset,
    });

    // Split-aware: a split face contributes its 4 part regions here instead
    // of one whole-face region, so texture drawing (unconditional, below)
    // always addresses a split face's parts individually, and so do
    // Blocks/Source/Transform/Split's own click regions. Destination mode
    // is the one exception — it always resizes the whole column/row
    // regardless of split state, so it defines its click regions from the
    // separate whole-face `makeFaceRegions` call further down instead.
    const blockFaceRegions = makeBlockFaceRegions({
      originX: gridOriginX,
      originY: gridOriginY,
      pageWidth: gridAreaWidth,
      pageHeight: gridAreaHeight,
      document: props.document,
      rowOffset,
    });

    blockFaceRegions.forEach(({ id: faceId, region }) => {
      if (
        props.editMode === "Blocks" ||
        props.editMode === "Source" ||
        props.editMode === "Transform" ||
        props.editMode === "Split"
      ) {
        ctx.defineRegion(region, faceId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      }
      const source = getFaceSource(props.document, faceId);
      const transform = getFaceTransform(props.document, faceId);
      const stack = props.document.faceTextures[faceId] ?? [];
      stack.forEach((texture) =>
        drawFaceTexture(
          ctx,
          applyFaceTransform(texture, transform),
          source,
          region
        )
      );
    });

    if (props.editMode === "Destination") {
      makeFaceRegions({
        originX: gridOriginX,
        originY: gridOriginY,
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document: props.document,
        rowOffset,
      }).forEach(({ id: faceId, region }) => {
        ctx.defineRegion(region, faceId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      });
    }

    if (props.editMode === "Source") {
      // Column bands bulk-apply across the whole document, so they only need
      // to appear once, on the first page, rather than once per page.
      if (pageIndex === 0) {
        makeSourceColumnHeaderRegions({
          originX: gridOriginX,
          originY: gridOriginY,
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document: props.document,
        }).forEach(({ id: headerId, region }) => {
          ctx.defineRegion(region, headerId);
          if (props.showEditRegions) {
            ctx.drawRectangle(region, editRegionOutlineOptions);
          }
        });
      }

      makeSourceRowHeaderRegions({
        originX: gridOriginX,
        originY: gridOriginY,
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document: props.document,
        rowOffset,
      }).forEach(({ id: headerId, region }) => {
        ctx.defineRegion(region, headerId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      });
    }

    if (props.editMode === "Destination") {
      // Column width is shared by every page, so its bulk-apply band only
      // needs to appear once, on the first page — same reasoning as Source's
      // own column header above.
      if (pageIndex === 0) {
        makeDestinationColumnHeaderRegions({
          originX: gridOriginX,
          originY: gridOriginY,
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document: props.document,
        }).forEach(({ id: headerId, region }) => {
          ctx.defineRegion(region, headerId);
          if (props.showEditRegions) {
            ctx.drawRectangle(region, editRegionOutlineOptions);
          }
        });
      }

      makeDestinationRowHeaderRegions({
        originX: gridOriginX,
        originY: gridOriginY,
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document: props.document,
        rowOffset,
      }).forEach(({ id: headerId, region }) => {
        ctx.defineRegion(region, headerId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      });
    }

    if (props.editMode === "Transform") {
      // Column bands bulk-apply across the whole document, same reasoning as
      // Source's own column header above.
      if (pageIndex === 0) {
        makeTransformColumnHeaderRegions({
          originX: gridOriginX,
          originY: gridOriginY,
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document: props.document,
        }).forEach(({ id: headerId, region }) => {
          ctx.defineRegion(region, headerId);
          if (props.showEditRegions) {
            ctx.drawRectangle(region, editRegionOutlineOptions);
          }
        });
      }

      makeTransformRowHeaderRegions({
        originX: gridOriginX,
        originY: gridOriginY,
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document: props.document,
        rowOffset,
      }).forEach(({ id: headerId, region }) => {
        ctx.defineRegion(region, headerId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      });
    }

    if (props.editMode === "Split") {
      // Column bands bulk-apply across the whole document, same reasoning as
      // Source's own column header above.
      if (pageIndex === 0) {
        makeSplitColumnHeaderRegions({
          originX: gridOriginX,
          originY: gridOriginY,
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document: props.document,
        }).forEach(({ id: headerId, region }) => {
          ctx.defineRegion(region, headerId);
          if (props.showEditRegions) {
            ctx.drawRectangle(region, editRegionOutlineOptions);
          }
        });
      }

      makeSplitRowHeaderRegions({
        originX: gridOriginX,
        originY: gridOriginY,
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document: props.document,
        rowOffset,
      }).forEach(({ id: headerId, region }) => {
        ctx.defineRegion(region, headerId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      });

      // A third, page-scoped bulk-apply tier unique to Split mode — one
      // small corner band that toggles every face on the current page.
      makeSplitPageHeaderRegions({
        originX: gridOriginX,
        originY: gridOriginY,
        document: props.document,
        rowOffset,
      }).forEach(({ id: headerId, region }) => {
        ctx.defineRegion(region, headerId);
        if (props.showEditRegions) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      });
    }

    const edgeRegions = makeEdgeRegions({
      originX: gridOriginX,
      originY: gridOriginY,
      pageWidth: gridAreaWidth,
      pageHeight: gridAreaHeight,
      document: props.document,
      rowOffset,
    });

    const boundaryEdgeRegions = makeBoundaryEdgeRegions({
      originX: gridOriginX,
      originY: gridOriginY,
      pageWidth: gridAreaWidth,
      pageHeight: gridAreaHeight,
      document: props.document,
      rowOffset,
    });

    [...edgeRegions, ...boundaryEdgeRegions].forEach(
      ({ id: edgeId, region, orientation }) => {
        if (props.editMode === "Tabs" || props.editMode === "Folds") {
          ctx.defineRegion(region, edgeId);
        }

        const tabShape = props.document.tabs[edgeId];
        if (isTabShape(tabShape)) {
          ctx.drawTab(region, orientation, { tabShape });
        }

        if (props.document.folds[edgeId]) {
          ctx.drawFoldLine(...getEdgeBoundaryLine(orientation, region));
        }

        if (
          props.showEditRegions &&
          (props.editMode === "Tabs" || props.editMode === "Folds")
        ) {
          ctx.drawRectangle(region, editRegionOutlineOptions);
        }
      }
    );

    ctx.drawImage("Title Portrait", [0, 0]);

    rowOffset += rowsThisPage;
  }
};

const minecraftDioramaGenerator: Generator<DioramaProps> = {
  id,
  name,
  images,
  textures,
  render,
};

const presetOptions = blockPresets.map((preset) => ({
  id: preset,
  label: preset,
}));

const rotationOptions = rotations.map((rotation) => ({
  id: rotation,
  label: `${rotationToDegrees(rotation)}°`,
}));

const flipOptions = flips.map((flip) => ({ id: flip, label: flip }));

function Component(): JSX.Element {
  const [document, setDocument] = React.useState<DioramaDocument>(
    makeEmptyDioramaDocument()
  );
  const [versionId, setVersionId] = React.useState(
    registry.versionIds[0] ?? ""
  );
  const [selectedTexture, setSelectedTexture] =
    React.useState<SelectedTexture | null>(null);
  const [blend, setBlend] = React.useState<string | null>(null);
  const [editMode, setEditMode] = React.useState<EditMode>("Blocks");
  const [showEditRegions, setShowEditRegions] = React.useState(true);
  const [pageCount, setPageCount] = React.useState(1);
  const [currentSource, setCurrentSource] =
    React.useState<Region>(fullSourceRegion);
  const [currentDestinationWidth, setCurrentDestinationWidth] = React.useState(
    getWorldUnitsForPreset("Full Blocks")
  );
  const [currentDestinationHeight, setCurrentDestinationHeight] =
    React.useState(getWorldUnitsForPreset("Full Blocks"));
  const [currentTransform, setCurrentTransform] =
    React.useState<FaceTransform>(defaultFaceTransform);
  const [currentSplit, setCurrentSplit] =
    React.useState<SplitSize>(defaultSplitSize);
  const textureVersion = registry.findVersion(versionId);

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    if (editMode === "Tabs") {
      setDocument((current) => cycleTab(current, regionId));
      return;
    }
    if (editMode === "Folds") {
      setDocument((current) => toggleFold(current, regionId));
      return;
    }
    if (editMode === "Source") {
      const { columns } = getGridDimensions({
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document,
      });

      const column = parseSourceColumnId(regionId);
      if (column !== null) {
        const totalRows = getTotalRowsAcrossPages({
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document,
          pageCount,
        });
        const faceIds = Array.from({ length: totalRows }, (_, row) =>
          getFaceId(column, row)
        );
        setDocument((current) =>
          setFaceSourceForFaces(current, faceIds, currentSource)
        );
        return;
      }

      const row = parseSourceRowId(regionId);
      if (row !== null) {
        const faceIds = Array.from({ length: columns }, (_, column) =>
          getFaceId(column, row)
        );
        setDocument((current) =>
          setFaceSourceForFaces(current, faceIds, currentSource)
        );
        return;
      }

      setDocument((current) => setFaceSource(current, regionId, currentSource));
      return;
    }
    if (editMode === "Destination") {
      const column = parseDestinationColumnId(regionId);
      if (column !== null) {
        setDocument((current) =>
          setColumnWidth(current, column, currentDestinationWidth)
        );
        return;
      }

      const row = parseDestinationRowId(regionId);
      if (row !== null) {
        setDocument((current) =>
          setRowHeight(current, row, currentDestinationHeight)
        );
        return;
      }

      const face = parseFaceId(regionId);
      if (face) {
        setDocument((current) =>
          setRowHeight(
            setColumnWidth(current, face.column, currentDestinationWidth),
            face.row,
            currentDestinationHeight
          )
        );
      }
      return;
    }
    if (editMode === "Transform") {
      const { columns } = getGridDimensions({
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document,
      });

      const column = parseTransformColumnId(regionId);
      if (column !== null) {
        const totalRows = getTotalRowsAcrossPages({
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document,
          pageCount,
        });
        const faceIds = Array.from({ length: totalRows }, (_, row) =>
          getFaceId(column, row)
        );
        setDocument((current) =>
          setFaceTransformForFaces(current, faceIds, currentTransform)
        );
        return;
      }

      const row = parseTransformRowId(regionId);
      if (row !== null) {
        const faceIds = Array.from({ length: columns }, (_, column) =>
          getFaceId(column, row)
        );
        setDocument((current) =>
          setFaceTransformForFaces(current, faceIds, currentTransform)
        );
        return;
      }

      setDocument((current) =>
        setFaceTransform(current, regionId, currentTransform)
      );
      return;
    }
    if (editMode === "Split") {
      const { columns } = getGridDimensions({
        pageWidth: gridAreaWidth,
        pageHeight: gridAreaHeight,
        document,
      });

      const column = parseSplitColumnId(regionId);
      if (column !== null) {
        const totalRows = getTotalRowsAcrossPages({
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document,
          pageCount,
        });
        const faceIds = Array.from({ length: totalRows }, (_, row) =>
          getFaceId(column, row)
        );
        setDocument((current) =>
          toggleSplitForFaces(current, faceIds, currentSplit)
        );
        return;
      }

      const row = parseSplitRowId(regionId);
      if (row !== null) {
        const faceIds = Array.from({ length: columns }, (_, column) =>
          getFaceId(column, row)
        );
        setDocument((current) =>
          toggleSplitForFaces(current, faceIds, currentSplit)
        );
        return;
      }

      const page = parseSplitPageId(regionId);
      if (page !== null) {
        const { rows: pageRows } = getGridDimensions({
          pageWidth: gridAreaWidth,
          pageHeight: gridAreaHeight,
          document,
          rowOffset: page,
        });
        const faceIds = Array.from({ length: columns }, (_, column) =>
          Array.from({ length: pageRows }, (_, row) =>
            getFaceId(column, page + row)
          )
        ).flat();
        setDocument((current) =>
          toggleSplitForFaces(current, faceIds, currentSplit)
        );
        return;
      }

      const baseFaceId = getBaseFaceId(regionId);
      if (baseFaceId) {
        setDocument((current) =>
          toggleSplitFace(current, baseFaceId, currentSplit)
        );
      }
      return;
    }
    if (!selectedTexture) {
      return;
    }
    setDocument((current) =>
      selectedTexture.textureDefId === ""
        ? eraseFaceTexture(current, regionId)
        : addFaceTexture(current, regionId, { ...selectedTexture, blend })
    );
  };

  const props: DioramaProps = {
    document,
    editMode,
    showEditRegions,
    pageCount,
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
              label="Edit Mode"
              options={editModeOptions}
              value={editMode}
              onValueChange={(value) => {
                if (isEditMode(value)) {
                  setEditMode(value);
                }
              }}
            />
            <GeneratorUI.BooleanControl
              label="Show Edit Regions"
              checked={showEditRegions}
              onCheckedChange={setShowEditRegions}
            />
            <GeneratorUI.TextControl>
              Pages: {pageCount}
            </GeneratorUI.TextControl>
            <GeneratorUI.ButtonControl
              label="+ Add Page"
              color="Green"
              onClick={() => setPageCount((count) => count + 1)}
            />
            <GeneratorUI.ButtonControl
              label="- Remove Page"
              color="Red"
              onClick={() => setPageCount((count) => Math.max(1, count - 1))}
            />
            {editMode === "Blocks" ? (
              <>
                <GeneratorUI.SelectControl
                  label="Block Preset"
                  options={presetOptions}
                  value={document.preset}
                  onValueChange={(value) => {
                    if (!isBlockPreset(value)) {
                      return;
                    }
                    setDocument((current) => setPreset(current, value));
                  }}
                />
                <GeneratorUI.SelectControl
                  label="Version"
                  options={registry.versionIds.map((id) => ({ id, label: id }))}
                  value={versionId}
                  onValueChange={(value) => {
                    setVersionId(value);
                    setSelectedTexture((current) =>
                      current?.textureDefId === value ? current : null
                    );
                  }}
                />
                {textureVersion ? (
                  <TexturePickerV3
                    textureVersion={textureVersion}
                    blend={blend}
                    onTextureSelected={setSelectedTexture}
                    onBlendSelected={setBlend}
                  />
                ) : null}
              </>
            ) : null}
            {editMode === "Source" ? (
              <>
                <GeneratorUI.RangeControl
                  label="Source X"
                  min={0}
                  max={16}
                  step={0.5}
                  showValue
                  value={currentSource[0]}
                  onValueChange={(value) =>
                    setCurrentSource(([, y, width, height]) => [
                      value,
                      y,
                      width,
                      height,
                    ])
                  }
                />
                <GeneratorUI.RangeControl
                  label="Source Y"
                  min={0}
                  max={16}
                  step={0.5}
                  showValue
                  value={currentSource[1]}
                  onValueChange={(value) =>
                    setCurrentSource(([x, , width, height]) => [
                      x,
                      value,
                      width,
                      height,
                    ])
                  }
                />
                <GeneratorUI.RangeControl
                  label="Source Width"
                  min={0.5}
                  max={16}
                  step={0.5}
                  showValue
                  value={currentSource[2]}
                  onValueChange={(value) =>
                    setCurrentSource(([x, y, , height]) => [
                      x,
                      y,
                      value,
                      height,
                    ])
                  }
                />
                <GeneratorUI.RangeControl
                  label="Source Height"
                  min={0.5}
                  max={16}
                  step={0.5}
                  showValue
                  value={currentSource[3]}
                  onValueChange={(value) =>
                    setCurrentSource(([x, y, width]) => [x, y, width, value])
                  }
                />
              </>
            ) : null}
            {editMode === "Destination" ? (
              <>
                <GeneratorUI.RangeControl
                  label="Destination Width"
                  min={1}
                  max={32}
                  step={1}
                  showValue
                  value={currentDestinationWidth}
                  onValueChange={setCurrentDestinationWidth}
                />
                <GeneratorUI.RangeControl
                  label="Destination Height"
                  min={1}
                  max={32}
                  step={1}
                  showValue
                  value={currentDestinationHeight}
                  onValueChange={setCurrentDestinationHeight}
                />
              </>
            ) : null}
            {editMode === "Transform" ? (
              <>
                <GeneratorUI.SelectControl
                  label="Face Rotation"
                  options={rotationOptions}
                  value={currentTransform.rotation}
                  onValueChange={(value) => {
                    if (isRotation(value)) {
                      setCurrentTransform((current) => ({
                        ...current,
                        rotation: value,
                      }));
                    }
                  }}
                />
                <GeneratorUI.SelectControl
                  label="Face Flip"
                  options={flipOptions}
                  value={currentTransform.flip}
                  onValueChange={(value) => {
                    if (isFlip(value)) {
                      setCurrentTransform((current) => ({
                        ...current,
                        flip: value,
                      }));
                    }
                  }}
                />
              </>
            ) : null}
            {editMode === "Split" ? (
              <>
                <GeneratorUI.RangeControl
                  label="Split Width"
                  min={0.5}
                  max={15.5}
                  step={0.5}
                  showValue
                  value={currentSplit.width}
                  onValueChange={(value) =>
                    setCurrentSplit((current) => ({ ...current, width: value }))
                  }
                />
                <GeneratorUI.RangeControl
                  label="Split Height"
                  min={0.5}
                  max={15.5}
                  step={0.5}
                  showValue
                  value={currentSplit.height}
                  onValueChange={(value) =>
                    setCurrentSplit((current) => ({
                      ...current,
                      height: value,
                    }))
                  }
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftDioramaGenerator}
            props={props}
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
