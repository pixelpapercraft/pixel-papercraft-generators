"use client";

import React from "react";
import { type Color } from "@genroot/builder/modules/canvasWithContext";
import { Model } from "@genroot/builder/modules/model";
import { Values } from "@genroot/builder/modules/modelValues";
import { Generator } from "@genroot/builder/modules/generator";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import {
  type Position,
  type Rectangle,
  type Region,
  type RegionLegacy,
} from "@genroot/builder/modules/renderers/types";
import { type DrawTextureOptions } from "@genroot/builder/modules/renderers/drawTexture";
import { type DrawRectangeOptions } from "@genroot/builder/modules/renderers/drawRectangle";
import { type LineProps } from "@genroot/builder/modules/renderers/drawLine";
import { type TabOrientation } from "@genroot/builder/modules/renderers/drawTab";
import { type Texture } from "@genroot/builder/modules/texture";
import { Pages } from "@genroot/builder/ui/pages/pages";
import { type GeneratorV2, type RenderContext } from "./generatorV2";
import { loadResourcesV2 } from "./loadResourcesV2";

// Delegates every draw/page method to an internal `Generator`, and
// implements `defineRegion` by storing a region control (via
// `Model.addRegionControl`, reused unchanged) whose `onClick` reads
// `onRegionClick` through a ref — never stale, even though the closure is
// stored once and may outlive the render pass that created it.
// `<Pages>`/`RegionControls` invoke that stored closure unchanged; they
// don't need to know region clicks exist.
class RenderContextAdapter implements RenderContext {
  private readonly gen: Generator;
  private readonly model: Model;
  private readonly onRegionClickRef: React.MutableRefObject<
    ((arg: { regionId: string }) => void) | undefined
  >;

  constructor(
    gen: Generator,
    model: Model,
    onRegionClickRef: React.MutableRefObject<
      ((arg: { regionId: string }) => void) | undefined
    >
  ) {
    this.gen = gen;
    this.model = model;
    this.onRegionClickRef = onRegionClickRef;
  }

  usePage(id: string): void {
    this.gen.usePage(id);
  }

  fillBackgroundColorWithWhite(): void {
    this.gen.fillBackgroundColorWithWhite();
  }

  fillRectangle(rectangle: Rectangle, color: string): void {
    this.gen.fillRectangle(rectangle, color);
  }

  drawRectangle(rectangle: Rectangle, options?: DrawRectangeOptions): void {
    this.gen.drawRectangle(rectangle, options);
  }

  drawImage(id: string, position: [number, number]): void {
    this.gen.drawImage(id, position);
  }

  getTexture(id: string): Texture | null {
    return this.gen.getTexture(id);
  }

  drawTexture(
    id: string,
    source: Region,
    dest: Region,
    options?: DrawTextureOptions
  ): void {
    this.gen.drawTexture(id, source, dest, options);
  }

  /** @deprecated Use `drawTexture()` instead. */
  drawTextureLegacy(
    id: string,
    source: RegionLegacy,
    dest: RegionLegacy,
    options?: DrawTextureOptions
  ): void {
    this.gen.drawTextureLegacy(id, source, dest, options);
  }

  drawLine(p1: Position, p2: Position, options?: LineProps): void {
    this.gen.drawLine(p1, p2, options);
  }

  drawFoldLine(p1: Position, p2: Position): void {
    this.gen.drawFoldLine(p1, p2);
  }

  drawTab(
    rectangle: Rectangle,
    orientation: TabOrientation,
    showFoldLine?: boolean,
    tabAngle?: number
  ): void {
    this.gen.drawTab(rectangle, orientation, showFoldLine, tabAngle);
  }

  drawText(text: string, position: Position, size: number): void {
    this.gen.drawText(text, position, size);
  }

  getImagePixelColor(id: string, position: [number, number]): Color | null {
    return this.gen.getImagePixelColor(id, position);
  }

  getTexturePixelColor(id: string, position: [number, number]): Color | null {
    return this.gen.getTexturePixelColor(id, position);
  }

  getCurrentPagePixelColor(position: [number, number]): Color | null {
    return this.gen.getCurrentPagePixelColor(position);
  }

  hasTexture(id: string): boolean {
    return this.gen.hasTexture(id);
  }

  defineRegion(region: Region, regionId: string): void {
    const currentPageId = this.gen.getCurrentPage().id;

    this.model.addRegionControl(
      currentPageId,
      region,
      () => this.onRegionClickRef.current?.({ regionId }),
      regionId
    );
  }
}

// `<GeneratorRenderer>` infers `Props` from `generator`, so the `props` call
// site is checked against whatever `Props` that generator declared.
export function GeneratorRenderer<Props>({
  generator,
  props,
  onRegionClick,
}: {
  generator: GeneratorV2<Props>;
  props: Props;
  onRegionClick?: (arg: { regionId: string }) => void;
}): JSX.Element {
  const [resources, setResources] = React.useState<Awaited<
    ReturnType<typeof loadResourcesV2>
  > | null>(null);

  // Kept fresh every render (not a `useMemo`/`useEffect` dep) so a region's
  // stored `onClick` closure — which can outlive the render pass that
  // created it — always calls the latest `onRegionClick`, never a stale one.
  const onRegionClickRef = React.useRef(onRegionClick);
  onRegionClickRef.current = onRegionClick;

  React.useEffect(() => {
    let cancelled = false;

    loadResourcesV2(generator).then((loadedResources) => {
      if (!cancelled) {
        setResources(loadedResources);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [generator]);

  // Fresh `Model`/`Generator` per render pass — this is the reactive seam:
  // `props` (author-owned `useState`) is a `useMemo` dep, so a parent
  // rerender (e.g. toggling a checkbox, or a region's `onRegionClick` calling
  // `setState`) recomputes the pages with no manual `runScript`/`onChange`
  // re-run wiring. `onRegionClick` deliberately isn't a dep — it's read
  // fresh via `onRegionClickRef` instead, so a changed handler identity
  // doesn't force an otherwise-unnecessary repaint.
  const model = React.useMemo(() => {
    if (!resources) {
      return null;
    }

    const [imageTuples, textureTuples] = resources;

    const newModel = new Model(new Values());

    imageTuples.forEach(([id, image]) => {
      newModel.addImage(id, image);
    });

    textureTuples.forEach(([id, texture]) => {
      newModel.addTexture(id, texture);
    });

    const gen = new Generator(newModel);
    const ctx = new RenderContextAdapter(gen, newModel, onRegionClickRef);

    generator.render(ctx, props);

    return newModel;
  }, [resources, props, generator]);

  if (!model) {
    return <div>Loading...</div>;
  }

  // Reuse `<Pages>` (page-render + toolbar + `RegionControls`) unchanged
  // rather than forking its JSX into a `PagesV2`. `<Pages>` only reads
  // `generatorDef.name` (directly, and via `<SaveAsPDFButton>`), so this stub
  // fills every other `GeneratorDef` field with a neutral default — smaller
  // diff than duplicating the page-render/toolbar JSX for v2. `onChange` is a
  // no-op: a region's stored closure calls `onRegionClick` (read via the ref
  // above), and the author's own `setState` is itself the re-render trigger.
  const generatorDefStub: GeneratorDef = {
    id: generator.id,
    name: generator.name,
    thumbnail: null,
    video: null,
    instructions: null,
    history: [],
    images: generator.images,
    textures: generator.textures,
    script: () => {},
  };

  return (
    <Pages generatorDef={generatorDefStub} model={model} onChange={() => {}} />
  );
}
