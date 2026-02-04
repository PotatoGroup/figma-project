import type { GetFileResponse, GetFileNodesResponse } from "@figma/rest-api-spec";
import type { ExtractorFn, TraversalOptions, SimplifiedDesign } from "./types.js";
/**
 * Extract a complete SimplifiedDesign from raw Figma API response using extractors.
 */
export declare function simplifyRawFigmaObject(apiResponse: GetFileResponse | GetFileNodesResponse, nodeExtractors: ExtractorFn[], options?: TraversalOptions): SimplifiedDesign;
//# sourceMappingURL=design-extractor.d.ts.map