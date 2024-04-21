import React from "react";

export function useElementWidthListener(elRef: React.RefObject<HTMLElement>) {
  const [width, setWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const updateWidth = () => {
      if (elRef.current) {
        const width = elRef.current.clientWidth;
        setWidth(width);
      }
    };

    const onResize = () => {
      updateWidth();
    };

    window.addEventListener("resize", onResize);

    updateWidth();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [elRef]);

  return width;
}
