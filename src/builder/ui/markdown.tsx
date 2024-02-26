import Marked from "marked";

// @react.component
// let make = (~children: string) => {
//   let html = Marked.parse(children)
//   <div className="prose xmax-w-none" dangerouslySetInnerHTML={{"__html": html}} />
// }

export function Markdown(props: { children: string }) {
  const html = Marked.parse(props.children);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
