"use client";

import { Generator } from "@/builder/ui/generator";
import { findGeneratorById } from "@/generators/generators";
import { PageHeading } from "@/ui/components/pageHeading";
import { CommonLink } from "@/ui/components/commonLink";

export function GeneratorPage({ generatorId }: { generatorId: string }) {
  const generatorDef = findGeneratorById(generatorId);
  if (!generatorDef) {
    return <div className="p-8">Generator not found</div>;
  }

  return (
    <div className="p-8">
      <PageHeading title={generatorDef.name} />

      <p className="mb-8">
        <CommonLink href="/">← Back to generator list</CommonLink>
      </p>

      <Generator generatorDef={generatorDef} />
    </div>
  );
}
