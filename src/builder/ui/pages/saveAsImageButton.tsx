import React from "react";

export function SaveAsImageButton({
  dataUrl,
  download,
}: {
  dataUrl: string;
  download: string;
}) {
  const [href, setHref] = React.useState("#");
  const onClick = () => setHref(dataUrl);
  return (
    <a href={href} onClick={onClick} download={download}>
      {"Save as PNG"}
    </a>
  );
}
