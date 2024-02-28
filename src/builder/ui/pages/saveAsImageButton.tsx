import React from "react";
import { makeButtonClassNames } from "../button/buttonStyles";

export function SaveAsImageButton({
  dataUrl,
  download,
}: {
  dataUrl: string;
  download: string;
}) {
  const [href, setHref] = React.useState("#");

  const onClick = () => setHref(dataUrl);

  const className = makeButtonClassNames({ color: "Blue", size: "Small" });

  return (
    <a className={className} href={href} onClick={onClick} download={download}>
      <span className="sm:hidden">Save as PNG</span>
      <span className="hidden sm:inline">Save page as PNG</span>
    </a>
  );
}
