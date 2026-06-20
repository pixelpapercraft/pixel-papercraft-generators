"use client";

import React from "react";

import {
  encodeProjectSave,
  exportProjectSave,
  type ProjectImportResult,
} from "@genroot/builder/modules/projectSave";
import { type Model } from "@genroot/builder/modules/model";
import { makeButtonClassNames } from "./button/buttonStyles";

export function ProjectSaveControl({
  model,
  generatorId,
  onImport,
}: {
  model: Model;
  generatorId: string;
  onImport: (json: string) => Promise<ProjectImportResult>;
}) {
  const [status, setStatus] = React.useState<string | null>(null);
  const fileInputId = React.useId();
  const json = encodeProjectSave(exportProjectSave(model, generatorId));
  const href = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
  const exportClassName = makeButtonClassNames({
    size: "Medium",
    color: "Green",
  });
  const importClassName = makeButtonClassNames({
    size: "Medium",
    color: "Blue",
  });

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    file
      .text()
      .then(onImport)
      .then((result) => {
        setStatus(result.message);
      })
      .catch(() => {
        setStatus("Import failed: the saved file could not be loaded.");
      });
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={href}
          download={`${generatorId}.json`}
          className={exportClassName}
          title="Export generator JSON"
          aria-label="Export generator JSON"
        >
          Export JSON
        </a>
        {status ? (
          <span className="text-sm text-gray-700">{status}</span>
        ) : null}
      </div>
      <div>
        <label
          htmlFor={fileInputId}
          className={importClassName}
          title="Import generator JSON"
          aria-label="Import generator JSON"
        >
          <input
            id={fileInputId}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onFileChange}
          />
          Import JSON
        </label>
      </div>
    </div>
  );
}
