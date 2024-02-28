import { parse } from "marked";

export function Markdown({ children }: { children: string }) {
  const html = parse(children);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
