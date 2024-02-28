"use client";

import React from "react";
import { GeneratorList } from "@/ui/components/generatorList";
import { PageHeading } from "@/ui/components/pageHeading";

export function HomePage() {
  return (
    <div className="p-8">
      <PageHeading title="Generators" />
      <GeneratorList />
    </div>
  );
}
