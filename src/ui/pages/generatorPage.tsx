"use client";

import { Generator } from "@genroot/builder/ui/generator";
import { findAnyGeneratorById } from "@genroot/generators/generators";
import { PageHeading } from "@genroot/ui/components/pageHeading";
import { CommonLink } from "@genroot/ui/components/commonLink";

export function GeneratorPage({ generatorId }: { generatorId: string }) {
  const found = findAnyGeneratorById(generatorId);

  if (!found) {
    return <div className="p-8">Generator not found</div>;
  }

  return (
    <div className="p-8">
      <PageHeading title={found.def.name} />

      <p className="mb-8">
        <CommonLink href="/">← Back to generator list</CommonLink>
      </p>

      {found.kind === "v1" ? (
        <Generator generatorDef={found.def} />
      ) : (
        <found.def.Component />
      )}
    </div>
  );
}
