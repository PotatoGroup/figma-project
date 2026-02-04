import type { Node as FigmaDocumentNode } from "@figma/rest-api-spec";
import type { ExtractorFn, TraversalOptions, GlobalVars, SimplifiedNode } from "./types.js";
/**
 * Extract data from Figma nodes using a flexible, single-pass approach.
 *
 * @param nodes - The Figma nodes to process
 * @param extractors - Array of extractor functions to apply during traversal
 * @param options - Traversal options (filtering, depth limits, etc.)
 * @param globalVars - Global variables for style deduplication
 * @returns Object containing processed nodes and updated global variables
 */
export declare function extractFromDesign(nodes: FigmaDocumentNode[], extractors: ExtractorFn[], options?: TraversalOptions, globalVars?: GlobalVars): {
    nodes: SimplifiedNode[];
    globalVars: GlobalVars;
};
//# sourceMappingURL=node-walker.d.ts.map