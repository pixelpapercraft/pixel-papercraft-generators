import { Markdown } from "./markdown";

export function Instructions({ markdown }: { markdown: string }) {
  return <Markdown>{markdown}</Markdown>;
}
