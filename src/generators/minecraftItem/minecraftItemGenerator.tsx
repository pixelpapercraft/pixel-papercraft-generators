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
import { type Generator } from "@genroot/builder/modules/generator";
import { allTextureDefs, versionIds, findVersion } from "./ui/textureVersions";
import {
  type SelectedTexture,
  encodeSelectedTexture,
  decodeSelectedTexture,
  encodeSelectedTextures,
  decodeSelectedTextures,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
import { TexturePicker } from "./ui/texturePicker";

/** [x, y, width, height] */
type Rectangle = [number, number, number, number];

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
## Item Sizes

The generator supports four standard sizes:

* **Medium** - Good for general items (400% scale)
* **Large** - Good for weapons and tools (700% scale)
* **Small** - Good for blocks as items (200% scale)
* **Full Page** - For fun large size items
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title", url: titleImage.src },
];

const textures: TextureDef[] = [
  ...allTextureDefs,
  {
    id: "CenterFold",
    url: centerFoldTexture.src,
    standardWidth: 2,
    standardHeight: 128,
  },
];

function makeRegionId(textureId: string, rectangle: Rectangle): string {
  const [tileX, tileY] = rectangle;
  return `${textureId}-${tileX}-${tileY}`;
}

function getTileWidth(rectangle: Rectangle): number {
  const [, , tileWidth] = rectangle;
  return tileWidth;
}

const script: ScriptDef = (generator: Generator) => {
  const getSelectInputAsNumberWithDefault = (
    id: string,
    defaultValue: number
  ) => {
    const value = generator.getSelectInputValue(id);
    return value ? parseInt(value, 10) : defaultValue;
  };

  const drawItem = (
    textureId: string,
    rectangle: Rectangle,
    x: number,
    y: number,
    size: number,
    showFolds: boolean
  ) => {
    const tileWidth = getTileWidth(rectangle);
    const regionId = makeRegionId(textureId, rectangle);
    const textureOffset = getSelectInputAsNumberWithDefault(regionId, 0);
    const offset = (textureOffset * size) / tileWidth;
    generator.drawTexture(textureId, rectangle, [x + offset, y, size, size]);
    generator.drawTexture(
      textureId,
      rectangle,
      [x + size - offset, y, size, size],
      {
        flip: "Horizontal",
      }
    );
    if (showFolds) {
      generator.drawTexture(
        "CenterFold",
        [0, 0, 2, size],
        [x + size - 1, y, 2, size]
      );
    }
  };

  const drawItems = ({
    selectedTextureFrames,
    size,
    border,
    maxCols,
    maxRows,
    showFolds,
  }: {
    selectedTextureFrames: SelectedTexture[];
    size: number;
    border: number;
    maxCols: number;
    maxRows: number;
    showFolds: boolean;
  }) => {
    const maxItemsPerPage = maxCols * maxRows;
    const itemCount = selectedTextureFrames.length;
    const pageCount =
      itemCount > 0 ? Math.floor((itemCount - 1) / maxItemsPerPage) + 1 : 0;

    for (let page = 1; page <= pageCount; page++) {
      generator.usePage(`Page ${page}`);
      generator.drawImage("Background", [0, 0]);
      selectedTextureFrames.forEach((selectedTextureFrame, index) => {
        const { textureDefId, frame } = selectedTextureFrame;
        const page = Math.floor(index / maxItemsPerPage) + 1;
        const pageId = `Page ${page}`;
        const col = index % maxCols;
        const row = Math.floor(index / maxCols) % maxRows;
        let x: number;
        let y: number;
        x = col * size * 2;
        x = col > 0 ? x + border * col : x;
        x = border + x;
        y = row * size;
        y = row > 0 ? y + border * row : y;
        y = border + y;
        generator.usePage(pageId);
        drawItem(textureDefId, frame.rectangle, x, y, size, showFolds);
        generator.drawImage("Title", [0, 0]);
      });
    }
  };

  const drawSmall = (
    selectedTextureFrames: SelectedTexture[],
    showFolds: boolean
  ) => {
    drawItems({
      selectedTextureFrames,
      size: 16 * 2,
      border: 25,
      maxCols: 6,
      maxRows: 13,
      showFolds,
    });
  };

  const drawMedium = (
    selectedTextureFrames: SelectedTexture[],
    showFolds: boolean
  ) => {
    drawItems({
      selectedTextureFrames,
      size: 16 * 4,
      border: 15,
      maxCols: 4,
      maxRows: 10,
      showFolds,
    });
  };

  const drawLarge = (
    selectedTextureFrames: SelectedTexture[],
    showFolds: boolean
  ) => {
    drawItems({
      selectedTextureFrames,
      size: 16 * 7,
      border: 20,
      maxCols: 2,
      maxRows: 6,
      showFolds,
    });
  };

  const drawFullPage = (selectedTextureFrames: SelectedTexture[]) => {
    const size = 16 * 8 * 4;
    const border = 30;
    const addedCount = selectedTextureFrames.length;
    const pageCount = addedCount * 2;
    for (let page = 1; page <= pageCount; page++) {
      generator.usePage(`Page ${page}`);
      generator.drawImage("Background", [0, 0]);
    }
    selectedTextureFrames.forEach((selectedTextureFrame, index) => {
      const { textureDefId, frame } = selectedTextureFrame;
      const x = border;
      const y = border;
      const page1 = index * 2 + 1;
      const page1Id = `Page ${page1}`;
      const page2 = index * 2 + 2;
      const page2Id = `Page ${page2}`;
      generator.usePage(page1Id);
      generator.drawTexture(textureDefId, frame.rectangle, [x, y, size, size]);
      generator.drawImage("Title", [0, 0]);
      generator.usePage(page2Id);
      generator.drawTexture(textureDefId, frame.rectangle, [x, y, size, size], {
        flip: "Horizontal",
      });
      generator.drawImage("Title", [0, 0]);
    });
  };

  const sizeSmall = "Small (200%)";
  const sizeMedium = "Medium (400%)";
  const sizeLarge = "Large (700%)";
  const sizeFullPage = "Full Page";
  const sizes = [sizeMedium, sizeLarge, sizeSmall, sizeFullPage];

  // Show a drop down of different texture versions

  generator.defineSelectInput("Version", versionIds);

  const versionId = generator.getSelectInputValue("Version") ?? "";

  // Get the current selected version

  const textureVersion = findVersion(versionId);

  // Show a drop down of sizes

  generator.defineSelectInput("Size", sizes);

  const size = generator.getSelectInputValue("Size");

  // Show the Texture Picker
  // When a texture is selected, we need to encode it into a string variable

  generator.defineCustomStringInput("SelectedTextureFrame", (onChange) => {
    if (!textureVersion) {
      return null;
    }
    return (
      <TexturePicker
        textureVersion={textureVersion}
        onSelect={(selectedTexture) => {
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

  const selectedTextureJson = generator.getStringInputValue(
    "SelectedTextureFrame"
  );
  const selectedTextureFrame: SelectedTexture | null = selectedTextureJson
    ? decodeSelectedTexture(selectedTextureJson)
    : null;

  // Decode the added textures

  const selectedTextureFramesJson = generator.getStringInputValue(
    "SelectedTextureFrames"
  );
  const selectedTextureFrames: SelectedTexture[] = selectedTextureFramesJson
    ? decodeSelectedTextures(selectedTextureFramesJson)
    : [];

  // Show a button which adds the selected texture to the page

  generator.defineButtonInput("Add Item", () => {
    if (selectedTextureFrame) {
      const newSelectedTextureFrames: SelectedTexture[] = [
        ...selectedTextureFrames,
        selectedTextureFrame,
      ];
      generator.setStringInputValue(
        "SelectedTextureFrames",
        encodeSelectedTextures(newSelectedTextureFrames)
      );
    }
  });

  // Show a button which allows the items to be cleared

  generator.defineButtonInput("Clear", () => {
    generator.setStringInputValue(
      "SelectedTextureFrames",
      encodeSelectedTextures([])
    );
  });

  // Show a blank page initially

  if (selectedTextureFrames.length === 0) {
    generator.usePage("Page 1");
    generator.drawImage("Background", [0, 0]);
    generator.drawImage("Title", [0, 0]);
  }

  if (size === sizeSmall) {
    drawSmall(selectedTextureFrames, showFolds);
  } else if (size === sizeMedium) {
    drawMedium(selectedTextureFrames, showFolds);
  } else if (size === sizeLarge) {
    drawLarge(selectedTextureFrames, showFolds);
  } else if (size === sizeFullPage) {
    drawFullPage(selectedTextureFrames);
  } else {
    drawMedium(selectedTextureFrames, showFolds);
  }
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
