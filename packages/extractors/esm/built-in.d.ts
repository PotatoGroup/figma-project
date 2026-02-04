import type { ExtractorFn } from "./types.js";
/**
 * Extracts layout-related properties from a node.
 */
export declare const layoutExtractor: ExtractorFn;
/**
 * Extracts text content and text styling from a node.
 */
export declare const textExtractor: ExtractorFn;
/**
 * Extracts visual appearance properties (fills, strokes, effects, opacity, border radius).
 */
export declare const visualsExtractor: ExtractorFn;
/**
 * Extracts component-related properties from INSTANCE nodes.
 */
export declare const componentExtractor: ExtractorFn;
/**
 * All extractors - replicates the current parseNode behavior.
 */
export declare const allExtractors: ExtractorFn[];
/**
 * Layout and text only - useful for content analysis and layout planning.
 */
export declare const layoutAndText: ExtractorFn[];
/**
 * Text content only - useful for content audits and copy extraction.
 */
export declare const contentOnly: ExtractorFn[];
/**
 * Visuals only - useful for design system analysis and style extraction.
 */
export declare const visualsOnly: ExtractorFn[];
/**
 * Layout only - useful for structure analysis.
 */
export declare const layoutOnly: ExtractorFn[];
//# sourceMappingURL=built-in.d.ts.map