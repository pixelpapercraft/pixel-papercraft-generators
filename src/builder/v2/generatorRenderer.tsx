"use client";

import React from "react";
import { Model } from "@genroot/builder/modules/model";
import { Values } from "@genroot/builder/modules/modelValues";
import { Generator } from "@genroot/builder/modules/generator";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import { Pages } from "@genroot/builder/ui/pages/pages";
import { type GeneratorV2, type RegionClickHandler } from "./generatorV2";
import { loadResourcesV2 } from "./loadResourcesV2";
import { RenderContextAdapter } from "./renderContextAdapter";

// `<GeneratorRenderer>` infers `Props` from `generator`, so the `props` call
// site is checked against whatever `Props` that generator declared.
export function GeneratorRenderer<Props>({
  generator,
  props,
  onRegionClick,
}: {
  generator: GeneratorV2<Props>;
  props: Props;
  onRegionClick?: RegionClickHandler;
}): JSX.Element {
  const [resources, setResources] = React.useState<Awaited<
    ReturnType<typeof loadResourcesV2>
  > | null>(null);

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
  // re-run wiring. No ref is needed to keep `onRegionClick` fresh: `props` is
  // a fresh inline object literal every render and `onRegionClick` is a
  // fresh function every render, both are `useMemo` deps, so this memo (and
  // thus the adapter and the region closures it stores) rebuilds every
  // render — the stored closure always captures the current handler.
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
    const ctx = new RenderContextAdapter(gen, newModel, onRegionClick);

    generator.render(ctx, props);

    return newModel;
  }, [resources, props, generator, onRegionClick]);

  if (!model) {
    return <div>Loading...</div>;
  }

  // Reuse `<Pages>` (page-render + toolbar + `RegionControls`) unchanged
  // rather than forking its JSX into a `PagesV2`. `<Pages>` only reads
  // `generatorDef.name` (directly, and via `<SaveAsPDFButton>`), so this stub
  // fills every other `GeneratorDef` field with a neutral default — smaller
  // diff than duplicating the page-render/toolbar JSX for v2. `onChange` is a
  // no-op: a region's stored closure calls `onRegionClick` directly, and the
  // author's own `setState` is itself the re-render trigger.
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
