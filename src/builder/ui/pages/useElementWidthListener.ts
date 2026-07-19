import React from "react";

export function useElementWidthListener(elRef: React.RefObject<HTMLElement>) {
  const [width, setWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = elRef.current;
    if (!el) {
      return;
    }

    const updateWidth = () => {
      setWidth(el.clientWidth);
    };

    // Observe the element itself rather than only listening for window
    // resizes: the page image starts at zero width and only gains its real
    // width once the `data:` URL decodes and lays out. A ResizeObserver fires
    // both on initial observe and again when that decode resizes the box, so
    // the measured width becomes correct without waiting for a window resize.
    // This matters for region overlays, which scale by this width and would
    // otherwise stay collapsed (and stacked on top of each other) at width 0.
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);

    updateWidth();

    return () => {
      observer.disconnect();
    };
  }, [elRef]);

  return width;
}
