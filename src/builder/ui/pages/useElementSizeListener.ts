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
        const width = elRef.current.clientWidth;
        const height = elRef.current.clientHeight;
        setSize((current) =>
          current && current.width === width && current.height === height
            ? current
            : { width, height }
        );
      }
    };

    // Only the window "resize" event drives re-measurement (matching the
    // previous width-only listener's behavior) rather than a ResizeObserver
    // on the element itself. ResizeObserver also fires for DOM mutations
    // unrelated to viewport size (e.g. a page-image src swap after a click),
    // which raced with already-in-flight interactions and shifted region
    // control positions by a rounding pixel after the fact.
    window.addEventListener("resize", updateSize);

    updateSize();

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [elRef]);

  return size;
}
