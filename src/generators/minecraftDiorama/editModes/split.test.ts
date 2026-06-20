import { describe, expect, it } from "vitest";
import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import { drawSplitRegions } from "./split";
import {
  defaultSplit,
  makeEmptyDioramaDocument,
  type DioramaDocument,
  type DioramaOptions,
} from "./shared";

type RegionInput = {
  region: Region;
  onClick: () => void;
};

type MockGenerator = Generator & {
  booleanValues: Map<string, boolean>;
  regionInputs: RegionInput[];
  selectValues: Map<string, string>;
  stringValues: Map<string, string>;
};

function makeGenerator(): MockGenerator {
  const generator = {
    booleanValues: new Map<string, boolean>(),
    regionInputs: [] as RegionInput[],
    selectValues: new Map<string, string>(),
    stringValues: new Map<string, string>(),
    defineRegionInput(region: Region, onClick: () => void) {
      this.regionInputs.push({ region, onClick });
    },
    drawRectangle() {},
    getBooleanInputValue(id: string) {
      return this.booleanValues.get(id) ?? null;
    },
    getSelectInputValue(id: string) {
      return this.selectValues.get(id) ?? null;
    },
    getStringInputValue(id: string) {
      return this.stringValues.get(id) ?? null;
    },
    setBooleanInputValue(id: string, value: boolean) {
      this.booleanValues.set(id, value);
    },
    setSelectInputValue(id: string, value: string) {
      this.selectValues.set(id, value);
    },
    setStringInputValue(id: string, value: string) {
      this.stringValues.set(id, value);
    },
  };

  return generator as unknown as MockGenerator;
}

function makeOptions(options: Partial<DioramaOptions> = {}): DioramaOptions {
  return {
    ox: 42,
    oy: 41,
    width: 128,
    height: 128,
    columns: 1,
    rows: 1,
    worldColumnOffset: 0,
    worldRowOffset: 0,
    editMode: "Split",
    showEditRegions: false,
    document: makeEmptyDioramaDocument(),
    currentSource: [0, 0, 16, 16],
    currentDestination: { width: 16, height: 16 },
    currentTransform: { rotate: 0, flip: "None" },
    currentSplit: defaultSplit,
    ...options,
  };
}

function getSavedDocument(generator: MockGenerator): DioramaDocument {
  const json = generator.stringValues.get("DioramaDocument");
  if (!json) {
    throw new Error("Diorama document was not saved");
  }

  return JSON.parse(json) as DioramaDocument;
}

function clickRegion(generator: MockGenerator, region: Region) {
  const input = generator.regionInputs.find((candidate) =>
    candidate.region.every((value, index) => value === region[index])
  );
  if (!input) {
    throw new Error(`Region not found: ${region.join(",")}`);
  }

  input.onClick();
}

describe("diorama split edit mode", () => {
  it("resizes an existing split unless the selected split size matches", () => {
    const generator = makeGenerator();
    const document = makeEmptyDioramaDocument();
    document.splits = {
      "BlockFace0 0": { width: 8, height: 8, source: [0, 0, 16, 16] },
    };

    drawSplitRegions(
      generator,
      makeOptions({
        document,
        currentSplit: { width: 4, height: 12 },
      })
    );
    generator.regionInputs[0]?.onClick();

    const resizedDocument = getSavedDocument(generator);
    expect(resizedDocument.splits["BlockFace0 0"]).toMatchObject({
      width: 4,
      height: 12,
      source: [0, 0, 16, 16],
    });

    generator.regionInputs = [];
    drawSplitRegions(
      generator,
      makeOptions({
        document: resizedDocument,
        currentSplit: { width: 4, height: 12 },
      })
    );
    generator.regionInputs[0]?.onClick();

    expect(getSavedDocument(generator).splits).toEqual({});
  });

  it("splits every visible frame from the top-left all region", () => {
    const generator = makeGenerator();

    drawSplitRegions(
      generator,
      makeOptions({
        columns: 2,
        rows: 2,
      })
    );
    clickRegion(generator, [10, 9, 32, 32]);

    expect(Object.keys(getSavedDocument(generator).splits).sort()).toEqual([
      "BlockFace0 0",
      "BlockFace0 1",
      "BlockFace1 0",
      "BlockFace1 1",
    ]);
  });

  it("splits a column or row from the edge control regions", () => {
    const columnGenerator = makeGenerator();
    drawSplitRegions(
      columnGenerator,
      makeOptions({
        columns: 2,
        rows: 2,
      })
    );
    clickRegion(columnGenerator, [42, 9, 128, 32]);

    expect(
      Object.keys(getSavedDocument(columnGenerator).splits).sort()
    ).toEqual(["BlockFace0 0", "BlockFace0 1"]);

    const rowGenerator = makeGenerator();
    drawSplitRegions(
      rowGenerator,
      makeOptions({
        columns: 2,
        rows: 2,
      })
    );
    clickRegion(rowGenerator, [10, 41, 32, 128]);

    expect(Object.keys(getSavedDocument(rowGenerator).splits).sort()).toEqual([
      "BlockFace0 0",
      "BlockFace1 0",
    ]);
  });

  it("copies top and left outside edge variables when splitting page-edge faces", () => {
    const generator = makeGenerator();
    generator.selectValues.set("TabsSouth0 -1", "2");
    generator.booleanValues.set("FoldsWest-1 0", true);

    drawSplitRegions(generator, makeOptions());
    generator.regionInputs[0]?.onClick();

    expect(generator.selectValues.get("TabsSouth0 -1A")).toBe("2");
    expect(generator.selectValues.get("TabsSouth0 -1B")).toBe("2");
    expect(generator.booleanValues.get("FoldsWest-1 0A")).toBe(true);
    expect(generator.booleanValues.get("FoldsWest-1 0C")).toBe(true);
  });

  it("moves a full-frame transform onto split children", () => {
    const generator = makeGenerator();
    const document = makeEmptyDioramaDocument();
    document.transforms = {
      "BlockFace0 0": { rotate: 90, flip: "Vertical" },
    };

    drawSplitRegions(generator, makeOptions({ document }));
    generator.regionInputs[0]?.onClick();

    expect(getSavedDocument(generator).transforms).toEqual({
      "BlockFace0 0A": { rotate: 90, flip: "Vertical" },
      "BlockFace0 0B": { rotate: 90, flip: "Vertical" },
      "BlockFace0 0C": { rotate: 90, flip: "Vertical" },
      "BlockFace0 0D": { rotate: 90, flip: "Vertical" },
    });
  });
});
