import { Markdown } from "./markdown";

export function Instructions({ markdown }: { markdown: string }) {
  return (
    <div className="mb-8">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}
