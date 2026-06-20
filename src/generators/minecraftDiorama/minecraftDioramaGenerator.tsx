"use client";

import type {
  GeneratorDef,
  HistoryDef,
  ImageDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import {
  decodeSelectedTexture,
  encodeSelectedTexture,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
import {
  parseAtlas,
  updateCustomTextureAtlas,
  updateCustomTextureUrl,
} from "../_common/textures/customTextureVersion";
import {
  allTextureDefs,
  versionIdsBlocksFirst as versionIds,
} from "../_common/textures/textureVersions";
import { TexturePicker } from "../_common/plugins/texturePicker/texturePicker";
import { blockTintChoiceGroups } from "../_common/tintSelector/tints";
import { drawBlocks } from "./editModes/blocks";
import {
  defineAndGetPresetInput,
  drawDestinationRegions,
  getCurrentDestination,
} from "./editModes/destination";
import { drawFolds } from "./editModes/folds";
import {
  defaultSource,
  getColumnCountThatFits,
  getDefaultDestinationForPreset,
  getDioramaDocument,
  getRowCountThatFits,
  makeEmptyDioramaDocument,
  setDioramaDocument,
  defaultTransform,
  defaultSplit,
  type DioramaOptions,
  type EditMode,
} from "./editModes/shared";
import { drawSourceRegions, getCurrentSource } from "./editModes/source";
import { drawSplitRegions, getCurrentSplit } from "./editModes/split";
import { drawTabs } from "./editModes/tabs";
import {
  drawTransformRegions,
  getCurrentTransform,
} from "./editModes/transform";

import thumbnailImage from "./thumbnail/v3-thumbnail-256.png";
import backgroundImage from "./images/Background.png";
import titleLandscapeImage from "./images/TitleLandscape.png";
import titlePortraitImage from "./images/TitlePortrait.png";

const id = "minecraft-diorama";

const name = "Minecraft Diorama";

const maxDioramaFaces = 16384;
const maxDioramaPages = 512;
const pageCountInputId = "Diorama Page Count";
const pagesAcrossInputId = "Pages Across";

const history: HistoryDef = [
  "24 Jan 2024 NinjolasNJM - Initial ReScript version.",
  "May 2026 NinjolasNJM - Plug generator into the TypeScript app.",
];

const instructions = `
## How to use the Minecraft Diorama Generator?
* The Diorama Generator is a generator designed as an advanced version of the block generator, to aide in the creation of any papercraft using block textures, in particular dioramas.
* It contains essentially a blank canvas to place block textures on with great control over how they are placed, and to annotate with tabs, folds, and the like.
* With a bit of effort, it can be used to create an accurate papercraft of any block model, and make custom diorama designs in an easy and accessible way.

### Grid and Pages
* Unlike the block generator, the diorama generator's faces are arraned as a grid across the whole page.
* Using the "Diorama Size" input, the grid's base size can be changed.
* Using the "Add Page" and "Remove Page" buttons, pages can be added and removed from the diorama.
* The faces of the grid will be remembered even if a page is removed, or if the scale is enlarged so that the face is no longer visible.
* Using the "Fit Pages to Design" button, the amount of pages can be set to include all faces that have been filled.
* This can be used to draw a design at a smaller scale on one page, then by scaling up to a larger size that the design would be printed as, the design will automatically be split into multiple pages with the same information.
* Using the "Landscape Mode" toggle, the aspect ratio of pages can be changed to one that is landscape instead of portrait.
* Using the "Block Preset" dropdown, the "Quarter Blocks" preset can be accessed which will change the grid to be split into quarters of blocks, allowing for the convenient setup of designs that will use stairs and slabs. There may be more presets in the future.

### Edit Modes
The Diorama Generator has a number of different edit modes, which change what the clickable regions on the page will do.
The "Show Edit Regions" toggle will show an outline of each clickable region, for the sake of visibility.

## Blocks Edit Mode 
* Click in the texture picker to select a block texture. 
* Block textures can be rotated, flipped, and tinted different colors.
* Click the regions on the page to add the selected texture to the page.
* Multiple textures can be added to the same block face.
* Click the erase button in the texture picker to clear the selected texture. Clicking a face without a specified texture will remove the last texture placed on it.
* Textures from different versions can be selected from the "Versions" dropdown menu. Custom textures can also be added from files.

## Tabs Edit Mode
* Click the regions on the page to place a tab.
* Clicking the tab will cycle through different types of tabs, enabling the creation of tabs that are wider than one block face.

## Folds Edit Mode
* Click the regions on the page to place a fold.
* When "Show Edit Regions" is enabled, the folds will temporarily appear red, for the sake of visibility.

## Source Edit Mode
* Source Mode allows for the changing of which part of the selected texture will be drawn on the face.
* The source x, y, width and height can be changed using the range inputs.
* Click the regions on the page to change the source of a chosen face.
* For example, by setting y to 8 and height to 8, and clicking on a face, then whatever texture is placed on that face will draw only the bottom half of the texture on the face.
* In Source Mode, there are additional regions on the top and left side of every row and column. Clicking them will set the source of every face in the chosen row or column.

## Destination Edit Mode
* Destination Mode allows for changing width and height of faces. In combination with the Source Mode, it can be used to make faces of custom models.
* The destination width and height can be changed using the range inputs.
* Click the regions on the page to change the destination of a chosen face's row and column. Every face in the same row as the chosen face will have its height changed, and every face in the same column will have its width changed.
* For example, by setting the destination height to 8, and clicking on a face, that row of faces will become half the height of a usual row. In combination with the example given in the Source Edit Mode section, this can be used to create the side faces of slabs.
* In Destination Mode, there are additional regions on the top and left side of every row and column. Clicking them will set the destination of every face in the chosen row or column.

## Transform Edit Mode
* Transform Mode allows for rotating and flipping faces. This is useful in combination with the other modes for some block models, and for creating accurate exported templates using the diorama generator.
* The rotation and flip can be changed using the select inputs.
* Click the regions on the page to change the rotation and flip of a chosen face.

## Split Edit Mode
* Split Mode splits a face into four smaller editable faces without changing adjacent rows or columns.
* The split width and height can be changed using the range inputs.
* Click an unsplit face to split it. Click any part of a split face to turn it back into one face.
* In Split Mode, there are additional regions on the top and left side of every row and column. Clicking them will split, resize, or unsplit the chosen row, column, or whole visible page.

### Saving and Loading
* Using the "Export JSON" button, the state the generator is in can be exported as a .json file.
* Using the "Import JSON" button, a generator's state can be loaded in from a .json file.
* This means that a large multipage diorama design can be saved, shared, and edited later, or that a template that could be useful with a number of blocks can be saved and shared around.
* Exporting and Importing is also available for all generators now, so go crazy with it!
`;

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title Landscape", url: titleLandscapeImage.src },
  { id: "Title Portrait", url: titlePortraitImage.src },
];

const textures = allTextureDefs;

function drawTexturePicker(generator: Generator, versionId: string | null) {
  const currentTextureJson = generator.getStringInputValue(
    "CurrentBlockTexture"
  );
  const currentTexture = currentTextureJson
    ? decodeSelectedTexture(currentTextureJson)
    : null;

  generator.defineCustomStringInput("CurrentBlockTexture", (onChange) => {
    if (!versionId) {
      return null;
    }

    return (
      <TexturePicker
        versionId={versionId}
        selectedTexture={currentTexture}
        tintChoiceGroups={blockTintChoiceGroups}
        onChange={(selectedTexture) => {
          onChange(encodeSelectedTexture(selectedTexture));
          generator.setSelectInputValue("Edit Mode", "Blocks");
        }}
      />
    );
  });
}

function defineCustomTextureInput(
  generator: Generator,
  versionId: string | null
) {
  if (versionId !== "custom") {
    return;
  }

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
  if (!customTexture) {
    return;
  }

  const textureUrl = customTexture.imageWithCanvas.image.src;
  if (customAtlas && customAtlas.frames.length > 0) {
    updateCustomTextureAtlas(textureUrl, customAtlas);
  } else {
    updateCustomTextureUrl(textureUrl);
  }
}

function drawDiorama(generator: Generator, options: DioramaOptions) {
  drawBlocks(generator, options);
  drawTabs(generator, options);
  drawSourceRegions(generator, options);
  drawDestinationRegions(generator, options);
  drawTransformRegions(generator, options);
  drawSplitRegions(generator, options);
  drawFolds(generator, options);
}

function getDioramaDimensions(generator: Generator) {
  const dioramaSize = generator.defineAndGetSelectInput("Diorama Size", [
    "800%",
    "400%",
    "200%",
    "Custom",
  ]);

  const dioramaWidth =
    dioramaSize === "Custom"
      ? generator.defineAndGetRangeInput("Diorama Width", {
          min: 100,
          max: 1600,
          value: 800,
          step: 50,
          showValue: true,
        })
      : parseInt(dioramaSize ?? "800", 10);

  return {
    dioramaSize,
    dioramaWidth,
    dioramaHeight: dioramaWidth,
  };
}

function getDioramaPageLayout(
  generator: Generator,
  document: ReturnType<typeof getDioramaDocument>,
  columns: number,
  rows: number
) {
  const facesPerPage = Math.max(1, columns * rows);
  const maxPageCount = Math.max(
    1,
    Math.min(maxDioramaPages, Math.floor(maxDioramaFaces / facesPerPage))
  );
  const requestedPageCount = Math.max(
    1,
    Math.min(
      Math.round(generator.getNumberVariable(pageCountInputId) ?? 1),
      maxPageCount
    )
  );
  generator.setNumberVariable(pageCountInputId, requestedPageCount);
  const currentPagesAcross = Math.max(
    1,
    Math.min(
      Math.round(
        generator.getNumberVariable(pagesAcrossInputId) ?? requestedPageCount
      ),
      requestedPageCount
    )
  );
  generator.setNumberVariable(pagesAcrossInputId, currentPagesAcross);

  generator.defineText(`Pages: ${requestedPageCount} / ${maxPageCount}`);
  const canAddPage = requestedPageCount < maxPageCount;
  const canRemovePage = requestedPageCount > 1;

  generator.defineButtonInput(
    "Add Page",
    () => {
      const nextPageCount = canAddPage
        ? Math.min(requestedPageCount + 1, maxPageCount)
        : requestedPageCount;
      generator.setNumberVariable(pageCountInputId, nextPageCount);
      if (currentPagesAcross >= requestedPageCount) {
        generator.setNumberVariable(pagesAcrossInputId, nextPageCount);
      }
    },
    canAddPage ? "Green" : "Gray"
  );
  generator.defineButtonInput(
    "Remove Page",
    () => {
      const nextPageCount = canRemovePage
        ? Math.max(1, requestedPageCount - 1)
        : requestedPageCount;
      generator.setNumberVariable(pageCountInputId, nextPageCount);
      generator.setNumberVariable(
        pagesAcrossInputId,
        Math.min(currentPagesAcross, nextPageCount)
      );
    },
    canRemovePage ? "Red" : "Gray"
  );
  generator.defineButtonInput(
    "Fit Pages to Design",
    () => {
      const fit = getPageLayoutForDesign(
        generator,
        document,
        columns,
        rows,
        maxPageCount
      );
      generator.setNumberVariable(pageCountInputId, fit.pageCount);
      generator.setNumberVariable(pagesAcrossInputId, fit.pageColumns);
    },
    "Blue"
  );

  return {
    pageCount: requestedPageCount,
    pageColumns: currentPagesAcross,
  };
}

function getPageLayoutForDesign(
  generator: Generator,
  document: ReturnType<typeof getDioramaDocument>,
  columns: number,
  rows: number,
  maxPageCount: number
) {
  const positions = getOccupiedFacePositions(generator, document);
  if (positions.length === 0) {
    return { pageCount: 1, pageColumns: 1 };
  }

  const pageColumns = Math.max(
    1,
    Math.max(
      ...positions.map((position) => Math.floor(position.column / columns))
    ) + 1
  );
  const lastPageIndex = Math.max(
    ...positions.map((position) => {
      const pageColumn = Math.max(0, Math.floor(position.column / columns));
      const pageRow = Math.max(0, Math.floor(position.row / rows));
      return pageRow * pageColumns + pageColumn;
    })
  );
  const pageCount = Math.min(maxPageCount, lastPageIndex + 1);

  return {
    pageCount,
    pageColumns: Math.min(pageColumns, pageCount),
  };
}

function getOccupiedFacePositions(
  generator: Generator,
  document: ReturnType<typeof getDioramaDocument>
): Array<{ column: number; row: number }> {
  return [
    ...Object.keys(document.sources),
    ...Object.keys(document.transforms),
    ...Object.keys(document.destinationColumns).map((column) => `${column} 0`),
    ...Object.keys(document.destinationRows).map((row) => `0 ${row}`),
    ...Object.keys(document.splits),
    ...getOccupiedVariableFaceIds(generator),
  ]
    .map(getFacePositionFromId)
    .filter(
      (position): position is { column: number; row: number } =>
        position !== null
    );
}

function getOccupiedVariableFaceIds(generator: Generator): string[] {
  return Array.from(generator.model.values.variables.entries())
    .filter(([id, variable]) => {
      if (/^BlockFace-?\d+ -?\d+[ABCD]?$/.test(id)) {
        return (
          variable.kind === "String" &&
          variable.value !== "" &&
          variable.value !== "[]"
        );
      }
      if (/^Tabs(?:North|South|East|West)-?\d+ -?\d+[ABCD]?$/.test(id)) {
        return variable.kind === "String" && variable.value !== "0";
      }
      if (/^Folds(?:North|South|East|West)-?\d+ -?\d+[ABCD]?$/.test(id)) {
        return variable.kind === "Boolean" && variable.value;
      }
      return false;
    })
    .map(([id]) => id);
}

function getFacePositionFromId(
  id: string
): { column: number; row: number } | null {
  const match =
    /^(?:BlockFace|Tabs(?:North|South|East|West)|Folds(?:North|South|East|West))?(-?\d+) (-?\d+)(?:[ABCD])?$/.exec(
      id
    );
  if (!match) {
    return null;
  }

  return {
    column: parseInt(match[1] ?? "0", 10),
    row: parseInt(match[2] ?? "0", 10),
  };
}

function clearDioramaEditMode(
  generator: Generator,
  document: ReturnType<typeof getDioramaDocument>,
  editMode: EditMode | string | null
): void {
  switch (editMode) {
    case "Blocks":
      clearVariablesMatching(generator, /^BlockFace-?\d+ -?\d+[ABCD]?$/);
      break;
    case "Tabs":
      clearVariablesMatching(
        generator,
        /^Tabs(?:North|South|East|West)-?\d+ -?\d+[ABCD]?$/
      );
      break;
    case "Folds":
      clearVariablesMatching(
        generator,
        /^Folds(?:North|South|East|West)-?\d+ -?\d+[ABCD]?$/
      );
      break;
    case "Source":
      setDioramaDocument(generator, {
        ...document,
        sources: {},
      });
      break;
    case "Destination":
      setDioramaDocument(generator, {
        ...document,
        destinationColumns: {},
        destinationRows: {},
      });
      break;
    case "Transform":
      setDioramaDocument(generator, {
        ...document,
        transforms: {},
      });
      break;
    case "Split":
      setDioramaDocument(generator, {
        ...document,
        splits: {},
      });
      break;
  }
}

function clearVariablesMatching(generator: Generator, idPattern: RegExp): void {
  Array.from(generator.model.values.variables.keys()).forEach((id) => {
    if (idPattern.test(id)) {
      generator.model.values.variables.delete(id);
    }
  });
}

const script: ScriptDef = (generator: Generator) => {
  generator.defineSelectInput("Version", versionIds);

  const versionId = generator.getSelectInputValue("Version");

  defineCustomTextureInput(generator, versionId);
  drawTexturePicker(generator, versionId);
  const { dioramaSize, dioramaWidth, dioramaHeight } =
    getDioramaDimensions(generator);
  const document = defineAndGetPresetInput(
    generator,
    getDioramaDocument(generator)
  );
  const editMode = generator.defineAndGetSelectInput("Edit Mode", [
    "Blocks",
    "Tabs",
    "Folds",
    "Source",
    "Destination",
    "Transform",
    "Split",
  ]);
  const currentSource =
    editMode === "Source" ? getCurrentSource(generator) : defaultSource;
  const currentDestination =
    editMode === "Destination"
      ? getCurrentDestination(
          generator,
          getDefaultDestinationForPreset(document.preset)
        )
      : getDefaultDestinationForPreset(document.preset);
  const currentTransform =
    editMode === "Transform"
      ? getCurrentTransform(generator)
      : defaultTransform;
  const currentSplit =
    editMode === "Split" ? getCurrentSplit(generator) : defaultSplit;

  const isLandscape = generator.defineAndGetBooleanInput(
    "Landscape Mode",
    false
  );
  const showEditRegions = generator.defineAndGetBooleanInput(
    "Show Edit Regions",
    false
  );

  const ox = 42; //isLandscape ? 37 : 42; ( why was it like that before? did it rotate the other way or something?)
  const oy = 41;
  const baseWidth = isLandscape ? 768 : 512;
  const baseHeight = isLandscape ? 512 : 768;
  const width = Math.round((16 * dioramaWidth) / 100);
  const height = Math.round((16 * dioramaHeight) / 100);
  const columns = getColumnCountThatFits({ baseWidth, width, document });
  const rows = getRowCountThatFits({ baseHeight, height, document });
  const { pageCount, pageColumns } = getDioramaPageLayout(
    generator,
    document,
    columns,
    rows
  );

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const pageColumn = pageIndex % pageColumns;
    const pageRow = Math.floor(pageIndex / pageColumns);
    generator.usePage(pageCount === 1 ? "Page" : `Page ${pageIndex + 1}`, {
      orientation: isLandscape ? "landscape" : "portrait",
    });
    generator.fillBackgroundColorWithWhite();
    generator.drawImage("Background", [0, 0]);

    const dioramaOptions: DioramaOptions = {
      ox,
      oy,
      width,
      height,
      columns,
      rows,
      worldColumnOffset: pageColumn * columns,
      worldRowOffset: pageRow * rows,
      editMode,
      showEditRegions,
      document,
      currentSource,
      currentDestination,
      currentTransform,
      currentSplit,
    };

    drawDiorama(generator, dioramaOptions);

    generator.drawImage(
      isLandscape ? "Title Landscape" : "Title Portrait",
      [0, 0]
    );
  }

  generator.defineCustomStringInput("Diorama Clear Button Break", () => (
    <div />
  ));

  generator.defineButtonInput(
    "Clear Edit Mode",
    () => {
      clearDioramaEditMode(generator, document, editMode);
    },
    "Red"
  );

  generator.defineButtonInput(
    "Clear All",
    () => {
      const currentTextureChoice = generator.getStringInputValue(
        "CurrentBlockTexture"
      );
      const currentVersionId = versionId;
      const currentEditMode = editMode;
      const currentDioramaSize = dioramaSize;
      const currentPageFormat = isLandscape;
      const currentShowEditRegions = showEditRegions;
      const currentSourceX = generator.getNumberVariable("Source X");
      const currentSourceY = generator.getNumberVariable("Source Y");
      const currentSourceWidth = generator.getNumberVariable("Source Width");
      const currentSourceHeight = generator.getNumberVariable("Source Height");
      const currentDestinationWidth =
        generator.getNumberVariable("Destination Width");
      const currentDestinationHeight =
        generator.getNumberVariable("Destination Height");
      const currentFaceRotation =
        generator.getSelectInputValue("Face Rotation");
      const currentFaceFlip = generator.getSelectInputValue("Face Flip");
      const currentSplitWidth = generator.getNumberVariable("Split Width");
      const currentSplitHeight = generator.getNumberVariable("Split Height");
      const currentPreset = document.preset;

      generator.clearAllVariables();

      if (currentTextureChoice) {
        generator.setStringInputValue(
          "CurrentBlockTexture",
          currentTextureChoice
        );
      }
      if (currentVersionId) {
        generator.setSelectInputValue("Version", currentVersionId);
      }
      if (currentEditMode) {
        generator.setSelectInputValue("Edit Mode", currentEditMode);
      }
      if (currentDioramaSize) {
        generator.setSelectInputValue("Diorama Size", currentDioramaSize);
      }
      generator.setBooleanInputValue("Landscape Mode", currentPageFormat);
      generator.setBooleanInputValue(
        "Show Edit Regions",
        currentShowEditRegions
      );
      generator.setNumberVariable(pageCountInputId, 1);
      generator.setNumberVariable(pagesAcrossInputId, 1);
      if (currentSourceX !== null) {
        generator.setNumberVariable("Source X", currentSourceX);
      }
      if (currentSourceY !== null) {
        generator.setNumberVariable("Source Y", currentSourceY);
      }
      if (currentSourceWidth !== null) {
        generator.setNumberVariable("Source Width", currentSourceWidth);
      }
      if (currentSourceHeight !== null) {
        generator.setNumberVariable("Source Height", currentSourceHeight);
      }
      if (currentDestinationWidth !== null) {
        generator.setNumberVariable(
          "Destination Width",
          currentDestinationWidth
        );
      }
      if (currentDestinationHeight !== null) {
        generator.setNumberVariable(
          "Destination Height",
          currentDestinationHeight
        );
      }
      if (currentFaceRotation) {
        generator.setSelectInputValue("Face Rotation", currentFaceRotation);
      }
      if (currentFaceFlip) {
        generator.setSelectInputValue("Face Flip", currentFaceFlip);
      }
      if (currentSplitWidth !== null) {
        generator.setNumberVariable("Split Width", currentSplitWidth);
      }
      if (currentSplitHeight !== null) {
        generator.setNumberVariable("Split Height", currentSplitHeight);
      }
      setDioramaDocument(generator, makeEmptyDioramaDocument(currentPreset));
    },
    "Red"
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
