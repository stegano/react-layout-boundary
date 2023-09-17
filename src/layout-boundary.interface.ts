import { PropsWithChildren } from "react";

export interface Props extends PropsWithChildren {
  /**
   * A class that identifies element
   */
  className?: string;
  /**
   * Options for `LayoutBoundary` element
   * [*] You can disable automatic resizing and adjust the size yourself.
   */
  options?:
    | {
        /**
         * If `true`, element will be resized automatically
         */
        autoResize?: true;
        /**
         * Width of element
         */
        width: undefined;
        /**
         * Height of element
         */
        height: undefined;
      }
    | {
        /**
         * If `false`, element will not be resized automatically
         */
        autoResize: false;
        /**
         * Width of the element; only absolute values are accepted.
         */
        width: number;
        /**
         * Height of the element; only absolute values are accepted.
         */
        height: number;
      };
}
