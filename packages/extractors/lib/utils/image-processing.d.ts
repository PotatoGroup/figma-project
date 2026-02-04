import type { Transform } from "@figma/rest-api-spec";
/**
 * Apply crop transform to an image based on Figma's transformation matrix
 * @param imagePath - Path to the original image file
 * @param cropTransform - Figma transform matrix [[scaleX, skewX, translateX], [skewY, scaleY, translateY]]
 * @returns Promise<string> - Path to the cropped image
 */
export declare function applyCropTransform(imagePath: string, cropTransform: Transform): Promise<string>;
/**
 * Get image dimensions from a file
 * @param imagePath - Path to the image file
 * @returns Promise<{width: number, height: number}>
 */
export declare function getImageDimensions(imagePath: string): Promise<{
    width: number;
    height: number;
}>;
export type ImageProcessingResult = {
    filePath: string;
    originalDimensions: {
        width: number;
        height: number;
    };
    finalDimensions: {
        width: number;
        height: number;
    };
    wasCropped: boolean;
    cropRegion?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    cssVariables?: string;
    processingLog: string[];
};
/**
 * Enhanced image download with post-processing
 * @param fileName - The filename to save as
 * @param localPath - The local path to save to
 * @param imageUrl - Image URL
 * @param needsCropping - Whether to apply crop transform
 * @param cropTransform - Transform matrix for cropping
 * @param requiresImageDimensions - Whether to generate dimension metadata
 * @returns Promise<ImageProcessingResult> - Detailed processing information
 */
export declare function downloadAndProcessImage(fileName: string, localPath: string, imageUrl: string, needsCropping?: boolean, cropTransform?: Transform, requiresImageDimensions?: boolean): Promise<ImageProcessingResult>;
/**
 * Create CSS custom properties for image dimensions
 * @param imagePath - Path to the image file
 * @returns Promise<string> - CSS custom properties
 */
export declare function generateImageCSSVariables({ width, height, }: {
    width: number;
    height: number;
}): string;
//# sourceMappingURL=image-processing.d.ts.map