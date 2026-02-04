import type { Node as FigmaDocumentNode, Paint, RGBA, Transform } from "@figma/rest-api-spec";
export type CSSRGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;
export type CSSHexColor = `#${string}`;
export interface ColorValue {
    hex: CSSHexColor;
    opacity: number;
}
/**
 * Simplified image fill with CSS properties and processing metadata
 *
 * This type represents an image fill that can be used as either:
 * - background-image (when parent node has children)
 * - <img> tag (when parent node has no children)
 *
 * The CSS properties are mutually exclusive based on usage context.
 */
export type SimplifiedImageFill = {
    type: "IMAGE";
    imageRef: string;
    scaleMode: "FILL" | "FIT" | "TILE" | "STRETCH";
    /**
     * For TILE mode, the scaling factor relative to original image size
     */
    scalingFactor?: number;
    backgroundSize?: string;
    backgroundRepeat?: string;
    isBackground?: boolean;
    objectFit?: string;
    imageDownloadArguments?: {
        /**
         * Whether image needs cropping based on transform
         */
        needsCropping: boolean;
        /**
         * Whether CSS variables for dimensions are needed to calculate the background size for TILE mode
         *
         * Figma bases scalingFactor on the image's original size. In CSS, background size (as a percentage)
         * is calculated based on the size of the container. We need to pass back the original dimensions
         * after processing to calculate the intended background size when translated to code.
         */
        requiresImageDimensions: boolean;
        /**
         * Figma's transform matrix for Sharp processing
         */
        cropTransform?: Transform;
        /**
         * Suggested filename suffix to make cropped images unique
         * When the same imageRef is used multiple times with different crops,
         * this helps avoid overwriting conflicts
         */
        filenameSuffix?: string;
    };
};
export type SimplifiedGradientFill = {
    type: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND";
    gradient: string;
};
export type SimplifiedPatternFill = {
    type: "PATTERN";
    patternSource: {
        /**
         * Hardcode to expect PNG for now, consider SVG detection in the future.
         *
         * SVG detection is a bit challenging because the nodeId in question isn't
         * guaranteed to be included in the response we're working with. No guaranteed
         * way to look into it and see if it's only composed of vector shapes.
         */
        type: "IMAGE-PNG";
        nodeId: string;
    };
    backgroundRepeat: string;
    backgroundSize: string;
    backgroundPosition: string;
};
export type SimplifiedFill = SimplifiedImageFill | SimplifiedGradientFill | SimplifiedPatternFill | CSSRGBAColor | CSSHexColor;
export type SimplifiedStroke = {
    colors: SimplifiedFill[];
    strokeWeight?: string;
    strokeDashes?: number[];
    strokeWeights?: string;
};
/**
 * Build simplified stroke information from a Figma node
 *
 * @param n - The Figma node to extract stroke information from
 * @param hasChildren - Whether the node has children (affects paint processing)
 * @returns Simplified stroke object with colors and properties
 */
export declare function buildSimplifiedStrokes(n: FigmaDocumentNode, hasChildren?: boolean): SimplifiedStroke;
/**
 * Convert a Figma paint (solid, image, gradient) to a SimplifiedFill
 * @param raw - The Figma paint to convert
 * @param hasChildren - Whether the node has children (determines CSS properties)
 * @returns The converted SimplifiedFill
 */
export declare function parsePaint(raw: Paint, hasChildren?: boolean): SimplifiedFill;
/**
 * Convert hex color value and opacity to rgba format
 * @param hex - Hexadecimal color value (e.g., "#FF0000" or "#F00")
 * @param opacity - Opacity value (0-1)
 * @returns Color string in rgba format
 */
export declare function hexToRgba(hex: string, opacity?: number): string;
/**
 * Convert color from RGBA to { hex, opacity }
 *
 * @param color - The color to convert, including alpha channel
 * @param opacity - The opacity of the color, if not included in alpha channel
 * @returns The converted color
 **/
export declare function convertColor(color: RGBA, opacity?: number): ColorValue;
/**
 * Convert color from Figma RGBA to rgba(#, #, #, #) CSS format
 *
 * @param color - The color to convert, including alpha channel
 * @param opacity - The opacity of the color, if not included in alpha channel
 * @returns The converted color
 **/
export declare function formatRGBAColor(color: RGBA, opacity?: number): CSSRGBAColor;
//# sourceMappingURL=style.d.ts.map