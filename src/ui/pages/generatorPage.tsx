"use client";

import Link from "next/link";
import { Generator } from "@/builder/ui/generator";
import { findGeneratorById } from "@/generators/generators";

export function GeneratorPage({ generatorId }: { generatorId: string }) {
  const generatorDef = findGeneratorById(generatorId);
  if (!generatorDef) {
    return <div className="p-8">Generator not found</div>;
  }

  return (
    <div>
      <Link href="/">Back</Link>
      <Generator generatorDef={generatorDef} />
    </div>
  );
}
