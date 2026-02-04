export type StyleId = `${string}_${string}` & {
    __brand: "StyleId";
};
/**
 * Download Figma image and save it locally
 * @param fileName - The filename to save as
 * @param localPath - The local path to save to
 * @param imageUrl - Image URL (images[nodeId])
 * @returns A Promise that resolves to the full file path where the image was saved
 * @throws Error if download fails
 */
export declare function downloadFigmaImage(fileName: string, localPath: string, imageUrl: string): Promise<string>;
/**
 * Remove keys with empty arrays or empty objects from an object.
 * @param input - The input object or value.
 * @returns The processed object or the original value.
 */
export declare function removeEmptyKeys<T>(input: T): T;
/**
 * Generate a 6-character random variable ID
 * @param prefix - ID prefix
 * @returns A 6-character random ID string with prefix
 */
export declare function generateVarId(prefix?: string): StyleId;
/**
 * Generate a CSS shorthand for values that come with top, right, bottom, and left
 *
 * input: { top: 10, right: 10, bottom: 10, left: 10 }
 * output: "10px"
 *
 * input: { top: 10, right: 20, bottom: 10, left: 20 }
 * output: "10px 20px"
 *
 * input: { top: 10, right: 20, bottom: 30, left: 40 }
 * output: "10px 20px 30px 40px"
 *
 * @param values - The values to generate the shorthand for
 * @returns The generated shorthand
 */
export declare function generateCSSShorthand(values: {
    top: number;
    right: number;
    bottom: number;
    left: number;
}, { ignoreZero, suffix, }?: {
    /**
     * If true and all values are 0, return undefined. Defaults to true.
     */
    ignoreZero?: boolean;
    /**
     * The suffix to add to the shorthand. Defaults to "px".
     */
    suffix?: string;
}): string | undefined;
/**
 * Check if an element is visible
 * @param element - The item to check
 * @returns True if the item is visible, false otherwise
 */
export declare function isVisible(element: {
    visible?: boolean;
}): boolean;
/**
 * Rounds a number to two decimal places, suitable for pixel value processing.
 * @param num The number to be rounded.
 * @returns The rounded number with two decimal places.
 * @throws TypeError If the input is not a valid number
 */
export declare function pixelRound(num: number): number;
//# sourceMappingURL=common.d.ts.map