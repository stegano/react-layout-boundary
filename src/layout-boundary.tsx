import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Props } from "./layout-boundary.interface";

/**
 * Minimizes computation by creating a layout boundary when rendering in the browser.
 */
function LayoutBoundary(props: Props) {
  const {
    options = { autoResize: true, width: undefined, height: undefined },
    className = "layout-boundary",
    children,
  } = props;
  const wrapperElRef = useRef<HTMLDivElement>(null);
  const resizeEventRef = useRef<{
    observer?: ResizeObserver;
    resize?: (e: Event) => void;
  }>({
    observer: undefined,
    resize: undefined,
  });
  const { autoResize, width, height } = options;

  const [size, setSize] = useState<
    | {
        width: number;
        height: number;
      }
    | undefined
  >(autoResize === false ? { width: options.width, height: options.height } : undefined);

  useLayoutEffect(() => {
    if (autoResize === true) {
      const wrapperEl = wrapperElRef.current;
      if (wrapperEl) {
        const { width: wrapperWidth, height: wrapperHeight } = wrapperEl.getBoundingClientRect();
        setSize((state) => {
          if (state === undefined) {
            return { width: wrapperWidth, height: wrapperHeight };
          }
          return state;
        });
      }
    } else if (autoResize === false) {
      setSize({ width, height });
    }
  }, [autoResize, height, width]);

  /**
   * Unbind if bound event exists
   */
  const unbindResizeEvents = useCallback(() => {
    const resizeEvent = resizeEventRef.current;
    resizeEvent.observer?.disconnect();
    if (resizeEvent.resize) {
      window.removeEventListener("resize", resizeEvent.resize);
    }
    resizeEventRef.current = { observer: undefined, resize: undefined };
  }, []);

  /**
   * Updates the wrapper element size by detecting the changed size of the parent element.
   */
  const bindResizeEvents = useCallback(() => {
    // Unbind if there was a previously bound event
    unbindResizeEvents();
    const parentEl = wrapperElRef.current?.parentElement;
    if (parentEl) {
      resizeEventRef.current.observer = new ResizeObserver((entries) => {
        const { width: elWidth, height: elHeight } = entries[0].contentRect;
        setSize({ width: elWidth, height: elHeight });
      });
      resizeEventRef.current.observer.observe(parentEl);
    } else {
      /**
       * Bind window resize event if parent element does not exist
       */
      resizeEventRef.current.resize = () => {
        setSize(undefined);
      };
      window.addEventListener("resize", resizeEventRef.current.resize);
    }
  }, [unbindResizeEvents]);

  useEffect(() => {
    if (autoResize === true) {
      bindResizeEvents();
    } else {
      unbindResizeEvents();
    }
    return () => {
      /**
       * Unbind events when component is unmounted
       * [!] Even if the value of autoResize is changed, the event must be unbound.
       */
      unbindResizeEvents();
    };
  }, [autoResize, bindResizeEvents, unbindResizeEvents]);

  const $content = useMemo(() => {
    if (size) {
      const { width: wrapperWidth, height: wrapperHeight } = size;
      return (
        <div
          style={{
            display: "block",
            position: "relative",
            width: wrapperWidth,
            height: wrapperHeight,
          }}
          ref={wrapperElRef}
          className={className}
        >
          <div
            style={{
              display: "inline-block",
              position: "absolute",
              overflow: "hidden",
              left: 0,
              top: 0,
              width: wrapperWidth,
              height: wrapperHeight,
            }}
          >
            {children}
          </div>
        </div>
      );
    }
    /**
     * Render to measure the size of child components.
     */
    return (
      <div ref={wrapperElRef} className={className}>
        {children}
      </div>
    );
  }, [children, className, size]);

  return $content;
}

export default LayoutBoundary;
