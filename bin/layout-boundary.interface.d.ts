import { PropsWithChildren } from "react";
export interface Props extends PropsWithChildren {
    /**
     * A class that identifies element
     */
    className?: string;
    /**
     * Options for element
     * [*] You can disable automatic resizing and adjust the size yourself.
     */
    options?: {
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
    } | {
        /**
         * If `false`, element will not be resized automatically
         */
        autoResize: false;
        /**
         * Width of element
         */
        width: number;
        /**
         * Height of element
         */
        height: number;
    };
}
