import type { Node as FigmaDocumentNode } from "@figma/rest-api-spec";
export interface SimplifiedLayout {
    mode: "none" | "row" | "column";
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "baseline" | "stretch";
    alignItems?: "flex-start" | "flex-end" | "center" | "space-between" | "baseline" | "stretch";
    alignSelf?: "flex-start" | "flex-end" | "center" | "stretch";
    wrap?: boolean;
    gap?: string;
    locationRelativeToParent?: {
        x: number;
        y: number;
    };
    dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
    };
    padding?: string;
    sizing?: {
        horizontal?: "fixed" | "fill" | "hug";
        vertical?: "fixed" | "fill" | "hug";
    };
    overflowScroll?: ("x" | "y")[];
    position?: "absolute";
}
export declare function buildSimplifiedLayout(n: FigmaDocumentNode, parent?: FigmaDocumentNode): SimplifiedLayout;
//# sourceMappingURL=layout.d.ts.map