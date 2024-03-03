/* eslint-disable @next/next/no-img-element */

import React from "react";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import {
  type GeneratorGroup,
  generatorGroups,
} from "@genroot/generators/generators";

function Heading({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold mb-2"> {children} </h1>;
}

function GeneratorItem({ generator }: { generator: GeneratorDef }) {
  const { id, name, thumbnail } = generator;
  const url = `/generator/${id}`;
  return (
    <div>
      <a className="flex items-center p-2 hover:bg-gray-100 rounded" href={url}>
        {thumbnail ? (
          <img className="w-20 h-20 mr-2" src={thumbnail.url} alt="" />
        ) : (
          <div className="w-20 h-20 bg-gray-200 mr-2" />
        )}
        <span> {name} </span>
      </a>
    </div>
  );
}

function GeneratorGroup({
  generatorGroup,
}: {
  generatorGroup: GeneratorGroup;
}) {
  const { label, generators } = generatorGroup;
  return (
    <div key={label} className="mb-8">
      <Heading> {label} </Heading>
      <div>
        {generators.map((generator) => (
          <GeneratorItem key={generator.id} generator={generator} />
        ))}
      </div>
    </div>
  );
}

export function GeneratorList() {
  return (
    <div>
      {generatorGroups.map((generatorGroup) => {
        if (generatorGroup.generators.length === 0) {
          return null;
        }
        return (
          <GeneratorGroup
            key={generatorGroup.label}
            generatorGroup={generatorGroup}
          />
        );
      })}
    </div>
  );
}
