import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { Markdown } from "./markdown";

export function Instructions({ markdown }: { markdown: string }) {
  return (
    <details className="group rounded-md border border-gray-200 bg-white px-4 shadow-sm">
      <summary className="flex min-h-[46px] cursor-pointer select-none items-center justify-between gap-4 font-bold marker:hidden [&::-webkit-details-marker]:hidden">
        <span>Instructions</span>
        <ChevronDownIcon
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pb-4 pt-2">
        <Markdown>{markdown}</Markdown>
      </div>
    </details>
  );
}
