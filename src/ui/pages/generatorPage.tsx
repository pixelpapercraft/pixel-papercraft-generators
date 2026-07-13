"use client";

import { Generator } from "@genroot/builder/ui/generator";
import {
  findGeneratorById,
  findGeneratorV2ById,
} from "@genroot/generators/generators";
import { PageHeading } from "@genroot/ui/components/pageHeading";
import { CommonLink } from "@genroot/ui/components/commonLink";

export function GeneratorPage({ generatorId }: { generatorId: string }) {
  const generatorV2Registration = findGeneratorV2ById(generatorId);
  if (generatorV2Registration) {
    return (
      <div className="p-8">
        <PageHeading title={generatorV2Registration.name} />

        <p className="mb-8">
          <CommonLink href="/">← Back to generator list</CommonLink>
        </p>

        <generatorV2Registration.Component />
      </div>
    );
  }

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
