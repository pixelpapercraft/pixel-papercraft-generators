import React from "react";

export type ElementSize = {
  width: number;
  height: number;
};

export function useElementSizeListener(elRef: React.RefObject<HTMLElement>) {
  const [size, setSize] = React.useState<ElementSize | null>(null);

  React.useEffect(() => {
    const updateSize = () => {
      if (elRef.current) {
        setSize({
          width: elRef.current.clientWidth,
          height: elRef.current.clientHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);

    if (elRef.current) {
      resizeObserver.observe(elRef.current);
    }

    updateSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [elRef]);

  return size;
}
